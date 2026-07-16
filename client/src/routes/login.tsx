import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function Login() {
  const nav = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Welcome back!");
        nav("/welcome");
      } else {
        toast.error(`Login incomplete: status ${result.status}`);
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/welcome",
      });
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Google sign in failed");
      setLoading(false);
    }
  }

  return (
    <AuthShell subtitle="Welcome back">
      <form onSubmit={submit} className="space-y-4">
        <button type="button" onClick={google} disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface/60 font-medium hover:bg-secondary disabled:opacity-60 cursor-pointer">
          <GoogleIcon /> Continue with Google
        </button>
        <div className="flex items-center gap-4 py-2">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[10px] uppercase text-muted-foreground">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-brand" />
        </label>
        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">Password</span>
            <button type="button" onClick={() => setResetOpen(true)} className="font-mono text-[10px] uppercase text-brand hover:underline cursor-pointer">
              Forgot?
            </button>
          </div>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:border-brand" />
        </label>
        <button disabled={loading}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-semibold text-brand-foreground ring-1 ring-brand disabled:opacity-60 cursor-pointer">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Log in"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link to="/signup" className="text-brand hover:underline">Sign up</Link>
        </p>
      </form>
      {resetOpen && <ResetModal onClose={() => setResetOpen(false)} />}
    </AuthShell>
  );
}

function ResetModal({ onClose }: { onClose: () => void }) {
  const { isLoaded, signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function resetPassword() {
    if (!isLoaded) return;
    try {
      await signIn.create({
        strategy: "reset_password_code",
        identifier: email,
      });
      setSent(true);
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Could not send reset code");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-2 font-display text-xl font-semibold">Reset password</h3>
        {sent ? (
          <p className="text-sm text-muted-foreground">If an account exists for {email}, check your inbox for instructions to reset your password.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">Enter your email — we'll send you a reset link.</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mb-4 h-11 w-full rounded-lg border border-border bg-background px-3 focus:border-brand outline-none" />
            <button onClick={resetPassword}
              className="h-10 w-full rounded-lg bg-brand font-semibold text-brand-foreground cursor-pointer">Send reset link</button>
          </>
        )}
      </motion.div>
    </div>
  );
}

export function AuthShell({ subtitle, children }: { subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-surface/50 lg:block">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-3xl" />
        </div>
        <div className="flex h-full flex-col justify-between p-12">
          <Link to="/" className="font-display text-xl font-semibold">GREDIS</Link>
          <div className="max-w-md">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-brand">Admission co-pilot</p>
            <h1 className="mb-4 font-display text-4xl font-semibold leading-tight">
              Precision routing for your engineering future.
            </h1>
            <p className="text-muted-foreground">
              AI-matched polytechnic recommendations, side-by-side comparison, and a personal roadmap.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase text-muted-foreground">© 2026 · Built for diploma admissions</p>
        </div>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block font-display text-xl font-semibold lg:hidden">GREDIS</Link>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-brand">{subtitle}</p>
          <h2 className="mb-8 font-display text-3xl font-semibold">Continue to Gredis</h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.7 2.5 2.5 6.7 2.5 12S6.7 21.5 12 21.5c6.9 0 9.5-4.9 9.5-9.4 0-.6-.1-1.2-.2-1.9H12z" />
    </svg>
  );
}
