// Local profile + recommendations + chat store. In production this is the
// Supabase schema described in /backend-reference/README.md.
import { useEffect, useState } from "react";

export type QuickProfile = {
  state?: string;
  tenthPercentage?: number;
  budget?: number;
  preferredBranch?: string;
  collegeType?: "government" | "private" | "both";
};
export type AdvancedProfile = {
  city?: string;
  category?: string;
  hostelRequired?: boolean;
  familyIncome?: number;
  scholarshipRequired?: boolean;
  placementPriority?: "high" | "medium" | "low";
  preferredLocation?: string;
  collegeSize?: "small" | "medium" | "large";
  careerGoal?: string;
  interestedSubjects?: string[];
  medium?: "english" | "gujarati" | "hindi";
  extracurricular?: string[];
};
export type Profile = QuickProfile & AdvancedProfile & { onboarded?: boolean };

export type College = {
  id: string;
  name: string;
  location: string;
  type: "government" | "private";
  matchScore: number;
  fees: number;
  cutoff: number;
  branch: string;
  hostel: boolean;
  placement: string;
  pros: string[];
  cons: string[];
  why: string;
};

export type ChatMessage = { id: string; role: "user" | "assistant"; content: string; ts: number };
export type ChatSession = { id: string; title: string; messages: ChatMessage[]; ts: number };

const PROFILE_KEY = "gredis:profile";
const RECS_KEY = "gredis:recs";
const SAVED_KEY = "gredis:saved";
const CHAT_KEY = "gredis:chat";

function get<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) as T : fallback; }
  catch { return fallback; }
}
function set<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(`store:${k}`));
}

export function useStore<T>(key: string, fallback: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => get(key, fallback));
  useEffect(() => {
    const handler = () => setValue(get(key, fallback));
    window.addEventListener(`store:${key}`, handler);
    return () => window.removeEventListener(`store:${key}`, handler);
  }, [key]);
  const update = (v: T | ((prev: T) => T)) => {
    const next = typeof v === "function" ? (v as (p: T) => T)(get(key, fallback)) : v;
    set(key, next);
    setValue(next);
  };
  return [value, update];
}

export const profileFields: (keyof Profile)[] = [
  "state","tenthPercentage","budget","preferredBranch","collegeType",
  "city","category","hostelRequired","familyIncome","scholarshipRequired",
  "placementPriority","preferredLocation","collegeSize","careerGoal",
  "interestedSubjects","medium","extracurricular",
];

export function profileCompletion(p: Profile): number {
  const uiFields: (keyof Profile)[] = [
    "state", "tenthPercentage", "budget", "preferredBranch", "collegeType",
    "city", "category", "medium", "preferredLocation", "familyIncome",
    "hostelRequired", "scholarshipRequired", "careerGoal", "placementPriority",
    "collegeSize"
  ];
  const filled = uiFields.filter((k) => {
    const v = p[k];
    return v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);
  }).length;
  const targetFieldsCount = uiFields.length - 2; // 13 fields
  if (filled >= targetFieldsCount) {
    return 100;
  }
  return Math.round((filled / targetFieldsCount) * 100);
}

export const useProfile = () => useStore<Profile>(PROFILE_KEY, {});
export const useRecommendations = () => useStore<College[]>(RECS_KEY, []);
export const useSavedColleges = () => useStore<string[]>(SAVED_KEY, []);
export const useChatSessions = () => useStore<ChatSession[]>(CHAT_KEY, []);
