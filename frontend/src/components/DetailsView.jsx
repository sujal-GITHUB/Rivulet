import React from 'react';
import { Award, Shield, ExternalLink, ArrowLeft, Package, CheckCircle } from 'lucide-react';

const DetailsView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('overview')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Product Details</h1>
                <p className="text-gray-300 text-sm">Complete product information and blockchain verification</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Product Info Card */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{productData.name}</h2>
                  <p className="text-gray-600">{productData.brand}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Blockchain Hash</span>
                  </div>
                  <p className="text-sm font-mono text-gray-600 break-all">{productData.blockchain.hash}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Verification Status</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-600 font-medium">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
                  <p className="text-gray-600">Quality and safety certifications</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {productData.manufacturing.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockchain Explorer Link */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Blockchain Explorer</h3>
                    <p className="text-gray-600">View transaction details on the blockchain</p>
                  </div>
                </div>
                <a 
                  href="#" 
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Explorer</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => setCurrentView('overview')}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Back to Overview
              </button>
              
              <button
                onClick={() => setCurrentView('scan')}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Scan Another Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
