#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Build script to prepare the demo page for deployment

const sourceFile = path.join(__dirname, '../templates/demo.html');
const outputFile = path.join(__dirname, '../public/demo.html');

console.log('Building demo.html...');

if (!fs.existsSync(path.dirname(outputFile))) {
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

// Copy the demo file
fs.copyFileSync(sourceFile, outputFile);

console.log(`✅ Demo deployed to ${outputFile}`);
