import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Leaf, ShieldCheck, Truck, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it Works — KrishiLink" },
      { name: "description", content: "Learn how KrishiLink connects farmers and consumers — listing, verification, ordering on WhatsApp, and pincode-batched delivery." },
      { property: "og:title", content: "How it Works — KrishiLink" },
      { property: "og:description", content: "Listing → Verification → WhatsApp Order → Pincode Delivery." },
    ],
  }),
  component: HowPage,
});

const steps = [
  { icon: Leaf, title: "Farmers list produce", desc: "Multiple photos, category, price/kg, stock, and harvest date — all in under 2 minutes on mobile." },
  { icon: ShieldCheck, title: "We verify the farm", desc: "Aadhaar/PAN upload, geo-tagged location, and harvest documentation. Verified badge appears on every listing." },
  { icon: MessageCircle, title: "Consumers order on WhatsApp", desc: "Browse by pincode, tap 'Order on WhatsApp' — order confirmations and updates flow via automated templates." },
  { icon: Truck, title: "Pincode-batched delivery", desc: "Orders for the same pincode and date are bundled, dramatically reducing per-order logistics cost." },
];

function HowPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">How KrishiLink Works</h1>
        <p className="mt-3 text-lg text-muted-foreground">Four steps from harvest to your kitchen.</p>
        <div className="mt-12 space-y-6">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-md">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
