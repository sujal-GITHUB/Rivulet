import React, { useState, useEffect } from 'react';
import { QrCode, Users, Star, Camera, ArrowLeft, Upload } from 'lucide-react';
import CameraScanner from './CameraScanner';
import { BrowserQRCodeReader } from '@zxing/browser';
import { API_URL } from '../config/api';

const ScanView = ({ handleScan, isLoading, error, MOCK_PRODUCT_ID, userPoints, setCurrentView }) => {
  const [showCamera, setShowCamera] = useState(false);

  // Cleanup effect to ensure camera scanner is stopped when not needed
  useEffect(() => {
    return () => {
      // Ensure camera scanner is closed when component unmounts
      setShowCamera(false);
    };
  }, []);

  // Remove local handleScan; use prop instead

  const handleCameraScan = async (decodedText) => {
    let productId;
    try {
      const parsed = JSON.parse(decodedText);
      productId = parsed.productId;
    } catch {
      productId = decodedText || MOCK_PRODUCT_ID;
    }
    
    // Immediately close the camera scanner
    setShowCamera(false);
    
    // Process the scan without delay
    handleScan(productId);
  };

  const handleCameraClose = () => {
    setShowCamera(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (isLoading) return;

    try {
      // Use zxing-js/browser for robust QR decoding
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromImageElement(img);
          let productId;
          try {
            const parsed = JSON.parse(result.getText());
            productId = parsed.productId;
          } catch {
            productId = result.getText() || MOCK_PRODUCT_ID;
          }
          handleScan(productId); // Use prop
        } catch (decodeError) {
          console.error('QR decode error (zxing):', decodeError);
          alert('Could not decode QR code from uploaded image. Please try a different image.');
        }
      };

      img.onerror = () => {
        alert('Failed to load uploaded image. Please try again.');
      };
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to process uploaded file. Please try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('/home')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-8">
            
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Scan Product</h1>
              <p className="text-gray-600">Blockchain-powered product transparency</p>
            </div>

            {/* QR Code Scanner Area */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <div className="w-32 h-32 mx-auto mb-4 relative">
                <QrCode className="w-full h-full text-gray-400" />
                <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Point your camera at the QR code</p>
            </div>

            {/* Scan Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setShowCamera(true)}
                disabled={isLoading}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Scan QR Code
                </span>
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <button
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload QR Image
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                <Star className="w-4 h-4 mr-2 text-gray-600" />
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
      <div id="qr-upload-reader" style={{ display: 'none' }}></div>
    </>
  );
};

export default ScanView;
