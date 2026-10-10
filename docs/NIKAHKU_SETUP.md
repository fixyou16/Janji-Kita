# Nikahku — database and deployment setup

## Current architecture target

- **Customer and reseller:** responsive public website.
- **Admin:** mobile-friendly PWA view; admin access must be authorized by the server, not by a client-side route or localStorage flag.
- **Backend:** Netlify Functions.
- **Database:** PostgreSQL (WoWSQL if a project is provisioned and connection details are available).
- **Templates:** store Canva template URL and thumbnail URL as metadata; do not upload a proprietary Canva project file.
- **Source of truth:** this repository.

## Database migration

Apply `database/migrations/001_initial_schema.sql` to a new PostgreSQL database using the database provider's SQL console. This creates the core users, reseller profiles, templates, invitations, orders, commissions, guestbook, and payment-webhook-event tables.

The migration does not create an administrator account or configure a payment provider. Create the first admin securely using a one-time server-side seed process after password hashing and authorization are implemented. Never commit database URLs, passwords, payment keys, or webhook secrets.

## Required environment variables (server-side only)

- `DATABASE_URL`: PostgreSQL connection string from the selected database provider.
- `SESSION_SECRET`: long random secret for signing secure sessions.
- Payment provider secrets only after a provider is chosen and its webhook verification is implemented.

Set these in Netlify's environment-variable settings with Function runtime scope, then redeploy. Do not put secrets in `VITE_*` variables because those are exposed to browser bundles.

## Ordered implementation checklist

1. [x] Confirm the existing React/Vite repository and inspect its app entry point.
2. [x] Add the initial PostgreSQL schema and this setup note.
3. [ ] Provision a PostgreSQL project and apply the migration.
4. [ ] Implement server-side authentication, secure sessions, and role checks.
5. [ ] Replace mock/localStorage persistence with API-backed templates, invitations, orders, and reseller commissions.
6. [ ] Add the Admin PWA experience and keep customer/reseller flows on the public website.
7. [ ] Choose and integrate a payment provider, including signed webhook verification and idempotency.
8. [ ] Run production build and smoke tests.
9. [ ] Connect GitHub to the existing Netlify site and verify a successful production deployment.

## Important status note

A GitHub repository and an empty Netlify site are not the same as a live application. Do not announce launch until a deployment is reported as successful and the public site is smoke-tested.