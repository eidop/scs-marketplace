# Monetization: Gratis Audit → Oppsett — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build all technical assets needed to launch the "Gratis Audit → Oppsett" monetization strategy for SCS Marketplace.

**Architecture:** Static HTML site (existing) gets a new audit booking page and updated NOK pricing. n8n workflow JSON files are created as demo assets. Sales materials (proposal template, email sequence, ROI spreadsheet) are created as standalone documents.

**Tech Stack:** HTML/CSS (existing site), n8n workflow JSON, Google Sheets for ROI calc, Calendly embed for booking

---

### Task 1: Create Demo-Ready Lead Capture Workflow

**Files:**
- Create: `workflows/lead-capture-engine.json`

**Step 1: Create n8n workflow JSON**

Create the workflow file with this structure: Webhook trigger → Parse data → Google Sheets append → Send welcome email (Gmail/SMTP) → Slack notification.

```json
{
  "name": "Lead Capture Engine — SCS Demo",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "new-lead",
        "responseMode": "responseNode"
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            { "name": "navn", "value": "={{$json.body.navn}}" },
            { "name": "epost", "value": "={{$json.body.epost}}" },
            { "name": "telefon", "value": "={{$json.body.telefon}}" },
            { "name": "bedrift", "value": "={{$json.body.bedrift}}" }
          ]
        }
      },
      "name": "Parse Lead Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [470, 300]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "YOUR_GOOGLE_SHEET_ID",
        "sheetName": "Leads",
        "columns": {
          "mappingColumns": [
            { "column": "A", "value": "={{$json.navn}}" },
            { "column": "B", "value": "={{$json.epost}}" },
            { "column": "C", "value": "={{$json.telefon}}" },
            { "column": "D", "value": "={{$json.bedrift}}" },
            { "column": "E", "value": "={{$now.toISO()}}" }
          ]
        }
      },
      "name": "Save to Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [690, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "YOUR_CREDENTIAL_ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "fromEmail": "hei@simplycomplexsolutions.com",
        "toEmail": "={{$json.epost}}",
        "subject": "Takk for din interesse, {{$json.navn}}!",
        "body": "Hei {{$json.navn}},\n\nTakk for at du kontaktet oss. Vi vil komme tilbake til deg innen 24 timer.\n\nMed vennlig hilsen,\nSimply Complex Solutions",
        "options": { "sendReplyTo": "hei@simplycomplexsolutions.com" }
      },
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [910, 200],
      "credentials": {
        "smtp": {
          "id": "YOUR_SMTP_CREDENTIAL_ID",
          "name": "SMTP account"
        }
      }
    },
    {
      "parameters": {
        "channel": "#leads",
        "text": "🎯 Ny lead: {{$json.navn}} fra {{$json.bedrift}} ({{$json.epost}})"
      },
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [910, 400],
      "credentials": {
        "slackApi": {
          "id": "YOUR_SLACK_CREDENTIAL_ID",
          "name": "Slack account"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({ status: 'ok', message: 'Lead mottatt!' }) }}"
      },
      "name": "Respond to Client",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1130, 300]
    }
  ],
  "connections": {
    "Webhook Trigger": { "main": [[{ "node": "Parse Lead Data", "type": "main", "index": 0 }]] },
    "Parse Lead Data": { "main": [[{ "node": "Save to Google Sheets", "type": "main", "index": 0 }]] },
    "Save to Google Sheets": { "main": [[{ "node": "Send Welcome Email", "type": "main", "index": 0 }, { "node": "Slack Notification", "type": "main", "index": 0 }]] },
    "Send Welcome Email": { "main": [[{ "node": "Respond to Client", "type": "main", "index": 0 }]] },
    "Slack Notification": { "main": [[{ "node": "Respond to Client", "type": "main", "index": 0 }]] }
  }
}
```

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add workflows/lead-capture-engine.json
git commit -m "feat: add lead capture engine n8n workflow demo"
```

---

### Task 2: Create Demo-Ready Recruitment Workflow

**Files:**
- Create: `workflows/recruitment-flow.json`

**Step 1: Create n8n workflow JSON**

```json
{
  "name": "Recruitment Flow — SCS Demo",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "new-application",
        "responseMode": "responseNode"
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            { "name": "kandidat_navn", "value": "={{$json.body.navn}}" },
            { "name": "kandidat_epost", "value": "={{$json.body.epost}}" },
            { "name": "stilling", "value": "={{$json.body.stilling}}" },
            { "name": "erfaring_ar", "value": "={{$json.body.erfaring}}" },
            { "name": "kompentanse", "value": "={{$json.body.kompetanse}}" }
          ]
        }
      },
      "name": "Parse Application",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [470, 300]
    },
    {
      "parameters": {
        "functionCode": "const exp = parseInt($input.item.json.erfaring_ar) || 0;\nconst skills = ($input.item.json.kompentanse || '').toLowerCase();\nlet score = 0;\nif (exp >= 5) score += 40;\nelse if (exp >= 3) score += 25;\nelse if (exp >= 1) score += 10;\nif (skills.includes('ledelse') || skills.includes('management')) score += 20;\nif (skills.includes('n8n') || skills.includes('automasjon')) score += 15;\nif (skills.includes('selger') || skills.includes('sales')) score += 15;\nif (skills.includes('b2b')) score += 10;\nconst verdict = score >= 60 ? 'kvalifisert' : score >= 35 ? 'vurderes' : 'avslag';\nreturn [{ json: { ...$input.item.json, score, verdict } }];"
      },
      "name": "Score Candidate",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [690, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.verdict}}",
              "operation": "notEquals",
              "value2": "avslag"
            }
          ]
        }
      },
      "name": "Filter Qualified",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [910, 300]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "YOUR_GOOGLE_SHEET_ID",
        "sheetName": "Soknader",
        "columns": {
          "mappingColumns": [
            { "column": "A", "value": "={{$json.kandidat_navn}}" },
            { "column": "B", "value": "={{$json.kandidat_epost}}" },
            { "column": "C", "value": "={{$json.stilling}}" },
            { "column": "D", "value": "={{$json.score}}" },
            { "column": "E", "value": "={{$json.verdict}}" },
            { "column": "F", "value": "={{$now.toISO()}}" }
          ]
        }
      },
      "name": "Save to Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [1130, 200],
      "credentials": {
        "googleSheetsOAuth2Api": { "id": "YOUR_CREDENTIAL_ID", "name": "Google Sheets" }
      }
    },
    {
      "parameters": {
        "fromEmail": "karriere@simplycomplexsolutions.com",
        "toEmail": "={{$json.kandidat_epost}}",
        "subject": "Søknad mottatt — {{$json.stilling}}",
        "body": "Hei {{$json.kandidat_navn}},\n\nTakk for din søknad som {{$json.stilling}}.\nVi vil kontakte deg innen 3 virkedager med en oppdatering.\n\nVennlig hilsen,\nTeamet"
      },
      "name": "Send Confirmation Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1350, 200],
      "credentials": {
        "smtp": { "id": "YOUR_SMTP_CREDENTIAL_ID", "name": "SMTP" }
      }
    },
    {
      "parameters": {
        "channel": "#rekruttering",
        "text": "📋 Ny søker: {{$json.kandidat_navn}} → {{$json.stilling}} (Score: {{$json.score}}, {{$json.verdict}})"
      },
      "name": "Slack Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1350, 350],
      "credentials": {
        "slackApi": { "id": "YOUR_SLACK_CREDENTIAL_ID", "name": "Slack" }
      }
    }
  ],
  "connections": {
    "Webhook Trigger": { "main": [[{ "node": "Parse Application", "type": "main", "index": 0 }]] },
    "Parse Application": { "main": [[{ "node": "Score Candidate", "type": "main", "index": 0 }]] },
    "Score Candidate": { "main": [[{ "node": "Filter Qualified", "type": "main", "index": 0 }]] },
    "Filter Qualified": { "main": [[{ "node": "Save to Sheets", "type": "main", "index": 0 }]] },
    "Save to Sheets": { "main": [[{ "node": "Send Confirmation Email", "type": "main", "index": 0 }, { "node": "Slack Alert", "type": "main", "index": 0 }]] }
  }
}
```

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add workflows/recruitment-flow.json
git commit -m "feat: add recruitment flow n8n workflow demo"
```

