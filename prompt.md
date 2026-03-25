You are a senior full-stack engineer, senior product designer, and senior solution architect.

Your task is to design and build a production-ready web application for an immigration consulting agency called “VisaCore Solutions”, based in Lomé, Togo.

The application must include:
1. A premium public-facing marketing website
2. A secure admin dashboard
3. A scalable CMS-like content management system for all site content
4. Lead management features
5. Appointment/request management
6. Testimonial, FAQ, service, and destination management
7. A strong, modern, conversion-focused UI inspired by this visual reference:
   https://i.pinimg.com/736x/02/dd/68/02dd68788cddc086012ea22b579b8ebd.jpg

Do not copy the reference literally. Use it only as inspiration for:
- clean premium layout
- strong visual hierarchy
- elegant card system
- modern spacing
- luxury/professional blue-and-gold aesthetic
- polished hero section
- refined typography
- soft shadows
- modern dashboard feel

The final product must feel like a premium international consulting platform, trustworthy, modern, responsive, and built for conversion.

==================================================
PRODUCT / BUSINESS CONTEXT
==================================================

Brand name: VisaCore Solutions

Business type:
International immigration consulting agency

Location:
Lomé, Togo

Primary markets:
- Togo
- Francophone West Africa
- Africans seeking immigration opportunities abroad

Main destinations covered:
- Canada
- United States
- Europe

Core services:
- Study visa support
- Work permit support
- Permanent residency support
- Visitor visa support
- Full immigration file preparation
- Personalized consultation
- Profile evaluation / eligibility assessment

Target audience:
- Young professionals
- Students
- Skilled workers
- Families
- People looking for better international opportunities

Brand values:
- Trust
- Transparency
- Professionalism
- Global opportunities
- Reliability
- Human support
- International expertise

Tone of voice:
- Reassuring
- Professional
- Aspirational
- Premium
- Clear
- Human-centered

Primary business objective:
Generate qualified leads and turn visitors into clients.

Secondary objectives:
- Build trust immediately
- Showcase expertise by destination
- Simplify contact and consultation booking
- Enable the team to manage all website content and inbound requests from an admin dashboard

==================================================
PRD (PRODUCT REQUIREMENTS DOCUMENT)
==================================================

Build a full application with two parts:

A) PUBLIC WEBSITE
B) ADMIN DASHBOARD

--------------------------------------------------
A) PUBLIC WEBSITE REQUIREMENTS
--------------------------------------------------

The public website must include the following pages and sections.

1. HOME PAGE
Must include:
- Premium hero section
- Strong CTA above the fold
- Trust indicators
- Destination cards
- Services overview
- Why choose us section
- Process/timeline section
- Testimonials
- Success stories
- FAQ preview
- Lead capture form
- Final CTA
- Premium footer

Hero content:
Headline:
“Votre avenir à l’international commence ici”

Subheadline:
“Experts en immigration vers le Canada, les États-Unis et l’Europe”

Primary CTAs:
- “Obtenir mon évaluation gratuite”
- “Prendre rendez-vous”

Trust indicators:
- +1000 dossiers accompagnés
- Taux de réussite élevé
- Consultants expérimentés

2. DESTINATIONS PAGE
Must contain dedicated sections/cards for:
- Canada
- États-Unis
- Europe

For each destination:
- Hero banner or intro block
- Main opportunities
- Visa/service categories
- Why choose this destination
- CTA to request evaluation
- FAQ specific to destination
- Related testimonials or success stories

3. SERVICES PAGE
Must display all services in structured cards or sections:
- Études à l’étranger
- Permis de travail
- Immigration permanente
- Visa visiteur
- Montage de dossier complet
- Consultation personnalisée

Each service page or section should include:
- overview
- who it is for
- required support
- benefits
- CTA

4. ABOUT PAGE
Must include:
- agency story
- mission
- vision
- values
- why VisaCore Solutions exists
- local presence in Lomé
- team section (optional now, manageable from admin later)

5. TESTIMONIALS / SUCCESS STORIES PAGE
Must include:
- client testimonials
- success cases
- optional before/after style stories
- filtering by destination if possible

