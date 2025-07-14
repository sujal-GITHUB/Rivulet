import React, { useState, useEffect } from 'react';

const ChromeWorkaround = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const testChromeWorkarounds = async () => {
      try {
        setStatus('Checking Chrome-specific APIs...');
        
        // Collect debug info
        const info = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          hasMediaDevices: !!navigator.mediaDevices,
          hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
          hasLegacyGetUserMedia: !!navigator.getUserMedia,
          hasWebkitGetUserMedia: !!navigator.webkitGetUserMedia,
          hasMozGetUserMedia: !!navigator.mozGetUserMedia,
          isSecureContext: window.isSecureContext,
          protocol: window.location.protocol,
          hostname: window.location.hostname,
          isLocalNetwork: !!(window.location.hostname.match(/^192\.168\./) || 
                            window.location.hostname.match(/^10\./) || 
                            window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./))
        };
        
        setDebugInfo(info);
        console.log('🔍 Chrome Debug Info:', info);
        
        // Method 1: Try to force MediaDevices API
        setStatus('Trying to force MediaDevices API...');
        
        // Sometimes Chrome blocks MediaDevices but allows direct access
        let getUserMedia = null;
        
        // Try multiple approaches
        const approaches = [
          {
            name: 'Modern MediaDevices',
            test: () => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                return navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
              }
              return null;
            }
          },
          {
            name: 'Legacy getUserMedia',
            test: () => {
              if (navigator.getUserMedia) {
                return navigator.getUserMedia.bind(navigator);
              }
              return null;
            }
          },
          {
            name: 'WebKit getUserMedia',
            test: () => {
              if (navigator.webkitGetUserMedia) {
                return navigator.webkitGetUserMedia.bind(navigator);
              }
              return null;
            }
          },
          {
            name: 'Mozilla getUserMedia',
            test: () => {
              if (navigator.mozGetUserMedia) {
                return navigator.mozGetUserMedia.bind(navigator);
              }
              return null;
            }
          },
          {
            name: 'Try to create MediaDevices',
            test: () => {
              // Try to force create MediaDevices if it doesn't exist
              if (!navigator.mediaDevices) {
                console.log('⚠️ MediaDevices not found, trying to create it...');
                try {
                  // Some Chrome versions need this
                  if (navigator.getUserMedia) {
                    return navigator.getUserMedia.bind(navigator);
                  }
                } catch (e) {
                  console.log('Failed to create MediaDevices:', e);
                }
              }
              return null;
            }
          }
        ];
        
        // Try each approach
        for (const approach of approaches) {
          console.log(`🔄 Trying ${approach.name}...`);
          setStatus(`Trying ${approach.name}...`);
          
          getUserMedia = approach.test();
          if (getUserMedia) {
            console.log(`✅ ${approach.name} found!`);
            break;
          }
        }
        
        if (!getUserMedia) {
          throw new Error('No camera API available. Chrome might be blocking camera access.');
        }
        
        setStatus('Requesting camera permissions...');
        
        // Try different constraint sets
        const constraintSets = [
          { video: true },
          { video: { facingMode: 'environment' } },
          { video: { width: { ideal: 640 }, height: { ideal: 480 } } },
          { video: { facingMode: 'user' } }
        ];
        
        let mediaStream = null;
        
        for (const constraints of constraintSets) {
          try {
            console.log('🔄 Trying constraints:', constraints);
            setStatus(`Trying camera with constraints: ${JSON.stringify(constraints)}`);
            
            mediaStream = await getUserMedia(constraints);
            console.log('✅ Camera access successful with constraints:', constraints);
            break;
          } catch (error) {
            console.log(`❌ Failed with constraints ${JSON.stringify(constraints)}:`, error.name, error.message);
            if (error.name === 'NotAllowedError') {
              throw new Error('Camera permission denied. Please allow camera access in Chrome settings.');
            }
          }
        }
        
        if (!mediaStream) {
          throw new Error('All camera constraint attempts failed.');
        }
        
        setStream(mediaStream);
        setStatus('✅ Camera access successful!');
        
      } catch (err) {
        console.error('❌ Chrome workaround failed:', err);
        setError(err.message);
        setStatus('❌ Camera access failed');
      }
    };

    testChromeWorkarounds();
  }, []);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return cleanup;
  }, [stream]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chrome Camera Workaround</h2>
      
      <div className="mb-4 p-4 border rounded">
        <div className="font-semibold">Status: {status}</div>
        {error && (
          <div className="text-red-600 mt-2">
            Error: {error}
          </div>
        )}
      </div>

      {stream && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Camera Preview:</h3>
          <video 
            autoPlay 
            playsInline 
            muted 
            className="w-full max-w-md border rounded"
            ref={video => {
              if (video) video.srcObject = stream;
            }}
          />
        </div>
      )}

      <div className="p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <div className="text-sm space-y-1">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Chrome on Android Solutions:</h3>
        <ul className="text-sm space-y-1">
          <li>• Go to Chrome Settings &gt; Site Settings &gt; Camera &gt; Allow</li>
          <li>• Try refreshing the page 3-4 times</li>
          <li>• Close all other apps that might use camera</li>
          <li>• Try Chrome Canary or Firefox</li>
          <li>• Check Android Settings &gt; Apps &gt; Chrome &gt; Permissions</li>
        </ul>
      </div>
    </div>
  );
};

export default ChromeWorkaround; 