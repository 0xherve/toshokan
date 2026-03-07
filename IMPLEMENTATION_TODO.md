# Implementation TODO

Context: execute the accounts + admin + sync architecture plan incrementally, with immediate focus on clean frontend foundations aligned to `DESIGN_SYSTEM.md`.

## Task Checklist

- [x] T1: Establish route structure for user, reader, auth, and admin areas
- [x] T2: Add temporary session/role state model (frontend-only) to unblock account/admin UI flows
- [x] T3: Build user-facing pages (auth + library) with consistent design tokens and interaction patterns
- [x] T4: Build admin-facing pages (dashboard, books, ingestion, users, audit) with coherent navigation
- [x] T5: Integrate reader entry path into new information architecture without breaking existing reader behavior
- [x] T6: Run lint/build validation and fix any regressions
- [x] T7: Review checklist and mark plan progress snapshot for next implementation phase

## Notes

- Better Auth client integration is wired for app-owned accounts.
- Supabase is currently used for book metadata, chapter storage, and EPUB uploads.

## Progress Snapshot

- Completed in this pass:
  - TanStack route IA for user/auth/reader/admin paths
  - Better Auth client session integration for sign-in/sign-up/sign-out UI
  - User UI: auth + library with Supabase-backed books
  - Admin UI: books upload with ingestion-time chapter sanitization
  - Reader integration into new app flow (library shortcut + bookmark panel entry)
  - Reader source now book-centric (`/reader/$bookId`) instead of env-based single EPUB
  - Validation: lint/build passing

- Next implementation phase (backend + data):
  - Better Auth server endpoints (`/api/auth/*`) deployment
  - Role propagation from Better Auth into app role model (`user`/`admin`)
  - API layer for ingestion jobs, analytics aggregations, and admin actions
  - Sync engine: IndexedDB outbox + server reconciliation

## Backend Checklist

- [x] B1: Add Supabase client/config and shared auth state provider
- [x] B2: Replace demo session usage with Better Auth session integration
- [x] B3: Add initial SQL migration for schema, indexes, and triggers
- [x] B4: Document local backend bootstrap and env behavior
- [x] B5: Validate lint/build after backend integration changes
- [x] B6: Add Drizzle ORM schema + drizzle-kit migrations and wire Better Auth to Drizzle adapter
- [x] B7: Add Better Auth runtime server with `/api/auth/*` endpoint and auth guard helpers
- [x] B8: Add role-aware auth model (`users.role`) and admin bootstrap command
- [x] B9: Add Google OAuth provider wiring and auth-page action
- [x] B10: Migrate app runtime to full TanStack Start (file routes + Start server runtime)
- [x] B11: Remove separate auth server process and mount Better Auth through Start request middleware
- [x] B12: Remove unused standalone auth server files/scripts and validate lint/build
