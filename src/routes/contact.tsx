import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KrishiLink" },
      { name: "description", content: "Get in touch with the KrishiLink team. Email, phone, and office address." },
      { property: "og:title", content: "Contact — KrishiLink" },
      { property: "og:description", content: "Reach out to the KrishiLink team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">We'd love to hear from farmers, consumers, and partners.</p>
        <div className="mt-10 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@krishilink.in" },
            { icon: Phone, label: "Phone", value: "+91 98000 12345" },
            { icon: MapPin, label: "Office", value: "Bengaluru, Karnataka, India" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                <div className="font-medium">{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
