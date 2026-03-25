# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Overview

VisaCore Solutions — an immigration consulting platform based in Lomé, Togo. Two main parts:
1. **Public marketing website** (French-language, conversion-focused)
2. **Secure admin dashboard** (lead/content/appointment management)

Full PRD is in `prompt.md`.

## Tech Stack

- **Next.js 16.2.1** (App Router) — **breaking changes from earlier versions; read `node_modules/next/dist/docs/` before writing Next.js code**
- **React 19.2.4**
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (uses `@import "tailwindcss"` syntax, not v3 `@tailwind` directives)
- **ESLint 9** (flat config in `eslint.config.mjs`)
- **Package manager:** npm

Planned additions per PRD: shadcn/ui, Prisma + PostgreSQL, NextAuth, Zod, React Hook Form, Framer Motion.

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, no --ext flag needed)
```

No test framework is configured yet.

## Path Alias

`@/*` maps to the project root (`./`). Use `@/app/...`, `@/components/...`, etc.

## Design System

- **Navy Blue:** #0A2540 | **Gold:** #C9A227 | **White:** #FFFFFF
- Premium, trust-first aesthetic — generous whitespace, soft shadows, rounded corners
- Fonts: Geist Sans + Geist Mono (loaded via `next/font/google` in root layout)
- Mobile-first responsive design
- All public-facing content is in **French**

## Architecture Notes

- App Router with server components by default; add `"use client"` only when needed
- Public pages under `app/` (accueil, destinations, services, à propos, témoignages, FAQ, contact, évaluation)
- Admin dashboard under `app/admin/` with route protection
- Data models planned: User, Role, Lead, ContactRequest, AppointmentRequest, Destination, Service, FAQ, Testimonial, SuccessStory, PageContent, SiteSetting, MediaAsset
- SEO: dynamic metadata exports per page, OG tags, structured headings, clean URLs
