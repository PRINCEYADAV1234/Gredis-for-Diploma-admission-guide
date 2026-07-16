import { Link } from "react-router-dom";
import { useSavedColleges, useRecommendations } from "@/lib/store";
import { CollegeCard } from "@/components/site/college-card";
import { Bookmark } from "lucide-react";

export function Saved() {
  const [saved] = useSavedColleges();
  const [recs] = useRecommendations();
  const items = recs.filter((r) => saved.includes(r.id));
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Bookmarks</p>
        <h1 className="font-display text-3xl font-semibold">Saved colleges</h1>
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <Bookmark className="mx-auto mb-4 size-8 text-brand" />
          <p className="mb-2 font-display text-lg font-semibold">Nothing saved yet</p>
          <p className="mb-6 text-sm text-muted-foreground">Bookmark colleges to compare and revisit later.</p>
          <Link to="/dashboard/recommendations" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground">
            Browse recommendations
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((c, i) => <CollegeCard key={c.id} college={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
