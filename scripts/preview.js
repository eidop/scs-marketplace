#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

const previewFile = path.join(__dirname, '../public/demo.html');

console.log(`Opening preview at file://${previewFile}`);

exec(`start ${previewFile}`);