---

### Task 3: Create Demo-Ready Support Automation Workflow

**Files:**
- Create: `workflows/support-automation.json`

**Step 1: Create n8n workflow JSON**

```json
{
  "name": "Support Automation — SCS Demo",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "support-ticket",
        "responseMode": "responseNode"
      },
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            { "name": "avsender", "value": "={{$json.body.avsender}}" },
            { "name": "epost", "value": "={{$json.body.epost}}" },
            { "name": "emne", "value": "={{$json.body.emne}}" },
            { "name": "melding", "value": "={{$json.body.melding}}" }
          ]
        }
      },
      "name": "Parse Ticket",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [470, 300]
    },
    {
      "parameters": {
        "functionCode": "const text = (($input.item.json.emne || '') + ' ' + ($input.item.json.melding || '')).toLowerCase();\nlet category = 'generell';\nlet priority = 'normal';\nif (text.includes('faktura') || text.includes('betaling') || text.includes('invoice')) { category = 'okonomi'; priority = 'hoy'; }\nelse if (text.includes('feil') || text.includes('bug') || text.includes('virker ikke') || text.includes('error')) { category = 'teknisk'; priority = 'hoy'; }\nelse if (text.includes('konto') || text.includes('login') || text.includes('passord')) { category = 'konto'; priority = 'normal'; }\nelse if (text.includes('avbestill') || text.includes('klage')) { category = 'kundeservice'; priority = 'hoy'; }\nreturn [{ json: { ...$input.item.json, category, priority } }];"
      },
      "name": "Categorize Ticket",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [690, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.priority}}",
              "operation": "equals",
              "value2": "hoy"
            }
          ]
        }
      },
      "name": "Check Priority",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [910, 300]
    },
    {
      "parameters": {
        "fromEmail": "support@simplycomplexsolutions.com",
        "toEmail": "={{$json.epost}}",
        "subject": "Autosvar: {{$json.emne}} [{{$json.category}}]",
        "body": "Hei,\n\nTakk for din henvendelse.\nVi har mottatt din melding og kategorisert den som {{$json.category}}.\n\nFor kunder med hoy prioritet: Vi svarer innen 4 timer.\nFor andre henvendelser: Innen 24 timer.\n\nDin sak er registrert.\n\nVennlig hilsen,\nSupportteamet"
      },
      "name": "Send Auto-Reply",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [1130, 200],
      "credentials": {
        "smtp": { "id": "YOUR_SMTP_CREDENTIAL_ID", "name": "SMTP" }
      }
    },
    {
      "parameters": {
        "channel": "#support-escalation",
        "text": "🔴 HOY PRIORITET: {{$json.avsender}} — {{$json.emne}} [{{$json.category}}]"
      },
      "name": "Escalate to Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1130, 400],
      "credentials": {
        "slackApi": { "id": "YOUR_SLACK_CREDENTIAL_ID", "name": "Slack" }
      }
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "YOUR_GOOGLE_SHEET_ID",
        "sheetName": "Tickets",
        "columns": {
          "mappingColumns": [
            { "column": "A", "value": "={{$json.avsender}}" },
            { "column": "B", "value": "={{$json.epost}}" },
            { "column": "C", "value": "={{$json.emne}}" },
            { "column": "D", "value": "={{$json.category}}" },
            { "column": "E", "value": "={{$json.priority}}" },
            { "column": "F", "value": "={{$now.toISO()}}" }
          ]
        }
      },
      "name": "Log Ticket",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [1350, 300],
      "credentials": {
        "googleSheetsOAuth2Api": { "id": "YOUR_CREDENTIAL_ID", "name": "Google Sheets" }
      }
    }
  ],
  "connections": {
    "Webhook Trigger": { "main": [[{ "node": "Parse Ticket", "type": "main", "index": 0 }]] },
    "Parse Ticket": { "main": [[{ "node": "Categorize Ticket", "type": "main", "index": 0 }]] },
    "Categorize Ticket": { "main": [[{ "node": "Check Priority", "type": "main", "index": 0 }]] },
    "Check Priority": {
      "main": [
        [{ "node": "Escalate to Slack", "type": "main", "index": 0 }],
        [{ "node": "Send Auto-Reply", "type": "main", "index": 0 }]
      ]
    },
    "Send Auto-Reply": { "main": [[{ "node": "Log Ticket", "type": "main", "index": 0 }]] },
    "Escalate to Slack": { "main": [[{ "node": "Log Ticket", "type": "main", "index": 0 }]] }
  }
}
```

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add workflows/support-automation.json
git commit -m "feat: add support automation n8n workflow demo"
```

---

### Task 4: Create Audit Booking Page

**Files:**
- Create: `audit.html`
- Modify: `css/styles.css` (append new section styles)

**Step 1: Create audit.html**

Create a Norwegian-language page with: hero section explaining the free audit, 3-step process (book → meet → get proposal), Calendly embed placeholder, and FAQ section. Match existing site design (dark theme, Inter font, indigo/purple gradient buttons).

Key sections:
- Hero: "Få en gratis 15-minutters automasjonsaudit" with CTA to Calendly
- Process: 3 cards — "Book møte" → "Vi kartlegger" → "Du får tilbud"
- What you get: bullet list of audit deliverables (process map, ROI estimate, recommendation)
- FAQ: 4-5 common questions (er det virkelig gratis? hva kreves? osv.)
- CTA: Calendly inline embed

**Step 2: Add audit page styles to css/styles.css**

Append styles for: `.audit-hero`, `.process-cards`, `.audit-faq`, `.calendly-container`. Use existing CSS variables and patterns from the site.

**Step 3: Add nav link**

In `audit.html`, include the standard nav from other pages. Add "Gratis Audit" link in the nav between "ROI Calculator" and "Get Started".

**Step 4: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add audit.html css/styles.css
git commit -m "feat: add audit booking page with Calendly integration"
```

