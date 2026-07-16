import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Target, Compass, TrendingUp, MessageSquare, BarChart3, Shield, GraduationCap, Map, Wallet } from "lucide-react";

const items = [
  { i: Target, t: "AI Match Score", d: "0-100 score computed across budget, marks, location, and career goal." },
  { i: Compass, t: "Career Recommendations", d: "AI suggests branches aligned with your interests and future opportunities." },
  { i: Shield, t: "Eligibility Checker", d: "Instantly know which branches you qualify for and why others don't." },
  { i: BarChart3, t: "College Compare", d: "Side-by-side comparison of fees, placement, hostel and match score." },
  { i: Map, t: "Admission Roadmap", d: "Step-by-step timeline with deadlines, documents, and fee payments." },
  { i: Wallet, t: "Scholarship Advisor", d: "Government schemes, fee waivers, and financial aid tailored to you." },
  { i: MessageSquare, t: "AI Admission Chat", d: "ChatGPT-style assistant that answers admission questions 24/7." },
  { i: GraduationCap, t: "450+ Institutes", d: "Deep data on polytechnics across Maharashtra, Gujarat, Karnataka & more." },
  { i: TrendingUp, t: "Cutoff Insights", d: "Historical round-wise cutoffs per branch and category." },
];

export function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-brand">Features</p>
        <h1 className="mb-6 font-display text-5xl font-semibold">Everything Gredis does for you.</h1>
        <p className="max-w-2xl text-muted-foreground">
          A complete admission command center for Indian diploma students. Built on Gemini, powered by real cutoff and placement data.
        </p>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <div key={f.t} className="rounded-xl border border-border bg-surface/30 p-6">
              <div className="mb-4 grid size-10 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20">
                <f.i className="size-5" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
