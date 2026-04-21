// KrishiLink core types
// TODO: Replace with Supabase-generated types when backend is enabled.

export type UserRole = "farmer" | "consumer";

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  fullName: string;
  pincode: string;
  city: string;
  // Farmer-only
  farmName?: string;
  primaryCrop?: string;
  documentUrl?: string;
  verified?: boolean;
  createdAt: string;
}

export type ProduceCategory = "vegetables" | "fruits" | "grains" | "dairy" | "spices";

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerVerified: boolean;
  pincode: string;
  city: string;
  name: string;
  category: ProduceCategory;
  description: string;
  pricePerKg: number;
  stockKg: number;
  harvestDate: string;
  images: string[];
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "out_for_delivery"
  | "delivered";

export interface Order {
  id: string;
  listingId: string;
  productName: string;
  productImage?: string;
  farmerId: string;
  farmerName: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  consumerPincode: string;
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}
