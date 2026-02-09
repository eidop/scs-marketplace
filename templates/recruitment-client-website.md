# Client Website Project: [Company Name]

**Project Name:** Recruitment Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Job board + ATS-lite + Employer branding
**Scope:** Recruitment website with automated candidate management and job posting system

---

## Design & UI
**Style:** Professional, energetic, modern
**Color scheme:**
- Primary: Blue (trust) + Orange (energy)
- Secondary: Clean white/light gray backgrounds
- Accent: Green for "Apply" buttons
**Typography:** Bold sans-serif (Montserrat or similar) for headings, clean for body
**References:** [LinkedIn, Greenhouse, Lever]

---

## Features
- [ ] Job listing page with filters
- [ ] Job detail pages (description, requirements, benefits)
- [ ] Application form (online submission)
- [ ] Candidate portal (application status, documents)
- [ ] Employer branding page (company culture, values)
- [ ] Newsletter signup
- [ ] Mobile-responsive design

---

## Automations (n8n Workflows)

**Job posting handling:**
- New job posting → n8n → Database + Email to team
- Job expiry handling → Email notification before deadline
- Job posting analytics → Weekly email report

**Application handling:**
- New application → n8n → CRM + Email notification to recruiter
- Application status updates → Candidate portal + Email/SMS
- Document processing (resume parsing, skills extraction)

**Candidate management:**
- Resume upload → n8n → OCR + Skills extraction
- Candidate matching → Score based on job requirements
- Automated email sequences (follow-ups, interview invites)

**Job board integration:**
- Job postings → n8n → Greenhouse/Lever API (auto-sync)
- Job applications → n8n → Applicant tracking system

**Notifications:**
- New applications → Slack notification to recruiting team
- Interview scheduling → Calendar sync + Email confirmation
- Rejection handling → Automated email (optional)

---

## Timeline
- [ ] Day 1: Design review, approval of mockups
- [ ] Day 2-3: Build with Anders (frontend + n8n workflows)
- [ ] Day 4: Testing, QA, bug fixes
- [ ] Day 5: Launch, SEO setup, analytics integration

---

## Notes
- Resume parsing: Use existing APIs (Clearbit, ParseHR) for MVP
- ATS integration: Greenhouse/Lever/Papertrail (via API)
- Email templates: Professional, concise, ATS-friendly
- Mobile optimization: Must work well on mobile (70%+ traffic)
- SEO: Job titles as keywords (important for recruiting sites)

**Out of scope:**
- AI candidate matching (can add later as feature)
- Video interviews (too complex for MVP)
- Payment for job postings (free for now, paid tier later)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
