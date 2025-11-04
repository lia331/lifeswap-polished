LifeSwap — Polished Cloud Edition
=================================

This polished mobile-first PWA includes:
- Supabase cloud save (uses your Supabase project)
- Framer Motion animations and lazy-loaded views
- Background synth hook (calm, futuristic)
- Social share card generator (html-to-image)
- Daily event generator and auto-save

Quick start:
1. npm install
2. npm run dev
3. Open http://localhost:5173

Supabase setup:
- Create table `lifeswap_progress`:
  create table if not exists lifeswap_progress (
    user_id text primary key,
    data jsonb,
    updated_at timestamptz default now()
  );

Security note:
- Move Supabase keys to environment variables in production. The anon key is acceptable for prototype reads/writes but for production use server-side functions.

Deploy:
- Build: npm run build
- Host: Vercel or Netlify (PWA-ready)

If you'd like, I can push this code to your GitHub and trigger a redeploy on Vercel—tell me when you're ready.
