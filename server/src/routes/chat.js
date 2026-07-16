import { Router } from "express";
import { getSupabaseClient } from "../lib/supabase.js";
import { gemini } from "../lib/gemini.js";

const r = Router();

r.get("/history", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data } = await supabase
    .from("chat_sessions")
    .select("id, title, created_at")
    .eq("clerk_user_id", req.userId)
    .order("created_at", { ascending: false });
  res.json(data ?? []);
});

r.get("/:id/messages", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  const { data } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("session_id", req.params.id)
    .order("created_at", { ascending: true });
  res.json(data ?? []);
});

r.post("/", async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { messages = [], sessionId, profile } = req.body ?? {};
    if (messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const system = `You are Gredis, an AI admission co-pilot for Indian diploma students. Profile: ${JSON.stringify(profile ?? {})}`;
    const history = messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
    
    let text = "";
    const last = messages[messages.length - 1]?.content ?? "";

    try {
      const chat = gemini.startChat({ 
        history: [{ role: "user", parts: [{ text: system }] }, ...history.slice(0, -1)] 
      });
      const result = await chat.sendMessage(last);
      text = result.response.text();
    } catch (geminiError) {
      console.error("Gemini Chat failed:", geminiError);
      return res.status(502).json({ error: `Gemini API Error: ${geminiError.message}. Please verify your GEMINI_API_KEY in server/.env.` });
    }

    let sid = sessionId;
    if (!sid) {
      const { data, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({ clerk_user_id: req.userId, title: last.slice(0, 40) })
        .select()
        .single();
      if (sessionError) {
        console.error("Supabase chat_sessions insert failed:", sessionError);
        return res.status(500).json({ error: `Supabase Error: ${sessionError.message}. Make sure your tables exist.` });
      }
      sid = data?.id;
    }
    
    const { error: msgError } = await supabase.from("messages").insert([
      { session_id: sid, role: "user", content: last },
      { session_id: sid, role: "assistant", content: text },
    ]);
    if (msgError) {
      console.error("Supabase messages insert failed:", msgError);
      return res.status(500).json({ error: `Supabase Error: ${msgError.message}` });
    }
    
    res.json({ text, sessionId: sid });
  } catch (error) {
    console.error("Chat completion crashed:", error);
    res.status(500).json({ error: error.message });
  }
});

r.delete("/:id", async (req, res) => {
  const supabase = getSupabaseClient(req.userToken);
  await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", req.params.id)
    .eq("clerk_user_id", req.userId);
  res.json({ ok: true });
});

export default r;