---

### Task 5: Update Pricing Page to NOK Audit Packages

**Files:**
- Modify: `pricing-no.html`

**Step 1: Update pricing cards**

Replace the 3 existing pricing tiers (14.900/34.900/89.900 kr/år) with the new audit-based packages:

| Card | Old | New |
|------|-----|-----|
| Starter | kr 14 900 /år | kr 25 000 engangs |
| Professional | kr 34 900 /år | kr 50 000 engangs |
| Enterprise | kr 89 900 /år | kr 80 000 engangs |

Update `data-nok` attributes and displayed prices. Change "per år" labels to "engangsbeløp". Update included items to match design doc (1 workflow + doc, 2-3 workflows + integration + 14 days support, full package + 30 days + training).

**Step 2: Update CTAs**

Change pricing card CTAs from "Kontakt Oss" → "Book Gratis Audit" linking to `audit.html`.

**Step 3: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add pricing-no.html
git commit -m "feat: update NOK pricing to audit-based packages (25k/50k/80k)"
```

---

### Task 6: Add Testimonial Section to Homepage

**Files:**
- Modify: `index.html`

**Step 1: Add testimonial section**

Insert a new `<section id="testimonials">` before the footer. Structure:

```html
<section id="testimonials" class="testimonials-section">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">Kunderesultater</span>
            <h2>Hva våre kunder sier</h2>
        </div>
        <div class="testimonials-grid">
            <!-- Placeholder card 1 -->
            <div class="testimonial-card">
                <div class="testimonial-quote">"Beskrivelse av resultat"</div>
                <div class="testimonial-author">
                    <strong>Navn</strong>
                    <span>Rolle, Bedrift</span>
                </div>
            </div>
            <!-- Repeat for 2-3 placeholder cards -->
        </div>
        <p class="testimonials-cta">
            Vil du være neste suksesshistorie?
            <a href="audit.html">Book en gratis audit →</a>
        </p>
    </div>
