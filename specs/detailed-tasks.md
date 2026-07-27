# Feature: Todo App — Detailed Task Fields

## Purpose
Allow a todo item to optionally carry a description, a due date, and a
priority, in addition to the existing task title.

## Entities touched
- Modifies existing `todos` table (no new table needed at this scale)
- New columns: `description` (text, nullable), `due_date` (date, nullable),
  `priority` (text, nullable, one of: low / medium / high)
- All three fields are optional — existing todos without them must
  continue to work unchanged

## User flow
1. "Add task" form gains three optional fields below the existing task
   input: description (textarea), due date (date picker), priority
   (select: low/medium/high, default medium)
2. Submitting with only a task title still works exactly as before
3. Each todo in the list shows the task title as it does now; if a
   description, due date, or priority is set, show them beneath the
   title in smaller/secondary text
4. Clicking a todo (not the checkbox) expands/collapses its detail view
   if it has any extra fields set

## Acceptance criteria
- [ ] Submitting a task with no description/due date/priority behaves
      identically to the current app
- [ ] A todo with a description shows it beneath the title when expanded
- [ ] Priority defaults to "medium" if not explicitly chosen
- [ ] Due date, if set, displays in a human-readable format (e.g. "12 Aug")
- [ ] Existing todos created before this change display correctly with
      no errors (nullable fields handled gracefully)
- [ ] Toggling task complete/incomplete still works unaffected

## Out of scope (explicitly deferred)
- Editing an existing todo's detail fields after creation
- Sorting/filtering by priority or due date