import { Router } from "express";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { getSupabaseClient } from "../lib/supabase.js";

const r = Router();

r.get("/me", clerkAuth, async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", req.userId)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ profile: data });
});

export default r;
