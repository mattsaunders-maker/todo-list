-- Add optional detail fields to todos: description, due_date, priority.
-- All nullable so existing rows continue to work unchanged.

alter table todos
  add column if not exists description text,
  add column if not exists due_date date,
  add column if not exists priority text;

alter table todos
  add constraint todos_priority_check
  check (priority is null or priority in ('low', 'medium', 'high'));
