import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApp } from "@/context/AppContext";
import type { User, UserRole } from "@/lib/types";
import { ArrowLeft, Sprout, ShoppingBasket, Upload } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional().default("signup"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign In — KrishiLink" },
      { name: "description", content: "Sign in or create your KrishiLink account as a farmer or consumer." },
    ],
  }),
  component: AuthPage,
});

type Step = "phone" | "otp" | "profile";

function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const search = Route.useSearch();

  const [role, setRole] = useState<UserRole>("consumer");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [profile, setProfile] = useState({
    fullName: "", pincode: "", city: "", farmName: "", primaryCrop: "", documentUrl: "",
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    // TODO: Replace with Supabase Auth phone OTP (signInWithOtp)
    toast.success("OTP sent! Use 123456 for demo.");
    setStep("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setStep("profile");
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim() || !/^\d{6}$/.test(profile.pincode) || !profile.city.trim()) {
      toast.error("Please fill name, 6-digit pincode and city");
      return;
    }
    if (role === "farmer" && (!profile.farmName.trim() || !profile.primaryCrop.trim())) {
      toast.error("Farm name and primary crop are required");
      return;
    }
    const user: User = {
      id: `u_${Date.now()}`,
      phone: `+91${phone}`,
      role,
      fullName: profile.fullName.trim(),
      pincode: profile.pincode,
      city: profile.city.trim(),
      farmName: role === "farmer" ? profile.farmName.trim() : undefined,
      primaryCrop: role === "farmer" ? profile.primaryCrop.trim() : undefined,
      documentUrl: role === "farmer" ? profile.documentUrl.trim() || undefined : undefined,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    setUser(user);
    toast.success(`Welcome, ${user.fullName}!`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute right-4 top-4"><ThemeToggle /></div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => (step === "phone" ? navigate({ to: "/" }) : setStep(step === "otp" ? "phone" : "otp"))}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <Logo />
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">
            {search.mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {step === "phone" && "Step 1 of 3 — verify your phone number"}
            {step === "otp" && "Step 2 of 3 — enter your OTP"}
            {step === "profile" && "Step 3 of 3 — complete your profile"}
          </p>

          {step === "phone" && (
            <>
              <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="consumer" className="gap-2"><ShoppingBasket className="h-4 w-4" />Consumer</TabsTrigger>
                  <TabsTrigger value="farmer" className="gap-2"><Sprout className="h-4 w-4" />Farmer</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="mt-1.5 flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                    <Input id="phone" inputMode="numeric" maxLength={10} placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="rounded-l-none" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95" size="lg">Send OTP</Button>
                <p className="text-center text-xs text-muted-foreground">By continuing you agree to our Terms &amp; Privacy.</p>
              </form>
            </>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="otp">6-digit OTP</Label>
                <Input id="otp" inputMode="numeric" maxLength={6} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="mt-1.5 text-center text-lg tracking-[0.5em]" />
                <p className="mt-2 text-xs text-muted-foreground">Sent to +91 {phone}. Use <span className="font-mono font-semibold">123456</span> for demo.</p>
              </div>
              <Button type="submit" className="w-full" size="lg">Verify OTP</Button>
            </form>
          )}

          {step === "profile" && (
            <form onSubmit={handleCompleteProfile} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" inputMode="numeric" maxLength={6} value={profile.pincode} onChange={(e) => setProfile({ ...profile, pincode: e.target.value.replace(/\D/g, "") })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="mt-1.5" />
                </div>
              </div>

              {role === "farmer" && (
                <>
                  <div>
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input id="farmName" value={profile.farmName} onChange={(e) => setProfile({ ...profile, farmName: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="crop">Primary Crop Type</Label>
                    <Input id="crop" placeholder="e.g. Vegetables, Fruits, Grains" value={profile.primaryCrop} onChange={(e) => setProfile({ ...profile, primaryCrop: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="doc">Aadhaar / PAN Document URL <span className="text-muted-foreground">(optional)</span></Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input id="doc" placeholder="Paste document URL or upload later" value={profile.documentUrl} onChange={(e) => setProfile({ ...profile, documentUrl: e.target.value })} />
                      <Button type="button" variant="outline" size="icon" title="Upload (TODO: Supabase Storage)"><Upload className="h-4 w-4" /></Button>
                    </div>
                    {/* TODO: Replace with Supabase Storage upload */}
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-95" size="lg">
                {role === "farmer" ? "Create Farmer Account" : "Create Consumer Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