6. FAQ PAGE
FAQ categories:
- General
- Canada
- USA
- Europe
- Documentation
- Consultation / process

7. CONTACT PAGE
Must include:
- contact form
- phone
- WhatsApp
- office location in Lomé
- business hours
- map placeholder/integration ready
- CTA to request consultation

8. FREE EVALUATION PAGE / LEAD CAPTURE PAGE
This is a key conversion page.

Form fields should include:
- Full name
- Email
- Phone / WhatsApp
- Country of residence
- Destination of interest
- Current situation
- Service needed
- Short message
- Consent checkbox

9. OPTIONAL BLOG / RESOURCES PAGE
If time allows, implement a blog/resources section for SEO and educational content.

--------------------------------------------------
B) ADMIN DASHBOARD REQUIREMENTS
--------------------------------------------------

Create a secure admin dashboard for internal team use.

Dashboard must allow admins to manage all major site content and business operations.

Admin roles:
- Super Admin
- Admin
- Editor / Staff (optional role structure if easy to implement)

Core admin modules:

1. DASHBOARD OVERVIEW
- KPIs cards
- Number of leads
- Number of unread contact requests
- Number of appointments
- Number of testimonials
- Number of services
- Number of published FAQs
- Recent submissions table
- Quick actions

2. LEADS MANAGEMENT
Must support:
- list all leads
- search/filter leads
- view detailed lead profile
- status system:
  - New
  - Contacted
  - Qualified
  - In Progress
  - Converted
  - Closed
- assign notes
- assign owner/staff member
- export CSV
- optional tags
- lead source field

3. CONTACT REQUEST MANAGEMENT
- view all contact requests
- mark as read/unread
- assign status
- add internal notes
- delete/archive

4. APPOINTMENT / CONSULTATION REQUEST MANAGEMENT
- list appointments
- approve / pending / cancelled statuses
- store preferred date/time
- notes field
- client details
- optional calendar-ready structure

5. DESTINATIONS MANAGEMENT
Admins can:
- create/edit/delete destination pages
- manage hero content
- manage destination descriptions
- manage key opportunities
- manage related FAQs
- manage related testimonials

6. SERVICES MANAGEMENT
Admins can:
- create/edit/delete services
- manage service icons/images
- update descriptions
- define CTA text
- reorder services

7. FAQ MANAGEMENT
Admins can:
- create/edit/delete FAQs
- assign categories
- assign destination
- publish/unpublish

8. TESTIMONIALS MANAGEMENT
Admins can:
- create/edit/delete testimonials
- upload client image
- set destination category
- set featured status
- publish/unpublish

9. SUCCESS STORIES MANAGEMENT
Admins can:
- create/edit/delete stories
- attach images
- assign destination
- write summary/results
- publish/unpublish

10. PAGES / CMS CONTENT MANAGEMENT
Admins can manage:
- homepage content blocks
- about page content
- CTA sections
- footer info
- social links
- contact details
- SEO metadata

11. MEDIA MANAGEMENT
- image upload
- image preview
- delete media
- reuse in content blocks

12. USER MANAGEMENT
- manage admin users
- roles/permissions
- reset password flow (basic)

13. SETTINGS
- site name
- logo upload
- favicon
- contact info
- social links
- WhatsApp number
- office address
- SEO defaults
- analytics script placeholders

==================================================
TECHNICAL EXPECTATIONS
==================================================

Choose a modern, maintainable architecture.

Preferred stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- NextAuth or secure custom auth
- Zod for validation
- React Hook Form
- Framer Motion for subtle animations

If you believe another stack is better, explain why first, but default to the above stack.

Must include:
- clean folder architecture
- reusable components
- proper server/client separation
- secure authentication for admin
- protected admin routes
- form validation on client and server
- accessible UI
- responsive layouts
- maintainable code
- production-ready conventions

==================================================
DESIGN SYSTEM REQUIREMENTS
==================================================

Visual style must feel premium, trustworthy, modern, and international.

Color palette:
- Navy Blue: #0A2540
- Gold: #C9A227
- White: #FFFFFF
- Light gray backgrounds
- subtle accent colors if needed

Typography:
- clean sans-serif
- elegant headings
- readable body text
- strong hierarchy

