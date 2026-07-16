import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const r = Router();

r.get("/users", async (_req, res) => {
  const { data } = await supabase.from("profiles").select("clerk_user_id, created_at").limit(200);
  res.json(data ?? []);
});

r.get("/analytics", async (_req, res) => {
  const { count: users } = await supabase.from("profiles").select("*", { head: true, count: "exact" });
  const { count: recs } = await supabase.from("recommendations").select("*", { head: true, count: "exact" });
  const { count: chats } = await supabase.from("chat_sessions").select("*", { head: true, count: "exact" });
  res.json({ users, recs, chats });
});

r.post("/colleges", async (req, res) => {
  const { data, error } = await supabase.from("colleges").insert(req.body).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

r.put("/colleges/:id", async (req, res) => {
  const { data, error } = await supabase.from("colleges").update(req.body).eq("id", req.params.id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

r.delete("/colleges/:id", async (req, res) => {
  await supabase.from("colleges").delete().eq("id", req.params.id);
  res.json({ ok: true });
});

export default r;
