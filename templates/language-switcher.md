# Language Switcher Template

## Approach
- Single-page with `lang` parameter
- Cookie-based preference persistence
- Norwegian (no) by default, English (en) optional

## Implementation
1. Add language toggle to header (🇳🇴 / 🇬🇧)
2. Store preference in `lang` cookie (24h)
3. Default to Norwegian if no preference set
4. All pages accept `?lang=en` or `?lang=no`

## Pages to Update
- `/index.html`
- `/solution-*.html` (all 3 Norwegian pages)
- `/pricing.html`
- `/resources.html`
- `/contact.html`
