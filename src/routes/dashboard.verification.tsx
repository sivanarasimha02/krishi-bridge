import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, MapPin, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/dashboard/verification")({
  component: VerificationPage,
});

function VerificationPage() {
  const { user, setUser } = useApp();
  const [docUrl, setDocUrl] = useState(user?.documentUrl ?? "");
  const [geoCaptured, setGeoCaptured] = useState(false);

  if (!user) return null;
  if (user.role !== "farmer") {
    return <div className="py-10 text-center text-muted-foreground">Verification is only required for farmers.</div>;
  }

  const captureGeo = () => {
    // Simulated geo capture
    setTimeout(() => { setGeoCaptured(true); toast.success("Farm location captured (simulated)"); }, 600);
  };

  const submit = () => {
    if (!docUrl.trim()) { toast.error("Please add a document URL"); return; }
    if (!geoCaptured) { toast.error("Please capture farm geo-location"); return; }
    // TODO: Replace with Supabase Storage upload + admin verification workflow
    setUser({ ...user, documentUrl: docUrl.trim(), verified: true });
    toast.success("Verification submitted — you're now verified! 🎉");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verification</h1>
        <p className="text-muted-foreground">Build consumer trust with a verified badge on every listing.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div>
          <div className="flex-1">
            <div className="font-semibold">Status</div>
            <VerifiedBadge verified={!!user.verified} />
          </div>
        </div>
      </div>

      {!user.verified && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div>
            <Label>Aadhaar / PAN Document URL</Label>
            <div className="mt-1.5 flex gap-2">
              <Input placeholder="Paste document URL" value={docUrl} onChange={(e) => setDocUrl(e.target.value)} />
              <Button variant="outline" size="icon" title="Upload (TODO: Supabase Storage)"><Upload className="h-4 w-4" /></Button>
            </div>
          </div>

          <div>
            <Label>Farm Geo-location</Label>
            <Button onClick={captureGeo} variant={geoCaptured ? "secondary" : "outline"} className="mt-1.5 gap-2">
              {geoCaptured ? <CheckCircle2 className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {geoCaptured ? "Location captured" : "Capture current location"}
            </Button>
          </div>

          <Button onClick={submit} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95" size="lg">
            Submit for Verification
          </Button>
        </div>
      )}
    </div>
  );
}
