# 10 Fakta for Automatiseringsjobben

## 1. Hva er automatisering egentlig?
- **Automatisering** = software som kjører på egenhånd uten at du må klikke på knapper
- Eksempel: En form som automatisk sender e-post til en liste når noen fyller den ut
- Målet: Spare tid og redusere feil

## 2. Hva gjør n8n?
- n8n er et verktøy for å koble sammen apper og trigge handlinger
- Tenk på det som en "smart bryter": når X skjer, kjører n8n Y
- Det kan ta data fra én app og sende det til en annen automatisk

## 3. Workflows består av trinn
- Et workflow er en rekke trinn som utføres i rekkefølge
- Eksempel: Motta form → Tjekk om felt er fylt → Lagre i database → Send e-post
- Hvert trinn kan ta input fra forrige trinn

## 4. HTTP Request (Webhooks)
- Webhooks er en måte å få data til et system på
- Når noe skjer (f.eks. ny lead), sender systemet data til n8n
- n8n kan sende tilbake svar eller trigge neste trinn

## 5. Hva er dataformater?
- JSON er den vanligste formatet for datautveksling
- Ser ut som: `{"navn": "Ola", "e-post": "ola@noa.no"}`
- n8n kan parse og transformere JSON-dato

## 6. APIs: "Språket" mellom programmer
- API (Application Programming Interface) lar apper snakke sammen
- n8n bruker API-er for å kjøre handlinger i andre apper
- Mange apper (Slack, Google, etc.) har API-er

## 7. Løkker og betingelser
- **Løkker**: Gjenta et trinn flere ganger (f.eks. for hver person i en liste)
- **Betingelser**: Velg hvilket trinn som skal kjøres basert på regler
  - Eksempel: Hvis e-post er tom → Send feilmelding, ellers → Fortsett

## 8. Feilsøking og logging
- Alt som går galt vises i n8n sin logg
- Tegn alltid ut workflow før du kjører det
- Test hver steg for seg selv først

## 9. Test av workflows
- Test ett steg av gangen
- Tjekk n8n-logger for feilmeldinger
- Test hele flowet minst én gang før levering

## 10. Dokumentasjon
- Skriv ned hva hver workflow gjør
- Noter hvilke apper som kobles sammen
- Lag oppskrifter for hvordan endre eller utvide systemet

---

### Viktige nøkkelord:
- **Workflow** - Hele prosessen fra start til slutt
- **Trigger** - Noe som starter automatikken
- **Webhook** - En måte å få data inn i n8n
- **API** - Språket mellom programmer
- **JSON** - Format for datautveksling
- **Testing** - Viktigst trinnet før levering

**Tips:** Lag en sjekkliste for hver oppgave for å sikre at du ikke glemmer noe.
