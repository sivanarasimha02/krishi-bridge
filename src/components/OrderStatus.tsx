import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STAGES: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    confirmed: "bg-primary/10 text-primary border-primary/30",
    packed: "bg-accent/15 text-accent border-accent/30",
    out_for_delivery: "bg-primary-glow/15 text-primary border-primary-glow/30",
    delivered: "bg-success/15 text-success border-success/30",
  };
  const label = STAGES.find((s) => s.key === status)?.label ?? status;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status])}>
      {label}
    </span>
  );
}

export function OrderProgress({ status }: { status: OrderStatus }) {
  const idx = STAGES.findIndex((s) => s.key === status);
  return (
    <div className="flex items-center gap-1">
      {STAGES.map((s, i) => (
        <div key={s.key} className="flex flex-1 items-center gap-1">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors",
              i <= idx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"
            )}
            title={s.label}
          >
            {i < idx ? <Check className="h-3 w-3" /> : i + 1}
          </div>
          {i < STAGES.length - 1 && (
            <div className={cn("h-0.5 flex-1 rounded", i < idx ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}

export const ORDER_STAGES = STAGES;
