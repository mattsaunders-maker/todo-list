-- Add per-user ownership to todos and lock it down with RLS.
-- Existing todos (created before auth) have no user_id and will become
-- invisible to everyone once RLS is enabled, since they match no user's
-- auth.uid(). They are not backfilled here.

alter table todos
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table todos enable row level security;

-- Drop whatever "allow all" policy predates this migration. The name
-- below is the common Supabase quickstart default; if your project used
-- a different name, drop that one instead (see Authentication > Policies
-- in the dashboard).
drop policy if exists "Enable read access for all users" on todos;

create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);
