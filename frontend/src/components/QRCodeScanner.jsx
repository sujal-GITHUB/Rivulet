import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, X, RotateCcw, AlertCircle, CheckCircle, Shield, AlertTriangle, Smartphone } from 'lucide-react';

const QRCodeScanner = ({ onScanSuccess, onClose, isMobile = false }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productData, setProductData] = useState(null);
  const [authenticityStatus, setAuthenticityStatus] = useState(null);
  const qrReaderRef = useRef(null);

  const API_URL = "http://localhost:3001";

  const handleScan = async (data) => {
    if (data && !isProcessing) {
      setIsProcessing(true);
      
      try {
        // Parse QR data
        let qrData;
        try {
          qrData = JSON.parse(data);
        } catch {
          // If not JSON, treat as direct product ID
          qrData = { productId: data };
        }

        // Fetch product data from blockchain
        const response = await fetch(`${API_URL}/api/qr/scan/${encodeURIComponent(data)}`);
        
        if (!response.ok) {
          throw new Error('Product not found or invalid QR code');
        }

        const result = await response.json();
        setProductData(result.product);
        setAuthenticityStatus(result.authenticity);

        // Call success callback with full data
        if (onScanSuccess) {
          onScanSuccess({
            qrData: qrData,
            product: result.product,
            authenticity: result.authenticity
          });
        }

      } catch (error) {
        console.error('Scan processing error:', error);
        setError('Failed to process QR code. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Failed to access camera. Please check camera permissions and try again.');
  };

  const handleRetry = () => {
    setError(null);
    setProductData(null);
    setAuthenticityStatus(null);
    setIsProcessing(false);
    if (qrReaderRef.current) {
      qrReaderRef.current.openImageDialog();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Mobile-specific styles
  const mobileStyles = isMobile ? {
    container: "fixed inset-0 bg-black flex flex-col",
    header: "bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white",
    content: "flex-1 flex flex-col",
    scanner: "flex-1 relative"
  } : {
    container: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50",
    header: "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 p-6 text-white relative",
    content: "bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden",
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
              className="p-2 rounded-xl cursor-pointer bg-white/20 hover:bg-white/30 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scanner Content */}
        <div className={mobileStyles.scanner}>
          {error ? (
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Error</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2 inline" />
                Try Again
              </button>
            </div>
          ) : isProcessing ? (
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing...</h3>
              <p className="text-gray-600">Verifying product on blockchain</p>
            </div>
          ) : productData ? (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
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
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">{productData.name}</h4>
                <p className="text-sm text-gray-600 mb-1">Brand: {productData.brand}</p>
                <p className="text-sm text-gray-600 mb-1">SKU: {productData.sku}</p>
                <p className="text-sm text-gray-600">Origin: {productData.origin.country}</p>
              </div>

              {/* Authenticity Status */}
              <div className={`rounded-xl p-4 mb-4 ${
                authenticityStatus?.verified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
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
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Scan Another Product
              </button>
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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

export default QRCodeScanner; 