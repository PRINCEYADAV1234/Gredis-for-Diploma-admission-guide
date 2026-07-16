import { useState, useEffect } from "react";
import { useProfile } from "@/lib/store";
import { generateRoadmap } from "@/lib/ai.functions";
import { motion } from "framer-motion";
import { Map, Loader2, RefreshCw, FileText, Calendar } from "lucide-react";
import { toast } from "sonner";

type Step = { step: number; title: string; description: string; deadline: string; documents: string[] };

export function Roadmap() {
  const [profile] = useProfile();
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  async function build() {
    setLoading(true);
    try { const r = (await generateRoadmap(profile)) as Step[]; if (Array.isArray(r)) setSteps(r); }
    catch (e) { console.error(e); toast.error("Failed to generate"); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (steps.length === 0) build(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Timeline</p>
          <h1 className="font-display text-3xl font-semibold">Your admission roadmap</h1>
        </div>
        <button onClick={build} disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Regenerate
        </button>
      </div>

      {loading && steps.length === 0 ? (
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface/40" />
      ) : steps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Map className="mx-auto mb-4 size-8 text-brand" />
          <p className="text-muted-foreground">No roadmap yet.</p>
        </div>
      ) : (
        <ol className="relative space-y-6 border-l border-border pl-8">
          {steps.map((s, i) => (
            <motion.li key={s.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="absolute -left-[9px] grid size-4 place-items-center rounded-full bg-brand ring-4 ring-background" />
              <div className="rounded-2xl border border-border bg-surface/40 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Step {s.step}</p>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                    <Calendar className="size-3" /> {s.deadline}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{s.description}</p>
                {s.documents?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {s.documents.map((d) => (
                      <span key={d} className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-1 text-[10px] text-muted-foreground">
                        <FileText className="size-3" /> {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
