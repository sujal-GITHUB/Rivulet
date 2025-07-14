import React, { useState, useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, X, RotateCcw, AlertCircle, CheckCircle, Shield, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { API_URL } from '../config/api';

const CameraScanner = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productData, setProductData] = useState(null);
  const [authenticityStatus, setAuthenticityStatus] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isHttps, setIsHttps] = useState(true);
  const html5QrCodeRef = useRef(null);
  const initializationTimeoutRef = useRef(null);
  const lastErrorLogRef = useRef(0);
  const lastScannedTextRef = useRef('');
  const scanCooldownRef = useRef(0);

  // Check if running on HTTPS or local network (which allows camera access)
  useEffect(() => {
    const isLocalNetwork = window.location.hostname.match(/^192\.168\./) || 
                          window.location.hostname.match(/^10\./) || 
                          window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
    
    const isSecure = window.location.protocol === 'https:' || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    isLocalNetwork ||
                    window.isSecureContext; // Also check if browser considers it secure
    
    console.log('🔒 Security check:', {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      isLocalNetwork,
      isSecureContext: window.isSecureContext,
      isSecure
    });
    
    setIsHttps(isSecure);
  }, []);

  // Function to check if element has proper dimensions
  const checkElementDimensions = (element) => {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const hasWidth = rect.width > 0;
    const hasHeight = rect.height > 0;
    
    return hasWidth && hasHeight;
  };

  // Function to wait for element to have dimensions
  const waitForElementDimensions = (elementId, maxAttempts = 20) => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const checkDimensions = () => {
        attempts++;
        const element = document.getElementById(elementId);
        
        if (!element) {
          if (attempts >= maxAttempts) {
            reject(new Error('Element not found'));
            return;
          }
          setTimeout(checkDimensions, 100);
          return;
        }
        
        if (checkElementDimensions(element)) {
          resolve(element);
        } else {
          if (attempts >= maxAttempts) {
            reject(new Error('Element has no dimensions after maximum attempts'));
            return;
          }
          setTimeout(checkDimensions, 100);
        }
      };
      
      checkDimensions();
    });
  };

  // Check camera permissions and availability
  const checkCameraAvailability = async () => {
    try {
      console.log('🔍 Checking camera availability...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔒 Is HTTPS:', isHttps);
      console.log('🌐 Browser Info:', {
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
        hostname: window.location.hostname
      });
      
      // Check if getUserMedia is supported with fallbacks
      let getUserMedia = null;
      
      console.log('🔍 Checking getUserMedia support:');
      console.log('- navigator.mediaDevices:', !!navigator.mediaDevices);
      console.log('- navigator.mediaDevices.getUserMedia:', !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
      console.log('- navigator.getUserMedia:', !!navigator.getUserMedia);
      console.log('- navigator.webkitGetUserMedia:', !!navigator.webkitGetUserMedia);
      console.log('- navigator.mozGetUserMedia:', !!navigator.mozGetUserMedia);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('✅ Using modern MediaDevices API');
        getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      } else if (navigator.getUserMedia) {
        console.log('✅ Using legacy getUserMedia API');
        getUserMedia = navigator.getUserMedia.bind(navigator);
      } else if (navigator.webkitGetUserMedia) {
        console.log('✅ Using WebKit getUserMedia API');
        getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mozGetUserMedia) {
        console.log('✅ Using Mozilla getUserMedia API');
        getUserMedia = navigator.mozGetUserMedia.bind(navigator);
      }
      
      if (!getUserMedia) {
        console.error('❌ No getUserMedia support found');
        console.error('🔍 Navigator object:', navigator);
        console.error('🔍 MediaDevices:', navigator.mediaDevices);
        console.error('🔍 Is Secure Context:', window.isSecureContext);
        
        // Check if it's a secure context issue, but allow local network IPs
        const isLocalNetwork = window.location.hostname.match(/^192\.168\./) || 
                              window.location.hostname.match(/^10\./) || 
                              window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
        
        if (!window.isSecureContext && !isLocalNetwork) {
          throw new Error('Camera access requires a secure context (HTTPS or localhost). Please access via HTTPS or your local network IP.');
        }
        
        // Try to detect if MediaDevices exists but getUserMedia is missing
        if (navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
          console.error('⚠️ MediaDevices exists but getUserMedia is missing - this might be a Chrome bug');
          throw new Error('Camera API detected but not functional. This might be a Chrome bug. Try refreshing the page or using a different browser.');
        }
        
        // Check if this is Chrome on Android with blocked APIs
        const userAgent = navigator.userAgent.toLowerCase();
        const isChromeOnAndroid = userAgent.includes('chrome') && userAgent.includes('android');
        
        if (isChromeOnAndroid) {
          console.error('⚠️ Chrome on Android detected with blocked camera APIs');
          throw new Error('Chrome on Android is blocking camera access. Try: 1) Refresh page 3-4 times, 2) Check Chrome Settings > Site Settings > Camera, 3) Use Firefox instead.');
        }
        
        // Provide more specific error based on browser
        let browserError = 'Camera access is not supported in this browser.';
        
        if (userAgent.includes('chrome')) {
          browserError = 'Camera access not supported. Please update Chrome or try a different browser.';
        } else if (userAgent.includes('firefox')) {
          browserError = 'Camera access not supported. Please update Firefox or try a different browser.';
        } else if (userAgent.includes('safari')) {
          browserError = 'Camera access not supported. Please update Safari or try a different browser.';
        } else if (userAgent.includes('edge')) {
          browserError = 'Camera access not supported. Please update Edge or try a different browser.';
        } else {
          browserError = 'Camera access not supported in this browser. Please use Chrome, Firefox, or Safari on mobile.';
        }
        
        throw new Error(browserError);
      }

      // Check if we're on HTTPS or local network (required for camera access on mobile)
      if (!isHttps) {
        throw new Error('Camera access requires HTTPS or local network access. Please access this app via HTTPS, localhost, or your local network IP.');
      }

      console.log('📱 Requesting camera permissions...');
      
      // Request camera permissions with fallback support
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        } 
      };
      
      let stream;
      try {
        stream = await getUserMedia(constraints);
      } catch (fallbackError) {
        // Try with simpler constraints if the first attempt fails
        console.log('🔄 Trying with simpler constraints...', fallbackError.message);
        stream = await getUserMedia({ video: true });
      }
      
      console.log('✅ Camera permissions granted');
      console.log('📹 Camera tracks:', stream.getTracks().length);
      
      // Stop the test stream
      stream.getTracks().forEach(track => {
        console.log('🛑 Stopping track:', track.kind, track.label);
        track.stop();
      });
      
      return true;
    } catch (error) {
      console.error('❌ Camera availability check failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found on this device. Please check if your device has a camera.');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Camera access is not supported in this browser. Please use Chrome, Firefox, or Safari.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is in use by another application. Please close other camera apps and try again.');
      } else if (error.name === 'OverconstrainedError') {
        throw new Error('Camera does not meet requirements. Please try a different camera or browser.');
      } else if (!isHttps) {
        throw new Error('Camera access requires HTTPS or local network access. Please access this app via HTTPS, localhost, or your local network IP.');
      } else {
        throw new Error(`Camera initialization failed: ${error.message}. Please check your camera permissions and try again.`);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const initializeScanner = async () => {
      if (isInitializing || !mounted) return;
      
      setIsInitializing(true);
      setError(null);
      
      try {
        // Check camera availability first
        await checkCameraAvailability();
        
        // Wait for the element to have proper dimensions
        await waitForElementDimensions("qr-reader");
        
        if (!mounted) return;

        console.log('📹 Checking available cameras...');
        // Check if cameras are available
        const cameras = await Html5Qrcode.getCameras();
        console.log('📷 Available cameras:', cameras);
        
        if (!cameras || cameras.length === 0) {
          throw new Error('No camera found. Please check camera permissions.');
        }

        console.log('🔧 Creating scanner instance...');
        // Create new scanner instance
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
        
        console.log('🚀 Starting scanner...');
        // Start the scanner with more robust configuration
        await html5QrCodeRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            disableFlip: false,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
            aspectRatio: 1.0
          },
          handleScanSuccess,
          handleScanError
        );
        
        console.log('✅ Scanner started successfully');

        if (mounted) {
          setIsInitialized(true);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Scanner initialization error:', error);
        if (mounted) {
          setError(error.message || 'Failed to initialize camera scanner');
          setIsInitializing(false);
        }
      }
    };

    // Start initialization after a short delay to ensure DOM is ready
    initializationTimeoutRef.current = setTimeout(() => {
      initializeScanner();
    }, 200);

    return () => {
      mounted = false;
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
      
      // Cleanup scanner
      if (html5QrCodeRef.current && isInitialized) {
        html5QrCodeRef.current.stop().catch(err => {
          console.log('Scanner cleanup error (expected):', err.message);
        });
      }
    };
  }, [isHttps]);

  const handleScanSuccess = async (decodedText) => {
    if (isProcessing) return;
    
    // Prevent multiple scans of the same QR code
    const now = Date.now();
    if (decodedText === lastScannedTextRef.current && now - scanCooldownRef.current < 3000) {
      return; // Skip if same QR code scanned within 3 seconds
    }
    
    setIsProcessing(true);
    lastScannedTextRef.current = decodedText;
    scanCooldownRef.current = now;
    
    try {
      // Stop the scanner immediately after successful scan
      if (html5QrCodeRef.current && isInitialized) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (err) {
          console.log('Scanner stop error (expected):', err.message);
        }
      }
      
      // Simply pass the decoded text to the parent component
      // Let the parent handle the QR processing (same as upload method)
      if (onScanSuccess) {
        onScanSuccess(decodedText);
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      setError('Failed to process QR code. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanError = (err) => {
    // Throttle error logging to prevent spam
    const now = Date.now();
    if (now - lastErrorLogRef.current < 5000) {
      return; // Skip logging if less than 5 seconds since last error
    }
    
    // Only log errors that are not normal "no QR code found" errors
    if (err && 
        err.name !== 'NotFoundException' && 
        !err.message?.includes('No MultiFormat Readers') &&
        !err.message?.includes('QR code parse error')) {
      console.error('Scanner error:', err);
      lastErrorLogRef.current = now;
    }
    // Don't set error for normal scanning attempts
  };

  const handleRetry = async () => {
    setError(null);
    setProductData(null);
    setAuthenticityStatus(null);
    setIsProcessing(false);
    setIsInitialized(false);
    setIsInitializing(false);
    
    // Cleanup existing scanner
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.log('Scanner stop error (expected):', err.message);
      }
      html5QrCodeRef.current = null;
    }
    
    // Clear any existing timeout
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }
    
    // Reinitialize after a short delay
    initializationTimeoutRef.current = setTimeout(() => {
      const initializeScanner = async () => {
        if (isInitializing) return;
        
        setIsInitializing(true);
        setError(null);
        
                         try {
          // Check camera availability first
          await checkCameraAvailability();
          
          // Wait for the element to have proper dimensions
          await waitForElementDimensions("qr-reader");
          
          // Check if cameras are available
          const cameras = await Html5Qrcode.getCameras();
          if (!cameras || cameras.length === 0) {
            throw new Error('No camera found. Please check camera permissions.');
          }

          // Create new scanner instance
          html5QrCodeRef.current = new Html5Qrcode("qr-reader");
          
          // Start the scanner with more robust configuration
          await html5QrCodeRef.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              disableFlip: false,
              experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
              },
              formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
              aspectRatio: 1.0
            },
            handleScanSuccess,
            handleScanError
          );

          setIsInitialized(true);
          setIsInitializing(false);
        } catch (error) {
          console.error('Scanner retry initialization error:', error);
          setError(error.message || 'Failed to initialize camera scanner');
          setIsInitializing(false);
        }
      };
      
      initializeScanner();
    }, 300);
  };

  const handleClose = async () => {
    // Cleanup scanner
    if (html5QrCodeRef.current && isInitialized) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.log('Scanner cleanup error (expected):', err.message);
      }
    }
    
    // Clear timeout
    if (initializationTimeoutRef.current) {
      clearTimeout(initializationTimeoutRef.current);
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full relative overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Scan QR Code</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner Content */}
        <div className="p-6">
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Camera Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              
              {/* Debug Information */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-left">
                <p className="text-xs text-gray-600 font-medium mb-1">Debug Info:</p>
                <p className="text-xs text-gray-500">URL: {window.location.href}</p>
                <p className="text-xs text-gray-500">Protocol: {window.location.protocol}</p>
                <p className="text-xs text-gray-500">Hostname: {window.location.hostname}</p>
                <p className="text-xs text-gray-500">User Agent: {navigator.userAgent.substring(0, 50)}...</p>
              </div>
              
              {/* HTTPS Warning for Mobile */}
              {!isHttps && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <WifiOff className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Camera Access Required</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Mobile browsers require HTTPS or local network access for camera. Try:
                  </p>
                  <div className="mt-2 text-xs text-yellow-600 space-y-1">
                    <p>• Access via your local network IP (e.g., <code className="bg-yellow-100 px-1 rounded">http://192.168.1.100:5173</code>)</p>
                    <p>• Use ngrok: <code className="bg-yellow-100 px-1 rounded">npm run tunnel</code></p>
                    <p>• Access via localhost if on same device</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleRetry}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          ) : isProcessing ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Processing...</h3>
              <p className="text-gray-600">Verifying product on blockchain</p>
            </div>
          ) : productData ? (
            <div className="text-center">
              <div className={`w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                authenticityStatus?.verified ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {authenticityStatus?.verified ? (
                  <CheckCircle className="w-10 h-10 text-green-500" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {authenticityStatus?.verified ? 'Product Verified!' : 'Verification Failed'}
              </h3>
              <p className="text-gray-600 mb-4">{authenticityStatus?.message}</p>
              
              {/* Product Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">{productData.name}</h4>
                <p className="text-sm text-gray-600 mb-1">Brand: {productData.brand}</p>
                <p className="text-sm text-gray-600 mb-1">SKU: {productData.sku}</p>
                <p className="text-sm text-gray-600">Origin: {productData.origin.country}</p>
              </div>

              {/* Authenticity Status */}
              <div className={`rounded-lg p-4 mb-4 border ${
                authenticityStatus?.verified ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Shield className={`w-5 h-5 ${
                    authenticityStatus?.verified ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`font-semibold ${
                    authenticityStatus?.verified ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Blockchain Verification
                  </span>
                </div>
                <p className={`text-sm mt-1 ${
                  authenticityStatus?.verified ? 'text-green-700' : 'text-red-700'
                }`}>
                  {authenticityStatus?.verified 
                    ? 'Product authenticity confirmed on blockchain'
                    : 'Product authenticity could not be verified'
                  }
                </p>
              </div>

              <button
                onClick={handleRetry}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Scan Another Product
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">
                  {isInitializing ? 'Initializing camera...' : 'Position the QR code within the frame'}
                </p>
              </div>
              
              {/* Scanner Container */}
              <div className="relative">
                <div id="qr-reader" className="w-full max-w-sm mx-auto min-h-[300px]"></div>
                
                {/* Scanning Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="border-2 border-gray-900 rounded-lg m-4">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-gray-900 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-gray-900 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-gray-900 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-gray-900 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleRetry}
                  disabled={isInitializing}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  {isInitializing ? 'Initializing...' : 'Restart Camera'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraScanner; 