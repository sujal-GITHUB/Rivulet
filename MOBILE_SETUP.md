# Mobile Setup Guide

This guide will help you set up mobile access to your Rivulet application.

## Prerequisites

1. Both your development machine and mobile device must be on the same WiFi network
2. Backend server must be running on port 3001
3. Frontend server must be running on port 5173

## Step 1: Find Your Network IP

Run the network IP finder script:

```bash
node scripts/get-network-ip.js
```

This will show you the available network interfaces and their IP addresses.

## Step 2: Start the Backend Server

```bash
cd backend
npm start
```

The backend should start and show:
```
🚀 Server running on http://0.0.0.0:3001
🌐 Accessible from network at: http://[your-local-ip]:3001
```

## Step 3: Start the Frontend Server

```bash
cd frontend
npm run dev
```

The frontend should start and show:
```
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

## Step 4: Access from Mobile

1. On your mobile device, open a web browser
2. Navigate to the Network URL shown by the frontend server (e.g., `http://192.168.x.x:5173`)
3. The app should automatically detect the network IP and connect to the backend

## Troubleshooting

### Backend Not Accessible

1. **Check if backend is running:**
   ```bash
   curl http://localhost:3001/api/products
   ```

2. **Check firewall settings:**
   - Windows: Check Windows Defender Firewall
   - macOS: Check System Preferences > Security & Privacy > Firewall
   - Linux: Check iptables or ufw

3. **Test backend directly from mobile:**
   - Try accessing `http://[your-ip]:3001/api/products` directly in mobile browser

### Frontend Not Loading

1. **Check if frontend is running:**
   ```bash
   curl http://localhost:5173
   ```

2. **Verify Vite configuration:**
   - Make sure `host: '0.0.0.0'` is set in `vite.config.js`

### API Connection Issues

1. **Use the Network Test component:**
   - Add `<NetworkTest />` to your app temporarily
   - This will show detailed connection information

2. **Check browser console:**
   - Open developer tools on mobile (if available)
   - Look for CORS or network errors

3. **Common issues:**
   - CORS errors: Backend CORS is configured to allow all origins
   - Network timeout: Check if devices are on same network
   - Port blocked: Check firewall settings

## Configuration Files

### Frontend API Configuration (`frontend/src/config/api.js`)

The app automatically detects the environment:
- **localhost**: Uses `http://localhost:3001`
- **network IP**: Uses `http://[network-ip]:3001`
- **ngrok**: Uses the configured ngrok URL

### Backend CORS Configuration (`backend/server.js`)

CORS is configured to allow all origins for development:
```javascript
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true
}));
```

### Vite Configuration (`frontend/vite.config.js`)

Vite is configured for network access:
```javascript
server: {
  host: '0.0.0.0',
  port: 5173,
  cors: true,
  allowedHosts: 'all'
}
```

## Testing the Setup

1. **Network Test Component:**
   ```jsx
   import NetworkTest from './components/NetworkTest';
   
   // Add to your app temporarily
   <NetworkTest />
   ```

2. **Manual Testing:**
   - Try scanning a QR code
   - Check if products load in the dashboard
   - Verify authentication works

## Security Notes

- This setup is for development only
- In production, use proper HTTPS and domain names
- The current CORS configuration allows all origins (development only)

## Quick Commands

```bash
# Start backend
cd backend && npm start

# Start frontend (in new terminal)
cd frontend && npm run dev

# Find network IP
node scripts/get-network-ip.js

# Test backend connectivity
curl http://localhost:3001/api/products
``` 