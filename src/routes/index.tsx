import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Sparkles, Truck, ShieldCheck, Leaf, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/hero-farm-city.png";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              WhatsApp-first agri marketplace
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Digital Bridge Between{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Farm &amp; City</span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">
              Buy fresh produce directly from verified Indian farmers. No middlemen,
              transparent pricing, and smart pincode-based delivery batching.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-success" /> Verified Farmers</span>
              <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-success" /> Fresh Guarantee</span>
              <span className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" /> WhatsApp Orders</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-hero opacity-20 blur-2xl" />
            <img
              src={heroImg}
              alt="Illustration of a digital bridge connecting a smart farm to a futuristic city"
              className="relative w-full rounded-3xl border border-border/60 shadow-elegant animate-float"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-20" id="how">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How KrishiLink Works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps from harvest to your home.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Leaf, title: "Farmers List", desc: "Verified farmers list fresh produce with photos, harvest date, and price per kg.", color: "from-secondary to-secondary/70" },
            { icon: ShieldCheck, title: "Verification", desc: "We verify farms with documents and geo-location. Trust badges build consumer confidence.", color: "from-primary to-primary-glow" },
            { icon: Truck, title: "Direct to Consumer", desc: "Orders are batched by pincode for efficient last-mile delivery — no doorstep markup.", color: "from-accent to-accent/70" },
          ].map((s, i) => (
            <div key={s.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-elegant">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-primary-foreground shadow-md`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust band */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-4">
          {[
            { v: "500+", l: "Verified Farmers" },
            { v: "12k+", l: "Orders Delivered" },
            { v: "30%", l: "Avg. Savings vs Mandi" },
            { v: "200+", l: "Pincodes Served" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-primary">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elegant md:p-16">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to taste the difference?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Join thousands of consumers buying directly from farms across India.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/auth" search={{ mode: "signup" }}>I'm a Consumer</Link>
            </Button>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/auth" search={{ mode: "signup" }}>I'm a Farmer</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
