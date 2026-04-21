import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, Package, ShieldCheck, User as UserIcon, Settings, LogOut, ShoppingBasket, ListChecks } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import * as storage from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !storage.getCurrentUser()) {
      throw redirect({ to: "/auth", search: { mode: "login" } });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  if (!user) return null;

  const farmerNav = [
    { to: "/dashboard", label: "Overview", icon: Home, exact: true },
    { to: "/dashboard/listings", label: "My Listings", icon: ListChecks, exact: false },
    { to: "/dashboard/orders", label: "Orders", icon: Package, exact: false },
    { to: "/dashboard/verification", label: "Verification", icon: ShieldCheck, exact: false },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon, exact: false },
  ];
  const consumerNav = [
    { to: "/dashboard", label: "Overview", icon: Home, exact: true },
    { to: "/dashboard/browse", label: "Browse", icon: ShoppingBasket, exact: false },
    { to: "/dashboard/orders", label: "My Orders", icon: Package, exact: false },
    { to: "/dashboard/profile", label: "Profile", icon: UserIcon, exact: false },
  ];
  const nav = user.role === "farmer" ? farmerNav : consumerNav;

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar (mobile + desktop) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:pl-64">
        <Link to="/" className="md:hidden"><Logo size={28} /></Link>
        <div className="hidden text-sm text-muted-foreground md:block">
          Welcome back, <span className="font-medium text-foreground">{user.fullName}</span>
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">{user.role}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2"><LogOut className="h-4 w-4" />Logout</Button>
        </div>
      </header>

      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <Link to="/"><Logo /></Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link to="/dashboard/profile" className="flex items-center gap-3 rounded-xl p-2 text-sm hover:bg-sidebar-accent">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <div className="truncate text-sm font-medium">{user.fullName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.phone}</div>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden">
        {nav.slice(0, 5).map((n) => {
          const active = n.exact ? path === n.to : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={cn("flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <main className="px-4 pb-24 pt-6 md:ml-64 md:pb-10 md:pl-8 md:pr-8">
        <Outlet />
      </main>
    </div>
  );
}
