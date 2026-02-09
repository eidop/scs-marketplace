# Real Estate Website Automation Test

**Test Date:** 2026-02-09
**Status:** Pending
**Tester:** Eido

---

## Test Scope
Test the n8n automation workflows for the Real Estate Client Website template.

---

## Test Cases

### 1. Contact Form Submission
**Expected:** Lead captured → CRM → WhatsApp notification

- [ ] Submit test form at `/real-estate-demo/contact`
- [ ] Check webhook received in n8n
- [ ] Verify lead added to CRM (Notion/HubSpot)
- [ ] Verify WhatsApp message sent to agent
- [ ] Verify email confirmation sent to lead

**Test Data:**
```
Name: Test Lead
Email: test@example.com
Phone: +4799999999
Property: Test Property #123
Message: This is a test inquiry
```

---

### 2. Viewing Calendar Booking
**Expected:** Slot selected → Calendar sync → Confirmation

- [ ] Navigate to `/real-estate-demo/viewings`
- [ ] Select available viewing slot
- [ ] Submit booking form
- [ ] Check calendar event created (Google/Outlook)
- [ ] Verify confirmation email sent
- [ ] Verify agent notification sent

**Test Data:**
```
Name: Test Viewer
Email: viewer@example.com
Phone: +4799999998
Preferred Date: [Select first available]
Property: Test Property #456
```

---

### 3. Duplicate Lead Detection
**Expected:** Same email → Flagged as duplicate → No duplicate CRM entry

- [ ] Submit contact form with email `duplicate@test.com`
- [ ] Submit again with same email
- [ ] Verify n8n checks for duplicates
- [ ] Verify lead marked as duplicate
- [ ] Verify no duplicate CRM entry

---

### 4. Lead Follow-up Sequence
**Expected:** No response after 24h → Automated follow-up email

- [ ] Submit contact form
- [ ] Wait 24h (or simulate)
- [ ] Check if follow-up email triggered
- [ ] Verify email content (personalized, adds value)

---

### 5. CRM Integration
**Expected:** Lead data → Structured CRM entry

- [ ] Submit contact form
- [ ] Check CRM entry created
- [ ] Verify fields mapped correctly:
  - Name → Contact name
  - Email → Contact email
  - Phone → Contact phone
  - Property → Related property
  - Source → "Website - Real Estate"
- [ ] Verify lead status set to "New"

---

## Test Environment
- **URL:** https://real-estate-demo.pages.dev
- **n8n Instance:** https://n8n.scs-marketplace.pages.dev
- **CRM:** Notion (or configured CRM)
- **WhatsApp:** Business API (or simulated)

---

## Test Accounts
| Account | Purpose | Credentials |
|---------|---------|-------------|
| Test Lead | Contact form tests | Use test emails above |
| Agent Account | Receive notifications | +4799999997 |
| Admin | CRM access | Configured in .env |

---

## Automated Test Script
```bash
# Run automated tests
cd /workspace12345
npm test -- --test=real-estate-automation
```

---

## Known Issues
- [ ] None yet

---

## Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Contact Form | ⏳ Pending | - |
| Calendar Booking | ⏳ Pending | - |
| Duplicate Detection | ⏳ Pending | - |
| Follow-up Sequence | ⏳ Pending | - |
| CRM Integration | ⏳ Pending | - |

---

**Last Updated:** 2026-02-09
**Version:** 1.0
