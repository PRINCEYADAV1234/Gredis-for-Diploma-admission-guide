import { GoogleGenerativeAI } from "@google/generative-ai";

const gen = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const gemini = gen.getGenerativeModel({ model: "gemini-3.5-flash" });

export async function generateJson(prompt, fallback) {
  try {
    const r = await gemini.generateContent(prompt);
    const t = r.response.text();
    const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    const raw = (m ? m[1] : t).trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error("Gemini AI API call or JSON parsing failed:", error);
    return fallback;
  }
}
