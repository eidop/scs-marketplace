#!/usr/bin/env node
/**
 * SCS Marketplace - Google Drive Upload Script
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const TOKEN_PATH = path.join(__dirname, 'drive-token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function main() {
  const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const oauth2Client = new google.auth.OAuth2(creds.installed.client_id, creds.installed.client_secret, 'http://localhost:3000');

  if (!fs.existsSync(TOKEN_PATH)) {
    const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
    console.log('Auth:', url);
    const code = await new Promise(r => readline.createInterface({ input: process.stdin, output: process.stdout }).question('Code: ', r));
    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  }

  oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const folderId = fs.existsSync('drive-folder-id.txt') ? fs.readFileSync('drive-folder-id.txt', 'utf8').trim() : '1BpeuAjTyyrWw57xw1KM6nSWZRCKVImEG';
  const products = [
    { name: 'Cold Outreach Engine', path: 'products/cold-outreach-engine.json' },
    { name: 'Cold Outreach Engine (Safe)', path: 'products/cold-outreach-engine-safe.json' },
    { name: 'Cold Outreach Simple', path: 'products/cold-outreach-simple.json' },
    { name: 'Setup Guide', path: 'products/COLD-OUTREACH-SETUP.md' }
  ];

  for (const p of products) {
    if (!fs.existsSync(p.path)) { console.log(`Skip: ${p.name}`); continue; }
    console.log(`Upload: ${p.name}`);
    await drive.files.create({
      requestBody: { name: p.name, parents: [folderId] },
      media: { mimeType: p.name.endsWith('.md') ? 'text/markdown' : 'application/json', body: fs.createReadStream(p.path) }
    });
    console.log(`OK: ${p.name}`);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
