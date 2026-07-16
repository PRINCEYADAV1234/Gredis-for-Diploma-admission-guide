import { useState } from "react";
import { useProfile, useRecommendations, type College } from "@/lib/store";
import { generateRecommendations } from "@/lib/ai.functions";
import { CollegeCard } from "@/components/site/college-card";
import { RefreshCw, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function Recommendations() {
  const [profile] = useProfile();
  const [recs, setRecs] = useRecommendations();
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = (await generateRecommendations(profile)) as College[];
      if (Array.isArray(r) && r.length > 0) { setRecs(r); toast.success("Recommendations updated"); }
      else toast.error("No results — try updating your profile");
    } catch (e) { console.error(e); toast.error("Failed to generate"); }
    finally { setLoading(false); }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">AI-Matched</p>
          <h1 className="font-display text-3xl font-semibold">Your recommendations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ranked by match score based on your profile.</p>
        </div>
        <button onClick={refresh} disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary disabled:opacity-60">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </button>
      </div>

      {loading && recs.length === 0 ? (
        <SkeletonGrid />
      ) : recs.length === 0 ? (
        <EmptyState onGenerate={refresh} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recs.map((c, i) => <CollegeCard key={c.id} college={c} index={i} />)}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface/40 p-6">
          <div className="mb-4 h-4 w-32 rounded bg-secondary" />
          <div className="mb-2 h-6 w-full rounded bg-secondary" />
          <div className="mb-6 h-4 w-24 rounded bg-secondary" />
          <div className="h-1 rounded-full bg-secondary" />
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="h-12 rounded bg-secondary" />
            <div className="h-12 rounded bg-secondary" />
            <div className="h-12 rounded bg-secondary" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-16 text-center">
      <Sparkles className="mx-auto mb-4 size-8 text-brand" />
      <h2 className="mb-2 font-display text-2xl font-semibold">No recommendations yet</h2>
      <p className="mb-8 text-muted-foreground">Generate your first AI shortlist based on your profile.</p>
      <button onClick={onGenerate} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-brand-foreground">
        Generate now <Sparkles className="size-4" />
      </button>
    </div>
  );
}
