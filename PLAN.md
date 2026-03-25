# VisaCore Solutions — Implementation Plan

## Architecture Overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Auth | Auth.js v5 (NextAuth) + Prisma Adapter |
| Database | Neon PostgreSQL (pooled connection) |
| ORM | Prisma |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Validation | Zod + React Hook Form |
| Animations | Framer Motion |
| Fonts | Geist Sans + Geist Mono |

### Next.js 16 Critical Notes
- `params`, `searchParams`, `cookies()`, `headers()` are **all async** — must `await`
- Middleware renamed to `proxy.ts` with `export function proxy()`
- Fetch not cached by default — opt-in with `cache: 'force-cache'`
- `GET` Route Handlers not cached by default
- Turbopack is the default bundler
- Node.js 20.9+ required

---

## Folder Structure

```
visacore-solutions/
├── app/
│   ├── (public)/                  # Public marketing pages (grouped route)
│   │   ├── layout.tsx             # Public layout (header + footer + WhatsApp button)
│   │   ├── page.tsx               # Homepage (accueil)
│   │   ├── destinations/
│   │   │   ├── page.tsx           # All destinations
│   │   │   └── [slug]/page.tsx    # Single destination
│   │   ├── services/
│   │   │   ├── page.tsx           # All services
│   │   │   └── [slug]/page.tsx    # Single service
│   │   ├── a-propos/page.tsx      # About page
│   │   ├── temoignages/page.tsx   # Testimonials
│   │   ├── faq/page.tsx           # FAQ page
│   │   ├── contact/page.tsx       # Contact page
│   │   └── evaluation/page.tsx    # Lead capture / free evaluation
│   ├── (auth)/                    # Auth pages (grouped route)
│   │   ├── layout.tsx             # Centered auth layout
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── admin/                     # Admin dashboard (protected)
│   │   ├── layout.tsx             # Admin shell (sidebar + topbar)
│   │   ├── page.tsx               # Dashboard overview
│   │   ├── leads/
│   │   │   ├── page.tsx           # Lead list
│   │   │   └── [id]/page.tsx      # Lead detail
│   │   ├── contacts/page.tsx      # Contact requests
│   │   ├── appointments/page.tsx  # Appointment management
│   │   ├── destinations/
│   │   │   ├── page.tsx           # Destination CRUD list
│   │   │   └── [id]/edit/page.tsx # Edit destination
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── faqs/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── stories/page.tsx       # Success stories
│   │   ├── content/page.tsx       # CMS page content
│   │   ├── media/page.tsx         # Media library
│   │   ├── users/page.tsx         # User management
│   │   └── settings/page.tsx      # Site settings
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Auth.js handler
│   │   ├── leads/route.ts
│   │   ├── contacts/route.ts
│   │   ├── appointments/route.ts
│   │   ├── destinations/route.ts
│   │   ├── services/route.ts
│   │   ├── faqs/route.ts
│   │   ├── testimonials/route.ts
│   │   ├── stories/route.ts
│   │   ├── content/route.ts
│   │   ├── media/route.ts
│   │   ├── users/route.ts
│   │   └── settings/route.ts
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles + design tokens
│   └── not-found.tsx              # 404 page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── public/                    # Public site components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── destination-card.tsx
│   │   ├── service-card.tsx
│   │   ├── testimonial-card.tsx
│   │   ├── faq-accordion.tsx
│   │   ├── lead-form.tsx
│   │   ├── contact-form.tsx
│   │   ├── cta-section.tsx
│   │   ├── trust-indicators.tsx
│   │   ├── process-timeline.tsx
│   │   └── whatsapp-button.tsx
│   └── admin/                     # Admin dashboard components
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       ├── stats-card.tsx
│       ├── data-table.tsx
│       ├── status-badge.tsx
│       └── form-fields.tsx
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # Auth.js config
│   ├── auth-client.ts             # Client-side auth helpers
│   ├── validations/               # Zod schemas
│   │   ├── lead.ts
│   │   ├── contact.ts
│   │   ├── appointment.ts
│   │   ├── destination.ts
│   │   ├── service.ts
│   │   ├── faq.ts
│   │   ├── testimonial.ts
│   │   └── auth.ts
│   └── utils.ts                   # Shared utilities (cn helper, etc.)
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.ts                    # Seed data (French content)
├── actions/                       # Server Actions
│   ├── leads.ts
│   ├── contacts.ts
│   ├── appointments.ts
│   ├── destinations.ts
│   ├── services.ts
│   ├── faqs.ts
│   ├── testimonials.ts
│   ├── stories.ts
│   ├── content.ts
│   ├── media.ts
│   ├── users.ts
│   └── settings.ts
├── public/
│   └── images/
├── proxy.ts                       # Next.js 16 proxy (was middleware.ts)
└── .env.local                     # Environment variables
```

---

## Database Schema (Prisma)

### Auth Models (Auth.js)
- **User** — id, name, email, hashedPassword, role (SUPER_ADMIN | ADMIN | EDITOR), image, emailVerified
- **Account** — Auth.js OAuth adapter
- **Session** — Auth.js session adapter
- **VerificationToken** — Auth.js email verification

