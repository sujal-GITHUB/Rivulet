import React, { useState, useEffect } from 'react';

const AdvancedCameraTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);
  const [stream, setStream] = useState(null);

  const runAdvancedTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Basic Navigator Check',
        test: () => {
          return {
            success: true,
            message: 'Navigator available: ✅'
          };
        }
      },
      {
        name: 'MediaDevices API Check',
        test: () => {
          const hasMediaDevices = !!navigator.mediaDevices;
          const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
          return {
            success: hasMediaDevices && hasGetUserMedia,
            message: `MediaDevices: ${hasMediaDevices ? '✅' : '❌'}, getUserMedia: ${hasGetUserMedia ? '✅' : '❌'}`
          };
        }
      },
      {
        name: 'Legacy API Check',
        test: () => {
          const hasLegacy = !!navigator.getUserMedia;
          const hasWebkit = !!navigator.webkitGetUserMedia;
          const hasMoz = !!navigator.mozGetUserMedia;
          return {
            success: hasLegacy || hasWebkit || hasMoz,
            message: `Legacy: ${hasLegacy ? '✅' : '❌'}, WebKit: ${hasWebkit ? '✅' : '❌'}, Mozilla: ${hasMoz ? '✅' : '❌'}`
          };
        }
      },
      {
        name: 'Secure Context Check',
        test: () => {
          const isLocalNetwork = window.location.hostname.match(/^192\.168\./) || 
                                window.location.hostname.match(/^10\./) || 
                                window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
          const isSecure = window.isSecureContext || isLocalNetwork;
          return {
            success: isSecure,
            message: `Secure Context: ${window.isSecureContext ? '✅' : '❌'}, Local Network: ${isLocalNetwork ? '✅' : '❌'}`
          };
        }
      },
      {
        name: 'Modern API Test',
        test: async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              return {
                success: false,
                message: 'Modern MediaDevices API not available'
              };
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            
            return {
              success: true,
              message: '✅ Modern API works!'
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ Modern API failed: ${error.name} - ${error.message}`
            };
          }
        }
      },
      {
        name: 'Legacy API Test',
        test: async () => {
          try {
            let getUserMedia = null;
            
            if (navigator.getUserMedia) {
              getUserMedia = navigator.getUserMedia.bind(navigator);
            } else if (navigator.webkitGetUserMedia) {
              getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
            } else if (navigator.mozGetUserMedia) {
              getUserMedia = navigator.mozGetUserMedia.bind(navigator);
            }
            
            if (!getUserMedia) {
              return {
                success: false,
                message: 'No legacy getUserMedia API available'
              };
            }
            
            const stream = await getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            
            return {
              success: true,
              message: '✅ Legacy API works!'
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ Legacy API failed: ${error.name} - ${error.message}`
            };
          }
        }
      },
      {
        name: 'Device Enumeration Test',
        test: async () => {
          try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
              return {
                success: false,
                message: 'Device enumeration not supported'
              };
            }
            
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            return {
              success: videoDevices.length > 0,
              message: `Found ${videoDevices.length} camera device(s)`
            };
          } catch (error) {
            return {
              success: false,
              message: `Device enumeration failed: ${error.message}`
            };
          }
        }
      },
      {
        name: 'Full Camera Access Test',
        test: async () => {
          try {
            let getUserMedia = null;
            
            // Try modern API first
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            } else if (navigator.getUserMedia) {
              getUserMedia = navigator.getUserMedia.bind(navigator);
            } else if (navigator.webkitGetUserMedia) {
              getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
            } else if (navigator.mozGetUserMedia) {
              getUserMedia = navigator.mozGetUserMedia.bind(navigator);
            }
            
            if (!getUserMedia) {
              return {
                success: false,
                message: 'No getUserMedia API available'
              };
            }
            
            const mediaStream = await getUserMedia({ 
              video: {
                facingMode: 'environment',
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 }
              } 
            });
            
            setStream(mediaStream);
            
            return {
              success: true,
              message: '✅ Full camera access successful!'
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ Full camera access failed: ${error.name} - ${error.message}`
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
    runAdvancedTests();
    return cleanup;
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Advanced Camera Test</h2>
      
      <div className="mb-4">
        <button 
          onClick={runAdvancedTests}
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
          <p className="text-sm text-green-700 mb-2">
            Camera is working! You should see a video preview below.
          </p>
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

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Chrome on Android Issues:</h3>
        <ul className="text-sm space-y-1">
          <li>• Chrome sometimes blocks MediaDevices API on local networks</li>
          <li>• Try refreshing the page multiple times</li>
          <li>• Check Chrome Settings &gt; Site Settings &gt; Camera</li>
          <li>• Try Chrome Canary or Firefox</li>
          <li>• Make sure no other apps are using the camera</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedCameraTest; 