import { useEffect, useState } from "react";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  provider: "email" | "google";
  createdAt: number;
  verified: boolean;
};

const KEY = "gredis:session";
const listeners = new Set<() => void>();

function read(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function write(user: SessionUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(KEY, JSON.stringify(user));
  else localStorage.removeItem(KEY);
  listeners.forEach((fn) => fn());
}

export const auth = {
  get current() { return read(); },

  syncClerkUser(user: any) {
    if (user) {
      const sessionUser: SessionUser = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: user.fullName ?? user.firstName ?? user.primaryEmailAddress?.emailAddress.split("@")[0] ?? "",
        provider: user.externalAccounts && user.externalAccounts.length > 0 ? "google" : "email",
        createdAt: user.createdAt ? new Date(user.createdAt).getTime() : Date.now(),
        verified: user.primaryEmailAddress?.verification.status === "verified",
      };
      write(sessionUser);
    } else {
      write(null);
    }
  },

  async signOut() {
    write(null);
    if (typeof window !== "undefined" && (window as any).Clerk) {
      try {
        await (window as any).Clerk.signOut();
      } catch (e) {
        console.error("Clerk sign out error", e);
      }
    }
  },

  subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
};

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(() => read());
  useEffect(() => auth.subscribe(() => setUser(read())), []);
  return user;
}
