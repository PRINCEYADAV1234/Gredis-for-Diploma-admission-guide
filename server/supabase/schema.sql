-- Gredis Supabase schema. Run in the Supabase SQL editor.

-- Profiles keyed to Clerk user id.
create table if not exists public.profiles (
  clerk_user_id text primary key,
  email text,
  name text,
  state text,
  city text,
  tenth_percentage numeric,
  category text,
  budget numeric,
  college_type text,
  hostel_required boolean,
  preferred_branch text,
  interested_subjects text[],
  preferred_location text,
  family_income numeric,
  medium text,
  extracurricular text[],
  career_goal text,
  college_size text,
  scholarship_required boolean,
  placement_priority text,
  onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  state text,
  type text check (type in ('government','private')),
  branch text,
  fees numeric,
  cutoff numeric,
  hostel boolean,
  placement text,
  created_at timestamptz default now()
);
grant select on public.colleges to anon, authenticated;
grant all on public.colleges to service_role;
alter table public.colleges enable row level security;
create policy "colleges public read" on public.colleges for select to anon, authenticated using (true);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references public.colleges(id) on delete cascade,
  name text not null,
  duration text,
  seats int
);
grant select on public.courses to anon, authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;
create policy "courses public read" on public.courses for select to anon, authenticated using (true);

create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  amount text,
  eligibility text,
  link text
);
grant select on public.scholarships to anon, authenticated;
grant all on public.scholarships to service_role;
alter table public.scholarships enable row level security;
create policy "scholarships public read" on public.scholarships for select to anon, authenticated using (true);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  title text,
  created_at timestamptz default now()
);
grant select, insert, update, delete on public.chat_sessions to authenticated;
grant all on public.chat_sessions to service_role;
alter table public.chat_sessions enable row level security;
create policy "own chats" on public.chat_sessions for all
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant','system')),
  content text,
  created_at timestamptz default now()
);
grant select, insert, delete on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "own messages" on public.messages for all
  using (exists (
    select 1 from public.chat_sessions s
    where s.id = messages.session_id and s.clerk_user_id = auth.jwt() ->> 'sub'
  ))
  with check (exists (
    select 1 from public.chat_sessions s
    where s.id = messages.session_id and s.clerk_user_id = auth.jwt() ->> 'sub'
  ));

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  payload jsonb,
  created_at timestamptz default now()
);
grant select, insert, delete on public.recommendations to authenticated;
grant all on public.recommendations to service_role;
alter table public.recommendations enable row level security;
create policy "own recs" on public.recommendations for all
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  payload jsonb,
  created_at timestamptz default now()
);
grant select, insert, delete on public.roadmaps to authenticated;
grant all on public.roadmaps to service_role;
alter table public.roadmaps enable row level security;
create policy "own roadmaps" on public.roadmaps for all
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  event text not null,
  metadata jsonb,
  created_at timestamptz default now()
);
grant select, insert on public.analytics to authenticated;
grant all on public.analytics to service_role;
alter table public.analytics enable row level security;
create policy "own analytics insert" on public.analytics for insert to authenticated with check (clerk_user_id = auth.jwt() ->> 'sub');
create policy "own analytics read" on public.analytics for select using (clerk_user_id = auth.jwt() ->> 'sub');
