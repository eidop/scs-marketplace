# Twilio AI Voice Support - Oppsett Guide

Dette er en komplette guide til å sette opp en AI Voice Support system med Twilio og n8n.

## 📋 Oversikt

Dette systemet lar deg:
- ✅ Motta telefonkall automatisk via Twilio
- ✅ Transkrivere samtaler i sanntid med OpenAI Whisper
- ✅ La AI svare på kunder
- ✅ Logge alle samtaler i Notion
- ✅ Sende oppsummering til kunden

## ⏱️ Tidsforbruk

**Totalt oppsett:** 30-60 minutter
- Twilio-konto: 5 min
- n8n webhook: 5 min
- N8n workflow: 10-15 min
- Testing: 10-15 min

## 🛠️ Forutsetninger

Før du starter, må du ha:

1. **Twilio-konto** (gratis test-versjon)
   - Registrer deg: https://www.twilio.com/
   - Få en "Phone Number" (som må være tilgjengelig i ditt land)

2. **n8n-instans**
   - Lokalt: https://n8n.io/download/
   - Cloud: https://n8n.io/cloud/

3. **OpenAI API Key**
   - Registrer: https://platform.openai.com/
   - Kjør minst $5 for å få tilgang

4. **Notion-konto** (valgfritt, men anbefalt)
   - Registrer: https://www.notion.so/
   - Opprett en "Database" for å lagre samtaler

---

## 🚀 STEG A: Sett opp Twilio

### 1. Opprett Twilio-konto
1. Gå til https://www.twilio.com/
2. Registrer deg (gratis)
3. Verifiser telefonnummer

### 2. Få en Phone Number
1. Gå til "Phone Numbers" → "Buy a Number"
2. Velg et nummer som er tilgjengelig i ditt land
3. **Merk:** Test-nummer koster ca. $1/mnd

### 3. Konfigurer Webhook (TwiML)
1. Gå til nummer-oppsettet
2. Under "Voice & Fax" → "A call comes in"
3. Velg "HTTP Method" = POST
4. URL: `https://ditt-n8n-url/webhook/twilio-call`
5. **Krever SSL/TLS:** Hvis du kjører n8n lokalt, bruk ngrok:
   ```bash
   ngrok http 5678
   ```
   Kopier den genererte HTTPS URL-en

### 4. Test nummer
1. Ring nummeret ditt
2. Se om n8n webhook mottar data

---

## 🔄 STEG B: Sett opp n8n Webhook

### 1. Opprett Webhook i n8n
1. Åpne n8n
2. Ny workflow: "Add Node" → "Webhook"
3. Velg "Method": POST
4. URL: `/twilio-call`
5. **Important:** Gi webhooken en navn, f.eks. "Twilio Voice"

### 2. Koble Twilio til n8n
Fyll ut webhook URL-en:
```
https://din-n8n-url/webhook/twilio-call
```

---

## 🤖 STEG C: Opprett AI Nodes i n8n

### 1. Parse Twilio Data (Code Node)
Legg til en **Code Node** etter webhook:
- Kopier koden fra workflow JSON
- Sett opp variabler:
  ```javascript
  const formData = $input.all()[0].json;
  const twilioBody = formData.Body || formData.msg || 'Ingen tekst';
  return {
    json: {
      callSid: formData.CallSid,
      callerNumber: formData.From,
      calleeNumber: formData.To,
      text: twilioBody,
      timestamp: new Date().toISOString(),
      direction: 'incoming',
      status: 'started'
    }
  };
  ```

### 2. AI Analyse og Svar (HTTP Request Node)
Koble til OpenAI:

**Payload:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Du er en kundeservice-robot. Svare konisnt, professionelt og hjelpsomt. Transkripsjon: {{$json.text}}"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Headers:**
```
Authorization: Bearer DIN_OPENAI_API_KEY
Content-Type: application/json
```

### 3. Parse AI Response (Code Node)
Legg til Code Node for å hente AI-svaret:
```javascript
const aiResponse = $input.item.json.choices[0].message.content;
return {
  json: {
    ...$input.item.json,
    aiResponse: aiResponse,
    timestamp: new Date().toISOString(),
    status: 'ai_processed'
  }
};
```

### 4. Save to Notion (Notion Node)
Koble til Notion database:
- Database ID: Din Notion Database ID
- Opprett database først med felter:
  - **Samtale** (Title)
  - **Kunde** (Text)
  - **Transkripsjon** (Text)
  - **AI Svar** (Text)
  - **Tidspunkt** (Date)

