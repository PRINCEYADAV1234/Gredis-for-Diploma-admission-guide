import { useState, useEffect } from "react";
import { useProfile } from "@/lib/store";
import { generateCareerRecs } from "@/lib/ai.functions";
import { Compass, Loader2, RefreshCw, Briefcase, Wrench, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Career = { branch: string; why: string; skills: string[]; opportunities: string[]; salaryRange: string };

export function CareerRecommendations() {
  const [profile] = useProfile();
  const [items, setItems] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = (await generateCareerRecs(profile)) as Career[];
      if (Array.isArray(r)) setItems(r);
    } catch (e) { console.error(e); toast.error("Failed to generate"); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (items.length === 0) refresh(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Career fit</p>
          <h1 className="font-display text-3xl font-semibold">Recommended branches</h1>
        </div>
        <button onClick={refresh} disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Refresh
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-surface/40" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Compass className="mx-auto mb-4 size-8 text-brand" />
          <p className="text-muted-foreground">No career recommendations yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((c, i) => (
            <motion.div key={c.branch} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-surface/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">{c.branch}</h3>
                <span className="rounded bg-brand/15 px-2 py-1 font-mono text-[10px] text-brand">{c.salaryRange}</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{c.why}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase text-brand"><Wrench className="size-3" /> Skills</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {c.skills.map((s, i) => <li key={i}>· {s}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1 font-mono text-[10px] uppercase text-brand"><Briefcase className="size-3" /> Opportunities</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {c.opportunities.map((s, i) => <li key={i}>· {s}</li>)}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
