# VisaCore Solutions — Full Upgrade Plan

## Context

VisaCore Solutions is an immigration consulting platform (Next.js 16, Prisma 7, Auth.js v5) with a public marketing site (mostly complete) and an admin dashboard (65% complete). A senior dev audit revealed: broken production DB singleton, no security headers, no error boundaries, missing admin CRUD forms, no search/pagination, and no AI features. This plan covers 3 phases to bring the app to premium production quality.

---

## Phase 1: Production-Ready Fixes

### 1.1 Fix Prisma singleton
- **File:** `lib/prisma.ts` — Remove `NODE_ENV` guard on line 19, always cache globally

### 1.2 Add database indexes
- **File:** `prisma/schema.prisma` — Add `@@index` on:
  - Lead: `[status]`, `[createdAt]`, `[assignedToId]`
  - ContactRequest: `[isRead]`, `[status]`, `[createdAt]`
  - AppointmentRequest: `[status]`, `[createdAt]`
  - Destination: `[published, order]`
  - Service: `[published, order]`
  - FAQ: `[published, category]`, `[destinationId]`
  - Testimonial: `[published, featured]`
  - SuccessStory: `[published]`
  - PageContent: `[pageKey]`
  - MediaAsset: `[createdAt]`
- Run `npx prisma db push`

### 1.3 Configure next.config.ts
- **File:** `next.config.ts` — Add security headers (X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), image remote patterns (images.unsplash.com)

### 1.4 SEO infrastructure
- **Create:** `app/robots.ts` — Allow all except /admin, /api, /login
- **Create:** `app/sitemap.ts` — Dynamic sitemap from Prisma (destinations, services + static pages)
- **Create:** `app/manifest.ts` — PWA manifest with VisaCore branding

### 1.5 Error boundaries
- **Create:** `app/global-error.tsx` — Root error catch with own html/body
- **Create:** `app/(public)/error.tsx` — Public error UI (navy/gold themed, retry button)
- **Create:** `app/admin/error.tsx` — Admin error UI (card pattern, reset button)

### 1.6 Environment template
- **Create:** `.env.example` — Document all required vars (DATABASE_URL, AUTH_SECRET, AUTH_URL, NEXT_PUBLIC_*)

### 1.7 Legal pages
- **Create:** `app/(public)/privacy/page.tsx` — French privacy policy (RGPD)
- **Create:** `app/(public)/terms/page.tsx` — French terms of service

### 1.8 ISR + static generation
- **Modify:** `app/(public)/destinations/[slug]/page.tsx` — Add `revalidate = 3600` + `generateStaticParams()`
- **Modify:** `app/(public)/services/[slug]/page.tsx` — Same
- **Modify:** Listing pages (destinations, services, faq, temoignages) — Add `revalidate = 3600`

### 1.9 Active nav state
- **Modify:** `components/public/header.tsx` — Compare `pathname` to each link href, add gold color + underline indicator for active link (desktop + mobile)

### 1.10 Footer social links
- **Modify:** `app/(public)/layout.tsx` — Fetch social URLs from SiteSetting
- **Modify:** `components/public/footer.tsx` — Accept settings prop, conditionally render social links

### Phase 1 Verification
- `npm run build` passes
- `/robots.txt`, `/sitemap.xml` render correctly
- `/privacy`, `/terms` pages load
- Error boundaries catch thrown errors
- Security headers present in responses
- Active nav link highlighted
- Dynamic pages use ISR caching

---

## Phase 2: Admin Dashboard Completion

### 2.1 Install dependencies
```bash
npm install @tanstack/react-table
npx shadcn@latest add dialog badge tabs switch radio-group popover command pagination table chart
```

### 2.2 Reusable DataTable system
- **Create:** `components/admin/data-table/data-table.tsx` — Generic `DataTable<T>` with TanStack Table
- **Create:** `components/admin/data-table/data-table-pagination.tsx` — URL-based pagination
- **Create:** `components/admin/data-table/data-table-search.tsx` — Debounced search → `?q=`
- **Create:** `components/admin/data-table/data-table-filters.tsx` — Filter dropdowns → URL params
- **Create:** `components/admin/data-table/data-table-toolbar.tsx` — Search + filters + bulk actions + export
- **Create:** `components/admin/data-table/index.ts` — Barrel export

**Pattern:** Server-side pagination via `searchParams` (async Promise in Next.js 16). Each page does `prisma.findMany({ skip, take, where })` + `prisma.count({ where })`.

### 2.3 Destination CRUD forms
- **Create:** `app/admin/destinations/new/page.tsx`
- **Create:** `app/admin/destinations/[id]/edit/page.tsx`
- **Create:** `components/admin/destination-form.tsx` — RHF + Zod, all fields including JSON editors
- **Create:** `components/admin/json-array-editor.tsx` — Reusable array-of-objects editor (for opportunities, visaCategories, whyChoose, benefits)
- **Modify:** `app/admin/destinations/page.tsx` — Rewrite with DataTable

### 2.4 Service CRUD forms
- **Create:** `app/admin/services/new/page.tsx`
- **Create:** `app/admin/services/[id]/edit/page.tsx`
- **Create:** `components/admin/service-form.tsx`
- **Modify:** `app/admin/services/page.tsx` — Rewrite with DataTable

### 2.5 FAQ CRUD forms
- **Create:** `app/admin/faqs/new/page.tsx`
- **Create:** `app/admin/faqs/[id]/edit/page.tsx`
- **Create:** `components/admin/faq-form.tsx`
- **Modify:** `app/admin/faqs/page.tsx` — Rewrite with DataTable

