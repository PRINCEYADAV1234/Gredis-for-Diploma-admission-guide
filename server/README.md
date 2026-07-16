# Gredis — Express + Clerk + Supabase reference backend

The live Lovable preview runs on TanStack Start (Cloudflare Workers) and uses
`createServerFn` for the AI Gateway calls (Gemini). This folder is a **reference
implementation** of the Node.js + Express + TypeScript + Clerk + Supabase
backend described in the original spec. Deploy it separately (Fly, Render,
Railway, or a VPS) and point the frontend at it.

## Stack

- Node.js 20 + TypeScript + Express 4
- Clerk (backend SDK) for auth verification
- Supabase (Postgres) via `@supabase/supabase-js` with the service role key
- Google Gemini via `@google/generative-ai`
- Zod for validation

## Structure

```
backend-reference/
├── src/
│   ├── index.ts             # Express bootstrap
│   ├── middleware/
│   │   ├── clerkAuth.ts     # Verifies Clerk JWT, loads req.userId
│   │   └── validate.ts      # Zod validation
│   ├── lib/
│   │   ├── supabase.ts      # Service-role Supabase client
│   │   └── gemini.ts        # Gemini client
│   ├── routes/
│   │   ├── auth.ts          # /auth/me
│   │   ├── users.ts         # /users/profile
│   │   ├── onboarding.ts    # /onboarding
│   │   ├── recommendations.ts
│   │   ├── colleges.ts
│   │   ├── chat.ts
│   │   ├── roadmap.ts
│   │   ├── scholarships.ts
│   │   ├── analytics.ts
│   │   └── admin.ts
│   └── schemas/
│       └── index.ts
├── supabase/
│   └── schema.sql            # Full DB schema — see below
├── package.json
└── tsconfig.json
```

## Supabase schema

See `supabase/schema.sql` for:

- `profiles`  (user id linked to Clerk user id, onboarding fields)
- `colleges`
- `courses`
- `scholarships`
- `chat_sessions`
- `messages`
- `recommendations`
- `roadmaps`
- `analytics`

All tables have Row Level Security (RLS) enabled and policies keyed by
`clerk_user_id`.

## Environment variables

```
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AI...
PORT=8787
CORS_ORIGIN=https://your-frontend
```

## Wiring on the frontend

Set `VITE_API_URL=https://your-backend-url` and swap the localStorage helpers
in `src/lib/auth.ts` and `src/lib/store.ts` with `fetch(`${API_URL}/…`)` calls
plus Clerk's `useAuth().getToken()` for the `Authorization: Bearer` header.

## Custom Clerk UI

Custom login/signup live in `src/routes/login.tsx` and `src/routes/signup.tsx`.
No Clerk branding. Wire them to Clerk with:

```ts
import { useSignIn, useSignUp } from "@clerk/clerk-react";
```

and pipe the email/password + Google OAuth handlers to the same functions the
current local store exposes.
