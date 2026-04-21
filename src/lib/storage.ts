// Local persistence layer for the MVP.
// TODO: Replace with Supabase Postgres (listings, orders) + Auth + Realtime.

import type { Listing, Order, User } from "./types";
import { mockFarmers, mockListings, mockOrders } from "@/data/mockData";

const KEYS = {
  user: "krishilink:user",
  users: "krishilink:users",
  listings: "krishilink:listings",
  orders: "krishilink:orders",
  theme: "krishilink:theme",
  seeded: "krishilink:seeded:v1",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEYS.seeded)) return;
  write(KEYS.users, mockFarmers);
  write(KEYS.listings, mockListings);
  write(KEYS.orders, mockOrders);
  localStorage.setItem(KEYS.seeded, "1");
}

// Session
export const getCurrentUser = () => read<User | null>(KEYS.user, null);
export const setCurrentUser = (u: User | null) => {
  if (u) write(KEYS.user, u);
  else if (typeof window !== "undefined") localStorage.removeItem(KEYS.user);
};

// Users
export const getUsers = () => read<User[]>(KEYS.users, []);
export const upsertUser = (u: User) => {
  const all = getUsers();
  const idx = all.findIndex((x) => x.id === u.id);
  if (idx >= 0) all[idx] = u;
  else all.push(u);
  write(KEYS.users, all);
};

// Listings
export const getListings = () => read<Listing[]>(KEYS.listings, []);
export const saveListings = (l: Listing[]) => write(KEYS.listings, l);

// Orders
export const getOrders = () => read<Order[]>(KEYS.orders, []);
export const saveOrders = (o: Order[]) => write(KEYS.orders, o);

// Theme
export const getTheme = () => read<"light" | "dark" | null>(KEYS.theme, null);
export const setTheme = (t: "light" | "dark") => write(KEYS.theme, t);

export const STORAGE_KEYS = KEYS;
