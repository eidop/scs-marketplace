# Norwegian Translation Strategy

## Current State
- SCS site: English-only
- Target audience: Norwegian companies (based in Oslo) + global

## Goals
1. Easy Norwegian translation for Norwegians
2. User choice between EN/NO on every page
3. Generate leads from Norwegian market

---

## Phase 1: Basic Translation (Quick Win)

**Create Norwegian versions of key pages:**
- `solution-megling.html` → `solution-megling-no.html` (Real Estate)
- `solution-investering.html` → `solution-investering-no.html` (Investment)
- `solution-kundeservice.html` → `solution-kundeservice-no.html` (Customer Service)
- `index.html` → `index-no.html` (Home)

**Implementation:**
- Add language switcher in header (EN/NO)
- Use `?lang=no` or `?lang=en` in URLs
- Default to user’s browser language

---

## Phase 2: Full Site Translation

**Translate all pages to Norwegian:**
- `solution-sales.html` → `solution-sales-no.html`
- `solution-support.html` → `solution-support-no.html`
- `solution-hiring.html` → `solution-hiring-no.html`
- `pricing.html` → `pricing-no.html`
- `contact.html` → `contact-no.html`
- All solution pages (6 verticals)

**Time estimate:** 2–3 hours

---

## Phase 3: Automatic Translation (Optional)

**Use AI translation tools:**
- DeepL API (free tier for ~500k characters/month)
- Google Translate API
- OpenAI GPT-4 for context-aware translation

**Benefits:**
- Faster translations
- Consistent tone
- Easy to update

---

## Lead Generation in Norway

**Channels:**
1. **LinkedIn** – Norwegian B2B companies
2. **Cold outreach** – Norwegian SaaS/E-commerce
3. **SEO** – Norwegian search engines (Google.no)
4. **Partnerships** – Norwegian automation agencies

**Content strategy:**
- Norwegian case studies (Real Estate, Investment, Customer Service)
- Norwegian pricing (convert USD to NOK)
- Norwegian testimonials
- Norwegian blog posts

---

## Pricing in Norwegian

**Convert to NOK:**
- Starter: $247 → 2,470 NOK
- Professional: $597 → 5,970 NOK
- Enterprise: $1,497 → 14,970 NOK

**Pricing page:**
- Show both USD and NOK
- Highlight Norwegian companies get local pricing

---

## Technical Implementation

### Language Switcher
```html
<div class="lang-switcher">
  <a href="?lang=en" class="lang-btn active">🇺🇸 EN</a>
  <a href="?lang=no" class="lang-btn">🇳🇴 NO</a>
</div>
```

### Route Handling (Cloudflare Pages)
```
/solution-megling.html?lang=no → solution-megling-no.html
/solution-megling.html?lang=en → solution-megling.html
```

### Redirect Logic (Cloudflare Workers)
```javascript
const url = new URL(request.url);
const lang = url.searchParams.get('lang') || 'en';
const page = url.pathname;

if (lang === 'no') {
  const noPage = page.replace('.html', '-no.html');
  return Response.redirect(new URL(noPage, request.url), 301);
}
```

---

## Lead Capture in Norway

**Forms:**
- Add Norwegian language to all forms
- Include ZIP code (NORGE)
- Call-to-action in Norwegian

**Examples:**
- “Få et tilbud” (Get a quote)
- “Start din automatisering” (Start your automation)
- “Kontakt oss” (Contact us)

---

## SEO in Norway

**Google.no:**
- Norwegian meta titles and descriptions
- H1/H2 in Norwegian
- Local keywords (eiendomsmegler, investering, kundeservice)
- Local links (Oslo, Norway)

**Example title:**
- EN: “Real Estate Automation | Simply Complex Solutions”
- NO: “Eiendomsmegling Automatisering | Simply Complex Solutions”

---

## Next Steps

1. **Translate 3 key pages** (Real Estate, Investment, Customer Service) this week
2. **Add language switcher** to header
3. **Set up Norwegian lead forms**
4. **Start outreach to Norwegian companies** on LinkedIn

---

**Last updated:** 2026-02-09
**Status:** Active
