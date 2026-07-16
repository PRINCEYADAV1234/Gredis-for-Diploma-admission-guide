import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase.js";

const r = Router();

r.get("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", req.userId)
    .maybeSingle();
  res.json(data ?? {});
});

r.post("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const payload = { 
    ...req.body, 
    clerk_user_id: req.userId, 
    onboarded: true, 
    updated_at: new Date().toISOString() 
  };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "clerk_user_id" })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default r;
