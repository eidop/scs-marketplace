# Client Website Project: [Company Name]

**Project Name:** Healthcare Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Patient portal + Booking system + Symptom checker
**Scope:** Healthcare website with automated patient management and notifications

---

## Design & UI
**Style:** Clean, reassuring, medical but modern
**Color scheme:**
- Primary: Medical blue
- Secondary: Soft white/light gray
- Accent: Calming green for positive indicators
**Typography:** Clean sans-serif (Inter or similar)
**References:** [Healthgrades, WebMD, local clinics]

---

## Features
- [ ] Patient registration/login
- [ ] Symptom checker (AI-powered)
- [ ] Appointment booking system
- [ ] Patient dashboard (appointments, medical history, messages)
- [ ] Document upload (prescriptions, test results)
- [ ] Doctor directory
- [ ] FAQ section
- [ ] Mobile-responsive design

---

## Automations (n8n Workflows)

**Appointment handling:**
- New booking → n8n → Calendar sync (Google/Outlook)
- Booking confirmation → SMS to patient
- Booking reminder (24 hours before) → SMS
- Booking reminder (1 hour before) → SMS
- Cancellation handling → Email notification

**Symptom checker:**
- Symptom input → n8n → AI analysis (RAG model)
- Potential conditions suggestions (with disclaimers)
- Recommendation to schedule appointment

**Document handling:**
- Document upload → n8n → Secure storage
- Document classification (labs, prescriptions, etc.)
- Upload notification → Patient + Doctor

**Patient management:**
- New patient registration → n8n → CRM
- Medical history updates → Database
- Follow-up reminders → Automated email/SMS

**Notifications:**
- Appointment changes → SMS notification
- Lab results ready → Email notification
- Treatment plan updates → Patient portal alert

---

## Timeline
- [ ] Day 1: Design review, approval of mockups
- [ ] Day 2-3: Build with Anders (frontend + n8n workflows)
- [ ] Day 4: Testing, QA, bug fixes
- [ ] Day 5: Launch, security audit, SEO setup

---

## Notes
- **HIPAA compliance** (if applicable) or local equivalent
- Document storage: Encrypted, access-controlled storage
- AI model: Fine-tuned medical assistant (use existing APIs for MVP)
- Security: SSL, 2FA authentication
- Privacy policy: Must be clearly visible

**Out of scope:**
- Actual medical diagnosis (disclaimer required)
- Video consultations (too complex for MVP)
- Billing/insurance integration (that's a separate system)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
