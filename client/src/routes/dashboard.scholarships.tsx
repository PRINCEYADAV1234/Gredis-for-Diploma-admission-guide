import { Wallet, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useProfile } from "@/lib/store";

const SCHOLARSHIPS = [
  { name: "Post Matric Scholarship (SC/ST)", type: "Government", amount: "₹230 – ₹1,200/month", eligibility: "SC/ST, family income < ₹2.5 LPA", link: "https://scholarships.gov.in" },
  { name: "OBC Scholarship (Post-Matric)", type: "Government", amount: "Up to ₹15,000/yr", eligibility: "OBC, family income < ₹1.5 LPA", link: "https://scholarships.gov.in" },
  { name: "Minority Community Scholarship", type: "Government", amount: "₹10,000 – ₹20,000/yr", eligibility: "Notified minority + income cap", link: "https://scholarships.gov.in" },
  { name: "EBC Fee Waiver Maharashtra", type: "State", amount: "50% – 100% of tuition", eligibility: "Family income < ₹8 LPA", link: "https://mahadbtmahait.gov.in" },
  { name: "AICTE Pragati Scholarship (Girls)", type: "AICTE", amount: "₹50,000/yr", eligibility: "Girls, family income < ₹8 LPA", link: "https://www.aicte-pragati-saksham-gov.in" },
  { name: "AICTE Saksham Scholarship (PwD)", type: "AICTE", amount: "₹50,000/yr", eligibility: "PwD students, family income < ₹8 LPA", link: "https://www.aicte-pragati-saksham-gov.in" },
];

export function Scholarships() {
  const [profile] = useProfile();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Financial aid</p>
        <h1 className="font-display text-3xl font-semibold">Scholarships for you</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.category ? `Curated for ${profile.category} · budget ₹${profile.budget?.toLocaleString("en-IN") ?? "—"}` : "Complete your profile for personalized picks."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SCHOLARSHIPS.map((s, i) => (
          <motion.a key={s.name} href={s.link} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-border bg-surface/40 p-5 hover:border-brand/40">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/20">
                <Wallet className="size-5" />
              </div>
              <span className="rounded bg-secondary px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">{s.type}</span>
            </div>
            <h3 className="mb-1 font-display text-base font-semibold">{s.name}</h3>
            <p className="mb-3 text-xs text-muted-foreground">{s.eligibility}</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-brand">{s.amount}</span>
              <ExternalLink className="size-4 text-muted-foreground group-hover:text-brand" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
