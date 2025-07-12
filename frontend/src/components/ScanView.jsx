import React from 'react';
import { QrCode, Users, Star } from 'lucide-react';

const ScanView = ({ handleScan, isLoading, error, MOCK_PRODUCT_ID, userPoints }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <QrCode className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">TrustTrace</h1>
      <p className="text-gray-600 mb-8">Blockchain-powered product transparency</p>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-500">Point your camera at the QR code</p>
      </div>

      <button
        onClick={handleScan}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Scanning..." : `Scan Product #${MOCK_PRODUCT_ID}`}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>2.3M+ scans</span>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1" />
          <span>Your Points: {userPoints}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ScanView;
