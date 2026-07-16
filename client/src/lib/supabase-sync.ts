import { type Profile, type College, type ChatSession, type ChatMessage } from "./store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function toCamel(obj: any) {
  const res: any = {};
  for (const k of Object.keys(obj)) {
    const camelK = k.replace(/_([a-z])/g, g => g[1].toUpperCase());
    res[camelK] = obj[k];
  }
  return res;
}

async function getHeaders(token: string | null) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function pullFromSupabase(userId: string, token: string | null, clerkUser?: any) {
  const headers = await getHeaders(token);

  try {
    // 1. Pull Profile
    const profileRes = await fetch(`${API_URL}/users/profile`, { headers });
    if (profileRes.ok) {
      let profileData = await profileRes.json();
      
      // If profile is empty/new, insert default from Clerk user
      if ((!profileData || !profileData.email) && clerkUser) {
        const defaultProfile = {
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          name: clerkUser.fullName ?? clerkUser.firstName ?? clerkUser.primaryEmailAddress?.emailAddress.split("@")[0] ?? "",
          onboarded: false
        };
        const createRes = await fetch(`${API_URL}/users/profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(defaultProfile)
        });
        if (createRes.ok) {
          profileData = await createRes.json();
        }
      }

      if (profileData && profileData.email) {
        const camelProfile = toCamel(profileData);
        localStorage.setItem("gredis:profile", JSON.stringify(camelProfile));
        window.dispatchEvent(new CustomEvent("store:gredis:profile"));
      }
    }

    // 2. Pull Recommendations
    const recsRes = await fetch(`${API_URL}/recommendations`, { headers });
    if (recsRes.ok) {
      const recsList = await recsRes.json();
      if (Array.isArray(recsList) && recsList.length > 0) {
        // Get the latest recommendation payload
        const latest = recsList[0]?.payload;
        if (latest) {
          localStorage.setItem("gredis:recs", JSON.stringify(latest));
          window.dispatchEvent(new CustomEvent("store:gredis:recs"));
        }
      }
    }

    // 3. Pull Chat Sessions
    const chatRes = await fetch(`${API_URL}/chat/history`, { headers });
    if (chatRes.ok) {
      const sessions = await chatRes.json();
      if (Array.isArray(sessions) && sessions.length > 0) {
        const chatSessions: ChatSession[] = [];
        
        for (const s of sessions) {
          const msgRes = await fetch(`${API_URL}/chat/${s.id}/messages`, { headers });
          if (msgRes.ok) {
            const messages = await msgRes.json();
            const sessionMsgs: ChatMessage[] = (messages || []).map((m: any) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content || "",
              ts: m.created_at ? new Date(m.created_at).getTime() : Date.now()
            }));
            
            chatSessions.push({
              id: s.id,
              title: s.title || "Chat Session",
              messages: sessionMsgs,
              ts: s.created_at ? new Date(s.created_at).getTime() : Date.now()
            });
          }
        }

        if (chatSessions.length > 0) {
          localStorage.setItem("gredis:chat", JSON.stringify(chatSessions));
          window.dispatchEvent(new CustomEvent("store:gredis:chat"));
        }
      }
    }
  } catch (error) {
    console.error("Failed to pull data from backend server:", error);
  }
}

export async function pushProfileToSupabase(userId: string, token: string | null, profile: Profile) {
  const headers = await getHeaders(token);
  try {
    await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers,
      body: JSON.stringify(profile)
    });
  } catch (error) {
    console.error("Failed to push profile to backend server:", error);
  }
}

export async function pushRecommendationsToSupabase(userId: string, token: string | null, recs: College[]) {
  // Recommendations are saved automatically on the server when generated.
  // This helper is kept for interface compatibility.
}

export async function pushChatToSupabase(userId: string, token: string | null, sessions: ChatSession[]) {
  // Chats are saved automatically on the server during communication.
  // This helper is kept for interface compatibility.
}
