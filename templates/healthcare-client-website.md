# Client Website Project: [Company Name]

**Project Name:** Healthcare/Medical Practice Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Patient portal + Appointment booking + Health records
**Scope:** HIPAA/GDPR-compliant healthcare site with patient portal, booking system, and secure communications

---

## Design & UI
**Style:** Clean, trustworthy, calming, professional
**Color scheme:**
- Primary: Soft blue or teal (medical trust)
- Secondary: White/light gray backgrounds
- Accent: Green for positive actions, amber for alerts
**Typography:** Sans-serif, highly readable (Inter, Open Sans)
**References:** [Patient portals, local clinic websites, NHI equivalents]

---

## Features

### Public Pages
- [ ] Home page (services, emergency info, quick actions)
- [ ] Services page (treatments, specialties, procedures)
- [ ] About us (doctors, credentials, experience)
- [ ] Patient information/education library
- [ ] Location, hours, contact information
- [ ] Emergency contact banner (prominent)

### Patient Portal (Authenticated)
- [ ] Dashboard (appointments, recent activity, reminders)
- [ ] Appointment booking (calendar, slot selection, type selection)
- [ ] Appointment history (past visits, notes)
- [ ] Medical records access (lab results, prescriptions, visit summaries)
- [ ] Secure messaging with healthcare providers
- [ ] Document upload (insurance cards, referral forms)
- [ ] Prescription refill requests
- [ ] Symptom checker (triage questionnaire, AI-assisted)
- [ ] Billing/payments (view statements, pay online)

### Technical
- [ ] HIPAA/GDPR compliance (data encryption, access controls)
- [ ] SSO or secure login with 2FA option
- [ ] Mobile-responsive design
- [ ] Fast loading (optimized assets)
- [ ] SSL + security headers
- [ ] Audit logging (who accessed what, when)

---

## Automations (n8n Workflows)

### Appointment Management
**Booking flow:**
- Patient books slot → n8n webhook → Confirm email + calendar invite
- Reminder sequence:
  - 48 hours → Email reminder
  - 24 hours → SMS reminder
  - 2 hours → Final SMS/push reminder
- Cancellation → Open slot → Notify waitlist (if applicable)
- No-show tracking → Internal alert + reschedule prompt

### Patient Communications
**Welcome/onboarding:**
- New patient signup → n8n → Welcome email + intake form link
- Intake completed → Assign to doctor → Notification

**Follow-ups:**
- Post-visit → n8n → Satisfaction survey
- Survey completed → Flag negative responses for staff review
- Prescription ready → n8n → SMS/email notification

### Document Handling
**Secure upload flow:**
- Patient uploads document → n8n → Virus scan → Encrypted storage
- Upload notification → Assigned staff member
- Insurance verification → Auto-check (if API available)

### Clinical Workflows
**Lab results:**
- Results available → n8n → Notify patient portal
- Abnormal results → Flag for doctor review first
- Normal results → Auto-release with educational content

**Symptom checker triage:**
- Questionnaire submitted → n8n → AI assessment
- Urgent → Flag for immediate callback
- Non-urgent → Book appointment suggestion

### Internal Alerts
**High-priority notifications:**
- Appointment cancellation → Front desk alert
- Prescription refill request → Assigned doctor notification
- Document upload → Triaged to relevant staff
- Billing issue → Accounting notification

---

## Integrations
- **Calendar:** Google Calendar, Outlook, or medical-specific (Healthrive, etc.)
- **SMS:** Twilio, ClickSend, or local Norwegian SMS provider
- **Secure messaging:** Custom encrypted or compliant platform
- **Payment:** Stripe (PCI-compliant), Vipps (Norwegian)
- **Document storage:** Encrypted cloud storage (AWS, or local alternatives)
- **Lab systems:** API integration where available
- **CRM:** Custom patient management or integrate with existing

---

## Timeline
- [ ] Day 1: Discovery (compliance requirements, existing systems)
- [ ] Day 2-3: Design mockups (focus on accessibility, trust)
- [ ] Day 4-6: Build (portal + automations)
- [ ] Day 7: Security review, compliance check, penetration test (if required)
- [ ] Day 8: Staff training, patient onboarding flow
- [ ] Day 9: Soft launch (small patient group)
- [ ] Day 10: Full launch, analytics, monitoring

---

## Pricing Tier Examples

### Essential (Small Practice)
**Scope:** Static site + online booking + basic portal
**Price:** 25–35k NOK
**Best for:** Solo practitioners, small clinics (1–3 doctors)

### Professional (Growing)
**Scope:** Full portal + automations + SMS reminders
**Price:** 40–60k NOK
**Best for:** Mid-sized clinics (3–10 doctors)

### Enterprise (Large)
**Scope:** Multi-location + full EHR integration + AI features
**Price:** 80–150k NOK
**Best for:** Hospital systems, large networks (10+ doctors)

### Add-ons
- AI symptom checker: +15–30k NOK
- Multi-language support: +8k NOK
- Video consultation integration: +20–40k NOK
- Patient app: +50–100k NOK
- Compliance audit: +10–20k NOK

---

## Notes
- **Critical:** Must comply with GDPR (Norwegian: Personvernloven) and potentially HIPAA
- Data processing agreement (DPA) required with all third-party services
- Retention policy for patient data (legal requirements)
- Right to access/delete compliance
- All communications must be logged for medical-legal purposes
- Regular security audits recommended (annual)
- Staff training on data handling is client's responsibility

**Out of scope:**
- Full EHR/EMR system (integrate with existing)
- Telemedicine video system (add-on)
- Insurance claim processing (integrate where possible)
- Prescription dispensing system (pharmacy integration only)

**Build owner:** Anders
**Approval:** [Eido signature]

**⚠️ Legal review recommended before deployment.**
