import { motion } from "framer-motion";
import { Bookmark, MapPin, Wallet, Users } from "lucide-react";
import type { College } from "@/lib/store";
import { useSavedColleges } from "@/lib/store";
import { toast } from "sonner";

export function CollegeCard({ college, index = 0 }: { college: College; index?: number }) {
  const [saved, setSaved] = useSavedColleges();
  const isSaved = saved.includes(college.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col rounded-2xl border border-border bg-surface/40 p-6 transition-colors hover:border-brand/40"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-brand">
            {college.type === "government" ? "Government" : "Private"} · {college.branch}
          </p>
          <h3 className="font-display text-lg font-semibold leading-tight">{college.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {college.location}
          </p>
        </div>
        <button onClick={() => {
          setSaved(isSaved ? saved.filter((s) => s !== college.id) : [...saved, college.id]);
          toast.success(isSaved ? "Removed from saved" : "College saved");
        }}
          className={`grid size-9 place-items-center rounded-lg border transition-colors ${isSaved ? "border-brand bg-brand/15 text-brand" : "border-border hover:bg-secondary"}`}>
          <Bookmark className="size-4" fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
          <span>Match Score</span>
          <span className="text-brand">{college.matchScore}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div initial={{ width: 0 }} animate={{ width: `${college.matchScore}%` }}
            transition={{ duration: 1, delay: index * 0.05 }} className="h-full bg-brand" />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background/40 p-3 text-center">
        <div>
          <p className="font-mono text-[9px] uppercase text-muted-foreground">Fees</p>
          <p className="mt-0.5 text-xs font-semibold">₹{college.fees.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase text-muted-foreground">Cutoff</p>
          <p className="mt-0.5 text-xs font-semibold">{college.cutoff}%</p>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase text-muted-foreground">Hostel</p>
          <p className="mt-0.5 text-xs font-semibold">{college.hostel ? "Yes" : "No"}</p>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{college.why}</p>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-brand">Pros</p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {college.pros.slice(0, 3).map((p, i) => <li key={i}>· {p}</li>)}
          </ul>
        </div>
        <div>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-destructive/80">Cons</p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {college.cons.slice(0, 2).map((p, i) => <li key={i}>· {p}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="size-3" /> {college.placement}</span>
        <span className="flex items-center gap-1"><Wallet className="size-3" /> ₹{college.fees.toLocaleString("en-IN")}/yr</span>
      </div>
    </motion.div>
  );
}
