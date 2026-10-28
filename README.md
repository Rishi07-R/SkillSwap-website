# SkillSwap — Peer-to-Peer Knowledge & Skill Exchange

SkillSwap is a modern, responsive skill-exchange marketplace where people connect to teach skills they love and learn skills they desire without exchanging money. Users maintain separate lists of skills offered and skills wanted; our intelligent reciprocal matching engine pairs complementary members with transparent compatibility scores and explanations.

---

## 🌟 Key Features

1. **Intelligent Reciprocal Matching Engine**
   - **Reciprocal Matches (85%–99% compatibility)**: Identifies mutual pairings where User A teaches what User B wants, AND User B teaches what User A wants.
   - **One-Way Mentorship (55%–84% compatibility)**: Surfaces members who can mentor you in specific target skills or who are seeking your exact expertise.
   - **Transparent Explanation**: Breaks down exact match reasons (e.g. *You teach React (Expert); They teach Figma (Expert)*).

2. **10 Dedicated Pages & Modular Routes**
   - **Landing Page (`/`)**: SaaS-grade hero with live keyword search, 3-step interactive diagram, featured skill categories, top-rated member cards, FAQ accordion, and footer.
   - **Explore Directory (`/explore`)**: Searchable and filterable catalog with category chips, specific skill filters, "Teaches what I want" toggle, and multi-field sorting (Highest Rated, Swaps Completed, A–Z).
   - **Member Profile (`/profile/:id`)**: Comprehensive profile displaying bio, offered skills (with years of experience and focus notes), wanted skills, availability, ratings breakdown, and exchange proposal CTA.
   - **Smart Matches (`/matches`)**: Dedicated algorithmic recommendation center grouped into mutual reciprocal swaps vs. one-way mentorships.
   - **Exchange Requests (`/requests`)**: Inbound and outbound proposal management with Accept, Decline, and Cancel capabilities.
   - **Collaborative Exchange Workspace (`/exchanges/:id`)**: Real-time session room with Google Meet/Zoom video links, schedule coordination, shared learning goals notes, and a **dual-party completion sign-off workflow**.
   - **Dashboard (`/dashboard`)**: Profile completion meter with checklist, KPI stat cards, Recharts analytics (weekly session hours & skills distribution), active session quick access, and top recommendations.
   - **Reviews Hub (`/reviews`)**: Rating distribution breakdown (1–5 stars), verified reviews list, and review submission for completed sessions.
   - **Settings (`/settings`)**: Profile info editor, avatar selector, availability schedule, offered skills manager, and wanted skills manager.
   - **Authentication (`/login`, `/register`, `/reset-password`, `/onboarding`)**: Full auth flow with **1-click instant demo profile switching** (Alex Rivera, Maya Lin, Elena Rostova, David Chen) for immediate evaluation without setup friction.

3. **Database & Row Level Security (RLS)**
   - Normalized PostgreSQL relational schema for `profiles`, `skills`, `user_skills`, `exchange_requests`, `exchanges`, `reviews`, and `notifications`.
   - Comprehensive Row Level Security (RLS) policies enforcing that users update only their own profile, request access is strictly limited to participants, exchange workspaces are restricted to participants, and only verified session participants can post reviews.
   - Automatic triggers for profile creation, timestamp management, and community rating recalculation.

4. **Zero-Configuration Fallback & Supabase Integration**
   - Can run with a live Supabase backend by supplying credentials in `.env`.
   - Automatically activates a local persistence engine using initial realistic development seed data if Supabase credentials are not yet configured.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Routing**: React Router 6 (SPA with `vercel.json` rewrites)
- **Icons**: Lucide React
- **Analytics**: Recharts
- **Celebration Effects**: Canvas-Confetti
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security)

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd skillswap
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

