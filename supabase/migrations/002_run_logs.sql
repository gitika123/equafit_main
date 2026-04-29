-- Optional: log runs / jogs for cardio tracking (syncs with app Progress page).
create table if not exists public.run_logs (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  run_date date not null,
  distance_km numeric(8,2),
  duration_min integer not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint run_logs_duration_reasonable check (duration_min > 0 and duration_min <= 1440)
);

create index if not exists run_logs_user_date_idx on public.run_logs (user_id, run_date desc);

alter table public.run_logs enable row level security;

create policy "run_logs owner access" on public.run_logs
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