### 2.6 Testimonials full CRUD
- **Create:** `app/admin/testimonials/new/page.tsx`
- **Create:** `app/admin/testimonials/[id]/edit/page.tsx`
- **Create:** `components/admin/testimonial-form.tsx`
- **Create:** `components/admin/testimonial-actions.tsx`
- **Modify:** `app/admin/testimonials/page.tsx` — Rewrite with DataTable + actions
- **Modify:** `actions/testimonials.ts` — Add toggle published/featured actions

### 2.7 Success Stories full CRUD
- **Create:** `app/admin/stories/new/page.tsx`
- **Create:** `app/admin/stories/[id]/edit/page.tsx`
- **Create:** `components/admin/story-form.tsx`
- **Create:** `components/admin/story-actions.tsx`
- **Create:** `lib/validations/story.ts` — Extract from inline schema
- **Modify:** `app/admin/stories/page.tsx` — Rewrite with DataTable + actions

### 2.8 Content editor
- **Modify:** `app/admin/content/page.tsx` — Add inline edit dialogs per section
- **Create:** `components/admin/content-editor.tsx` — Dialog form for title/subtitle/content/order

### 2.9 Settings editor
- **Modify:** `app/admin/settings/page.tsx` — Inline edit per setting
- **Create:** `components/admin/setting-editor.tsx` — Input type based on SettingType (TEXT→Input, BOOLEAN→Switch, IMAGE→URL+preview, JSON→Textarea)

### 2.10 Users management (SUPER_ADMIN)
- **Modify:** `app/admin/users/page.tsx` — DataTable + actions
- **Create:** `components/admin/user-create-dialog.tsx` — Create user form (name, email, password, role)
- **Create:** `components/admin/user-actions.tsx` — Change role, delete (SUPER_ADMIN only)

### 2.11 Media upload
- **Create:** `app/api/upload/route.ts` — File upload API (validate type/size, save to /public/uploads, create MediaAsset)
- **Create:** `components/admin/media-upload.tsx` — Drag-and-drop upload zone
- **Create:** `actions/media.ts` — deleteMedia action
- **Modify:** `app/admin/media/page.tsx` — Upload button + grid with delete

### 2.12 Bulk actions
- **Modify:** `components/admin/data-table/data-table.tsx` — Add row selection (checkbox column)
- **Modify:** `components/admin/data-table/data-table-toolbar.tsx` — Bulk action bar when items selected
- **Add bulk server actions** to each `actions/*.ts` file

### 2.13 CSV export
- **Create:** `lib/export-csv.ts` — Client-side CSV generation utility
- **Modify:** DataTable toolbar — Add "Exporter CSV" button

### 2.14 RBAC UI + Dashboard charts
- **Create:** `lib/rbac.ts` — Permission helpers (`hasPermission(role, action)`)
- **Modify:** All admin list pages — Hide action buttons based on role
- **Modify:** `components/admin/sidebar.tsx` — Hide Users/Settings for non-SUPER_ADMIN
- **Modify:** `app/admin/page.tsx` — Add lead funnel bar chart + monthly trends line chart (Recharts via shadcn chart)

### Phase 2 Verification
- All CRUD forms work (create, edit, delete for every entity)
- DataTable has search, filter, pagination, sorting on all list pages
- Bulk select + delete works
- CSV export downloads correctly
- EDITOR cannot delete, cannot see Users/Settings
- Dashboard shows charts with real data
- Media upload works

---

## Phase 3: AI Assistant

### 3.1 AI SDK setup
```bash
npm install ai @ai-sdk/anthropic
```
- **Create:** `lib/ai.ts` — Anthropic provider config
- **Add:** `ANTHROPIC_API_KEY` to .env.example

### 3.2 Public chatbot
- **Create:** `app/api/chat/route.ts` — Streaming chat with `streamText()`, system prompt with VisaCore identity + FAQ data, tool calls for appointment booking + checklist generation
- **Create:** `components/public/chatbot.tsx` — Floating chat widget (`useChat()` hook), navy/gold theme, minimized pill → expanded panel
- **Create:** `components/public/chatbot-message.tsx` — Message bubble component
- **Modify:** `app/(public)/layout.tsx` — Add `<Chatbot />` component

### 3.3 Admin AI copilot
- **Create:** `app/api/admin/ai/route.ts` — Protected streaming API (auth check)
- **Create:** `components/admin/ai-copilot.tsx` — Slide-out panel from topbar
- **Create:** `components/admin/ai-lead-insights.tsx` — Lead scoring + response draft on lead detail page
- **Modify:** `app/admin/leads/[id]/page.tsx` — Add AI insights panel
- **Modify:** `components/admin/topbar.tsx` — Add AI copilot trigger button

### 3.4 Chat persistence
- **Modify:** `prisma/schema.prisma` — Add `ChatConversation` + `ChatMessage` models
- **Create:** `actions/chat.ts` — Save/load conversation history
- Run `npx prisma db push`

### 3.5 Rate limiting
- **Create:** `lib/rate-limit.ts` — In-memory rate limiter (20 msgs/hour public, 50/hour admin)
- **Modify:** Chat API routes — Apply rate limits
- Add safety guardrails to system prompts

### Phase 3 Verification
- Chatbot opens, streams French responses
- FAQ questions answered from database
- Admin copilot scores leads, drafts responses
- Chat history persists across reloads
- Rate limiting returns 429 after threshold

---

## Commit Strategy
- After Phase 1: `feat: production-ready infrastructure (security, SEO, error handling, ISR)`
- After Phase 2: `feat: complete admin dashboard (CRUD, DataTable, charts, RBAC)`
- After Phase 3: `feat: AI assistant (public chatbot + admin copilot)`
