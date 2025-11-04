SUPABASE SETUP (required tables)
=================================

Run these SQL queries in your Supabase SQL editor to create required tables:

-- Progress (saves)
create table if not exists lifeswap_progress (
  user_id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);

-- Chat
create table if not exists lifeswap_chat (
  id bigserial primary key,
  user_id text,
  username text,
  message text,
  created_at timestamptz default now()
);

-- Stories / gallery
create table if not exists lifeswap_stories (
  id bigserial primary key,
  user_id text,
  user_email text,
  title text,
  excerpt text,
  data jsonb,
  created_at timestamptz default now()
);

-- Leaderboard
create table if not exists lifeswap_leaderboard (
  id bigserial primary key,
  user_id text,
  username text,
  score int,
  created_at timestamptz default now()
);