### Application Models
- **Lead** — fullName, email, phone, country, destination, situation, serviceNeeded, message, consent, status (NEW | CONTACTED | QUALIFIED | IN_PROGRESS | CONVERTED | CLOSED), source, notes, assignedToId → User, tags
- **ContactRequest** — fullName, email, phone, subject, message, isRead, status, notes
- **AppointmentRequest** — fullName, email, phone, preferredDate, preferredTime, serviceType, destinationType, message, status (PENDING | APPROVED | CANCELLED | COMPLETED), notes, assignedToId → User
- **Destination** — name, slug, heroTitle, heroDescription, heroImage, opportunities (JSON), visaCategories (JSON), whyChoose (JSON), ctaText, published, order, seoTitle, seoDescription
- **Service** — name, slug, icon, description, whoIsItFor, requiredSupport, benefits (JSON), ctaText, published, order, seoTitle, seoDescription
- **FAQ** — question, answer, category (GENERAL | CANADA | USA | EUROPE | DOCUMENTATION | PROCESS), destinationId → Destination (optional), published, order
- **Testimonial** — clientName, clientImage, destination, content, rating, featured, published
- **SuccessStory** — title, slug, clientName, destination, summary, content, images (JSON), published, seoTitle, seoDescription
- **PageContent** — pageKey (unique), sectionKey, title, subtitle, content (JSON), published
- **SiteSetting** — key (unique), value, type (TEXT | IMAGE | JSON | BOOLEAN)
- **MediaAsset** — filename, url, mimeType, size, alt, uploadedById → User

All models include `createdAt` and `updatedAt` timestamps.

---

## Authentication System

### Auth.js v5 Setup
- **Credentials provider** — email + password (bcrypt-hashed)
- **Prisma adapter** — sessions stored in DB
- **JWT strategy** — stateless sessions with role embedded in token
- **Role-based access** — SUPER_ADMIN, ADMIN, EDITOR
- **Proxy (middleware)** — protects `/admin/*` routes, redirects unauthenticated users to `/login`

### Auth Flow
1. Admin visits `/login` → credentials form
2. Auth.js validates credentials against DB (bcrypt compare)
3. JWT issued with `{ id, email, name, role }`
4. `proxy.ts` checks JWT on `/admin/*` routes
5. Server components access session via `auth()` helper
6. Client components use `useSession()` hook
7. Role checks in API routes and server actions

### Seeded Admin Account
- Email: `admin@visacore.com`
- Password: `VisaCore2024!` (bcrypt-hashed in seed)

---

## Implementation Phases

### Phase 1: Foundation Setup
1. Install all dependencies (prisma, next-auth, shadcn/ui, zod, react-hook-form, framer-motion, bcryptjs, lucide-react)
2. Initialize shadcn/ui with VisaCore design tokens (navy/gold palette)
3. Configure Prisma with Neon DB connection
4. Create full Prisma schema
5. Run migrations
6. Set up Auth.js v5 with credentials provider
7. Create `proxy.ts` for route protection
8. Set up `lib/prisma.ts` singleton and `lib/utils.ts`

### Phase 2: Design System & Shared Components
1. Update `globals.css` with VisaCore design tokens
2. Install and configure shadcn/ui components (button, card, input, dialog, table, dropdown-menu, tabs, badge, accordion, toast, form, select, textarea, separator, avatar, sheet, skeleton)
3. Build public layout (header with sticky nav, footer, WhatsApp floating button)
4. Build admin layout (sidebar, topbar, breadcrumbs)

### Phase 3: Public Marketing Pages
1. **Homepage** — hero, trust indicators, destinations, services overview, why choose us, process timeline, testimonials, FAQ preview, lead capture CTA, footer
2. **Destinations** — listing page + dynamic `[slug]` pages
3. **Services** — listing page + dynamic `[slug]` pages
4. **About** — agency story, mission, vision, values, team
5. **Testimonials** — filterable grid
6. **FAQ** — categorized accordion
7. **Contact** — form + business info + map placeholder
8. **Evaluation** — lead capture form (key conversion page)

### Phase 4: API Routes & Server Actions
1. CRUD route handlers for all entities
2. Server actions for form submissions (leads, contacts, appointments)
3. Zod validation schemas for all inputs
4. Auth-protected admin API routes
5. CSV export endpoint for leads

### Phase 5: Admin Dashboard
1. **Overview** — KPI cards, recent submissions, quick actions
2. **Leads** — data table with search/filter, status management, notes, assignment
3. **Contacts** — inbox-style list, read/unread, status
4. **Appointments** — list with approval workflow
5. **Destinations CRUD** — form with rich fields
6. **Services CRUD** — form with icon picker, benefits
7. **FAQ CRUD** — categorized, destination-linked
8. **Testimonials CRUD** — with image upload, featured toggle
9. **Success Stories CRUD** — rich content editor
10. **Page Content** — CMS blocks for homepage/about/CTAs
11. **Media Library** — upload, preview, delete
12. **Users** — admin user management, role assignment
13. **Settings** — site config (contact info, social links, SEO defaults)

### Phase 6: Seed Data & Polish
1. French-language seed data for all content
2. SEO metadata on all public pages
3. Loading states and error boundaries
4. Responsive testing
5. 404 page

---

## Environment Variables (.env.local)

```
# Database (Neon)
DATABASE_URL="postgresql://..."

# Auth.js
AUTH_SECRET="generated-secret"
AUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="+22890000000"
```

---

## Key Design Decisions

1. **Route groups** `(public)` and `(auth)` — separate layouts without URL segments
2. **Server Actions over API routes** for admin mutations — simpler, type-safe, progressive enhancement
3. **API routes** for public form submissions (leads, contacts) — consumed by client forms
4. **JSON fields** for flexible content (destination opportunities, service benefits, page content blocks)
5. **Slug-based routing** for destinations and services — clean SEO-friendly URLs
6. **JWT strategy** (not database sessions) — lower latency, works with edge proxy
7. **Single Prisma schema** — all models in one file for simplicity at this scale
