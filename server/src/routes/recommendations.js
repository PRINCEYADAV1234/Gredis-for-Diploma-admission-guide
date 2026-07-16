import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase.js";
import { generateJson } from "../lib/gemini.js";

const r = Router();

r.get("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data } = await supabase
    .from("recommendations")
    .select("*")
    .eq("clerk_user_id", req.userId)
    .order("created_at", { ascending: false });
  res.json(data ?? []);
});

r.post("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const profile = req.body ?? {};
  const prompt = `You are an expert diploma admission counselor for India. Based on this student profile, recommend 6 realistic polytechnic/diploma colleges. Return STRICT JSON array only.

Profile: ${JSON.stringify(profile)}

Each item must match this exact shape:
{ 
  "id": "kebab-case-slug", 
  "name": string, 
  "location": "City, State", 
  "type": "government"|"private", 
  "matchScore": 0-100 integer, 
  "fees": annual fees INR integer, 
  "cutoff": percentage number, 
  "branch": string, 
  "hostel": boolean, 
  "placement": "e.g. 85% placed, avg ₹4.2 LPA", 
  "pros": [3 short strings], 
  "cons": [2 short strings], 
  "why": "one sentence tailored to the student" 
}

Return only the JSON array, no prose.`;

  const items = await generateJson(prompt, []);
  
  try {
    await supabase.from("recommendations").insert({ clerk_user_id: req.userId, payload: items });
  } catch (err) {
    console.error("Failed to save recommendations to Supabase:", err);
  }
  
  res.json(items);
});

r.post("/career", async (req, res) => {
  const profile = req.body ?? {};
  const prompt = `Suggest 4 diploma engineering branches for this student. STRICT JSON array only.
Profile: ${JSON.stringify(profile)}
Shape per item: { "branch": string, "why": string (2 sentences), "skills": [4 short strings], "opportunities": [3 short strings], "salaryRange": "e.g. ₹3-8 LPA entry" }`;

  const items = await generateJson(prompt, []);
  res.json(items);
});

r.post("/eligibility", async (req, res) => {
  const profile = req.body ?? {};
  const prompt = `Check eligibility for common diploma branches based on this profile. STRICT JSON.
Profile: ${JSON.stringify(profile)}
Shape: { "eligible": [{ "branch": string, "reason": string }], "notEligible": [{ "branch": string, "reason": string }] }`;

  const items = await generateJson(prompt, { eligible: [], notEligible: [] });
  res.json(items);
});

export default r;
