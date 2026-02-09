# Client Website Project: [Company Name]

**Project Name:** Accounting Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Client portal + Document upload + Dashboard
**Scope:** Accounting website with automated document handling and deadline tracking

---

## Design & UI
**Style:** Professional, trustworthy, clean
**Color scheme:**
- Primary: Navy blue
- Secondary: Light gray backgrounds
- Accent: Green for positive indicators
**Typography:** Professional serif (Playfair Display) for headings, clean sans-serif (Inter) for body
**References:** [QuickBooks, Xero, local accounting firms]

---

## Features
- [ ] Client login portal
- [ ] Document upload (receipts, contracts, invoices)
- [ ] Document dashboard (uploaded files, processing status)
- [ ] Tax summary dashboard (visual overview)
- [ ] Upcoming deadlines calendar
- [ ] Invoice viewer (downloadable PDFs)
- [ ] Document sharing with accountant
- [ ] Mobile-responsive design

---

## Automations (n8n Workflows)

**Document handling:**
- Document upload → n8n → OCR processing → Database
- File classification (receipt vs invoice vs contract)
- Automatic naming & tagging

**Data sync:**
- Uploaded documents → Client folder (encrypted)
- Sync with accounting software (Xero/NetSuite via API)

**Notifications:**
- Document processed → Email notification to client
- Document ready for review → Notification to accountant
- Tax deadline approaching (30 days) → Reminder email
- Quarterly tax deadline → WhatsApp reminder

**Invoice management:**
- Invoice upload → n8n → Database
- Invoice status tracking (paid/pending/overdue)
- Automatic invoice reminders (n8n → Email/SMS)

**Calendar integration:**
- Deadline reminders → Calendar events
- Quarterly filings → Recurring calendar entries

---

## Timeline
- [ ] Day 1: Design review, approval of mockups
- [ ] Day 2-3: Build with Anders (frontend + n8n workflows)
- [ ] Day 4: Testing, QA, bug fixes
- [ ] Day 5: Launch, client training, SEO setup

---

## Notes
- Must prioritize security (client documents are sensitive)
- Document storage: encrypted cloud storage (AWS S3/Backblaze)
- OCR provider: Azure Computer Vision or Google Vision API
- Client training: Video walkthrough of upload process
- Compliance: GDPR-compliant data handling

**Out of scope:**
- Actual accounting/bookkeeping (that's their internal process)
- Integration with external accounting software (just file storage)
- Tax calculation logic (they handle this)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
