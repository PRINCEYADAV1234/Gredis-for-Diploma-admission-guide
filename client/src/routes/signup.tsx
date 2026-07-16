import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { AuthShell } from "./login";

export function Signup() {
  const nav = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userLoaded && isSignedIn) {
      const profile = JSON.parse(localStorage.getItem("gredis:profile") || "{}");
      if (profile.onboarded) {
        nav("/dashboard");
      } else {
        nav("/welcome");
      }
    }
  }, [isSignedIn, userLoaded, nav]);

  if (!isLoaded || !userLoaded || (userLoaded && isSignedIn)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!email || !name || password.length < 6) { toast.error("Fill all fields (password 6+ chars)"); return; }
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifyOpen(true);
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!code) { toast.error("Enter verification code"); return; }
    setVerifying(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Account created successfully!");
        nav("/welcome");
      } else {
        toast.error(`Verification incomplete: status ${completeSignUp.status}`);
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  async function google() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/welcome",
      });
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Google sign up failed");
      setLoading(false);
    }
  }

  return (
    <AuthShell subtitle="Create account">
      <form onSubmit={submit} className="space-y-4">
        <button type="button" onClick={google} disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface/60 font-medium hover:bg-secondary cursor-pointer">
          <GoogleIconSmall /> Continue with Google
        </button>
        <div className="flex items-center gap-4 py-2">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase text-muted-foreground">or email</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Field label="Full name" value={name} onChange={setName} type="text" />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        <button disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-brand-foreground ring-1 ring-brand disabled:opacity-60 cursor-pointer">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-brand hover:underline">Log in</Link>
        </p>
      </form>
      {verifyOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center">
            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-brand/15 text-brand">
              <Check className="size-6" />
            </div>
            <h3 className="mb-2 font-display text-xl font-semibold">Verify your email</h3>
            <p className="mb-4 text-sm text-muted-foreground">We sent a verification code to <b>{email}</b>. Enter it below to activate your account.</p>
            <form onSubmit={handleVerify} className="space-y-4">
              <input type="text" required placeholder="Verification code" value={code} onChange={(e) => setCode(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-center text-lg tracking-widest font-mono outline-none focus:border-brand" />
              <button disabled={verifying} type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-brand-foreground cursor-pointer">
                {verifying ? <Loader2 className="size-4 animate-spin" /> : "Verify and Continue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AuthShell>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground">{label}</span>
      <input type={type} required value={value} onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-brand" />
    </label>
  );
}

function GoogleIconSmall() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.9 9.5-9.4 0-.6-.1-1.2-.2-1.9H12z" />
    </svg>
  );
}
