-- 1. Fix user_roles privilege escalation
DROP POLICY IF EXISTS "Users can claim their own role at signup" ON public.user_roles;

CREATE POLICY "Users can claim consumer role at signup"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'consumer'::app_role);

-- 2. Fix profiles public exposure of phone/pincode/city
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Public view that excludes sensitive fields (phone, pincode, city)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT
  id,
  full_name,
  avatar_url,
  farm_name,
  primary_crop,
  is_verified,
  created_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;