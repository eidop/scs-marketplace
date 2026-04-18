# ROI Spreadsheet — Google Sheets Specification

## Setup

1. Opprett et nytt Google Sheets-dokument: "SCS ROI Kalkulator — [KUNDENAVN]"
2. Opprett 3 ark: Input, Pakker, Resultater

---

## Ark 1: Input

| Celle | Felt | Format | Standardverdi |
|-------|------|--------|----------------|
| A1 | **Input-data** | Bold header | |
| A2 | Bedriftsnavn | Tekst | [DIN BEDRIFT] |
| A3 | Antall ansatte | Heltall | 5 |
| A4 | Timepris (kr/t) | Tall | 500 |
| A5 | Manuelle timer/uke per person | Tall | 10 |
| A6 | Automasjonsgrad | Prosent | 70% |

---

## Ark 2: Pakker

| Celle | Pakke | Pris (kr) |
|-------|-------|-----------|
| A1 | **Pakke** | **Pris** |
| A2 | Starter | 25000 |
| A3 | Professional | 50000 |
| A4 | Enterprise | 80000 |

---

## Ark 3: Resultater

### Formler

**Timer bespart per måned:**
```
=Input!B3 * Input!B5 * Input!B6 * 4.33
```
Forklaring: Ansatte × Manuelle timer × Automasjonsgrad × Uker per måned

**Månedlig besparelse (kr):**
```
=Timer_bespart * Input!B4
```
Forklaring: Timer bespart × Timepris

**Årlig besparelse (kr):**
```
=Månedlig_besparelse * 12
```

**ROI per pakke (Starter eksempel):**
```
=(Årlig_besparelse - Pakker!B2) / Pakker!B2 * 100
```

**Tilbakebetalingsdager per pakke (Starter eksempel):**
```
=Pakker!B2 / (Månedlig_besparelse / 30)
```

### Eksempel med standardverdier

| Metrikk | Verdi |
|---------|-------|
| Timer bespart/mnd | 151.6 |
| Månedlig besparelse | kr 75 800 |
| Årlig besparelse | kr 909 600 |
| ROI Starter | 3 538% |
| ROI Professional | 1 719% |
| ROI Enterprise | 1 037% |
| Tilbakebetalingsdager Starter | 9.9 |
| Tilbakebetalingsdager Professional | 19.8 |
| Tilbakebetalingsdager Enterprise | 31.7 |

### Visualisering

Legg til en stolpediagram som viser:
- X-akse: Pakker (Starter, Professional, Enterprise)
- Y-akse: Tilbakebetalingsdager

Legg til en linjediagram som viser:
- X-akse: Måneder (1-12)
- Y-akse: Kumulativ besparelse vs. pakkepris