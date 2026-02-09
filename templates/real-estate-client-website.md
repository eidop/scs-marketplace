# Client Website Project: [Company Name]

**Project Name:** Real Estate Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Landing page + Property search + Contact form
**Scope:** Modern real estate site with automation for lead capture and notifications

---

## Design & UI
**Style:** Clean, modern, professional
**Color scheme:**
- Primary: [Client's brand color]
- Secondary: Dark grays for backgrounds
- Accent: Gold for CTAs
**Typography:** Sans-serif (Inter or similar)
**References:** [Zillow, Rightmove, local agency sites]

---

## Features
- [ ] Property listing search (filter by price, location, bedrooms)
- [ ] Property detail pages (photos, description, amenities)
- [ ] Visningskalender (viewing calendar integration)
- [ ] Contact form with field validation
- [ ] Mobile-responsive design
- [ ] Fast loading (optimized images)

---

## Automations (n8n Workflows)

**Form handling:**
- Contact form submission → n8n webhook → Database
- Field validation (email, phone required)
- Spam detection (CAPTCHA integration)

**Data sync:**
- New leads → [CRM/Notion] automatically
- Lead status updates → Client notification

**Notifications:**
- New inquiry → WhatsApp notification to agent
- New inquiry → Email notification to agency

**Calendar integration:**
- Booking form → Calendar sync (Google/Outlook)
- Confirmation email to client

---

## Timeline
- [ ] Day 1: Design review, approval of mockups
- [ ] Day 2-3: Build with Anders (frontend + n8n workflows)
- [ ] Day 4: Testing, QA, bug fixes
- [ ] Day 5: Launch, SEO setup, analytics integration

---

## Notes
- Must match client's brand guidelines (logo, colors)
- Privacy policy and terms required
- Analytics: GA4 integration
- Lead management: Client wants WhatsApp notifications (not email)

**Out of scope:**
- Property listing management (that's their system)
- Video background (too heavy)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
