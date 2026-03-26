# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

VisaCore Solutions — an immigration consulting platform based in Lomé, Togo. Two main parts:
1. **Public marketing website** (French-language, conversion-focused)
2. **Secure admin dashboard** (lead/content/appointment management)

Full PRD is in `prompt.md`. Implementation plan is in `PLAN.md`.

## Tech Stack

- **Next.js 16.2.1** (App Router, Turbopack) — **breaking changes from earlier versions; read `node_modules/next/dist/docs/` before writing Next.js code**
- **React 19.2.4**
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (uses `@import "tailwindcss"` syntax, not v3 `@tailwind` directives)
- **shadcn/ui** (base-nova style) — components in `components/ui/`
- **Prisma 7.5** with `@prisma/adapter-pg` → Neon PostgreSQL
- **Auth.js v5** (next-auth@beta) with credentials provider, JWT strategy
- **Zod** for validation schemas
- **React Hook Form** for client forms
- **Framer Motion** for animations
- **ESLint 9** (flat config in `eslint.config.mjs`)
- **Package manager:** npm

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma generate  # Regenerate Prisma client (output: lib/generated/prisma)
npx prisma db push   # Push schema changes to DB
npx prisma migrate dev --name <name>  # Create migration
npx tsx prisma/seed.ts  # Seed database
```

No test framework is configured yet.

## Path Alias

`@/*` maps to the project root (`./`). Use `@/components/...`, `@/lib/...`, `@/actions/...`, etc.

## Design System

- **Navy Blue:** #0A2540 | **Gold:** #C9A227 | **White:** #FFFFFF
- Premium, trust-first aesthetic — generous whitespace, soft shadows, rounded corners
- Fonts: Geist Sans + Geist Mono (loaded via `next/font/google` in root layout)
- Mobile-first responsive design
- All public-facing content is in **French**
- CSS variables defined in `app/globals.css` using oklch color space

## Architecture

### Route Structure
- `app/(public)/` — marketing pages with shared Header/Footer/WhatsApp button
- `app/(auth)/` — login page with split layout (navy branding panel + form)
- `app/admin/` — protected dashboard with sidebar/topbar layout
- `app/api/auth/[...nextauth]/` — Auth.js route handler

### Key Files
- `lib/prisma.ts` — Prisma client singleton (uses pg adapter, strips `channel_binding` param)
- `lib/auth.ts` — Auth.js config with credentials provider, JWT strategy, role in token
- `proxy.ts` — Next.js 16 middleware (renamed from middleware.ts) for admin route protection
- `lib/validations/` — Zod schemas for all models
- `actions/` — Server actions for all CRUD operations
- `components/admin/` — StatusBadge, StatsCard, Sidebar, Topbar
- `components/public/` — Header, Footer, WhatsAppButton, ContactForm, LeadForm

### Database
- Prisma schema in `prisma/schema.prisma`
- Generated client at `lib/generated/prisma/` (not the default `node_modules`)
- Models: User, Account, Session, VerificationToken, Lead, ContactRequest, AppointmentRequest, Destination, Service, FAQ, Testimonial, SuccessStory, PageContent, SiteSetting, MediaAsset
- Enums: Role (SUPER_ADMIN/ADMIN/EDITOR), LeadStatus, AppointmentStatus, FAQCategory, SettingType

### Auth
- Admin login: credentials provider (email/password with bcrypt)
- JWT strategy with role embedded in token
- Session augmented with `user.id` and `user.role` (see `types/next-auth.d.ts`)
- Seed admin: admin@visacore.com / VisaCore2024!

### Important Patterns
- Next.js 16: `params` and `searchParams` are async Promises (must await them)
- Next.js 16: middleware file is `proxy.ts` (not `middleware.ts`)
- Prisma 7: requires database adapter (PrismaPg), not direct connection string
- Server components by default; `"use client"` only for interactive components
- Server actions in `actions/` directory for all mutations
