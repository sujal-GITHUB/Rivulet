import React, { useState } from 'react';
import { QrCode, Users, Star, Sparkles, Camera } from 'lucide-react';
import CameraScanner from './CameraScanner';

const ScanView = ({ handleScan, onQRScan, isLoading, error, MOCK_PRODUCT_ID, userPoints }) => {
  const [showCamera, setShowCamera] = useState(false);

  const handleCameraScan = (decodedText) => {
    // For now, we'll use the scanned text as the product ID
    // In a real app, you'd parse the QR code content and extract the product ID
    const productId = decodedText || MOCK_PRODUCT_ID;
    
    // Close camera and trigger the scan process
    setShowCamera(false);
    
    // Simulate the scan process with the scanned product ID
    setTimeout(() => {
      handleScan(productId);
    }, 500);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md w-full text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
                Rivulet
              </h1>
              <p className="text-gray-600 text-lg font-medium">Blockchain-powered product transparency</p>
            </div>

            {/* QR Code Scanner Area */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-8 border border-gray-200/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <QrCode className="w-full h-full text-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Point your camera at the QR code</p>
              </div>
            </div>

            {/* Scan Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => onQRScan()}
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Scan QR Code
                </span>
              </button>

              <button
                onClick={() => handleScan(MOCK_PRODUCT_ID)}
                disabled={isLoading}
                className="w-full cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className="relative flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Demo Scan (Product #{MOCK_PRODUCT_ID})
                </span>
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-gray-700 font-medium">{userPoints} points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showCamera && (
        <CameraScanner
          onScanSuccess={handleCameraScan}
          onClose={handleCameraClose}
        />
      )}
    </>
  );
};

export default ScanView;