---

## 📞 STEG D: Voice Webhook for Svartring

### 1. Opprett Voice Webhook i n8n
Legg til en ny **Webhook Node**:
- Method: POST
- URL: `/twilio-voice`
- Trigger: Manual (vi kaller denne manuelt via Twilio)

### 2. Lag TwiML XML-node
I Voice Webhook:
- Legg til **Function Node** som returnerer TwiML:
```javascript
return {
  json: {
    twiml: `<Response>
      <Say>${$json.aiResponse}</Say>
    </Response>`
  }
};
```

### 3. Sett opp Twilio Voice
1. I Twilio nummer-oppsett → "Voice Webhook URL"
2. Sett URL: `https://ditt-n8n-url/webhook/twilio-voice`
3. "Method": POST

---

## 🧪 STEG E: Testing

### Test 1: Basic Call Flow
1. Ring nummeret ditt
2. Si noe kort
3. Sjekk n8n:
   - Er webhook mottatt?
   - Er transkripsjonen lagret?
   - Hva svarer AI?

### Test 2: AI Svar
1. Still AI-et et spørsmål
2. Sjekk svaret på telefon
3. Noter: Er det naturlig?

### Test 3: Notion Integration
1. Gå til Notion database
2. Sjekk om samtalen ble lagret
3. Korrektur: Transkripsjon og AI-svar

---

## 📊 STEG F: Optimalisering

### 1. Sett opp Voice Activity Detection (VAD)
Twilio gir deg "Voice Activity Detection" - se om AI stopper når du stopper:

```javascript
// Code Node for VAD
return {
  json: {
    ...$input.item.json,
    isSpeaking: $json.speechDuration > 0.5
  }
};
```

### 2. Mulige oppgraderinger
- **Whisper API** for bedre transkripsjon
- **Claude** for mer naturlige svar
- **Google Cloud Speech** for lokal transkripsjon
- **WebRTC** for web-basert voice

---

## 🔧 STEG G: Deploy i Produksjon

### 1. HTTPS for n8n
- Lokalt: bruk ngrok (gratis)
- Cloud: kjør n8n.cloud
- VPS: kjør n8n med Let's Encrypt SSL

### 2. Test nummer
- Bruk Twilio-test-nummer ($1/mnd) for testing
- Kjøp nummer i ditt land for produksjon

### 3. Håndtering av timeouts
- Legg til timeout-handling i workflow
- Sjekk for at AI-svaret blir generert

---

## 💰 Kostnader

### Twilio
- **Test nummer:** ~$1/mnd
- **Produksjonsnummer:** ~$2-10/mnd (avhengig av land)
- **Call rates:** $0.005 per minutt (varies by country)
- **Free tier:** Første $15 inkludert

### OpenAI
- **GPT-4:** $0.03 per 1K tokens
- **GPT-3.5 Turbo:** $0.002 per 1K tokens
- **Whisper:** $0.006 per minutt

### Notion
- **Free tier:** Perfekt for oppstartsversjon
- **Plus:** $10/mnd (vil du vise dette til kunder?)

---

## 📚 Ressurser

### Offisielle dokumenter
- [Twilio Voice Documentation](https://www.twilio.com/docs/voice)
- [n8n Documentation](https://docs.n8n.io)
- [OpenAI API](https://platform.openai.com/docs)

### Eksempler
- [n8n + Twilio GitHub](https://github.com/n8n-io/n8n-examples)
- [Twilio AI Voice Blog](https://www.twilio.com/blog/ai-voice-support)

---

## ❓ FAQ

**Q: Hvor mye koster dette?**
A: Minimum: Twilio test nummer ($1/mnd) + OpenAI ($5 bonus). Første måned kan være ca. $10.

**Q: Hvordan håndterer jeg automatiske anrop?**
A: Bruk Twilio "Forward" feature eller n8n cron job for å sende oppkall.

**Q: Kan jeg bruke dette for support?**
A: Ja, men pass på at AI har god kunnskapsbase for produktet ditt.

**Q: Hvorfor ikke Vapi.ai?**
A: Vapi.ai er bedre og enklere, men krever mer tid å sette opp. Twilio + n8n er mer kontrollert.

---

## 🎯 Neste Steg

Når dette er på plass:
1. Opprett ditt first customer demo
2. Test med faktiske kunder
3. Lagre som SCS-marketplace template
4. Fyll i gull

Lykke til! 🚀

---

*Last updated: 2026-02-09*