UI direction:
- premium consultancy + fintech clarity
- modern cards
- large hero
- generous whitespace
- elegant iconography
- subtle motion
- rounded corners
- soft shadow system
- polished forms
- trust-building visual composition

The site must feel:
- credible
- high-end
- conversion-focused
- globally oriented
- mobile-first

==================================================
PUBLIC WEBSITE UX REQUIREMENTS
==================================================

- sticky header
- floating WhatsApp button
- clear CTA repetition
- highly visible lead forms
- mobile-first responsiveness
- smooth scroll and transitions
- polished hover states
- strong above-the-fold message
- trust-first structure
- easy navigation

Suggested main navigation:
- Accueil
- Destinations
- Services
- À propos
- Témoignages
- FAQ
- Contact

Admin navigation should be separate and protected.

==================================================
DATA MODEL EXPECTATIONS
==================================================

Create proper data models/entities for at least:
- User
- Role
- Lead
- ContactRequest
- AppointmentRequest
- Destination
- Service
- FAQ
- Testimonial
- SuccessStory
- PageContent
- SiteSetting
- MediaAsset

Include:
- timestamps
- publication status where relevant
- slug fields where relevant
- SEO fields where relevant
- relational integrity

==================================================
SEO REQUIREMENTS
==================================================

Implement SEO foundations:
- dynamic metadata
- page titles
- meta descriptions
- OG tags
- structured heading hierarchy
- clean URLs
- sitemap-ready structure
- robots-ready
- schema-ready if possible

The content should be optimized for relevant searches around:
- immigration agency in Lomé
- immigration to Canada from Togo
- immigration to USA from Togo
- Europe visa support from Togo
- study abroad consulting in Lomé

==================================================
SECURITY REQUIREMENTS
==================================================

- secure authentication
- route protection
- input validation
- sanitization
- CSRF-aware architecture where relevant
- secure password handling
- admin-only actions protected
- basic audit-friendly patterns

==================================================
DELIVERABLES
==================================================

I want you to produce the project in a structured way.

Step 1:
Summarize the architecture you will build.

Step 2:
Define the folder structure.

Step 3:
Define the Prisma schema / database models.

Step 4:
Build the UI system and shared components.

Step 5:
Build the public pages.

Step 6:
Build the admin dashboard.

Step 7:
Wire all forms and CRUD flows.

Step 8:
Add seed/demo content for VisaCore Solutions.

Step 9:
Add setup instructions and environment variables.

Step 10:
Provide a final review of missing enhancements and next steps.

==================================================
CONTENT SEED REQUIREMENTS
==================================================

Use realistic French content for the public website.

Include content examples such as:

Hero title:
“Votre avenir à l’international commence ici”

Hero subtitle:
“Experts en immigration vers le Canada, les États-Unis et l’Europe”

Why choose us bullets:
- Expertise internationale
- Accompagnement complet
- Transparence totale
- Suivi personnalisé
- Présence locale à Lomé

Process steps:
1. Analyse du profil
2. Stratégie personnalisée
3. Préparation du dossier
4. Soumission officielle
5. Suivi jusqu’à obtention

Destination cards:
- Canada
- États-Unis
- Europe

Services:
- Études à l’étranger
- Permis de travail
- Immigration permanente
- Visa visiteur
- Montage de dossier complet
- Consultation personnalisée

Lead capture CTA:
“Obtenez votre évaluation gratuite en 24h”

Final CTA:
“Faites le premier pas vers votre nouvelle vie”

==================================================
IMPLEMENTATION QUALITY BAR
==================================================

Do not generate a toy project.
Do not generate a generic landing page.
Do not oversimplify the admin dashboard.

I want:
- a serious application structure
- scalable code
- premium visual quality
- production-minded architecture
- realistic admin workflows
- reusable patterns
- clean forms
- excellent UX

When making design decisions, prioritize:
1. credibility
2. conversion
3. maintainability
4. responsiveness
5. admin efficiency

If something is ambiguous, choose the most premium, scalable, and conversion-oriented option.

Start by:
1. presenting the implementation plan
2. presenting the folder structure
3. generating the core app foundation
4. then proceed module by module