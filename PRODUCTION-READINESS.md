# VisaCore Solutions — Production Readiness Audit

**Date:** 2026-03-28  
**Assessment basis:** current repository state  
**Overall Score:** 7.8/10 — solid application foundation, but several production blockers remain

---

## 1. Executive Summary

This codebase is not a prototype. It already has a meaningful operational baseline:
- Next.js App Router architecture with clear public/admin separation
- Prisma-backed persistence
- Auth.js credentials authentication with role handling
- Zod validation across core forms and admin mutations
- Captcha + honeypot defenses on public forms
- Existing automated tests for content, validation, and layout resilience
- Security headers already present in `next.config.ts`

The main production risks are concentrated in infrastructure and operational hardening rather than basic application correctness:
- upload storage strategy is not production-safe for Vercel
- rate limiting is process-local and not distributed
- CSP is missing
- observability is minimal
- RBAC is too broad for some admin routes
- environment validation and operational tooling are incomplete

---

## 2. Verified Strengths

These are confirmed positives from the current repository:

- **Validation discipline is good.** Zod schemas are used throughout forms and mutations.
- **Public forms already include anti-abuse controls.** Turnstile and honeypot handling are implemented for lead/contact flows.
- **Authentication exists and is functional.** Credentials auth, JWT sessions, and route authorization callbacks are in place.
- **The app is tested.** The repository includes a working `npm test` script and multiple test files under `tests/`.
- **There is already a migration footprint.** `prisma/migrations/` exists, so the issue is deployment discipline, not a complete lack of migrations.
- **Public/admin error isolation exists.** There are error boundaries and structured route layouts.
- **SEO basics are present.** Metadata, sitemap, and robots endpoints exist.

---

## 3. Critical Before Production

These items should be completed before treating the site as production-ready.

### 3.1 Replace Local Filesystem Uploads

**Verified issue:** `app/api/upload/route.ts` writes to `public/uploads/` on disk.

**Why this matters:**
- Vercel serverless instances do not provide durable writable local storage
- uploaded files become publicly reachable under `/uploads/...`
- upload validation trusts client-provided MIME type

**Recommendation:**
- move uploads to Vercel Blob, S3, or Cloudflare R2
- validate file signatures with `file-type` before accepting content
- store only metadata and remote URLs in the database
- decide whether uploaded assets should be public, signed, or admin-only

### 3.2 Replace In-Memory Rate Limiting

**Verified issue:** `lib/rate-limit.ts` uses a process-local `Map`.

**Why this matters:**
- limits reset on restart or deploy
- multiple serverless instances do not share counters
- memory use grows without cleanup

**Recommendation:**
- move to Upstash Redis or another shared store
- keep the current API shape so the migration stays localized
- record `remaining` and `resetAt` in a consistent way for future headers/telemetry

### 3.3 Add a Real Content Security Policy

**Verified issue:** `next.config.ts` includes several security headers but no CSP.

**Why this matters:**
- CSP is one of the highest-leverage browser-side containment controls
- the site loads external Turnstile assets and needs an explicit policy anyway
- adding CSP now is cheaper than retrofitting after third-party scripts accumulate

**Recommendation:**
- add CSP in report-only mode first
- explicitly allow required Cloudflare Turnstile origins
- then enforce once violations are understood and cleaned up

### 3.4 Tighten Admin Access Control

**Verified issue:** `lib/rbac.ts` only restricts `/admin/users` and `/admin/settings`; most other admin routes are effectively open to any authenticated role.

**Why this matters:**
- EDITOR currently has wider route reach than most production back offices should allow
- route-level overexposure increases accidental data modification risk

**Recommendation:**
- move from exceptions-based gating to explicit route permission mapping
- define per-section permissions for leads, contacts, media, content, stories, and settings
- keep navigation visibility and route authorization driven by the same permission map

### 3.5 Add Environment Validation

**Verified issue:** `.env.example` is incomplete and there is no startup schema validation.

**Why this matters:**
- missing secrets currently fail late and opaquely
- Turnstile is implemented in code but not documented in `.env.example`
- future infrastructure changes will increase configuration surface area

