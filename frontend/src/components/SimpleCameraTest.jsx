import React, { useState, useEffect } from 'react';

const SimpleCameraTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const testCamera = async () => {
      try {
        setStatus('Checking browser support...');
        
        // Log all available APIs
        console.log('🔍 Available APIs:');
        console.log('- navigator:', !!navigator);
        console.log('- navigator.mediaDevices:', !!navigator.mediaDevices);
        console.log('- navigator.getUserMedia:', !!navigator.getUserMedia);
        console.log('- navigator.webkitGetUserMedia:', !!navigator.webkitGetUserMedia);
        console.log('- navigator.mozGetUserMedia:', !!navigator.mozGetUserMedia);
        console.log('- window.isSecureContext:', window.isSecureContext);
        console.log('- window.location.protocol:', window.location.protocol);
        console.log('- window.location.hostname:', window.location.hostname);
        
        setStatus('Testing MediaDevices API...');
        
        // Test 1: Check if MediaDevices exists
        if (!navigator.mediaDevices) {
          throw new Error('MediaDevices API not available');
        }
        
        // Test 1.5: Check secure context for local networks
        const isLocalNetwork = window.location.hostname.match(/^192\.168\./) || 
                              window.location.hostname.match(/^10\./) || 
                              window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
        
        if (!window.isSecureContext && !isLocalNetwork) {
          throw new Error('Camera access requires a secure context (HTTPS or localhost). Please access via HTTPS or your local network IP.');
        }
        
        setStatus('Testing getUserMedia...');
        
        // Test 2: Check if getUserMedia exists
        if (!navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia not available');
        }
        
        setStatus('Requesting camera access...');
        
        // Test 3: Try to get camera access
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        
        setStream(mediaStream);
        setStatus('✅ Camera access successful!');
        
      } catch (err) {
        console.error('❌ Camera test failed:', err);
        setError(err.message);
        setStatus('❌ Camera test failed');
      }
    };

    testCamera();
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
      <h2 className="text-2xl font-bold mb-4">Simple Camera Test</h2>
      
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
          <div>User Agent: {navigator.userAgent}</div>
          <div>Platform: {navigator.platform}</div>
          <div>Secure Context: {window.isSecureContext ? 'Yes' : 'No'}</div>
          <div>Protocol: {window.location.protocol}</div>
          <div>Hostname: {window.location.hostname}</div>
          <div>MediaDevices: {navigator.mediaDevices ? 'Available' : 'Not Available'}</div>
          <div>getUserMedia: {navigator.mediaDevices?.getUserMedia ? 'Available' : 'Not Available'}</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting:</h3>
        <ul className="text-sm space-y-1">
          <li>• Make sure you're accessing via network IP (not localhost)</li>
          <li>• Check browser camera permissions in settings</li>
          <li>• Try refreshing the page</li>
          <li>• Close other apps that might be using the camera</li>
          <li>• Try using Chrome or Firefox</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleCameraTest; 