import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, X, RotateCcw, AlertCircle, CheckCircle, Shield, AlertTriangle, Smartphone, Play, Upload } from 'lucide-react';
import { API_URL } from '../config/api';
import { BrowserQRCodeReader } from '@zxing/browser';

const QRCodeScanner = ({ onScanSuccess, onClose, isMobile = false }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productData, setProductData] = useState(null);
  const [authenticityStatus, setAuthenticityStatus] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const qrScannerRef = useRef(null);
  const initializationTimeoutRef = useRef(null);
  const lastErrorLogRef = useRef(0);
  const [lastDecodedText, setLastDecodedText] = useState(null);

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

  // Function to check camera permissions
  const checkCameraPermissions = async () => {
    try {
      // Check if we're on mobile and not using HTTPS or local network
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSecure = window.location.protocol === 'https:' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.match(/^192\.168\./) ||
                      window.location.hostname.match(/^10\./) ||
                      window.location.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./);
      
      if (isMobile && !isSecure) {
        throw new Error('Mobile browsers require HTTPS or local network access for camera. Use "Upload QR Image" option below or access via your local network IP.');
      }

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.');
      }

      // Try to get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stop all tracks to release camera
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission error:', error);
      
      // Handle specific error types
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera access denied. Please allow camera permissions in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found on this device. Please connect a camera and try again.');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Camera not supported in this browser. Please use Chrome, Firefox, or Safari.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is in use by another application. Please close other camera apps and try again.');
      } else if (error.name === 'OverconstrainedError') {
        throw new Error('Camera does not meet requirements. Please try a different camera or browser.');
      } else if (error.message.includes('HTTPS')) {
        throw error; // Re-throw HTTPS error as-is
      } else {
        throw new Error('Camera initialization failed. Please check your camera settings and try again.');
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
        // Check camera permissions first
        await checkCameraPermissions();
        
        // Wait for the element to have proper dimensions
        await waitForElementDimensions("qr-reader");
        
        if (!mounted) return;

        qrScannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { 
            fps: 5, 
            qrbox: { width: 300, height: 300 },
            aspectRatio: 1.0,
            disableFlip: false,
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
          },
          false
        );

        qrScannerRef.current.render(handleScanSuccess, onScanError);
        
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
      if (qrScannerRef.current && isInitialized) {
        try {
          qrScannerRef.current.clear();
        } catch (err) {
          console.log('Scanner cleanup error (expected):', err.message);
        }
      }
    };
  }, []);

  const handleScanSuccess = async (decodedText) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setLastDecodedText(decodedText); // Save for debugging UI
    try {
      // Parse QR data
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // If not JSON, treat as direct product ID
        qrData = { productId: decodedText };
      }
      // Always fetch product data from backend using POST
      const productId = qrData.productId;
      if (!productId) throw new Error('QR code does not contain a productId');
      const response = await fetch(`${API_URL}/api/qr/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: JSON.stringify({ productId }) })
      });
      if (!response.ok) {
        throw new Error('Product not found or invalid QR code');
      }
      const result = await response.json();
      setProductData(result.product);
      setAuthenticityStatus(result.authenticity);
      if (onScanSuccess) {
        onScanSuccess({
          qrData: qrData,
          product: result.product,
          authenticity: result.authenticity
        });
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      setError(error.message || 'Failed to process QR code. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onScanError = (err) => {
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

  const handleRetry = () => {
    setError(null);
    setProductData(null);
    setAuthenticityStatus(null);
    setIsProcessing(false);
    setIsInitialized(false);
    setIsInitializing(false);
    
    // Cleanup existing scanner
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.clear();
      } catch (err) {
        console.log('Scanner cleanup error (expected):', err.message);
      }
      qrScannerRef.current = null;
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
          // Check camera permissions first
          await checkCameraPermissions();

          // Wait for the element to have proper dimensions
          await waitForElementDimensions("qr-reader");
          
          qrScannerRef.current = new Html5QrcodeScanner(
            "qr-reader",
            { 
              fps: 10, 
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              disableFlip: false,
              experimentalFeatures: {
                useBarCodeDetectorIfSupported: true
              }
            },
            false
          );

          qrScannerRef.current.render(handleScanSuccess, onScanError);
          
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

  const handleClose = () => {
    // Cleanup scanner
    if (qrScannerRef.current && isInitialized) {
      try {
        qrScannerRef.current.clear();
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

  // Demo scan with partner products
  const handleDemoScan = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Use a demo product ID (assuming product ID 1 is a partner product)
      const demoProductId = 1;
      const demoQRData = JSON.stringify({
        productId: demoProductId,
        blockchainAddress: '0x1234567890123456789012345678901234567890',
        timestamp: Date.now(),
        type: 'demo_scan'
      });

      // Fetch product data from blockchain
      const response = await fetch(`${API_URL}/api/qr/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: demoQRData })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.isPartnerProduct === false) {
          throw new Error('Invalid QR code: Product not registered by a verified partner');
        } else if (response.status === 404) {
          throw new Error('Product not found on blockchain');
        } else {
          throw new Error('Product not found or invalid QR code');
        }
      }

      const result = await response.json();
      setProductData(result.product);
      setAuthenticityStatus(result.authenticity);

      // Call success callback with full data
      if (onScanSuccess) {
        onScanSuccess({
          qrData: { productId: demoProductId },
          product: result.product,
          authenticity: result.authenticity
        });
      }

    } catch (error) {
      console.error('Demo scan error:', error);
      setError(error.message || 'Failed to process demo scan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Use zxing-js/browser for robust QR decoding
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromImageElement(img);
          // Process the decoded text
          await handleScanSuccess(result.getText());
        } catch (decodeError) {
          console.error('QR decode error (zxing):', decodeError);
          setError('Could not decode QR code from uploaded image. Please try a different image.');
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load uploaded image. Please try again.');
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to process uploaded file. Please try again.');
      setIsProcessing(false);
    }
  };

  // Mobile-specific styles
  const mobileStyles = isMobile ? {
    container: "fixed inset-0 bg-black flex flex-col",
    header: "bg-gray-900 p-4 text-white",
    content: "flex-1 flex flex-col",
    scanner: "flex-1 relative"
  } : {
    container: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50",
    header: "bg-gray-900 p-6 text-white relative",
    content: "bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full relative overflow-hidden",
    scanner: "p-6"
  };

  return (
    <div className={mobileStyles.container}>
      <div className={mobileStyles.content}>
        {/* Header */}
        <div className={mobileStyles.header}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6" />
              <h2 className="text-xl font-bold">Scan Product QR</h2>
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
        <div className={mobileStyles.scanner}>
          {error ? (
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              {/* Debug: Show last decoded QR text if available */}
              {lastDecodedText && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4 text-left break-all">
                  <p className="text-xs text-gray-800 font-mono mb-1">Decoded QR Text:</p>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">{lastDecodedText}</pre>
                </div>
              )}
              
              {/* Additional help for common issues */}
              {error.includes('denied') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-left">
                  <p className="text-sm text-blue-800 font-medium mb-2">💡 Camera Permission Help:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Click the camera icon in your browser's address bar</li>
                    <li>• Select "Allow" for camera access</li>
                    <li>• Refresh the page and try again</li>
                  </ul>
                </div>
              )}
              
              {error.includes('HTTPS') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-left">
                  <p className="text-sm text-blue-800 font-medium mb-2">📱 Mobile Camera Access:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Mobile browsers require HTTPS or local network access for camera</li>
                    <li>• <strong>Solution:</strong> Use "Upload QR Image" button below</li>
                    <li>• Or access via your local network IP (e.g., <code className="bg-blue-100 px-1 rounded">http://192.168.1.100:5173</code>)</li>
                  </ul>
                </div>
              )}
              
              {error.includes('not supported') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-left">
                  <p className="text-sm text-yellow-800 font-medium mb-2">💡 Browser Compatibility:</p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Try using Chrome, Firefox, or Safari</li>
                    <li>• Make sure you're using HTTPS (required for camera)</li>
                    <li>• Check if your device has a camera</li>
                  </ul>
                </div>
              )}
              
              <button
                onClick={handleRetry}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2 inline" />
                Try Again
              </button>
            </div>
          ) : isProcessing ? (
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing...</h3>
              <p className="text-gray-600">Verifying product on blockchain</p>
            </div>
          ) : productData ? (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  authenticityStatus?.verified ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {authenticityStatus?.verified ? (
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {authenticityStatus?.verified ? 'Product Verified!' : 'Verification Failed'}
                </h3>
                <p className="text-gray-600 mb-4">{authenticityStatus?.message}</p>
              </div>

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
            <div className="text-center p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">
                  {isInitializing ? 'Initializing camera...' : 'Position the QR code within the frame'}
                </p>
                
                {/* Mobile camera notice */}
                {!isInitializing && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-left">
                    <p className="text-xs text-blue-800">
                      <strong>📱 Mobile Users:</strong> If camera doesn't work, use "Upload QR Image" below or access via your local network IP.
                    </p>
                  </div>
                )}
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
              
              <div className="mt-6 space-y-3">
                {/* Mobile-first layout - File upload first for mobile users */}
                {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                    <button
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      📱 Upload QR Image (Mobile)
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleRetry}
                  disabled={isInitializing}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  {isInitializing ? 'Initializing...' : 'Restart Camera'}
                </button>
                
                <button
                  onClick={handleDemoScan}
                  disabled={isProcessing}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Demo Scan (Partner Product)
                </button>

                {/* Desktop file upload (if not mobile) */}
                {!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                    <button
                      disabled={isProcessing}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload QR Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 