If connecting to Supabase, provide your credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(If left empty or placeholder, SkillSwap automatically runs in local demo mode with instant persistence and fictional seed data!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄 Supabase Database Setup & Migrations

If deploying with Supabase, run the provided SQL scripts in the **Supabase Dashboard -> SQL Editor**:

1. **Schema & Security Policies (`supabase/schema.sql`)**:
   - Creates `profiles`, `skills`, `user_skills`, `exchange_requests`, `exchanges`, `reviews`, and `notifications`.
   - Enables Row Level Security (RLS) on all tables with explicit read, insert, update, and delete policies.
   - Configures triggers for `handle_new_user()` on `auth.users` insert and `handle_new_review()` for average rating updates.

2. **Seed Data (`supabase/seed.sql`)**:
   - Seeds standard skills across Software & Tech, Design & Creative, Languages, Business, and Music.
   - Inserts 8 detailed member profiles with offered and wanted skills, sample exchange requests, and verified reviews.

### Supabase Row Level Security (RLS) Summary

| Table | Policy Purpose | Rule |
| :--- | :--- | :--- |
| `profiles` | Public view / Owner edit | Select: `true`; Insert/Update: `auth.uid() = id` |
| `skills` | Directory access | Select: `true`; Insert: `authenticated` |
| `user_skills` | Skill associations | Select: `true`; Insert/Update/Delete: `auth.uid() = user_id` |
| `exchange_requests` | Proposal privacy | Select/Update: `auth.uid() = sender_id or auth.uid() = receiver_id` |
| `exchanges` | Workspace privacy | Select/Update: `auth.uid() = user_a_id or auth.uid() = user_b_id` |
| `reviews` | Verified reviews only | Select: `true`; Insert: Participant in completed exchange |
| `notifications` | Private user alerts | Select/Update: `auth.uid() = user_id` |

---

## 🧪 Testing Core Workflows

1. **Switch Demo Perspectives**:
   - Use the **"Acting as: [Name]"** pill in the top navigation bar to switch between:
     - **Alex Rivera** (Senior Full Stack Dev — teaches React, Node.js; wants UI/UX, Spanish)
     - **Maya Lin** (Principal Product Designer — teaches UI/UX, Figma; wants React)
     - **Elena Rostova** (Polyglot Coach — teaches Spanish, German; wants Python)
2. **Test Reciprocal Matching**:
   - As Alex, navigate to **Smart Matches (`/matches`)**. Notice **Maya Lin** appears as a **Reciprocal Match** with a high synergy score because Alex teaches what Maya seeks (React) and Maya teaches what Alex seeks (Figma & UI/UX).
3. **Propose an Exchange**:
   - Click **"Propose Swap Now"** on Maya's card. Select the skills to exchange and click **"Send Proposal"**.
4. **Accept Proposal & Test Session**:
   - Switch active perspective to **Maya Lin** using the top pill.
   - Navigate to **Requests (`/requests`)** and view the incoming proposal from Alex.
   - Click **"Accept & Start Swap"**.
   - Navigate to the **Exchange Workspace (`/exchanges/:id`)**, add video call links and notes, and test the **dual-party completion sign-off workflow**.
5. **Submit a Verified Review**:
   - Once completed, open the review modal and submit a 5-star review. Notice the member's profile rating recalculates automatically.

---

## 📦 Building & Production Deployment

### Build for Production
```bash
npm run build
```
The optimized bundle with manual code-splitting will be output to `dist/`.

### Preview Production Build Locally
```bash
npm run preview
```

### Deploy to Vercel
1. Push this repository to GitHub.
2. In the Vercel Dashboard, import the repository:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key
4. Single Page Application (SPA) routing is pre-configured via `vercel.json`.
5. In Supabase Dashboard -> **Authentication -> URL Configuration**, add your Vercel deployment URL (e.g. `https://skillswap.vercel.app`) to **Site URL** and **Redirect URLs**.

---

## 📄 License
MIT License. Built for peer-to-peer knowledge empowerment.
