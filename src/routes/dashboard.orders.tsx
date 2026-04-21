import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { OrderStatusBadge, OrderProgress, ORDER_STAGES } from "@/components/OrderStatus";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user, orders, updateOrderStatus } = useApp();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const myOrders = useMemo(() => {
    if (!user) return [];
    return user.role === "farmer"
      ? orders.filter((o) => o.farmerId === user.id)
      : orders.filter((o) => o.consumerId === user.id);
  }, [orders, user]);

  // Farmer view: group by pincode
  const grouped = useMemo(() => {
    const map = new Map<string, typeof myOrders>();
    for (const o of myOrders) {
      const arr = map.get(o.consumerPincode) ?? [];
      arr.push(o);
      map.set(o.consumerPincode, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [myOrders]);

  if (!user) return null;

  const sendWhatsAppUpdate = (o: typeof myOrders[number], newStatus: OrderStatus) => {
    const stageLabel = ORDER_STAGES.find((s) => s.key === newStatus)?.label ?? newStatus;
    const text = `Hi ${o.consumerName}, your KrishiLink order #${o.id.slice(-5).toUpperCase()} (${o.productName} × ${o.quantityKg}kg) is now: ${stageLabel}. — ${o.farmerName}`;
    // TODO: Replace with real WhatsApp Business API send. For MVP: open chat link.
    window.open(`https://wa.me/${o.consumerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{user.role === "farmer" ? "Orders by Pincode" : "My Orders"}</h1>
        <p className="text-muted-foreground">
          {user.role === "farmer" ? "Auto-grouped for efficient pincode-batched delivery." : "Track your KrishiLink orders."}
        </p>
      </div>

      {myOrders.length === 0 ? (
        <EmptyOrders />
      ) : user.role === "farmer" ? (
        <div className="space-y-3">
          {grouped.map(([pin, list]) => {
            const open = openGroups[pin] ?? true;
            return (
              <div key={pin} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <button onClick={() => setOpenGroups((g) => ({ ...g, [pin]: !open }))} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <div>
                      <div className="font-semibold">Pincode {pin}</div>
                      <div className="text-xs text-muted-foreground">{list.length} order{list.length !== 1 ? "s" : ""} • {list.reduce((s, o) => s + o.quantityKg, 0)}kg total</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">₹{list.reduce((s, o) => s + o.totalPrice, 0).toLocaleString("en-IN")}</div>
                </button>
                {open && (
                  <div className="divide-y divide-border border-t border-border">
                    {list.map((o) => (
                      <div key={o.id} className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {o.productImage && <img src={o.productImage} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                            <div>
                              <div className="font-medium">{o.productName} <span className="text-sm text-muted-foreground">× {o.quantityKg}kg</span></div>
                              <div className="text-xs text-muted-foreground">{o.consumerName} • {o.consumerPhone}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{o.totalPrice}</div>
                            <OrderStatusBadge status={o.status} />
                          </div>
                        </div>
                        <OrderProgress status={o.status} />
                        <div className="flex flex-wrap items-center gap-2">
                          <Select value={o.status} onValueChange={(v) => { updateOrderStatus(o.id, v as OrderStatus); }}>
                            <SelectTrigger className="h-8 w-[180px] text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {ORDER_STAGES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => sendWhatsAppUpdate(o, o.status)}>
                            <MessageCircle className="h-3.5 w-3.5" /> Send WhatsApp update
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {o.productImage && <img src={o.productImage} alt="" className="h-14 w-14 rounded-lg object-cover" />}
                  <div>
                    <div className="font-semibold">{o.productName}</div>
                    <div className="text-xs text-muted-foreground">{o.quantityKg}kg • from {o.farmerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{o.totalPrice}</div>
                  <OrderStatusBadge status={o.status} />
                </div>
              </div>
              <div className="mt-3"><OrderProgress status={o.status} /></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">No orders yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">When orders come in, they'll appear here grouped for efficient delivery.</p>
    </div>
  );
}

// silence unused import warning
void cn;
