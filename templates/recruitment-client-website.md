# Client Website Project: [Company Name]

**Project Name:** Recruitment/Staffing Agency Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Job board + ATS portal + Employer branding
**Scope:** Recruitment agency site with job listings, application tracking, and automated candidate workflows

---

## Design & UI
**Style:** Professional, engaging, action-oriented
**Color scheme:**
- Primary: Blue (trust) or client's brand color
- Secondary: Clean white/gray backgrounds
- Accent: Orange/green for CTAs (apply buttons)
**Typography:** Sans-serif, modern (Inter, Poppins)
**References:** [Indeed, LinkedIn Jobs, local staffing agencies]

---

## Features

### Public Pages
- [ ] Home page (value prop, featured jobs,cta)
- [ ] Job board with search and filters
- [ ] Job detail pages (description, requirements, apply)
- [ ] About us (team, experience, industries served)
- [ ] Services page (permanent, temporary, executive search)
- [ ] Employer branding pages (for companies hiring)
- [ ] Contact form / recruiter inquiry

### Candidate Portal (Authenticated)
- [ ] Dashboard (applied jobs, status, upcoming interviews)
- [ ] Profile management (resume, skills, experience)
- [ ] Job search + bookmarking
- [ ] Application history with status tracking
- [ ] Interview scheduling (when invited)
- [ ] Document center (upload CV, cover letters, certificates)
- [ ] Job alerts (saved searches, email notifications)

### Client/Employer Portal (Authenticated)
- [ ] Job posting management
- [ ] Applicant tracking dashboard
- [ ] Candidate review + shortlist
- [ ] Interview scheduling + calendar sync
- [ ] Feedback collection
- [ ] Hiring pipeline visualization

### Technical
- [ ] ATS-lite functionality (tracking, status updates)
- [ ] Resume parsing (extract skills, experience)
- [ ] Mobile-responsive design
- [ ] Fast loading (optimized)
- [ ] SEO-optimized job pages

---

## Automations (n8n Workflows)

### Application Processing
**New application flow:**
- Candidate submits → n8n webhook → Resume parsed
- Extracted data → Candidate profile created
- Auto-response → Confirmation email to candidate
- Notification → Assigned recruiter
- Duplicate check → Flag if already in system

**Status updates:**
- Status changes → n8n → Candidate notification
- Rejection → Personalized email (keep relationship)
- Interview invite → Calendar invite + preparation materials
- Offer sent → Congratulatory email + next steps

### Candidate Sourcing
**Job alert system:**
- New job matching saved search → n8n → Email alert
- Daily/weekly digest → Summarized job matches
- Passive candidate outreach → Template sequences

**Social posting:**
- New job posted → n8n → Auto-post to LinkedIn
- Platform-specific formatting (LinkedIn, Indeed, Facebook)

### Interview Scheduling
**Calendar coordination:**
- Interview proposed → n8n → Find mutual availability
- Confirmation → Candidate + interviewer emails
- Reschedule → Auto-notify all parties
- Reminders → 24h before (candidate), 1h before (interviewer)

### Employer Workflows
**Client notifications:**
- New applicant → n8n → Client notification (email/Slack)
- Shortlist ready → Detailed candidate summaries
- Interview booked → Calendar invites all parties
- Position filled → Close job + notify unsuccessful

### Communication Sequences
**Candidate nurture:**
- Applied but rejected → Added to talent pool
- Newsletter → Monthly updates (opt-in)
- New relevant jobs → Personalized recommendations

---

## Integrations
- **Calendar:** Google Calendar, Outlook
- **Email:** SendGrid, or client's SMTP
- **LinkedIn:** API integration for posting
- **Job boards:** Indeed API, or manual posting templates
- **CRM:** HubSpot, Pipedrive, or custom ATS
- **Slack/Teams:** Internal notifications
- **Video:** Zoom, Teams integration for remote interviews
- **AI:** OpenAI for resume parsing, candidate matching

---

## Timeline
- [ ] Day 1: Discovery (current process, pain points, integrations)
- [ ] Day 2-3: Design (portal mockups, job board layout)
- [ ] Day 4-6: Build (frontend + ATS portal + n8n workflows)
- [ ] Day 7: Resume parser setup, AI matching configuration
- [ ] Day 8: Testing (application flow, automation triggers)
- [ ] Day 9: Staff training, sample data upload
- [ ] Day 10: Launch, analytics, monitoring

---

## Pricing Tier Examples

### Essential (Small Agency)
**Scope:** Static site + job board + basic application form
**Price:** 15–25k NOK
**Best for:** Boutique agencies (1–5 recruiters)

### Professional (Growing)
**Scope:** Full ATS portal + candidate portal + automations
**Price:** 30–50k NOK
**Best for:** Mid-sized agencies (5–15 recruiters)

### Enterprise (Scale)
**Scope:** Multi-client portal + AI matching + full integration
**Price:** 60–100k NOK
**Best for:** Large agencies (15+ recruiters), RPO providers

### Add-ons
- AI resume parser: +8–15k NOK
- LinkedIn integration: +5–10k NOK
- Video interview platform: +20–40k NOK
- Multi-language: +5k NOK per language
- Custom integrations: Varies

---

## Notes
- GDPR compliance for candidate data (storage limits, consent)
- Data processing agreements with job boards
- Anti-discrimination compliance (EEA/Norwegian: Likestillingsloven)
- Accessibility requirements (WCAG 2.1)
- Retention policy for candidate data (legal requirements)
- Consent management for communications

**Out of scope:**
- Full enterprise ATS (integrate with existing like Bullhorn, Force)
- Background check services (integrate third-party)
- Payroll processing (separate system)
- Executive search premium (custom engagement)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
