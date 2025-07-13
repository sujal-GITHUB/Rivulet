import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, X, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

const CameraScanner = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState(null);
  const [scannedCode, setScannedCode] = useState(null);
  const qrReaderRef = useRef(null);

  const handleScan = (data) => {
    if (data) {
      setScannedCode(data);
      
      // Call the success callback
      if (onScanSuccess) {
        onScanSuccess(data);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Failed to access camera. Please check camera permissions and try again.');
  };

  const handleRetry = () => {
    setError(null);
    setScannedCode(null);
    if (qrReaderRef.current) {
      qrReaderRef.current.openImageDialog();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 p-6 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-6 h-6" />
              <h2 className="text-xl font-bold">Scan QR Code</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner Content */}
        <div className="p-6">
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Error</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2 inline" />
                Try Again
              </button>
            </div>
          ) : scannedCode ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">QR Code Detected!</h3>
              <p className="text-gray-600 mb-4">Processing product information...</p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Scanned Code:</p>
                <p className="font-mono text-sm text-gray-700 break-all">{scannedCode}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 text-sm">Position the QR code within the frame</p>
              </div>
              
              {/* Scanner Container */}
              <div className="relative">
                <div className="w-full max-w-sm mx-auto">
                  <QrReader
                    ref={qrReaderRef}
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                    facingMode="environment"
                    legacyMode={false}
                  />
                </div>
                
                {/* Scanning Frame Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="border-2 border-green-500 rounded-lg m-4">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-green-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-green-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleRetry}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  Restart Camera
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