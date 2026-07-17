# Personal Details

Name : Yadav Prince <br>
Endrollment No : 240163116036 <br>
Semester: 7th sem <br>
Collage : Government Engineering COllage, Modasa <br>


# About Project :  GREDIS — AI Co-Pilot for Diploma Admissions

Gredis is a premium fullstack web application designed to act as an intelligent co-pilot for students seeking polytechnic and diploma engineering admissions in India. 

Selecting the right engineering stream, calculating cutoff eligibility, comparing colleges, and preparing registration timelines is often overwhelming. Gredis leverages **Google Gemini AI** and cloud databases to guide students step-by-step through their admission journey.

---

# video Explanation : [HERE](https://www.youtube.com/watch?v=kS9iQpYK4Zc)

##  Key Features

* **AI College Recommendations**: Recommends 6 realistic polytechnic colleges customized to the student's 10th-grade percentage, fee budget, location, and branch preferences.
* **Interactive AI Chat Counselor**: A conversational interface ("Gredis AI") that answers student queries regarding cutoffs, branches, documents, and placement advice with full awareness of the student's profile.
* **Side-by-Side College Comparison**: Compare up to 4 colleges by fees, cutoff history, hostel availability, placement percentages, and tailored AI pros/cons.
* **Personalized Admission Roadmap**: An interactive 6-step roadmap detailing registration rounds, required document verifications, and deadlines.
* **Cloud Sync & Persistent Profiles**: Secure registration via Clerk synced seamlessly with a Supabase PostgreSQL database to persist chat histories, preferences, and lists.

---

##  The Role of Artificial Intelligence (Google Gemini)

Gredis utilizes the high-efficiency **Gemini 1.5 Flash** model to power its decision-making backend:
1. **Dynamic JSON Schemas**: Instead of raw text, Gemini is prompted to return strict JSON arrays mapping to the frontend's TypeScript interfaces. This enables dynamic rendering of charts, tables, and lists.
2. **Context-Aware Chat**: When a student chats, the system implicitly injects their profile context (percentage, budget, category, stream preference) into the prompt history. This ensures the AI provides hyper-targeted Indian diploma counseling.
3. **Automated Eligibility Analysis**: The model automatically cross-references state eligibility rules to recommend optimal branches (like CSE, AI/ML, Mechanical) matching student performance.

---

##  Technology Stack

### Frontend
* **Framework**: React 19 (Single Page Application)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4 (Glassmorphism theme)
* **Animations**: Framer Motion
* **Authentication**: Clerk React (Google OAuth & Email verification)

### Backend & Database
* **Server**: Node.js + Express
* **Database**: Supabase (PostgreSQL)
* **AI Engine**: Google Generative AI Developer SDK (`@google/generative-ai`)
* **Security**: Clerk Auth Middleware (JWKS token signature verification)

---

##  Repository Folder Structure

```text
Project_2_Ai_Chatbot for Diploma Admission Guidance/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable layout and sidebar components
│   │   ├── lib/            # Store (Zustand-like custom state), auth utils, & API fetching
│   │   ├── routes/         # Routing pages (Dashboard, Chat, Compare, Profile, Login/Signup)
│   │   ├── styles.css      # Tailwind v4 entry and custom variables
│   │   └── main.tsx        # Application mount
│   ├── index.html          # SPA HTML template
│   └── vite.config.ts      # Vite bundler & Tailwind configuration
│
└── server/                 # Express Backend API Application
    ├── src/
    │   ├── lib/            # Gemini & Supabase database connectors
    │   ├── middleware/     # Clerk authentication token checkers
    │   ├── routes/         # Express endpoint controllers (chat, recommendations, profiles)
    │   └── index.js        # Express listener entrypoint
    └── supabase/
        └── schema.sql      # Database tables and Row Level Security (RLS) definitions
```

---

##  Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* A [Supabase](https://supabase.com/) Account (Free tier)
* A [Clerk](https://clerk.com/) Developer Account
* A [Google AI Studio](https://aistudio.google.com/) API Key

### Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `server/` with the following variables:
   ```env
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   GEMINI_API_KEY=your_gemini_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
4. Run the database migration script in your Supabase SQL editor using the schema inside `server/supabase/schema.sql`.
5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside `client/` with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend developer server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.
