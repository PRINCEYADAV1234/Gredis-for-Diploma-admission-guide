import { verifyToken } from "@clerk/backend";
import crypto from "crypto";

const secretKey = process.env.CLERK_SECRET_KEY || "";

// Fallback JWKS Verification for when CLERK_SECRET_KEY is missing
async function verifyClerkTokenFallback(token) {
  const [headerB64, payloadB64, signatureB64] = token.split(".");
  if (!headerB64 || !payloadB64 || !signatureB64) {
    throw new Error("Invalid JWT format");
  }

  const header = JSON.parse(Buffer.from(headerB64, "base64url").toString("utf-8"));
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));

  const kid = header.kid;
  const iss = payload.iss; // e.g. https://still-starfish-1.clerk.accounts.dev

  if (!kid || !iss) {
    throw new Error("Missing kid or iss claim in JWT");
  }

  // Fetch JWKS from Clerk's public endpoint
  const jwksRes = await fetch(`${iss}/.well-known/jwks.json`);
  if (!jwksRes.ok) {
    throw new Error("Failed to fetch Clerk JWKS");
  }

  const jwks = await jwksRes.json();
  const jwk = jwks.keys.find((k) => k.kid === kid);
  if (!jwk) {
    throw new Error("Key not found in JWKS");
  }

  // Convert JWK to PEM public key using Node's crypto
  const publicKey = crypto.createPublicKey({
    format: "jwk",
    key: jwk,
  });

  // Verify signature
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(`${headerB64}.${payloadB64}`);

  const verified = verifier.verify(publicKey, Buffer.from(signatureB64, "base64url"));
  if (!verified) {
    throw new Error("JWT signature verification failed");
  }

  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    throw new Error("JWT has expired");
  }

  return payload;
}

export async function clerkAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
    }
    const token = authHeader.slice(7);

    let sub;
    if (secretKey) {
      try {
        const verified = await verifyToken(token, { secretKey });
        sub = verified.sub;
      } catch (err) {
        console.warn("Clerk SDK verifyToken failed, trying fallback JWKS:", err);
        const payload = await verifyClerkTokenFallback(token);
        sub = payload.sub;
      }
    } else {
      const payload = await verifyClerkTokenFallback(token);
      sub = payload.sub;
    }

    req.userId = sub;
    req.userToken = token;
    next();
  } catch (error) {
    console.error("Clerk Authentication failed:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}
