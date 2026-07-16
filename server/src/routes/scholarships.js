import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const r = Router();

r.get("/", async (_req, res) => {
  const { data } = await supabase.from("scholarships").select("*").limit(100);
  res.json(data ?? []);
});

export default r;
