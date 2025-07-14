const os = require('os');

function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  
  console.log('🌐 Network Interfaces:');
  console.log('=====================');
  
  for (const name of Object.keys(interfaces)) {
    const interface = interfaces[name];
    
    for (const alias of interface) {
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        console.log(`📡 Interface: ${name}`);
        console.log(`📍 IP Address: ${alias.address}`);
        console.log(`🔗 Frontend URL: http://${alias.address}:5173`);
        console.log(`🔗 Backend URL: http://${alias.address}:3001`);
        console.log('---');
      }
    }
  }
  
  console.log('\n📱 Mobile Access Instructions:');
  console.log('=============================');
  console.log('1. Make sure your backend is running: npm start (in backend folder)');
  console.log('2. Make sure your frontend is running: npm run dev (in frontend folder)');
  console.log('3. On your mobile device, open the frontend URL shown above');
  console.log('4. The app should automatically detect the network IP and connect to the backend');
  console.log('\n⚠️  Note: Both devices must be on the same WiFi network');
}

getNetworkIP(); 