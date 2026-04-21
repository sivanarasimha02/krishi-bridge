import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Smartphone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            KrishiLink connects Indian farmers directly to urban consumers — no middlemen,
            verified profiles, and smart pincode-based delivery.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-opacity hover:opacity-95">
            <Smartphone className="h-4 w-4" />
            Download App (coming soon)
          </button>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/how-it-works" className="hover:text-foreground">How it Works</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Get Started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">Sign up as Farmer</Link></li>
            <li><Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">Sign up as Consumer</Link></li>
            <li><a href="mailto:hello@krishilink.in" className="hover:text-foreground">hello@krishilink.in</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4">
        <p className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} KrishiLink. Building a fair farm economy. 🌾
        </p>
      </div>
    </footer>
  );
}
