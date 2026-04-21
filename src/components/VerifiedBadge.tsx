import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ verified, className }: { verified: boolean; className?: string }) {
  if (verified) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success", className)}>
        <BadgeCheck className="h-3.5 w-3.5" /> Verified
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning-foreground", className)}>
      Pending Verification
    </span>
  );
}
