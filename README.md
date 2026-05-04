# EquaFit

A **personalized, animated fitness & wellness app** for college students. Login, set your details, pick goal-based 30-day routines (belly/abs, arms, legs, full body, cardio, flexibility, stress relief, period-friendly), complete daily workouts, get post-workout celebration and “how are you feeling” flow, and receive funny/witty reminder messages. Includes period tracker and light routines for cycle days.

## Features

- **Login / Sign up** — Supabase email/password auth
- **Onboarding** — Height, weight, age, gender, goals, optional period tracking
- **Routine groups** — Belly & abs, Arms, Legs, Full body, Cardio, Flexibility, Stress relief, **Period-friendly (light)**
- **30-day routines** — Each group has a 30-day program; tap a day to see exercises, watch video tutorials (YouTube), and mark complete
- **Post-workout** — Celebration, “How are you feeling?” (Great / Good / Okay / Tired), motivation to return next day
- **Reminders** — Toggle daily reminder and preview funny, witty motivational lines
- **Period tracker** — Log start/end dates, see “on period” hint and quick link to period-friendly routine
- **Progress** — Streak, longest streak, sessions done, days active, sessions-per-week bar chart (last 4 weeks)
- **Profile** — View details, export/import backup (JSON), and log out
- **Diet Fuel Guide** — Weekly, budget-friendly nutrition tips for students (not a personalized meal plan). Eight themes rotate by **calendar ISO week** (a new focus each week; the full set repeats after eight weeks). Data lives in `lib/diet-fuel-guide.ts`. **Home** shows a preview of the current week; the full guide is at **`/diet-fuel`** and in the sidebar / bottom nav under **Fuel**.

### High-impact additions

- **Goal-based recommendations** — Home shows “Recommended for you” with routines sorted by your onboarding goals
- **Resume routine** — One-tap “Resume [Routine] · Day X” to pick up where you left off
- **Progress charts** — Sessions-per-week bar chart and longest streak stat
- **Export / import data** — Download backup or restore from another device
- **Video tutorials** — Each exercise has a “Watch tutorial” link that opens YouTube form tutorials

## Tech stack

- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **Framer Motion** — Animations and transitions
- **Tailwind CSS** — Fitness theme (orange/coral + teal gradients)

## Getting started

```bash
cd equafit
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up → complete onboarding → use Home, Routines, Progress, Fuel (Diet Fuel Guide), Cycle, Remind, Profile.

### Auth + DB setup (Supabase)

1. Copy env template and add your project keys:
   - `cp .env.example .env.local`
   - Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL` format must be `https://<project-ref>.supabase.co` (do **not** use `/rest/v1/`)
2. In Supabase SQL editor, run migrations in order:
   - `supabase/migrations/001_init_equafit.sql`
   - `supabase/migrations/002_run_logs.sql` (if present)
   - `supabase/migrations/003_profiles_onboarding_completed.sql`
   - `supabase/migrations/004_profiles_trigger_weight_entries.sql` (auto-creates a `profiles` row on signup + `weight_entries` for Progress weight history)
3. Enable email/password auth in Supabase Auth settings.
4. If login shows **Email not confirmed**, either:
   - confirm the verification email, or
   - disable confirmation for development in `Authentication -> Providers -> Email`.

### Verifying database integration

1. **Environment** — With the app running (`npm run dev`), open `/login` and confirm you do **not** see “Supabase is not configured”.
2. **Auth** — Sign up a test user; in Supabase **Authentication → Users**, the user should appear.
3. **Tables** — After onboarding, open **Table Editor → `profiles`**: a row with your `user_id` should exist (after migration `004`, new signups get a row as soon as the auth user is created); `onboarding_completed` should be `true` after you finish the wizard.
4. **Client ↔ cloud** — Complete a workout day, log a run, and add a weight entry on **Progress**; refresh **Table Editor** for `completed_days`, `run_logs`, and `weight_entries`.
5. **RLS** — If inserts fail in the browser console, confirm you are logged in and RLS policies from the migrations are applied. Failed writes log as `[EquaFit DB …]` or `[EquaFit] Cloud sync:` in the console.

## Project structure

```
equafit/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard (home)
│   ├── login/                # Login
│   ├── signup/               # Sign up
│   ├── onboarding/           # Height, weight, goals, period opt-in
│   ├── routines/             # List of groups
│   ├── routines/[groupId]/   # 30-day grid
│   ├── routines/[groupId]/[day]/  # Day workout + mark complete
│   ├── complete/             # Celebration + feeling + return tomorrow
│   ├── progress/             # Streaks & stats
│   ├── period/               # Period tracker + light routine link
│   ├── reminders/            # Witty reminders on/off + preview
│   ├── diet-fuel/            # Diet Fuel Guide (weekly budget tips)
│   └── profile/              # Account & details
├── components/
│   ├── AppShell.tsx          # Auth + nav visibility
│   ├── BottomNav.tsx         # Home, Routines, Progress, Fuel, Cycle, Remind, Profile
│   └── home/
│       └── DietFuelPreview.tsx  # Home teaser → /diet-fuel
├── lib/
│   ├── auth-context.tsx      # Supabase auth + session state
│   ├── supabase.ts           # Supabase client
│   ├── user-store.ts         # local cache + per-user sync helpers
│   ├── routines.ts           # Groups + 30-day exercise data
│   ├── reminders.ts          # Witty reminder copy
│   └── diet-fuel-guide.ts    # Weekly themes + ISO week rotation
├── supabase/
│   └── migrations/
│       ├── 001_init_equafit.sql
│       ├── 002_run_logs.sql
│       ├── 003_profiles_onboarding_completed.sql
│       └── 004_profiles_trigger_weight_entries.sql
└── ...
```

## Reference

Based on CS161 Team 4 PRD (PulseFlow / EquaFit concept).
