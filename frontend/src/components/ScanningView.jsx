import React from 'react';
import { QrCode, CheckCircle } from 'lucide-react';

const ScanningView = ({ scanProgress }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <QrCode className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping"></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scanning Product...</h2>

      <div className="bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${scanProgress}%` }}
        ></div>
      </div>

      <p className="text-gray-600 mb-4">Verifying on blockchain...</p>

      <div className="space-y-2 text-sm text-left mx-auto max-w-xs">
        <div className={`flex items-center ${scanProgress >= 20 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle className="w-4 h-4 mr-2" />QR Code Decoded</div>
        <div className={`flex items-center ${scanProgress >= 40 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle className="w-4 h-4 mr-2" />Fetching from Blockchain</div>
        <div className={`flex items-center ${scanProgress >= 60 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle className="w-4 h-4 mr-2" />Validating Supply Chain</div>
        <div className={`flex items-center ${scanProgress >= 80 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle className="w-4 h-4 mr-2" />Checking Certifications</div>
        <div className={`flex items-center ${scanProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}><CheckCircle className="w-4 h-4 mr-2" />Report Ready</div>
      </div>
    </div>
  </div>
);

export default ScanningView;
