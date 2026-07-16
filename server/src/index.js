import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkAuth } from "./middleware/clerkAuth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import onboardingRoutes from "./routes/onboarding.js";
import recRoutes from "./routes/recommendations.js";
import collegeRoutes from "./routes/colleges.js";
import chatRoutes from "./routes/chat.js";
import roadmapRoutes from "./routes/roadmap.js";
import scholarshipRoutes from "./routes/scholarships.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Public routes
app.use("/auth", authRoutes);
app.use("/colleges", collegeRoutes);
app.use("/scholarships", scholarshipRoutes);

// Protected routes (require Clerk JWT authentication)
app.use(clerkAuth);
app.use("/users", userRoutes);
app.use("/onboarding", onboardingRoutes);
app.use("/recommendations", recRoutes);
app.use("/chat", chatRoutes);
app.use("/roadmap", roadmapRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/admin", adminRoutes);

const port = Number(process.env.PORT ?? 5000);
app.listen(port, () => console.log(`Gredis backend listening on :${port}`));
