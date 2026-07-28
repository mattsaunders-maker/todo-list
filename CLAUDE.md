# Project conventions

## Database
- Never use the Supabase CLI, migrations folder, or Docker.
- For any schema change, give me the raw SQL to run manually in the
  Supabase SQL Editor.

## Working process
- Read the full spec file before making any changes.
- Implement only what the spec describes — don't add functionality
  beyond its acceptance criteria or "out of scope" section.
- After implementing, list which acceptance criteria your changes
  address, so I can test against them directly.
- If anything in the spec is ambiguous, ask before assuming.

## Stack
- Next.js (App Router), TypeScript, Tailwind, Supabase (Postgres + Auth).
- This is a solo practice project — keep tooling and process
  lightweight, don't introduce CI, testing frameworks, or extra
  infrastructure unless asked.