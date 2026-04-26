-- Run this in Supabase SQL Editor (supabase.com > SQL Editor)

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text default '',
  jd_text text not null,
  resume_text text not null,
  jd_skills jsonb default '[]',
  resume_skills jsonb default '[]',
  skills_to_assess jsonb default '[]',
  current_skill_index int default 0,
  is_complete boolean default false,
  created_at timestamptz default now()
);

-- Run this if the table already exists:
-- alter table sessions add column if not exists title text default '';

create table messages (
  id bigint generated always as identity primary key,
  session_id uuid references sessions(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid unique references sessions(id) on delete cascade,
  overall_score float,
  overall_percentage float,
  classification text,
  skill_scores jsonb default '[]',
  learning_plans jsonb default '[]',
  total_learning_hours float default 0,
  created_at timestamptz default now()
);

alter table sessions enable row level security;
alter table messages enable row level security;
alter table reports enable row level security;

create policy "Users manage own sessions" on sessions
  for all using (user_id = auth.uid());

create policy "Users manage own messages" on messages
  for all using (session_id in (select id from sessions where user_id = auth.uid()));

create policy "Users manage own reports" on reports
  for all using (session_id in (select id from sessions where user_id = auth.uid()));
