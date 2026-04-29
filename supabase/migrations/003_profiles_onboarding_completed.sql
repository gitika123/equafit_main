-- Persist onboarding completion so returning users skip the wizard on new devices.

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

-- Backfill: rows that already have body metrics were almost certainly onboarded before this column existed.
update public.profiles
set onboarding_completed = true
where height_cm is not null and weight_kg is not null and age is not null;
