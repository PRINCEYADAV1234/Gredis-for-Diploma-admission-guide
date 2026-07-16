import { useState, useEffect } from "react";
import { useProfile } from "@/lib/store";
import { checkEligibility } from "@/lib/ai.functions";
import { ShieldCheck, ShieldX, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type EligibilityResult = {
  eligible: { branch: string; reason: string }[];
  notEligible: { branch: string; reason: string }[];
};

export function EligibilityChecker() {
  const [profile] = useProfile();
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try { setResult((await checkEligibility(profile)) as EligibilityResult); }
    catch (e) { console.error(e); toast.error("Failed to check"); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (!result) run(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Eligibility</p>
          <h1 className="font-display text-3xl font-semibold">What can you get into?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Based on your 10th %, budget, and preferences.</p>
        </div>
        <button onClick={run} disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Re-check
        </button>
      </div>

      {loading && !result ? (
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface/40" />
      ) : result ? (
        <div className="grid gap-6 md:grid-cols-2">
          <ResultList title="Eligible" items={result.eligible} icon={ShieldCheck} accent="brand" />
          <ResultList title="Not eligible" items={result.notEligible} icon={ShieldX} accent="destructive" />
        </div>
      ) : null}
    </div>
  );
}

function ResultList({ title, items, icon: Icon, accent }: { title: string; items: { branch: string; reason: string }[]; icon: any; accent: "brand" | "destructive" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface/40 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`size-5 ${accent === "brand" ? "text-brand" : "text-destructive"}`} />
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <span className="ml-auto rounded bg-secondary px-2 py-0.5 font-mono text-[10px]">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing here.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.branch} className="rounded-lg border border-border bg-background/40 p-3">
              <p className="font-display text-sm font-semibold">{it.branch}</p>
              <p className="mt-1 text-xs text-muted-foreground">{it.reason}</p>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
