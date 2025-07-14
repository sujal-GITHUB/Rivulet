import React, { useState } from 'react';

const BrowserTest = () => {
  const [testResults, setTestResults] = useState([]);

  const runBrowserTests = () => {
    const results = [];
    
    // Test 1: Basic navigator support
    results.push({
      name: 'Navigator Object',
      success: true,
      message: 'Navigator available: ✅'
    });

    // Test 2: MediaDevices support
    results.push({
      name: 'MediaDevices API',
      success: Boolean(navigator.mediaDevices),
      message: `MediaDevices available: ${navigator.mediaDevices ? '✅' : '❌'}`
    });

    // Test 3: getUserMedia support
    const hasModernGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    const hasLegacyGetUserMedia = !!navigator.getUserMedia;
    const hasWebkitGetUserMedia = !!navigator.webkitGetUserMedia;
    const hasMozGetUserMedia = !!navigator.mozGetUserMedia;
    
    results.push({
      name: 'getUserMedia Support',
      success: hasModernGetUserMedia || hasLegacyGetUserMedia || hasWebkitGetUserMedia || hasMozGetUserMedia,
      message: `Modern: ${hasModernGetUserMedia ? '✅' : '❌'}, Legacy: ${hasLegacyGetUserMedia ? '✅' : '❌'}, WebKit: ${hasWebkitGetUserMedia ? '✅' : '❌'}, Mozilla: ${hasMozGetUserMedia ? '✅' : '❌'}`
    });

    // Test 4: Browser detection
    const userAgent = navigator.userAgent.toLowerCase();
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (userAgent.includes('chrome')) {
      browserName = 'Chrome';
      const match = userAgent.match(/chrome\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('firefox')) {
      browserName = 'Firefox';
      const match = userAgent.match(/firefox\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browserName = 'Safari';
      const match = userAgent.match(/version\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    } else if (userAgent.includes('edge')) {
      browserName = 'Edge';
      const match = userAgent.match(/edge\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    
    results.push({
      name: 'Browser Detection',
      success: browserName !== 'Unknown',
      message: `${browserName} ${browserVersion}`
    });

    // Test 5: Platform detection
    results.push({
      name: 'Platform',
      success: true,
      message: `${navigator.platform} - ${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}`
    });

    // Test 6: HTTPS/Local network check
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLocalNetwork = hostname.match(/^192\.168\./) || 
                          hostname.match(/^10\./) || 
                          hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
    const isSecure = protocol === 'https:' || isLocalhost || isLocalNetwork;
    
    results.push({
      name: 'Secure Context',
      success: isSecure,
      message: `Protocol: ${protocol}, Hostname: ${hostname}, Secure: ${isSecure ? '✅' : '❌'}`
    });

    // Test 7: Camera device enumeration
    const testDeviceEnumeration = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter(device => device.kind === 'videoinput');
          
          return {
            name: 'Camera Devices',
            success: videoDevices.length > 0,
            message: `Found ${videoDevices.length} camera device(s)`
          };
        } else {
          return {
            name: 'Camera Devices',
            success: false,
            message: 'Device enumeration not supported'
          };
        }
      } catch (error) {
        return {
          name: 'Camera Devices',
          success: false,
          message: `Error: ${error.message}`
        };
      }
    };

    // Run async tests
    Promise.all([
      testDeviceEnumeration()
    ]).then(asyncResults => {
      setTestResults([...results, ...asyncResults]);
    });
  };

  React.useEffect(() => {
    runBrowserTests();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Browser Compatibility Test</h2>
      
      <div className="mb-4">
        <button 
          onClick={runBrowserTests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Tests Again
        </button>
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="p-3 border rounded">
            <div className="font-semibold">{result.name}</div>
            <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Recommendations:</h3>
        <ul className="text-sm space-y-1">
          <li>• Use Chrome, Firefox, or Safari on mobile devices</li>
          <li>• Make sure you're accessing via local network IP (not localhost from mobile)</li>
          <li>• Update your browser to the latest version</li>
          <li>• Check if your device has a camera</li>
          <li>• Try a different browser if camera support is missing</li>
        </ul>
      </div>
    </div>
  );
};

export default BrowserTest; 