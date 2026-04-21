import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { useMemo } from "react";
import { Package, IndianRupee, ListChecks, ShoppingBasket, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/OrderStatus";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user, listings, orders } = useApp();
  if (!user) return null;

  const isFarmer = user.role === "farmer";

  const myListings = useMemo(() => listings.filter((l) => l.farmerId === user.id), [listings, user.id]);
  const myOrdersAsFarmer = useMemo(() => orders.filter((o) => o.farmerId === user.id), [orders, user.id]);
  const myOrdersAsConsumer = useMemo(() => orders.filter((o) => o.consumerId === user.id), [orders, user.id]);

  const weekRevenue = myOrdersAsFarmer
    .filter((o) => Date.now() - new Date(o.createdAt).getTime() < 7 * 86400000)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  if (isFarmer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Overview</h1>
          <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
        </div>

        {!user.verified && (
          <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-warning-foreground" />
            <div className="flex-1">
              <div className="font-semibold">Get verified to boost trust</div>
              <p className="text-sm text-muted-foreground">Upload your Aadhaar/PAN to receive the verified badge on every listing.</p>
            </div>
            <Button asChild size="sm"><Link to="/dashboard/verification">Verify now</Link></Button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={ListChecks} label="Active Listings" value={myListings.length.toString()} tint="primary" />
          <StatCard icon={Package} label="Pending Orders" value={myOrdersAsFarmer.filter((o) => o.status === "pending").length.toString()} tint="accent" />
          <StatCard icon={IndianRupee} label="Revenue (7d)" value={`₹${weekRevenue.toLocaleString("en-IN")}`} tint="success" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/dashboard/orders">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {myOrdersAsFarmer.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{o.productName} <span className="text-sm text-muted-foreground">× {o.quantityKg}kg</span></div>
                  <div className="text-xs text-muted-foreground">{o.consumerName} • Pincode {o.consumerPincode}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">₹{o.totalPrice}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
              </div>
            ))}
            {myOrdersAsFarmer.length === 0 && <EmptyState message="No orders yet — share your listings on WhatsApp!" />}
          </div>
        </div>
      </div>
    );
  }

  // Consumer overview
  const verifiedListings = listings.filter((l) => l.farmerVerified);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.fullName.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Fresh produce from verified farmers near pincode {user.pincode}.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ShoppingBasket} label="Available Listings" value={listings.length.toString()} tint="primary" />
        <StatCard icon={ShieldCheck} label="Verified Farmers" value={new Set(verifiedListings.map((l) => l.farmerId)).size.toString()} tint="success" />
        <StatCard icon={TrendingUp} label="My Orders" value={myOrdersAsConsumer.length.toString()} tint="accent" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured Verified Farmers</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/dashboard/browse">Browse all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {verifiedListings.slice(0, 6).map((l) => (
            <Link key={l.id} to="/dashboard/browse" className="group overflow-hidden rounded-xl border border-border bg-background transition-all hover:shadow-md">
              <div className="aspect-video overflow-hidden bg-muted">
                <img src={l.images[0]} alt={l.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{l.name}</div>
                  <div className="font-semibold text-primary">₹{l.pricePerKg}/kg</div>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  {l.farmerName} <VerifiedBadge verified={l.farmerVerified} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tint: "primary" | "accent" | "success" }) {
  const tints = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tints[tint]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="py-8 text-center text-sm text-muted-foreground">{message}</div>;
}
