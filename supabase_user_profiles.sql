-- =============================================================
-- user_profiles table  (run once in the Supabase SQL editor)
-- Links to auth.users via the user's UUID.
-- Stores optional profile fields that are NOT in auth schema.
-- =============================================================

create table if not exists public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  university  text,
  email       text,          -- mirrors auth.users.email for easy querying
  phone       text,
  gender      text check (gender in ('male', 'female', 'non_binary', 'prefer_not_to_say')),
  updated_at  timestamptz default now()
);

-- Auto-create a profile row on every new sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===========================================================
-- RLS: users can only read/write their own row.
-- Service role (admin) can read all rows (for leaderboard).
-- ===========================================================
alter table public.user_profiles enable row level security;

-- Authenticated user may read their own profile
drop policy if exists "users_read_own_profile" on public.user_profiles;
create policy "users_read_own_profile"
  on public.user_profiles for select
  using (auth.uid() = id);

-- Authenticated user may upsert their own profile
drop policy if exists "users_write_own_profile" on public.user_profiles;
create policy "users_write_own_profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "users_update_own_profile" on public.user_profiles;
create policy "users_update_own_profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Authenticated users may read all profiles (for leaderboard display — name + university only)
drop policy if exists "authenticated_read_all_profiles" on public.user_profiles;
create policy "authenticated_read_all_profiles"
  on public.user_profiles for select
  using (auth.role() = 'authenticated');
