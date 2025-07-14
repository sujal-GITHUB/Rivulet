#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to update the backend URL in the API config
function updateBackendUrl(ngrokUrl) {
  const configPath = path.join(__dirname, 'src', 'config', 'api.js');
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Replace the placeholder URL with the actual ngrok URL
    content = content.replace(
      /return "https:\/\/your-backend-ngrok-url\.ngrok-free\.app";/,
      `return "${ngrokUrl}";`
    );
    
    fs.writeFileSync(configPath, content);
    console.log(`✅ Backend URL updated to: ${ngrokUrl}`);
    console.log('🔄 Please restart your Vite dev server for changes to take effect.');
  } catch (error) {
    console.error('❌ Error updating backend URL:', error.message);
  }
}

// If called with a URL argument
if (process.argv[2]) {
  updateBackendUrl(process.argv[2]);
} else {
  console.log('📝 Usage: node update-backend-url.js <ngrok-backend-url>');
  console.log('📝 Example: node update-backend-url.js https://abcd1234.ngrok-free.app');
  console.log('');
  console.log('🔍 To get your backend ngrok URL:');
  console.log('1. Start your backend: npm start (in backend folder)');
  console.log('2. In another terminal: npx ngrok http 3001');
  console.log('3. Copy the HTTPS URL and run this script with it');
} 