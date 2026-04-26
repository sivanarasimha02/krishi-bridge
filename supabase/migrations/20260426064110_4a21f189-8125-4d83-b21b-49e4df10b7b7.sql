-- Enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'farmer', 'consumer');

-- Enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled');

-- Enum for produce category
CREATE TYPE public.produce_category AS ENUM ('vegetables', 'fruits', 'grains', 'dairy', 'other');

-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================
-- profiles
-- =========================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  pincode TEXT,
  city TEXT,
  farm_name TEXT,
  primary_crop TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- user_roles + has_role function (privilege-escalation safe)
-- =========================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can claim their own role at signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =========================
-- listings
-- =========================
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category produce_category NOT NULL,
  price_per_kg NUMERIC(10,2) NOT NULL CHECK (price_per_kg >= 0),
  stock_kg NUMERIC(10,2) NOT NULL CHECK (stock_kg >= 0),
  harvest_date DATE,
  pincode TEXT NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_farmer ON public.listings(farmer_id);
CREATE INDEX idx_listings_pincode ON public.listings(pincode);
CREATE INDEX idx_listings_category ON public.listings(category);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings are viewable by everyone"
  ON public.listings FOR SELECT
  USING (is_active = true OR auth.uid() = farmer_id);

CREATE POLICY "Farmers can create their own listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id AND public.has_role(auth.uid(), 'farmer'));

CREATE POLICY "Farmers can update their own listings"
  ON public.listings FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
  ON public.listings FOR DELETE
  USING (auth.uid() = farmer_id);

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- orders
-- =========================
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consumer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg > 0),
  price_per_kg NUMERIC(10,2) NOT NULL CHECK (price_per_kg >= 0),
  total_price NUMERIC(12,2) NOT NULL CHECK (total_price >= 0),
  consumer_name TEXT NOT NULL,
  consumer_phone TEXT NOT NULL,
  consumer_pincode TEXT NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_consumer ON public.orders(consumer_id);
CREATE INDEX idx_orders_farmer ON public.orders(farmer_id);
CREATE INDEX idx_orders_pincode ON public.orders(consumer_pincode);
CREATE INDEX idx_orders_status ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consumers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = consumer_id);

CREATE POLICY "Farmers can view orders for their listings"
  ON public.orders FOR SELECT
  USING (auth.uid() = farmer_id);

CREATE POLICY "Consumers can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = consumer_id);

CREATE POLICY "Farmers can update orders for their listings"
  ON public.orders FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Consumers can cancel their own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = consumer_id);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- Auto-create profile on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.phone, NEW.raw_user_meta_data ->> 'phone', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();