**Recommendation:**
- add `lib/env.ts` with Zod validation
- split env vars into required production vars and optional feature flags
- update `.env.example` with current known requirements including:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`

---

## 4. High Priority Before Broad Public Launch

### 4.1 Add Observability

**Verified issue:** no analytics package or error tracking integration is present in the repository.

**Recommendation:**
- add Vercel Analytics and Speed Insights for baseline traffic and performance visibility
- add Sentry for production exceptions and traces
- track conversions for lead and contact submissions

### 4.2 Add an Email Notification Path

**Verified issue:** there is no mail provider integration in the current repo.

**Why this matters:**
- submissions are persisted, but operational response depends on staff polling the admin dashboard
- if the business promises a rapid human response, notifications become operationally important

**Recommendation:**
- add transactional/admin notifications with Resend
- start with internal notifications first
- add customer acknowledgments second

### 4.3 Improve Session Explicitness and Auth Hardening

**Verified issue:** `lib/auth.ts` uses JWT sessions but does not declare `maxAge` or `updateAge`, and it relies on loose casts for role propagation.

**Recommendation:**
- set explicit session lifetime
- remove `as string` casts where possible with stronger typing
- consider adding login rate limiting and, for admin accounts, MFA as a next hardening step

### 4.4 Add Structured Data and Better Social Previews

**Verified issue:** no JSON-LD components were found, and root metadata has no configured Open Graph image.

**Recommendation:**
- add `LocalBusiness`, `FAQPage`, and `BreadcrumbList` structured data where relevant
- add a default OG image and `metadataBase`
- add Twitter card metadata

### 4.5 Strengthen Password Rules for Admin-Created Accounts

**Verified issue:** `lib/validations/auth.ts` uses a minimum of 8 characters for user creation and 6 for login validation.

**Recommendation:**
- raise the created-password minimum
- consider passphrase-style validation instead of rigid complexity-only rules
- align create-user validation with operational admin account policy

### 4.6 Add Audit Logging for Admin Mutations

**Verified issue:** there is no audit log model or admin action trail.

**Recommendation:**
- capture actor, action, target type, target id, diff summary, and timestamp
- start with destructive and status-changing actions first

---

## 5. Medium Priority

### 5.1 Expose Appointment Requests Through the Public Site

**Verified issue:** appointment actions exist, but there is no dedicated public route or form for appointment requests.

**Recommendation:**
- create a public appointment request flow
- link it directly from contact-oriented CTAs and the chatbot

### 5.2 Formalize Production Migration Workflow

**Verified issue:** migrations exist, but package scripts and workflow still emphasize development-style commands such as `db push`.

**Recommendation:**
- standardize production rollout on `prisma migrate deploy`
- document the deployment procedure
- prevent accidental schema drift between environments

### 5.3 Add CI for Build, Lint, and Tests

**Verified issue:** no `.github/workflows/` pipeline is present.

**Recommendation:**
- run lint, tests, and production build on PRs
- optionally add a smoke workflow for protected branches

### 5.4 Increase Test Coverage on Critical User Journeys

**Verified issue:** tests exist, but they are mostly unit/integration-style repository tests rather than browser-level critical-path coverage.

**Recommendation:**
- add E2E coverage for:
  - admin login
  - lead submission
  - contact submission
  - core admin CRUD flows

### 5.5 Optimize Hero Image Delivery

**Verified issue:** some hero/background visuals are driven through remote background images, which bypass Next image optimization.

**Recommendation:**
- move critical hero media to `next/image` where practical
- use optimized derivatives for decorative backgrounds
- reduce reliance on large remote images for above-the-fold sections

### 5.6 Improve Error Logging Quality

**Verified issue:** several actions log raw errors with `console.error`, and some chatbot context loaders fail silently.

**Recommendation:**
- standardize structured logging
- log enough context for debugging without leaking sensitive payloads
- distinguish expected operational failures from actual exceptions

---

## 6. Lower Priority / Post-Launch

- GDPR data export/deletion workflow
- admin export tools for leads and contacts
- English localization
- calendar integrations
- payment collection for consultations
- blog/content marketing system
- client portal
- service worker / offline strategy if a real PWA goal emerges

---

## 7. Deployment Checklist

### Infrastructure
- [ ] Set `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` to the production domain
- [ ] Verify database backup and restore process
- [ ] Choose durable object/file storage
- [ ] Choose shared rate-limit backend

### Security
- [ ] Add CSP in report-only mode
- [ ] Review admin route permission matrix
- [ ] Validate all required env vars at startup
- [ ] Rotate secrets before launch
- [ ] Decide whether admin MFA is required

### Operations
- [ ] Add internal notifications for new submissions
- [ ] Add Sentry
- [ ] Add Analytics / Speed Insights
- [ ] Add uptime monitoring

### Verification
- [ ] Test login at `/login`
- [ ] Test admin access by role
- [ ] Test lead submission with captcha
- [ ] Test contact submission with captcha
- [ ] Test upload flow in a production-like environment
- [ ] Test chatbot response path and rate limiting behavior
- [ ] Validate sitemap, robots, and social previews

---

## 8. Recommended Implementation Order

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Replace local uploads with durable storage | Medium | Critical |
| 2 | Replace in-memory rate limiting | Small | Critical |
| 3 | Add CSP safely | Small | Critical |
| 4 | Tighten RBAC mapping | Medium | Critical |
| 5 | Add env validation + update `.env.example` | Small | High |
| 6 | Add Sentry + analytics | Small | High |
| 7 | Add email notifications | Medium | High |
| 8 | Add OG image + structured data | Small | High |
| 9 | Explicit session config + auth cleanup | Small | High |
| 10 | Add audit logging | Medium | High |
| 11 | Add CI workflow | Small | Medium |
| 12 | Add E2E coverage for critical paths | Medium | Medium |
| 13 | Add public appointment flow | Medium | Medium |

---

## 9. SPECIAL — Why This Version Improves the Prior Audit

This section explains why the document was rewritten rather than lightly edited.

- **It separates verified facts from assumptions.** The earlier draft treated some recommendations as if they were confirmed defects. This version only states hard claims that are supported by the repository.
- **It removes false negatives.** The previous draft said there was no testing and no migration strategy. That was not accurate. Tests exist, and migrations exist. The real gaps are E2E coverage and production deployment discipline.
- **It recalibrates severity.** Some items were useful but overstated. For example, missing email notifications matter operationally, but they are not the same class of blocker as non-durable uploads or broken rate limiting.
- **It improves trustworthiness.** Production-readiness documents are only useful if engineers can rely on them. A shorter accurate audit is more valuable than a longer aggressive one.
- **It adds operational reasoning.** Recommendations now explain the failure mode they prevent, so implementation can be prioritized by risk instead of by generic best-practice checklists.
- **It narrows scope to what matters now.** The revised order focuses first on risks that can cause data loss, broken runtime behavior, or unauthorized access.

---

## 10. Bottom Line

VisaCore Solutions is close to production readiness from an application perspective, but not yet from an operational-hardening perspective.

If the team fixes the storage, rate limiting, CSP, RBAC, env validation, and observability gaps, the platform will be in a credible position for public launch.
