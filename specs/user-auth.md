# Feature: Todo App — User Auth

## Branch
feature/user-auth

## Purpose
Allow users to create an account and log in, so each user only sees
and manages their own set of tasks.

## Entities touched
- Uses Supabase Auth (email/password), with email confirmation enabled
  — no custom user table
- First name stored in Supabase's user metadata (`user_metadata.first_name`)
  at signup, not a separate column
- Modifies `todos`: add `user_id` column, referencing `auth.users`
- Row Level Security policy on `todos`: a user can only select/insert/
  update/delete rows where `user_id` matches their own logged-in ID
  (replaces the current "allow all" policy)

## User flow
1. App's root screen shows a simple "Welcome" message with a login form
   (email, password) if the user is not logged in
2. Below the form, a "Register" link goes to `/auth/register`
3. Register screen: first name, email, password, and a "Create account"
   button
4. On registration, user is shown a "check your email to confirm your
   account" message — they are NOT automatically logged in yet
5. User clicks the confirmation link in their email, which verifies
   their account
6. User can now log in normally with email and password, and is
   redirected to the task list, showing only their own tasks
7. If an unconfirmed user tries to log in before clicking the
   confirmation link, show a clear message telling them to check their
   email, not a generic error
8. If a user is not logged in and tries to visit the task list directly,
   they're redirected back to the login screen
9. A "Log out" link/button is visible once logged in, on the task list
   screen

## Acceptance criteria
- [ ] A new user can register with first name, email, and password
- [ ] Registering with an email that's already in use shows a clear
      error, not a crash
- [ ] After registering, the user sees a "confirm your email" message
      and is not logged in yet
- [ ] Attempting to log in before confirming shows a clear "please
      confirm your email" message, not a generic login failure
- [ ] Clicking the confirmation link allows the user to log in
      afterward
- [ ] Logging in with correct, confirmed credentials shows only that
      user's own tasks
- [ ] Logging in with an incorrect password shows a clear error
- [ ] User A can never see or modify User B's tasks, even by guessing
      task IDs
- [ ] Visiting the task list while logged out redirects to login, not
      an error or empty page
- [ ] Logging out returns to the welcome/login screen and blocks access
      to the task list again

## Out of scope
- No password reset feature
- No "remember me" / persistent session controls beyond Supabase's default