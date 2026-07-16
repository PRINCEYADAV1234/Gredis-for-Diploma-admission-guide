import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, useSession } from "@/lib/auth";
import { Sparkles, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export function Welcome() {
  const user = useSession();
  const nav = useNavigate();
  useEffect(() => { if (!user) nav("/login"); }, [user, nav]);

  return (
    <div className="grid min-h-screen place-items-center bg-background p-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-xl text-center">
        <div className="mx-auto mb-6 grid size-16 place-items-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/30">
          <Sparkles className="size-7" />
        </div>
        <h1 className="mb-3 font-display text-4xl font-semibold sm:text-5xl">
          Welcome, {user?.name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="mb-2 text-lg text-muted-foreground">Your AI Co-Pilot for Diploma Admissions.</p>
        <p className="mb-10 text-sm text-muted-foreground">
          We'll ask a few questions to personalize your recommendations. Takes less than 2 minutes.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/onboarding"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 font-semibold text-brand-foreground ring-1 ring-brand hover:scale-[1.02] transition-transform">
            Start Setup <ArrowRight className="size-4" />
          </Link>
          <Link to="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium hover:bg-secondary">
            Skip for Now
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
