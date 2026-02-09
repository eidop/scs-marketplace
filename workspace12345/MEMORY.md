# Long-Term Memory – Simply Complex Solutions

_This file is shared across all workspaces. Add important decisions, preferences, and lessons learned here._

---

## Project Overview

**Name:** Simply Complex Solutions (SCS)
**Business Model:** B2B automation templates (n8n)
**Revenue Model:** 3 tiers ($247, $597, $1,497) via Gumroad
**Status:** Launch ready (31 pages, live at https://scs-marketplace.pages.dev/)
**GitHub:** https://github.com/eidop/scs-marketplace

---

## Live Site

**URL:** https://scs-marketplace.pages.dev/
**Status:** ✅ Launch ready
**Key Pages:**
- `/client-dashboard.html` - Analytics demo
- `/roi-calculator.html` - Interactive savings calculator
- `/lead.html` - Lead capture → Gumroad redirect
- `/resources.html` - 12 free downloads
- `/solution-megling.html` - Norwegian real estate landing page
- `/solution-investering.html` - Norwegian investment landing page
- `/solution-kundeservice.html` - Norwegian customer service landing page

**Cloudflare:**
- Account: dennnwood@gmail.com
- Account ID: e576148798d3edb601a8858facd86324

**To Activate:**
- GA4: Replace `GA_MEASUREMENT_ID` in index.html
- Intercom: Replace `INTERCOM_APP_ID` in index.html

---

## Key Pages

- `/client-dashboard.html` - Analytics demo (dark/light, charts, filters)
- `/roi-calculator.html` - Interactive savings calculator
- `/lead.html` - Lead capture → Gumroad redirect
- `/resources.html` - 12 free downloads

---

## Next Steps

1. **Drive traffic** (Product Hunt, Reddit, Twitter)
2. **Set up email capture**
3. **Test Gumroad checkout flow**
4. **Add more verticals** (Accounting, Healthcare, Recruitment)

---

## Identity

**Name:** Eido
**Handle:** @eidoeit (Telegram)
**Timezone:** Europe/Oslo (GMT+1)

**Work Style:**
- Prefers autonomous execution
- Wants launch-ready, not half-finished
- Values efficiency
- Likes clean, direct communication

**Preferences:**
- Dark mode UIs
- Compact, functional designs
- Wants memory system to be smart

**Pet Peeves:**
- Cluttered memory with implementation details
- Having to repeat context
- Unnecessary confirmations

**Current Projects:**
- Simply Complex Solutions — B2B automation templates business

---

## Automation Website Services (Client Websites)

**Strategy:** Build pretty, functional websites with n8n automations.

**Workflow:**
1. Client asks → Discord `#client-websites` thread
2. Fill in template (features, automations, timeline)
3. Anders' bot builds → You approve → Deploy

**Value Add:**
- Dynamic content (not hardcoded HTML)
- Automations built in (forms → n8n → CRM/email)
- Real-time updates
- No backend dev needed

**Templates Created:**
- `templates/client-website-template.md` (general)
- `templates/real-estate-client-website.md` (example)
- `templates/automation-website-verticals.md` (catalog)
- `templates/verticals-complete.md` (5 verticals)
- `templates/discord-client-websites-setup.md` (workflow)

**Verticals:**
1. Real Estate (Eiendomsmegler)
2. Investment Firms (Investering)
3. Customer Service (Kundeservice)
4. Accounting (Regnskap)
5. Healthcare (Helse)
6. Recruitment (Rekruttering)

**Pricing:**
- Basic: 10–15k NOK
- Standard: 20–40k NOK
- Premium: 50–100k NOK
- Maintenance: 15% of project cost/year

---

## Vault & Secrets Management

**System:** Automated categorized vault system
**Location:** `secrets.json` (workspace)
**Categories:**
- `models` (Ollama)
- `apis` (OpenRouter, etc.)
- `apps` (Discord, Slack)
- `services` (Cloudflare, n8n, GitHub)
- `secrets` (misc)

**Automation:**
- `vault.js` – Categorized keys
- `auto-rotate.js` – Key rotation
- `load-vault.js` – Auto-load on session start

**Security:**
- Never commit `secrets.json` to Git
- Rotate keys regularly
- Keep vault in workspace, not on public repo

---

## Team

**Eido:** Owner, client relations, approvals
**Anders:** Builds sites + automations, technical details

**Workflow:**
- Anders gets Discord access to `#client-websites` only
- You approve all builds before client sees anything
- Threads per client project

---

## Tools & Skills

**n8n:** Core automation tool
**Ollama:** Local LLMs (fine-tuning, offline usage)
**OpenRouter:** API keys for various models
**GitHub:** Source control
**Cloudflare Pages:** Hosting

**Skills to Learn:**
1. Automation basics (n8n workflows)
2. Webhooks (apps talking)
3. REST APIs (get/set data)
4. Push vs. Pull notifications
5. Security (never expose secrets)
6. Form handling & validation
7. Testing workflows
8. Clear templates

---

## Daily Checklist

**Token Usage Monitor:**
- ADVANCED SYSTEM ACTIVE: Checks every 5 minutes via cron
- THRESHOLD: 80-90% → Cooldown to 10%
- ACTION: Automatic cooldown and agent switching

**Vault Maintenance:**
- Check vault: `node auto-rotate.js list`
- Rotate old keys: `node auto-rotate.js rotate <category>/<key> <newKey>`
- Review `secrets.json` for missing keys
- Ensure `.gitignore` excludes `secrets.json`

**Ollama & Models:**
- Check installed models: `ollama list`
- Update models if needed: `ollama pull <model-name>`
- Fine-tune models (scheduled): `ollama fine-tune ...`

**Client Websites:**
- Review Discord `#client-websites` threads
- Approve builds before sending to clients
- Update templates if needed

**Deployment:**
- Check `git status`
- Commit changes: `git add . && git commit -m "message"`
- Push changes: `git push`

---

## Website Card Improvements

**Support Automation Card (index.html):**
- Removed decorative emojis and non-essential symbols
- Reduced icon size and opacity (56px → 48px, 85%)
- Simplified feature list to 3 bullets (no borders, equal weight)
- Consolidated metadata into single line
- Reduced CTA dominance (cleaner, secondary)
- Removed checkmarks (`✓`)
- Made badge more subtle

**Result:** Calmer, more scannable, premium feel

---

## Key Lessons

1. **Always keep secrets local** – Never put API keys in public repos
2. **Automation is about workflows** – Not just tools, but how they connect
3. **Templates save time** – Create once, use many times
4. **Control the client relationship** – Approve everything before delivery
5. **Keep memory curated** – Only save what’s reusable

---

**Last updated:** 2026-02-09
**Version:** 1.0
**Status:** Active
