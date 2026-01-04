-- APP Planner schema
-- No medical data stored. Training planning only.

create extension if not exists "uuid-ossp";

-- Clients
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text,
  sport text,
  objective_name text,
  objective_date date,
  notes text,
  created_at timestamptz not null default now()
);

-- Cycles (macro/meso/micro)
create table if not exists public.cycles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  type text not null check (type in ('macro','meso','micro')),
  name text not null,
  start_date date not null,
  end_date date not null,
  parent_cycle_id uuid references public.cycles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Sessions
create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  date date not null,
  order_in_day int not null default 0,
  kind text not null check (kind in ('run','strength','rest')),
  duration_min_planned int,
  rpe_planned int check (rpe_planned between 0 and 10),
  notes text,
  status text not null default 'planned' check (status in ('planned','done','skipped')),
  created_at timestamptz not null default now()
);

create index if not exists sessions_client_date_idx on public.sessions(client_id, date);

-- Run details
create table if not exists public.run_details (
  session_id uuid primary key references public.sessions(id) on delete cascade,
  run_type text not null check (run_type in ('EF','SL','FRACTIONNE','INTERVALLE_MIX')),
  distance_km numeric,
  workout_json jsonb
);

-- Exercises bank
create table if not exists public.exercises (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tags text[],
  muscle_group text,
  equipment text,
  video_url text,
  created_at timestamptz not null default now()
);

-- Strength items (V2 usage in session editor)
create table if not exists public.strength_items (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  sets int,
  reps text,
  rir int,
  load_kg numeric,
  tempo text,
  rest_sec int,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.clients enable row level security;
alter table public.cycles enable row level security;
alter table public.sessions enable row level security;
alter table public.run_details enable row level security;
alter table public.exercises enable row level security;
alter table public.strength_items enable row level security;

-- Policies: owner can do everything
create policy "clients_owner_all" on public.clients
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "cycles_owner_all" on public.cycles
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "sessions_owner_all" on public.sessions
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- run_details: tie through sessions ownership
create policy "run_details_owner_all" on public.run_details
  for all using (
    exists (
      select 1 from public.sessions s
      where s.id = run_details.session_id and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = run_details.session_id and s.owner_id = auth.uid()
    )
  );

create policy "exercises_owner_all" on public.exercises
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- strength_items: tie through sessions ownership
create policy "strength_items_owner_all" on public.strength_items
  for all using (
    exists (
      select 1 from public.sessions s
      where s.id = strength_items.session_id and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions s
      where s.id = strength_items.session_id and s.owner_id = auth.uid()
    )
  );
