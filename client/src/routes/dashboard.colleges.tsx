import { useState, useMemo } from "react";
import { useRecommendations } from "@/lib/store";
import { CollegeCard } from "@/components/site/college-card";
import { Search } from "lucide-react";

export function Colleges() {
  const [recs] = useRecommendations();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "government" | "private">("all");

  const filtered = useMemo(() => recs.filter((c) =>
    (type === "all" || c.type === type) &&
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.location.toLowerCase().includes(q.toLowerCase()))
  ), [recs, q, type]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Directory</p>
        <h1 className="font-display text-3xl font-semibold">All colleges</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or location…"
            className="h-11 w-full rounded-lg border border-border bg-surface/50 pl-9 pr-3 text-sm outline-none focus:border-brand" />
        </div>
        <div className="flex rounded-lg border border-border p-1">
          {(["all","government","private"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${type === t ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
          <p>No colleges found. Try refreshing recommendations from the Recommendations page.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => <CollegeCard key={c.id} college={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
