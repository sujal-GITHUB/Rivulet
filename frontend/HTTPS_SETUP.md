# HTTPS Setup for Mobile Camera Access

## Problem
Mobile browsers require HTTPS to access camera APIs when accessing via network URL (not localhost).

## Solutions

### Option 1: Use ngrok (Recommended for testing)

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your Vite dev server:
   ```bash
   npm run dev
   ```

3. In another terminal, create HTTPS tunnel:
   ```bash
   ngrok http 5173
   ```

4. Use the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)

### Option 2: Use localhost (Same device)

If testing on the same device as development:
- Use `http://localhost:5173` - this works for camera access

### Option 3: Use localhost (Same network)

If testing on mobile device on same network:
- Use `http://localhost:5173` from your computer's IP address
- This works because localhost is considered secure

### Option 4: Self-signed certificates (Advanced)

1. Generate certificates:
   ```bash
   openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes
   ```

2. Update vite.config.js to use HTTPS:
   ```javascript
   import fs from 'fs'
   import path from 'path'
   import { fileURLToPath } from 'url'

   const __dirname = path.dirname(fileURLToPath(import.meta.url))

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     server: {
       host: '0.0.0.0',
       port: 5173,
       cors: true,
       https: {
         key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
         cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
       }
     }
   })
   ```

3. Access via `https://your-ip:5173`

## Troubleshooting

- **Camera permission denied**: Check browser settings and allow camera access
- **HTTPS required error**: Use one of the solutions above
- **No camera found**: Ensure device has a camera and permissions are granted
- **Network access issues**: Check firewall settings and network connectivity 