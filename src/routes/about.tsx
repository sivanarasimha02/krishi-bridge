import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — KrishiLink" },
      { name: "description", content: "KrishiLink is on a mission to give Indian farmers a fair price by connecting them directly with urban consumers." },
      { property: "og:title", content: "About — KrishiLink" },
      { property: "og:description", content: "Our mission: end exploitative middlemen and build a transparent farm-to-city economy." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About KrishiLink</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          India's farmers grow the food that feeds a billion people — yet middlemen capture
          most of the value. KrishiLink is rebuilding that supply chain with a WhatsApp-first
          marketplace, geo-verified farmer profiles, and pincode-batched logistics.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Our Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Give every Indian farmer a fair price and every urban household access to
              fresh, traceable produce.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Our Approach</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mobile-first onboarding, automated WhatsApp updates, and intelligent
              pincode-batched routes that cut delivery costs by 60%.
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
