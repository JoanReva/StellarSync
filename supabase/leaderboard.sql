create extension if not exists pgcrypto;

create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  player_name text not null,
  time_remaining numeric not null,
  constraint time_range check (time_remaining > 0 and time_remaining <= 30),
  constraint player_name_length check (char_length(player_name) between 1 and 15)
);

alter table public.leaderboard enable row level security;

drop policy if exists "Allow public read access" on public.leaderboard;
create policy "Allow public read access"
on public.leaderboard
for select
using (true);

drop policy if exists "Allow public insert with validation" on public.leaderboard;
create policy "Allow public insert with validation"
on public.leaderboard
for insert
with check (
  time_remaining > 0
  and time_remaining <= 30
  and char_length(player_name) between 1 and 15
);

create index if not exists leaderboard_rank_idx
on public.leaderboard (time_remaining desc, created_at asc);
