-- ===========================================================
-- Progress counter migration
-- Run this ONCE in the Supabase SQL Editor.
-- Adds two denormalised columns to user_profiles so the
-- leaderboard never has to scan the entire soq_progress table.
-- ===========================================================

-- 1. Add the new columns (safe to run multiple times)
alter table public.user_profiles
  add column if not exists completed_topics_count int not null default 0,
  add column if not exists last_completed_at      timestamptz;

-- 2. Backfill from ALL existing soq_progress rows
--    This fixes the "old progress not counted" problem.
update public.user_profiles p
set
  completed_topics_count = sub.cnt,
  last_completed_at      = sub.last_at
from (
  select
    user_id,
    count(*)         as cnt,
    max(completed_at) as last_at   -- null-safe: max ignores NULLs
  from public.soq_progress
  group by user_id
) sub
where p.id = sub.user_id;

-- 3. Trigger function: fires after every INSERT on soq_progress
--    (ignoreDuplicates=true on the upsert means duplicates never
--    reach here, so no double-counting risk.)
create or replace function public.handle_new_progress()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, completed_topics_count, last_completed_at)
  values (new.user_id, 1, new.completed_at)
  on conflict (id) do update
    set
      completed_topics_count = user_profiles.completed_topics_count + 1,
      last_completed_at = greatest(
        coalesce(user_profiles.last_completed_at, new.completed_at),
        coalesce(new.completed_at, user_profiles.last_completed_at)
      );
  return new;
end;
$$;

-- 4. Attach the trigger
-- drop trigger if exists on_progress_inserted on public.soq_progress;
create trigger on_progress_inserted
  after insert on public.soq_progress
  for each row execute procedure public.handle_new_progress();
