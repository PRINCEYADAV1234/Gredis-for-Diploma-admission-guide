import { Router } from "express";
import { generateJson } from "../lib/gemini.js";
import { getSupabaseClient } from "../lib/supabase.js";

const r = Router();

r.post("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const profile = req.body ?? {};
  const items = await generateJson(
    `Generate a 6-step diploma admission roadmap as JSON. Profile: ${JSON.stringify(profile)}. Shape: { step, title, description, deadline, documents:[] }`,
    []
  );
  try {
    await supabase.from("roadmaps").insert({ clerk_user_id: req.userId, payload: items });
  } catch (err) {
    console.error("Failed to insert roadmap to Supabase:", err);
  }
  res.json(items);
});

export default r;
