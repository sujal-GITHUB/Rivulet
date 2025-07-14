import React, { useState, useEffect } from 'react';

const CameraTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [stream, setStream] = useState(null);

  const runCameraTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Browser Support',
        test: () => {
          const hasMediaDevices = !!navigator.mediaDevices;
          const hasGetUserMedia = !!navigator.mediaDevices?.getUserMedia;
          return {
            success: hasMediaDevices && hasGetUserMedia,
            message: `MediaDevices: ${hasMediaDevices ? '✅' : '❌'}, getUserMedia: ${hasGetUserMedia ? '✅' : '❌'}`
          };
        }
      },
      {
        name: 'HTTPS/Local Network Check',
        test: () => {
          const protocol = window.location.protocol;
          const hostname = window.location.hostname;
          const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
          const isLocalNetwork = hostname.match(/^192\.168\./) || 
                                hostname.match(/^10\./) || 
                                hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
          const isSecure = protocol === 'https:' || isLocalhost || isLocalNetwork;
          
          return {
            success: isSecure,
            message: `Protocol: ${protocol}, Hostname: ${hostname}, Secure: ${isSecure ? '✅' : '❌'}`
          };
        }
      },
      {
        name: 'Camera Permission Request',
        test: async () => {
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
              video: {
                facingMode: 'environment',
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 }
              } 
            });
            
            setStream(mediaStream);
            
            const tracks = mediaStream.getTracks();
            const videoTrack = tracks.find(track => track.kind === 'video');
            
            return {
              success: true,
              message: `✅ Camera access granted. Tracks: ${tracks.length}, Video: ${videoTrack ? videoTrack.label : 'None'}`
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ Camera access failed: ${error.name} - ${error.message}`
            };
          }
        }
      },
      {
        name: 'Camera Capabilities',
        test: async () => {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            return {
              success: videoDevices.length > 0,
              message: `Found ${videoDevices.length} camera(s): ${videoDevices.map(d => d.label || 'Unknown').join(', ')}`
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ Failed to enumerate devices: ${error.message}`
            };
          }
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, { name: test.name, ...result }]);
      } catch (error) {
        setTestResults(prev => [...prev, { 
          name: test.name, 
          success: false, 
          message: `❌ Test failed: ${error.message}` 
        }]);
      }
    }

    setIsTesting(false);
  };

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    runCameraTests();
    return cleanup;
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Camera Test Results</h2>
      
      <div className="mb-4">
        <button 
          onClick={runCameraTests}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Run Tests Again'}
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

      {stream && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-800 mb-2">✅ Camera Stream Active</h3>
          <p className="text-sm text-green-700">
            Camera is working! You should see a video preview below.
          </p>
          <video 
            autoPlay 
            playsInline 
            muted 
            className="mt-2 w-full max-w-md border rounded"
            ref={video => {
              if (video) video.srcObject = stream;
            }}
          />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-sm space-y-1">
          <li>• Make sure you're accessing via local network IP (not localhost from mobile)</li>
          <li>• Check browser camera permissions in settings</li>
          <li>• Try refreshing the page after granting permissions</li>
          <li>• Close other apps that might be using the camera</li>
          <li>• Try using Chrome or Safari on mobile</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraTest; 