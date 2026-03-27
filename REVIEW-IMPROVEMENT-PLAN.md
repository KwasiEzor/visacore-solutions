# VisaCore Solutions — Senior Improvement Plan

## Purpose

This document turns the senior review into an execution-ready improvement backlog.
It focuses on real issues observed in the current codebase, not generic best practices.

## Current Assessment

### What is already good

- Strong product direction and visual identity on the public site
- Clear separation between public site and admin back office
- Modern stack: Next.js 16, React 19, Prisma 7, Auth.js v5, Zod, server actions
- Production build passes
- Security headers and error boundaries already exist

### What is currently holding the project back

- Public pages are only partially connected to CMS/admin data
- Seeded content shape does not match the rendering logic on some dynamic pages
- Some homepage and footer links point to outdated or invalid targets
- Site settings are inconsistently named and not consumed consistently
- Admin structured content editing is fragile and can silently erase data
- Public forms have no anti-spam or abuse protection
- A few authorization and UX consistency issues reduce trust and maintainability

## Main Objectives

1. Make the database the single source of truth for all editable business content.
2. Eliminate broken links, mismatched slugs, and content schema inconsistencies.
3. Harden public input surfaces against spam and accidental bad data.
4. Align admin permissions, settings, and CMS behavior with actual product intent.
5. Add enough validation and testing to prevent these regressions from returning.

## Priority Matrix

### P0: Immediate business risk

- Fix broken homepage service links and outdated slugs
- Fix destination/service JSON shape mismatch
- Fix settings key mismatch for social links and WhatsApp
- Stop silent JSON corruption in admin forms

### P1: Production hardening

- Add spam protection and rate limiting to public forms
- Align settings authorization logic
- Remove invalid interactive markup and clean contact inconsistencies
- Connect homepage and other public pages to real CMS content

### P2: Product quality

- Improve admin UX for structured content editing
- Improve observability and error reporting
- Add test coverage for critical public flows and admin mutations
- Improve SEO/content operations workflow

## Current Status

### Completed phases

- Phase 1 completed: core content/data source alignment
- Phase 2 completed: CMS-driven public content mapping
- Phase 3 completed: public form hardening and submission feedback
- Phase 4 completed: RBAC alignment and upload policy hardening
- Phase 5 completed: trust/UX cleanup and semantic fixes
- Phase 6 completed: automated quality gates and DB-backed content integrity checks

### Remaining implementation backlog

- Replace raw JSON textareas in service/destination admin forms with structured repeatable editors
- Add unsaved-change guards and validation summaries to large admin forms
- Add search/filter UX for leads and contacts admin screens
- Add E2E smoke coverage for public CTAs, contact submission, and admin login
- Consider optional CAPTCHA and abuse-event logging if the public funnel starts attracting spam beyond the current guardrails

## Phase 1: Stabilize Core Content Flows

### 1.1 Unify service slugs and source of truth

#### Problems

- Homepage uses static service data with old slugs
- Services index uses DB data, but homepage does not
- Footer still links to old anchors and outdated service names

#### Actions

- Replace homepage static services with Prisma-backed published services
- Remove legacy slugs from public CTAs and navigation shortcuts
- Update footer service shortcuts to use current service slugs or remove anchor shortcuts entirely
- Add a small fallback only if the DB is unavailable, and ensure fallback slugs match real seeded slugs

#### Acceptance criteria

- Every service CTA from homepage, footer, and listing pages resolves to an existing published page
- Admin-edited service names and slugs are reflected across the public site

### 1.2 Normalize destination and service JSON schemas

#### Problems

- Seeded `benefits`, `opportunities`, and `whyChoose` values are arrays of strings
- Public pages expect arrays of objects with labels and descriptions

#### Actions

- Define strict TypeScript and Zod schemas for:
  - destination opportunities
  - destination visa categories
  - destination why-choose items
  - service benefits
- Update seed data to conform to the same object schemas used by rendering
- Add migration/cleanup script for existing malformed JSON data if needed
- Reject malformed structured data at admin submission time

#### Acceptance criteria

- Seeded content renders correctly on all destination and service detail pages
- Structured sections never render `undefined` title/description content
- Admin cannot save malformed JSON payloads

### 1.3 Fix settings naming and runtime consumption

#### Problems

- Admin and seed use `facebook_url`, `linkedin_url`, `instagram_url`, `whatsapp_number`
- Public layout/footer expect `social_facebook`, `social_linkedin`, `social_instagram`, `social_whatsapp`
- WhatsApp floating button reads only env var and ignores DB settings

#### Actions

- Choose one canonical settings key convention
- Update seed, admin labels, public layout, footer, and WhatsApp button to use the same keys
- Make public contact/social elements prefer DB settings and fall back to env only when necessary
- Audit all contact details for one canonical email, phone, and WhatsApp number

#### Acceptance criteria

- Editing social/contact settings in admin updates the public site correctly
- Footer social buttons no longer point to `#`
- WhatsApp button uses the configured business number consistently

## Phase 2: Repair CMS Integrity

### 2.1 Make page content admin actually drive public pages

#### Problems

- `PageContent` exists and can be edited
- Public homepage still renders hardcoded hero/trust/testimonial copy

#### Actions

- Decide which public sections are CMS-managed and which remain static by design
- Wire homepage hero, trust strip, selected testimonials, and CTA blocks to `PageContent` or remove those CMS entries
- Add a clear content map document:
  - page
  - section key
  - owning UI component
  - expected content schema

#### Acceptance criteria

- Every editable content block in admin maps to a visible public section
- There are no orphan admin content entries with no effect on the public site

### 2.2 Replace raw JSON textareas with safer editors

