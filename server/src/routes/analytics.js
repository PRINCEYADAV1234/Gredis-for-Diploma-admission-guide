import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase.js";

const r = Router();

r.get("/", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data: recs } = await supabase
    .from("recommendations")
    .select("id, created_at")
    .eq("clerk_user_id", req.userId);
  const { data: chats } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("clerk_user_id", req.userId);
  res.json({
    recommendationsGenerated: recs?.length ?? 0,
    chatsStarted: chats?.length ?? 0,
    lastActivity: recs?.[0]?.created_at ?? null,
  });
});

export default r;
