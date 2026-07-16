const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function getAuthHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      const token = await clerk.session.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (err) {
    console.error("Error retrieving Clerk session token:", err);
  }

  return headers;
}

export async function generateRecommendations(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/recommendations`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to generate recommendations: ${errText}`);
  }
  return res.json();
}

export async function chatCompletion(data: { messages: any[]; sessionId?: string; profile?: any }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to get chat completion: ${errText}`);
  }
  return res.json();
}

export async function generateCareerRecs(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/recommendations/career`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to generate career recommendations: ${errText}`);
  }
  return res.json();
}

export async function checkEligibility(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/recommendations/eligibility`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to check eligibility: ${errText}`);
  }
  return res.json();
}

export async function generateRoadmap(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/roadmap`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to generate roadmap: ${errText}`);
  }
  return res.json();
}

export async function deleteChatSession(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/chat/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to delete chat session: ${errText}`);
  }
  return res.json();
}
