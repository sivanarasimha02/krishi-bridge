import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, MessageCircle, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Listing, Order, ProduceCategory } from "@/lib/types";

export const Route = createFileRoute("/dashboard/browse")({
  component: BrowsePage,
});

const CATEGORIES: ("all" | ProduceCategory)[] = ["all", "vegetables", "fruits", "grains", "dairy", "spices"];

function BrowsePage() {
  const { user, listings, addOrder } = useApp();
  const [query, setQuery] = useState("");
  const [pincode, setPincode] = useState(user?.pincode ?? "");
  const [category, setCategory] = useState<"all" | ProduceCategory>("all");
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [orderTarget, setOrderTarget] = useState<Listing | null>(null);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (query && !l.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (category !== "all" && l.category !== category) return false;
      if (maxPrice > 0 && l.pricePerKg > maxPrice) return false;
      if (verifiedOnly && !l.farmerVerified) return false;
      return true;
    });
  }, [listings, query, category, maxPrice, verifiedOnly]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Fresh Produce</h1>
        <p className="text-muted-foreground">Direct from verified Indian farmers.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search produce..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pincode" inputMode="numeric" maxLength={6} value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))} className="w-[140px] pl-9" />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v as "all" | ProduceCategory)}>
            <SelectTrigger className="w-[150px]"><Filter className="mr-1 h-4 w-4" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Max ₹/kg" value={maxPrice || ""} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-[120px]" />
          <div className="flex items-center gap-2 rounded-md border border-input px-3">
            <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
            <Label htmlFor="verified" className="text-sm">Verified only</Label>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No listings match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((l) => (
            <div key={l.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-elegant">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={l.images[0]} alt={l.name} loading="lazy" className="h-full w-full object-cover transition-transform hover:scale-105" />
                <div className="absolute left-2 top-2"><VerifiedBadge verified={l.farmerVerified} /></div>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold leading-tight">{l.name}</h3>
                  <div className="font-bold text-primary">₹{l.pricePerKg}<span className="text-xs font-normal text-muted-foreground">/kg</span></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {l.farmerName} • <span className="capitalize">{l.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {l.city} ({l.pincode})
                </div>
                <Button size="sm" className="mt-2 w-full gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => setOrderTarget(l)}>
                  <MessageCircle className="h-3.5 w-3.5" /> Order on WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <OrderDialog
        listing={orderTarget}
        onClose={() => setOrderTarget(null)}
        onConfirm={(qty) => {
          if (!user || !orderTarget) return;
          const order: Order = {
            id: `o_${Date.now()}`,
            listingId: orderTarget.id,
            productName: orderTarget.name,
            productImage: orderTarget.images[0],
            farmerId: orderTarget.farmerId,
            farmerName: orderTarget.farmerName,
            consumerId: user.id,
            consumerName: user.fullName,
            consumerPhone: user.phone,
            consumerPincode: user.pincode,
            quantityKg: qty,
            pricePerKg: orderTarget.pricePerKg,
            totalPrice: qty * orderTarget.pricePerKg,
            status: "pending",
            createdAt: new Date().toISOString(),
          };
          addOrder(order);
          // TODO: Replace with WhatsApp Business API automated template
          const text = `Hi ${orderTarget.farmerName}, I'd like to order ${qty}kg of ${orderTarget.name} (₹${order.totalPrice}). My pincode: ${user.pincode}. — via KrishiLink`;
          window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
          toast.success("Order placed! WhatsApp opened to confirm with farmer.");
          setOrderTarget(null);
        }}
      />
    </div>
  );
}

function OrderDialog({ listing, onClose, onConfirm }: { listing: Listing | null; onClose: () => void; onConfirm: (qty: number) => void }) {
  const [qty, setQty] = useState(1);
  if (!listing) return null;
  return (
    <Dialog open={!!listing} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {listing.name}</DialogTitle>
          <DialogDescription>From {listing.farmerName} • ₹{listing.pricePerKg}/kg</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Quantity (kg)</Label>
            <Input type="number" min={1} max={listing.stockKg} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="mt-1.5" />
            <p className="mt-1 text-xs text-muted-foreground">{listing.stockKg}kg available</p>
          </div>
          <div className="rounded-xl bg-muted p-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{(qty * listing.pricePerKg).toLocaleString("en-IN")}</span></div>
            <div className="mt-1 text-xs text-muted-foreground">Delivery batched by pincode — usually free.</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(qty)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90"><MessageCircle className="mr-1 h-4 w-4" /> Confirm &amp; Open WhatsApp</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
