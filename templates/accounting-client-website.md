# Client Website Project: [Company Name]

**Project Name:** Accounting Firm Automation Site
**Client:** [Company Name]
**Date:** 2026-02-09

---

## Project Overview
**Type:** Client portal + Dashboard + Document management
**Scope:** Professional accounting firm site with client portal, document uploads, and automated reminders

---

## Design & UI
**Style:** Clean, trustworthy, professional
**Color scheme:**
- Primary: Navy blue or client's brand color
- Secondary: White/light gray backgrounds
- Accent: Green for financial/positive actions
**Typography:** Sans-serif (Inter, Roboto, or similar)
**References:** [FreshBooks, QuickBooks portals, local accounting firm sites]

---

## Features

### Public Pages
- [ ] Home page (services overview, value proposition, CTA)
- [ ] Services page (bookkeeping, tax, payroll, advisory)
- [ ] About us (team, credentials, experience)
- [ ] Pricing/transparent fees page
- [ ] Contact form with inquiry type selector
- [ ] GDPR/privacy policy page

### Client Portal (Authenticated)
- [ ] Dashboard (overview of financial health, upcoming deadlines)
- [ ] Invoice management (view, download, pay)
- [ ] Document center (upload receipts, contracts, statements)
- [ ] Tax summary dashboard (YTD taxes, estimates)
- [ ] Report library (financial statements, analysis)
- [ ] Deadline calendar (tax dates, payment due dates)
- [ ] Secure messaging with accountant

### Technical
- [ ] SSO or secure login system
- [ ] Mobile-responsive design
- [ ] Fast loading (optimized assets)
- [ ] SSL encryption (required for financial data)

---

## Automations (n8n Workflows)

### Document Processing
- **Upload flow:**
  - Client uploads receipt/invoice → n8n webhook → OCR extraction
  - Extracted data → Categorization (expense type, vendor)
  - Match against existing records → Flag duplicates
  - Store in structured database (Notion, Airtable, or dedicated DB)
- **Supported formats:** PDF, JPG, PNG, receipt photos

### Deadline Management
- **Tax calendar automation:**
  - Track key dates (VAT, income tax, corporate tax)
  - 14-day reminder → Email/SMS to client
  - 7-day reminder → Escalation notification to assigned accountant
  - Deadline passed → Internal alert, mark as overdue

### Invoice Reminders
- **Automated follow-up sequence:**
  - Day 0: Invoice sent (client-facing system)
  - Day 3: First reminder (n8n → email)
  - Day 10: Second reminder (n8n → email + SMS)
  - Day 21: Final notice (n8n → email + internal notification)
  - Day 30: Escalation to accountant (manual follow-up)

### Client Notifications
- **Welcome sequence:**
  - New client signup → n8n → Welcome email + onboarding checklist
  - Document request → n8n → Personalized email with upload link
  - Report ready → n8n → Email notification + download link

### Internal Workflows
- **New inquiry handling:**
  - Contact form → n8n → CRM (HubSpot/Pipedrive)
  - Lead categorization → Assign to relevant accountant
  - Auto-reply with calendly booking link
- **Task creation:**
  - Document received → n8n → Create task in project management
  - Assign to team member based on service type

---

## Integrations
- **CRM:** HubSpot, Pipedrive, or custom
- **Document storage:** Google Drive, Dropbox, or secure alternative
- **Accounting software:**对接 (Visma, Mamut, or client's existing system)
- **Calendar:** Google Calendar, Outlook for deadline tracking
- **Payments:** Stripe, Klarna for invoice payments
- **Notifications:** Email (SendGrid), SMS (Twilio), WhatsApp Business API
- **OCR:** OCR.space, Google Vision API, or n8n native

---

## Timeline
- [ ] Day 1: Discovery call, gather requirements, access credentials
- [ ] Day 2-3: Design mockups, client portal wireframes
- [ ] Day 4-5: Build (frontend + n8n automations)
- [ ] Day 6: Integration with client's accounting software
- [ ] Day 7: Testing, security review, client walkthrough
- [ ] Day 8: Launch, analytics setup, training session

---

## Pricing Tier Examples

### Essential (Starter)
**Scope:** Static site + contact form + document upload only
**Price:** 15–20k NOK
**Best for:** Solo accountants, small firms (1–5 clients)

### Professional (Growth)
**Scope:** Full portal + automations + CRM integration
**Price:** 25–40k NOK
**Best for:** Growing firms (5–20 clients)

### Enterprise (Scale)
**Scope:** Multi-client portal + full accounting integration + custom workflows
**Price:** 50–80k NOK
**Best for:** Established firms (20+ clients)

### Add-ons
- OCR receipt scanning: +5–10k NOK
- WhatsApp notifications: +3k NOK
- Custom report builder: +8–15k NOK
- Multi-language support: +5k NOK

---

## Notes
- Must include privacy policy and data processing agreement (GDPR compliance)
- All financial data must be encrypted at rest and in transit
- Client needs admin panel to manage user access
- Consider multi-factor authentication for portal access
- Compliance check: Ensure adherence to local accounting standards (Norwegian: Regnskapsloven)

**Out of scope:**
- Full accounting software development (integrate with existing)
- Tax filing directly (advisory and preparation only)
- Payroll processing system (integrate with Visma/Mamut)

**Build owner:** Anders
**Approval:** [Eido signature]

**Review before sending to client.**
