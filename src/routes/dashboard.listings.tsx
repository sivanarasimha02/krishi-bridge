import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Share2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { Listing, ProduceCategory } from "@/lib/types";

export const Route = createFileRoute("/dashboard/listings")({
  component: ListingsPage,
});

const CATEGORIES: ProduceCategory[] = ["vegetables", "fruits", "grains", "dairy", "spices"];
const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop";

function ListingsPage() {
  const { user, listings, addListing, updateListing, deleteListing } = useApp();
  const myListings = useMemo(() => listings.filter((l) => l.farmerId === user?.id), [listings, user?.id]);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [open, setOpen] = useState(false);

  if (!user || user.role !== "farmer") {
    return <div className="py-10 text-center text-muted-foreground">Listings management is only for farmers.</div>;
  }

  const handleShare = (l: Listing) => {
    const text = `🌱 ${l.name} from ${l.farmName}\n₹${l.pricePerKg}/kg • ${l.stockKg}kg available\nOrder via KrishiLink: https://krishilink.in/l/${l.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
          <p className="text-muted-foreground">Manage your produce catalog.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-95"><Plus className="h-4 w-4" /> Add Listing</Button>
          </DialogTrigger>
          <ListingDialog
            initial={editing}
            onSubmit={(data) => {
              if (editing) {
                updateListing(editing.id, data);
                toast.success("Listing updated");
              } else {
                const newListing: Listing = {
                  id: `l_${Date.now()}`,
                  farmerId: user.id,
                  farmerName: user.fullName,
                  farmName: user.farmName ?? "My Farm",
                  farmerVerified: !!user.verified,
                  pincode: user.pincode,
                  city: user.city,
                  createdAt: new Date().toISOString(),
                  ...data,
                };
                addListing(newListing);
                toast.success("Listing added");
              }
              setOpen(false);
              setEditing(null);
            }}
          />
        </Dialog>
      </div>

      {myListings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No listings yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add your first produce listing to start receiving orders.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myListings.map((l) => (
            <div key={l.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className="relative aspect-video bg-muted">
                <img src={l.images[0] ?? PLACEHOLDER} alt={l.name} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute left-2 top-2"><VerifiedBadge verified={l.farmerVerified} /></div>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold leading-tight">{l.name}</h3>
                    <div className="text-xs capitalize text-muted-foreground">{l.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">₹{l.pricePerKg}<span className="text-xs font-normal text-muted-foreground">/kg</span></div>
                    <div className="text-xs text-muted-foreground">{l.stockKg}kg left</div>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{l.description}</p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleShare(l)}><Share2 className="h-3.5 w-3.5" />Share</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(l); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this listing?")) { deleteListing(l.id); toast.success("Deleted"); } }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ListingForm = Pick<Listing, "name" | "category" | "description" | "pricePerKg" | "stockKg" | "harvestDate" | "images">;

function ListingDialog({ initial, onSubmit }: { initial: Listing | null; onSubmit: (data: ListingForm) => void }) {
  const [form, setForm] = useState<ListingForm>(() => ({
    name: initial?.name ?? "",
    category: initial?.category ?? "vegetables",
    description: initial?.description ?? "",
    pricePerKg: initial?.pricePerKg ?? 0,
    stockKg: initial?.stockKg ?? 0,
    harvestDate: initial?.harvestDate ?? new Date().toISOString().slice(0, 10),
    images: initial?.images ?? [PLACEHOLDER],
  }));
  const [imageInput, setImageInput] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.pricePerKg <= 0 || form.stockKg <= 0) {
      toast.error("Fill name, price and stock");
      return;
    }
    onSubmit({ ...form, images: form.images.length ? form.images : [PLACEHOLDER] });
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit listing" : "Add new produce"}</DialogTitle>
        <DialogDescription>List a fresh batch from your farm.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label>Product name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ProduceCategory })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Harvest date</Label>
            <Input type="date" value={form.harvestDate} onChange={(e) => setForm({ ...form, harvestDate: e.target.value })} className="mt-1.5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Price per kg (₹)</Label>
            <Input type="number" min={0} value={form.pricePerKg || ""} onChange={(e) => setForm({ ...form, pricePerKg: Number(e.target.value) })} className="mt-1.5" />
          </div>
          <div>
            <Label>Stock (kg)</Label>
            <Input type="number" min={0} value={form.stockKg || ""} onChange={(e) => setForm({ ...form, stockKg: Number(e.target.value) })} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" />
        </div>
        <div>
          <Label>Image URLs</Label>
          <div className="mt-1.5 flex gap-2">
            <Input placeholder="Paste image URL" value={imageInput} onChange={(e) => setImageInput(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => { if (imageInput.trim()) { setForm({ ...form, images: [...form.images, imageInput.trim()] }); setImageInput(""); } }}>Add</Button>
          </div>
          {/* TODO: Replace with Supabase Storage multi-image upload */}
          {form.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.images.map((u, i) => (
                <div key={i} className="relative">
                  <img src={u} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-95">{initial ? "Save changes" : "Create listing"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
