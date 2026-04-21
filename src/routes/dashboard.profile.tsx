import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setUser } = useApp();
  const [form, setForm] = useState(() => ({
    fullName: user?.fullName ?? "",
    pincode: user?.pincode ?? "",
    city: user?.city ?? "",
    farmName: user?.farmName ?? "",
    primaryCrop: user?.primaryCrop ?? "",
  }));

  if (!user) return null;

  const save = () => {
    if (!form.fullName.trim() || !/^\d{6}$/.test(form.pincode) || !form.city.trim()) {
      toast.error("Name, 6-digit pincode and city are required");
      return;
    }
    setUser({
      ...user,
      fullName: form.fullName.trim(),
      pincode: form.pincode,
      city: form.city.trim(),
      farmName: user.role === "farmer" ? form.farmName.trim() || user.farmName : undefined,
      primaryCrop: user.role === "farmer" ? form.primaryCrop.trim() || user.primaryCrop : undefined,
    });
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Update your personal and farm details.</p>
        </div>
        {user.role === "farmer" && <VerifiedBadge verified={!!user.verified} />}
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-2xl font-semibold text-primary-foreground">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="text-lg font-semibold">{user.fullName}</div>
            <div className="text-sm text-muted-foreground">{user.phone} • <span className="capitalize">{user.role}</span></div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Full name</Label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1.5" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={user.phone} disabled className="mt-1.5" />
          </div>
          <div>
            <Label>Pincode</Label>
            <Input inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })} className="mt-1.5" />
          </div>
          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1.5" />
          </div>

          {user.role === "farmer" && (
            <>
              <div>
                <Label>Farm name</Label>
                <Input value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Primary crop</Label>
                <Input value={form.primaryCrop} onChange={(e) => setForm({ ...form, primaryCrop: e.target.value })} className="mt-1.5" />
              </div>
            </>
          )}
        </div>

        <Button onClick={save} className="bg-gradient-primary text-primary-foreground hover:opacity-95">Save changes</Button>
      </div>
    </div>
  );
}