</section>
```

Style with dark card background, subtle border, matching site theme. Placeholder text: "Din suksesshistorie kan stå her — book en audit og la oss automatisere dine prosesser."

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add index.html
git commit -m "feat: add testimonial section to homepage"
```

---

### Task 7: Update ROI Calculator to NOK

**Files:**
- Modify: `roi-calculator.html`

**Step 1: Convert to NOK**

Change the calculator inputs and outputs:
- "Average Hourly Cost" label → "Timepris (kr/t)" with default 500
- Package dropdown → use NOK audit prices: Starter (25 000), Professional (50 000), Enterprise (80 000)
- Output labels: "Monthly Savings" → "Månedlig besparelse", "Annual Savings" → "Årlig besparelse"
- Output values: show "kr" prefix instead of "$"
- "Days to Payback" → "Dager til innført"

**Step 2: Update JavaScript**

Update the `calculate()` function to use NOK values. The 70% automation rate stays. CTA button changes from "Book a Demo" → "Book Gratis Audit" linking to `audit.html`.

**Step 3: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add roi-calculator.html
git commit -m "feat: update ROI calculator to NOK with audit-based pricing"
```

---

### Task 8: Create Post-Audit Email Sequence

**Files:**
- Create: `sales/emails/01-tilbud.md`
- Create: `sales/emails/02-oppfolging.md`
- Create: `sales/emails/03-siste-sjanse.md`

**Step 1: Write email 1 — Tilbud (sent same day as audit)**

Subject: "Ditt automasjonstilbud fra Simply Complex Solutions"

Content structure:
- Reference the audit meeting and the pain point discussed
- Present the 3 package options with NOK prices
- Include ROI calculation from the meeting
- Clear CTA: "Svar på denne e-posten for å komme i gang"
- Include: 14-dagers garanti, 30-dagers pengene-tilbake

**Step 2: Write email 2 — Oppfølging (sent 3 days after tilbud)**

Subject: "Har du spørsmål om tilbudet?"

Content: Short check-in. Remind them of the ROI numbers. Offer to answer questions. Include a "book 10-min chat" Calendly link.

**Step 3: Write email 3 — Siste sjanse (sent 7 days after tilbud)**

Subject: "Siste mulighet — tilbudet utløper om 48 timer"

Content: Urgency. Restate value. Note that pricing may change. Clear CTA.

**Step 4: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add sales/emails/
git commit -m "feat: add post-audit email sequence (3 emails)"
```

