import { useNavigate } from "react-router-dom";
import { auth, useSession } from "@/lib/auth";
import { useProfile, useRecommendations, useSavedColleges, useChatSessions } from "@/lib/store";
import { toast } from "sonner";
import { LogOut, Trash2 } from "lucide-react";

export function Settings() {
  const nav = useNavigate();
  const user = useSession();
  const [, setProfile] = useProfile();
  const [, setRecs] = useRecommendations();
  const [, setSaved] = useSavedColleges();
  const [, setChats] = useChatSessions();

  function deleteAccount() {
    if (!confirm("Delete all local data and sign out?")) return;
    setProfile({});
    setRecs([]);
    setSaved([]);
    setChats([]);
    auth.signOut();
    nav("/");
    toast.success("Account deleted");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-brand">Settings</p>
        <h1 className="font-display text-3xl font-semibold">Account</h1>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Signed in as</h2>
          <p className="text-sm">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email} · via {user?.provider}</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-1 font-display text-lg font-semibold">Notifications</h2>
          <p className="mb-4 text-sm text-muted-foreground">Manage email and product alerts.</p>
          <div className="space-y-2 text-sm">
            <ToggleRow label="Weekly admission tips" defaultOn />
            <ToggleRow label="New scholarship matches" defaultOn />
            <ToggleRow label="AI product updates" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/40 p-6">
          <h2 className="mb-1 font-display text-lg font-semibold">Session</h2>
          <button onClick={() => { auth.signOut(); nav("/"); }}
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-1 font-display text-lg font-semibold text-destructive">Danger zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">Delete all your data. This cannot be undone.</p>
          <button onClick={deleteAccount}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-destructive/80 px-4 text-sm font-semibold text-destructive-foreground">
            <Trash2 className="size-4" /> Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-2">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="size-4 accent-[color:var(--brand)]" />
    </label>
  );
}
