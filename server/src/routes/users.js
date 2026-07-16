import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase.js";

const r = Router();

r.get("/profile", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", req.userId)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data ?? {});
});

r.put("/profile", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  
  // Clean payload
  const body = { ...req.body };
  delete body.onboarded;

  const payload = { 
    ...body, 
    clerk_user_id: req.userId, 
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
