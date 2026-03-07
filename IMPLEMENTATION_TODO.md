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

- Backend/database/auth provider integration is a separate implementation phase.
- This pass delivers production-grade frontend scaffolding that maps directly to planned backend contracts.

## Progress Snapshot

- Completed in this pass:
  - TanStack route IA for user/auth/reader/admin paths
  - Frontend-only session + role model (`guest`, `user`, `admin`)
  - User UI: auth + library experience
  - Admin UI: overview, books, ingestion, users, audit
  - Reader integration into new app flow (library shortcut + bookmark panel entry)
  - Validation: lint/build passing

- Next implementation phase (backend + data):
  - Supabase auth wiring to replace demo session store
  - Postgres schema/migrations for profiles/roles/books/preferences/progress/bookmarks/events
  - API layer for ingestion jobs, analytics aggregations, and admin actions
  - Sync engine: IndexedDB outbox + server reconciliation
