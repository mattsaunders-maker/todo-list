# Feature: Todo App — Task Pagination

## Branch
feature/task-pagination

## Purpose
Paginate the task list, showing 5 tasks per page, so the list stays
manageable as tasks accumulate.

## Entities touched
- Reads only — query fetches 5 rows per page, ordered by `created_at`
  descending. No schema change.

## User flow
1. Task list shows only the 5 most recent tasks by default
2. Page numbers appear beneath the list
3. Clicking a page number navigates to `/page/2`, `/page/3`, etc.,
   showing the next 5 tasks back in time

## Acceptance criteria
- [ ] Exactly 5 tasks shown per page, ordered newest first
- [ ] If there are 5 or fewer tasks total, no page controls are shown
- [ ] The last page shows the remaining tasks even if fewer than 5
- [ ] Visiting a page number beyond the available range shows a message that says "you've travelled too far"
- [ ] Page number is reflected in the URL and browser back/forward
      navigation works correctly between pages

## Out of scope
- Adjustable page size
- Infinite scroll as an alternative to numbered pages