#### Problems

- Invalid JSON currently becomes `null` silently
- Editors must hand-write structured content in raw JSON

#### Actions

- Short term:
  - validate JSON before submit
  - show inline parse errors
  - block save when invalid
- Medium term:
  - replace raw JSON textareas with repeatable item editors
  - support add/remove/reorder item rows
  - validate required fields per row

#### Acceptance criteria

- Invalid structured content cannot be saved
- Editors can manage arrays of objects without writing JSON by hand

## Phase 3: Public Funnel Hardening

### 3.1 Protect contact and lead forms from abuse

#### Problems

- Public server actions write directly to DB after validation
- No CAPTCHA, honeypot, throttling, or IP-based limits

#### Actions

- Add rate limiting at the route/action boundary
- Add honeypot field for public forms
- Add optional CAPTCHA for high-risk pages
- Add duplicate submission checks for same email/phone in short windows
- Log abuse events for monitoring

#### Acceptance criteria

- Repeated automated form submissions are throttled
- Basic bots are filtered without degrading UX too much
- Admin tables stay usable over time

### 3.2 Improve submission feedback and trust

#### Actions

- Add success references like expected response time and next step
- Show clearer failure messages for network/server problems
- Consider saving local draft values until success for long forms

#### Acceptance criteria

- Users always understand whether the submission succeeded, failed, or needs retry

## Phase 4: Authorization and Admin Consistency

### 4.1 Align role policy with implementation

#### Problems

- `/admin/settings` route is effectively SUPER_ADMIN-only
- `updateSetting` currently allows ADMIN too

#### Actions

- Define a role matrix per resource:
  - users
  - settings
  - content
  - services
  - destinations
  - leads
  - contacts
  - media
- Centralize permission checks through one RBAC helper
- Apply the same policy in:
  - proxy/auth route guards
  - server actions
  - admin UI visibility

#### Acceptance criteria

- No route/action mismatch remains
- Hidden admin UI matches real backend authorization

### 4.2 Reduce accidental data and media risk

#### Actions

- Review whether files in `public/uploads` are acceptable for PDFs and business documents
- If not, move uploads to private/object storage with signed URLs
- Add allowed extension checks in addition to MIME checks
- Add virus scanning or at least content-type verification for uploads if business risk warrants it

#### Acceptance criteria

- Upload policy is explicit and matches business/security requirements

## Phase 5: UX and UI Cleanup

### 5.1 Fix trust-breaking inconsistencies

#### Actions

- Use one canonical contact email everywhere
- Use one canonical phone and WhatsApp number everywhere
- Remove placeholder partner logos unless real partners exist
- Review copy claims like success rates and dossier counts if they are not substantiated

#### Acceptance criteria

- Contact and trust information is consistent across all public pages

### 5.2 Clean semantic and accessibility issues

#### Actions

- Replace `Link > button` patterns with a single interactive element
- Review keyboard navigation in mobile nav, dialogs, dropdowns, and forms
- Add better ARIA labels where needed
- Audit color contrast on gold/light text combinations

#### Acceptance criteria

- No invalid interactive nesting remains
- Main navigation and forms are fully keyboard-usable

### 5.3 Improve admin usability

#### Actions

- Add preview links from admin records to public pages
- Add unsaved-change guards for large forms
- Add structured validation summaries at top of forms
- Add basic search/filter improvements on contact and lead management screens

## Phase 6: Testing and Quality Gates

### 6.1 Add automated tests for critical paths

#### Minimum test suite

- Unit tests for schema normalization helpers
- Integration tests for:
  - create lead
  - create contact request
  - settings update authorization
  - service slug resolution
- E2E smoke tests for:
  - homepage CTAs
  - service detail route
  - destination detail route
  - contact submission
  - admin login

#### Acceptance criteria

- Broken slug mismatches and malformed content schemas are caught before release

### 6.2 Add release checks

#### Actions

- Enforce:
  - `npm run lint`
  - `npm run build`
  - test suite
- Add a content integrity check script that verifies:
  - all public service links resolve
  - all published destination/service records have valid structured data
  - required settings keys exist

## Recommended Delivery Order

### Sprint 1

- Fix homepage service data source
- Fix footer service links
- Fix settings key mismatch
- Fix contact/email inconsistencies
- Align seeded JSON shape with render expectations

### Sprint 2

- Add strict structured-content validation
- Block invalid JSON saves
- Wire public content blocks to CMS or remove dead CMS paths
- Align settings authorization

### Sprint 3

- Add form anti-spam protections
- Add upload policy hardening
- Fix semantics/a11y issues
- Add smoke tests

### Sprint 4

- Replace raw JSON editors with structured admin editors
- Add content integrity scripts
- Improve admin previews and workflow polish

## Suggested Ownership

### Backend / platform

- settings normalization
- RBAC alignment
- spam protection
- upload hardening
- integrity scripts

### Frontend / product

- homepage and footer data wiring
- service/destination page rendering cleanup
- contact/trust consistency
- accessibility cleanup
- admin form UX improvements

### QA / release

- smoke tests
- regression checklist
- content integrity validation

## Definition of Done

A phase is complete only if:

- the code is merged
- the related admin flow works end-to-end
- the public UI reflects the updated data correctly
- lint/build/tests pass
- no legacy fallback path is silently masking the issue that was supposed to be fixed

## Final Recommendation

Do not start with visual polish.
The right order is:

1. content integrity
2. settings consistency
3. spam/security hardening
4. authorization cleanup
5. admin UX improvements
6. cosmetic refinement

If this order is followed, the project can move from “good-looking but fragile” to “production-ready and maintainable” without wasting effort on surface-level changes first.
