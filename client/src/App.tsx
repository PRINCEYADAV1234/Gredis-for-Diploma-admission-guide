import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, useUser, useAuth } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef } from "react";

// Import Route Components
import { Landing } from "./routes/index";
import { Login } from "./routes/login";
import { Signup } from "./routes/signup";
import { SsoCallback } from "./routes/sso-callback";
import { Welcome } from "./routes/welcome";
import { Onboarding } from "./routes/onboarding";
import { About } from "./routes/about";
import { Features } from "./routes/features";
import { DashboardLayout } from "./routes/dashboard";
import { DashboardHome } from "./routes/dashboard.index";
import { Profile } from "./routes/dashboard.profile";
import { Recommendations } from "./routes/dashboard.recommendations";
import { Colleges } from "./routes/dashboard.colleges";
import { Compare } from "./routes/dashboard.compare";
import { Chat } from "./routes/dashboard.chat";
import { Roadmap } from "./routes/dashboard.roadmap";
import { EligibilityChecker } from "./routes/dashboard.eligibility-checker";
import { Saved } from "./routes/dashboard.saved";
import { Scholarships } from "./routes/dashboard.scholarships";
import { Settings } from "./routes/dashboard.settings";
import { CareerRecommendations } from "./routes/dashboard.career-recommendations";

import { auth } from "@/lib/auth";
import { pullFromSupabase, pushProfileToSupabase, pushRecommendationsToSupabase, pushChatToSupabase } from "@/lib/supabase-sync";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

function ClerkSessionSync() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded) {
      auth.syncClerkUser(user);
    }
  }, [user, isLoaded]);
  return null;
}

function SupabaseSync() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const isPullingRef = useRef(false);

  useEffect(() => {
    if (!userId || !user) return;

    async function initSync() {
      isPullingRef.current = true;
      const token = await getToken().catch(() => null);
      await pullFromSupabase(userId, token, user);
      isPullingRef.current = false;
    }

    initSync();
  }, [userId, getToken, user]);

  useEffect(() => {
    if (!userId) return;

    const handleProfileUpdate = async () => {
      if (isPullingRef.current) return;
      const token = await getToken().catch(() => null);
      const raw = localStorage.getItem("gredis:profile");
      if (raw) {
        pushProfileToSupabase(userId, token, JSON.parse(raw));
      }
    };

    const handleRecsUpdate = async () => {
      if (isPullingRef.current) return;
      const token = await getToken().catch(() => null);
      const raw = localStorage.getItem("gredis:recs");
      if (raw) {
        pushRecommendationsToSupabase(userId, token, JSON.parse(raw));
      }
    };

    const handleChatUpdate = async () => {
      if (isPullingRef.current) return;
      const token = await getToken().catch(() => null);
      const raw = localStorage.getItem("gredis:chat");
      if (raw) {
        pushChatToSupabase(userId, token, JSON.parse(raw));
      }
    };

    window.addEventListener("store:gredis:profile", handleProfileUpdate);
    window.addEventListener("store:gredis:recs", handleRecsUpdate);
    window.addEventListener("store:gredis:chat", handleChatUpdate);

    return () => {
      window.removeEventListener("store:gredis:profile", handleProfileUpdate);
      window.removeEventListener("store:gredis:recs", handleRecsUpdate);
      window.removeEventListener("store:gredis:chat", handleChatUpdate);
    };
  }, [userId, getToken]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser();
  
  if (user.isLoaded && !user.isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ClerkSessionSync />
        <SupabaseSync />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/sso-callback" element={<SsoCallback />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />

            {/* Protected routes */}
            <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

            {/* Dashboard layout with children sub-routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<Profile />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="colleges" element={<Colleges />} />
              <Route path="compare" element={<Compare />} />
              <Route path="chat" element={<Chat />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="eligibility-checker" element={<EligibilityChecker />} />
              <Route path="saved" element={<Saved />} />
              <Route path="scholarships" element={<Scholarships />} />
              <Route path="settings" element={<Settings />} />
              <Route path="career-recommendations" element={<CareerRecommendations />} />
            </Route>

            {/* Redirect any other paths to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster theme="dark" richColors position="top-right" />
      </ClerkProvider>
    </QueryClientProvider>
  );
}
