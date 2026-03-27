# Content Map

This file documents every `PageContent` section that is intentionally connected to the public site.

## Home

- `home.hero`
  - Route: `/`
  - Component: `app/(public)/page.tsx`
  - Purpose: main hero headline, intro copy, and both CTA labels
  - Content schema:
    - `title`: main hero title
    - `subtitle`: supporting paragraph
    - `content.eyebrow`: top badge text
    - `content.primaryCta`: main CTA label
    - `content.secondaryCta`: secondary CTA label

- `home.trust`
  - Route: `/`
  - Component: `app/(public)/page.tsx`
  - Purpose: trust heading and stats displayed under the hero actions
  - Content schema:
    - `title`: trust section label
    - `subtitle`: optional helper line
    - `content.stats[]`
      - `value`: stat value
      - `label`: stat label

## About

- `about.story`
  - Route: `/a-propos`
  - Component: `app/(public)/a-propos/page.tsx`
  - Purpose: origin story block
  - Content schema:
    - `title`: section heading
    - `subtitle`: optional intro line
    - `content.text`: main paragraph content

- `about.mission`
  - Route: `/a-propos`
  - Component: `app/(public)/a-propos/page.tsx`
  - Purpose: mission card
  - Content schema:
    - `title`: card heading
    - `content.text`: mission body

- `about.vision`
  - Route: `/a-propos`
  - Component: `app/(public)/a-propos/page.tsx`
  - Purpose: vision card
  - Content schema:
    - `title`: card heading
    - `content.text`: vision body

## Notes

- Any `PageContent` entry outside this map is treated as unsupported and should not be used as a public source of truth.
- Core sections keep runtime fallbacks so the public site remains readable if the database is unavailable.
