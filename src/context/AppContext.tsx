import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Listing, Order, OrderStatus, User } from "@/lib/types";
import * as storage from "@/lib/storage";

interface AppContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;

  listings: Listing[];
  addListing: (l: Listing) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    storage.ensureSeeded();
    setUserState(storage.getCurrentUser());
    setListings(storage.getListings());
    setOrders(storage.getOrders());
  }, []);

  const setUser = (u: User | null) => {
    storage.setCurrentUser(u);
    if (u) storage.upsertUser(u);
    setUserState(u);
  };

  const logout = () => setUser(null);

  const addListing = (l: Listing) => {
    const next = [l, ...listings];
    setListings(next);
    storage.saveListings(next);
  };
  const updateListing = (id: string, patch: Partial<Listing>) => {
    const next = listings.map((l) => (l.id === id ? { ...l, ...patch } : l));
    setListings(next);
    storage.saveListings(next);
  };
  const deleteListing = (id: string) => {
    const next = listings.filter((l) => l.id !== id);
    setListings(next);
    storage.saveListings(next);
  };

  const addOrder = (o: Order) => {
    const next = [o, ...orders];
    setOrders(next);
    storage.saveOrders(next);
  };
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    storage.saveOrders(next);
  };

  const value = useMemo<AppContextValue>(
    () => ({ user, setUser, logout, listings, addListing, updateListing, deleteListing, orders, addOrder, updateOrderStatus }),
    [user, listings, orders]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
