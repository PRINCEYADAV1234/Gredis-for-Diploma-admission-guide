import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Sparkles, Building2, GitCompareArrows, MessageSquare,
  Compass, ShieldCheck, Map, Wallet, Bookmark, Settings, User2,
  LogOut, Menu, X, Bell, Search,
} from "lucide-react";
import { auth, useSession } from "@/lib/auth";
import { useProfile, profileCompletion } from "@/lib/store";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/dashboard/colleges", label: "Colleges", icon: Building2 },
  { to: "/dashboard/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/dashboard/career-recommendations", label: "Career", icon: Compass },
  { to: "/dashboard/eligibility-checker", label: "Eligibility", icon: ShieldCheck },
  { to: "/dashboard/roadmap", label: "Roadmap", icon: Map },
  { to: "/dashboard/scholarships", label: "Scholarships", icon: Wallet },
  { to: "/dashboard/saved", label: "Saved", icon: Bookmark },
  { to: "/dashboard/profile", label: "Profile", icon: User2 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as { to: string; label: string; icon: any; exact?: boolean }[];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const user = useSession();
  const [profile] = useProfile();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const completion = profileCompletion(profile);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Link to="/" className="font-display text-lg font-semibold">GREDIS</Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");
            return (
              <Link key={it.to} to={it.to}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-brand/15 text-brand" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                <it.icon className="size-4" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          {completion < 100 && (
            <div className="mb-4 rounded-lg border border-brand/20 bg-brand/5 p-3">
              <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-brand">Profile · {completion}%</p>
              <div className="mb-2 h-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-brand" style={{ width: `${completion}%` }} />
              </div>
              <Link to="/dashboard/profile" className="font-mono text-[10px] uppercase text-brand hover:underline">Complete →</Link>
            </div>
          )}
          <button onClick={() => { auth.signOut(); nav("/"); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar lg:hidden">
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                <Link to="/" className="font-display text-lg font-semibold">GREDIS</Link>
                <button onClick={() => setMobileOpen(false)}><X className="size-5" /></button>
              </div>
              <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {items.map((it) => (
                  <Link key={it.to} to={it.to} onClick={() => setMobileOpen(false)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
                    <it.icon className="size-4" /> <span>{it.label}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search colleges, branches…"
              className="h-9 w-full rounded-lg border border-border bg-surface/50 pl-9 pr-3 text-sm outline-none focus:border-brand" />
          </div>
          <button className="grid size-9 place-items-center rounded-lg border border-border hover:bg-secondary">
            <Bell className="size-4" />
          </button>
          <Link to="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{user?.name ?? "Student"}</p>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">{user?.provider === "google" ? "Google" : "Email"}</p>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-brand/20 text-sm font-semibold text-brand ring-1 ring-brand/40">
              {(user?.name ?? "S").charAt(0).toUpperCase()}
            </div>
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
