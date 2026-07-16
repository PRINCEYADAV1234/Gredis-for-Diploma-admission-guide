import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const r = Router();

r.get("/", async (_req, res) => {
  const { data } = await supabase.from("colleges").select("*").limit(200);
  res.json(data ?? []);
});

r.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  const { data } = await supabase.from("colleges").select("*").ilike("name", `%${q}%`).limit(50);
  res.json(data ?? []);
});

r.get("/compare", async (req, res) => {
  const ids = String(req.query.ids ?? "").split(",").filter(Boolean);
  const { data } = await supabase.from("colleges").select("*").in("id", ids);
  res.json(data ?? []);
});

r.get("/:id", async (req, res) => {
  const { data } = await supabase.from("colleges").select("*").eq("id", req.params.id).maybeSingle();
  res.json(data ?? null);
});

export default r;
