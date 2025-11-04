LifeSwap — Final Edition (extended features)
============================================

This build includes:
- SEO meta, social preview, robots & sitemap placeholders
- Intro carousel with visual transitions
- AI Avatar creator UI (placeholder client-side; connect to server API for production)
- Community chat (Supabase real-time), stories gallery, leaderboard
- Fictionalized "celebrity" timeline options for legal safety
- Privacy note and moderation placeholders

How to run locally:
1. npm install
2. npm run dev
3. Open http://localhost:5173

Supabase setup:
- Follow SUPABASE_SETUP.md to create required tables.
- Ensure your Supabase project URL & anon key are set in src/App.jsx for prototype.
- For production, push keys to environment variables and implement server-side protections.

Deploy:
- Build: npm run build
- Host on Vercel/Netlify as a static PWA. Configure environment vars for production keys.

Legal & Safety:
- Real modern celebrities require licenses. Use fictionalized characters or licensed content.
- Implement moderation for chat (server-side) and user-uploaded images.