---

### Task 9: Create Proposal Template

**Files:**
- Create: `sales/proposal-template.md`

**Step 1: Write proposal template**

Markdown template with these sections:
1. Header: SCS logo, date, customer name
2. Oppsummering: 2-3 sentence summary of what was discussed
3. Din situasjon i dag: Pain points from audit
4. Vår løsning: Which package, what workflows, timeline
5. Pris: The 3 tiers with clear pricing table
6. Forventet ROI: Hours saved, NOK saved, payback period (fill from audit)
7. Garanti: 14-dagers garanti, 30-dagers pengene-tilbake
8. Neste steg: "Signer og returner" with contact info
9. Vedlegg: n8n workflow demo screenshots

Include placeholder fields: `[KUNDENAVN]`, `[DATO]`, `[PAKKE]`, `[TIMER_BESPART]`, `[KRONER_BESPART]`

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add sales/proposal-template.md
git commit -m "feat: add proposal template for audit follow-up"
```

---

### Task 10: Create ROI Spreadsheet Template

**Files:**
- Create: `sales/roi-spreadsheet.md` (instructions + formulas for Google Sheets)

**Step 1: Write spreadsheet specification**

Document the Google Sheets structure:

| Sheet | Purpose |
|-------|---------|
| Input | Company name, team size, hourly rate NOK, manual hours/week |
| Results | Hours saved, NOK saved/month, NOK saved/year, payback days |
| Packages | Starter/Professional/Enterprise pricing comparison |

Key formulas:
- Hours saved = Team size × Manual hours × 70% × 4.33
- Monthly savings = Hours saved × Hourly rate
- ROI = (Annual savings - Package price) / Package price × 100
- Payback = Package price / (Monthly savings / 30)

**Step 2: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add sales/roi-spreadsheet.md
git commit -m "feat: add ROI calculator spreadsheet specification"
```

---

### Task 11: Add Nav Links Across All Pages

**Files:**
- Modify: `index.html`, `pricing-no.html`, `roi-calculator.html`, `n8n-store.html`, `contact.html`, `case-studies.html`, `features.html`, `about.html`

**Step 1: Add "Gratis Audit" to nav**

In each page's `<nav>` section, add a link: `<a href="audit.html" class="nav-highlight">Gratis Audit</a>` before the "Get Started" button. Add CSS for `.nav-highlight` with the indigo gradient background and white text.

**Step 2: Update footer links**

Add "Gratis Audit" link to footer navigation under "Solutions" or "Company" section.

**Step 3: Commit**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
git add -u
git commit -m "feat: add Gratis Audit nav link across all pages"
```

---

### Task 12: Deploy and Verify

**Step 1: Run link checker**

```bash
cd /c/Users/Dennn/scs-marketplace-repo
node scripts/check-links.js
```

Expected: All links resolve, no 404s on new audit.html.

**Step 2: Deploy**

```bash
node scripts/deploy.js --message "Add audit booking page, NOK pricing, sales materials"
```

**Step 3: Verify live site**

Check https://scs-marketplace.pages.dev/ — confirm audit page loads, pricing updated, ROI calculator shows NOK.

**Step 4: Commit final state**

```bash
git push origin master
```