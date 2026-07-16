import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProfile, useRecommendations, profileCompletion } from "@/lib/store";
import { useSession } from "@/lib/auth";
import { Sparkles, Target, GraduationCap, Wallet, Calendar, ArrowRight, MessageSquare } from "lucide-react";

export function DashboardHome() {
  const user = useSession();
  const [profile] = useProfile();
  const [recs] = useRecommendations();
  const completion = profileCompletion(profile);
  const topMatch = recs[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Overview</p>
        <h1 className="font-display text-3xl font-semibold">Welcome back, {user?.name?.split(" ")[0] ?? "Student"}.</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your admission command center.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat i={Target} label="Profile" value={`${completion}%`} sub={completion < 100 ? "Complete your profile" : "Fully complete"} accent />
        <Stat i={GraduationCap} label="Recommended" value={String(recs.length)} sub="matched colleges" />
        <Stat i={Wallet} label="Budget" value={profile.budget ? `₹${profile.budget.toLocaleString("en-IN")}` : "—"} sub="per year" />
        <Stat i={Calendar} label="Season" value="2026" sub="admission cycle" />
      </div>

      {completion < 100 && (
        <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-surface to-background p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-brand">Profile Completion · {completion}%</p>
              <h2 className="font-display text-xl font-semibold">Sharpen your recommendations.</h2>
              <p className="mt-1 text-sm text-muted-foreground">Answer a few more questions to unlock better matches.</p>
            </div>
            <Link to="/dashboard/profile" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground">
              Complete Profile <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }} transition={{ duration: 1 }} className="h-full bg-brand" />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Top Recommendations</h2>
            <Link to="/dashboard/recommendations" className="font-mono text-[10px] uppercase text-brand hover:underline">View all →</Link>
          </div>
          {recs.length === 0 ? (
            <EmptyRecs />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {recs.slice(0, 4).map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-surface/40 p-5">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-sm font-semibold">{r.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">{r.location} · {r.type}</p>
                    </div>
                    <span className="rounded bg-brand/15 px-1.5 py-0.5 font-mono text-[10px] text-brand">{r.matchScore}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-brand" style={{ width: `${r.matchScore}%` }} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{r.why}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Quick actions</h2>
          <Link to="/dashboard/chat" className="flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-4 hover:border-brand/40">
            <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand"><MessageSquare className="size-5" /></div>
            <div>
              <p className="text-sm font-medium">Ask the AI Counselor</p>
              <p className="text-xs text-muted-foreground">Chat about eligibility, fees, deadlines.</p>
            </div>
          </Link>
          <Link to="/dashboard/compare" className="flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-4 hover:border-brand/40">
            <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand"><Target className="size-5" /></div>
            <div>
              <p className="text-sm font-medium">Compare colleges</p>
              <p className="text-xs text-muted-foreground">Side-by-side breakdown.</p>
            </div>
          </Link>
          <Link to="/dashboard/roadmap" className="flex items-center gap-3 rounded-xl border border-border bg-surface/40 p-4 hover:border-brand/40">
            <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand"><Sparkles className="size-5" /></div>
            <div>
              <p className="text-sm font-medium">Admission roadmap</p>
              <p className="text-xs text-muted-foreground">Deadlines & documents.</p>
            </div>
          </Link>
          {topMatch && (
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-brand">AI Insight</p>
              <p className="text-sm">"{topMatch.why}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ i: Icon, label, value, sub, accent }: { i: any; label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-brand/30 bg-brand/5" : "border-border bg-surface/40"}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="size-4 text-brand" />
      </div>
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function EmptyRecs() {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <Sparkles className="mx-auto mb-3 size-6 text-brand" />
      <p className="mb-2 font-display text-lg font-semibold">No recommendations yet</p>
      <p className="mb-6 text-sm text-muted-foreground">Complete your quick setup to get AI-matched colleges.</p>
      <Link to="/onboarding" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-brand-foreground">
        Start Setup
      </Link>
    </div>
  );
}
