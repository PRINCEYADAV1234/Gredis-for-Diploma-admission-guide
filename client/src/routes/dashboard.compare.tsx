import { useState } from "react";
import { useRecommendations } from "@/lib/store";
import { GitCompareArrows, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

export function Compare() {
  const [recs] = useRecommendations();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => recs.slice(0, 2).map((r) => r.id));
  const selected = selectedIds.map((id) => recs.find((r) => r.id === id)!).filter(Boolean);
  const others = recs.filter((r) => !selectedIds.includes(r.id));

  const rows: [string, (c: (typeof recs)[number]) => React.ReactNode][] = [
    ["Type", (c) => <span className="capitalize">{c.type}</span>],
    ["Location", (c) => c.location],
    ["Branch", (c) => c.branch],
    ["Match Score", (c) => <span className="font-mono text-brand">{c.matchScore}%</span>],
    ["Annual Fees", (c) => <span className="font-mono">₹{c.fees.toLocaleString("en-IN")}</span>],
    ["Last Cutoff", (c) => <span className="font-mono">{c.cutoff}%</span>],
    ["Placement", (c) => c.placement],
    ["Hostel", (c) => (c.hostel ? "Yes" : "No")],
    ["Top Pro", (c) => c.pros[0] ?? "—"],
    ["Top Con", (c) => c.cons[0] ?? "—"],
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Analysis</p>
        <h1 className="font-display text-3xl font-semibold">Compare colleges</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add up to 4 colleges side-by-side.</p>
      </div>

      {selected.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-3">
            {selected.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm">
                {c.name}
                <button onClick={() => setSelectedIds(selectedIds.filter((id) => id !== c.id))}>
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
            {selected.length < 4 && others.length > 0 && (
              <select onChange={(e) => { if (e.target.value) setSelectedIds([...selectedIds, e.target.value]); }} value=""
                className="rounded-full border border-dashed border-border bg-transparent px-3 py-1.5 text-sm text-foreground cursor-pointer">
                <option value="" className="text-black bg-white font-sans">+ Add college</option>
                {others.map((c) => <option key={c.id} value={c.id} className="text-black bg-white font-sans">{c.name}</option>)}
              </select>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto rounded-2xl border border-border bg-surface/30">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-mono text-[10px] uppercase text-muted-foreground">Metric</th>
                  {selected.map((c) => (
                    <th key={c.id} className="p-4 text-left">
                      <p className="font-display text-sm font-semibold">{c.name}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{c.type}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, render], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-background/20" : ""}>
                    <td className="p-4 font-mono text-[10px] uppercase text-muted-foreground">{label}</td>
                    {selected.map((c) => <td key={c.id} className="p-4 text-sm">{render(c)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-16 text-center">
      <GitCompareArrows className="mx-auto mb-4 size-8 text-brand" />
      <p className="mb-2 font-display text-lg font-semibold">Nothing to compare yet</p>
      <p className="text-sm text-muted-foreground">Generate recommendations first, then come back to compare.</p>
    </div>
  );
}
