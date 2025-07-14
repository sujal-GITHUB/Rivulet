import React from 'react';
import { Leaf, Award, MapPin, Truck, Factory, Shield, ChevronRight, QrCode, Globe, Badge, ArrowLeft, Package, Users, Calendar, TrendingUp, Zap, Route, Package2 } from 'lucide-react';

const OverviewView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  // Check if product is from a partner
  const isPartnerProduct = productData.isPartnerProduct !== false; // Default to true if not specified

  if (!isPartnerProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-full mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="bg-red-600 p-6 text-white relative">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Invalid Product QR</h1>
                  <p className="text-red-200 text-sm">Product not registered by a verified partner</p>
                </div>
              </div>
              
              {/* Back Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setCurrentView('scan')}
                  className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Back to Scanner
                </button>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Invalid QR Code</h3>
              <p className="text-gray-600 mb-6">
                This QR code is not from a product registered by a verified partner. 
                Only products uploaded by partners can be scanned and viewed.
              </p>
              <button
                onClick={() => setCurrentView('scan')}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Scan Another QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900 p-6 text-white relative">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">{productData.name}</h1>
                <p className="text-gray-300 text-sm">{productData.brand}</p>
              </div>
            </div>
            
            {/* Top Right Corner Elements */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setCurrentView('scan')}
                className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Back
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Verified Badge and Product ID */}
            <div className="mb-4 flex justify-between gap-3">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Verified</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 text-xs">Product ID: </span>
                <span className="font-mono text-gray-700 text-xs">#{productData.id || '12345'}</span>
              </div>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Leaf className="w-3 h-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">Sustainability</h3>
                  <div className="text-sm font-bold text-gray-900">{productData.sustainability.overallScore}/10</div>
                  <p className="text-gray-500 text-xs">Score</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Badge className="w-3 h-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">Certifications</h3>
                  <div className="text-sm font-bold text-gray-900">{productData.manufacturing.certifications.length}</div>
                  <p className="text-gray-500 text-xs">Active</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Globe className="w-3 h-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">Origin</h3>
                  <div className="text-xs font-bold text-gray-900">{productData.origin.country}</div>
                  <p className="text-gray-500 text-xs">Source</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                    <Package className="w-3 h-3 text-gray-600" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">SKU</h3>
                  <div className="text-xs font-bold text-gray-900">{productData.sku}</div>
                  <p className="text-gray-500 text-xs">Product</p>
                </div>
              </div>
            </div>

            {/* Green Score Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-green-600" />
                Green Score Analysis
              </h3>

              {/* CO2 Stats - Two Blocks */}
              <div className="flex gap-3 mb-4">
                {/* Personal CO2 Savings */}
                <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-green-700">25kg CO₂</div>
                      <p className="text-xs text-green-600">You've saved this month!</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-500">75% of goal</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CO2 Emission Display */}
                <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-green-700">~1.4kg CO₂</div>
                      <p className="text-xs text-green-600">emitted during journey</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-500">Product impact</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Factors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Route className="w-3 h-3 mr-1 text-gray-600" />
                    <span className="font-medium text-gray-700">Distance</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">2,450 km</div>
                  <p className="text-gray-600">Farm to factory</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Truck className="w-3 h-3 mr-1 text-gray-600" />
                    <span className="font-medium text-gray-700">Transport</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">Sea + Truck</div>
                  <p className="text-gray-600">Mixed method</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Package2 className="w-3 h-3 mr-1 text-gray-600" />
                    <span className="font-medium text-gray-700">Packaging</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">Recycled</div>
                  <p className="text-gray-600">85% recycled</p>
                </div>
              </div>

              {/* AI + Blockchain Note */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center text-xs text-gray-700">
                  <Shield className="w-3 h-3 mr-2" />
                  <span>Calculated using AI + blockchain event data</span>
                </div>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {/* Manufacturing Info */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                  <Factory className="w-3 h-3 mr-2 text-gray-600" />
                  Manufacturing
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{productData.manufacturing.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{productData.manufacturing.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certifications:</span>
                    <span className="font-medium">{productData.manufacturing.certifications.length}</span>
                  </div>
                </div>
              </div>

              {/* Supply Chain Info */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                  <Truck className="w-3 h-3 mr-2 text-gray-600" />
                  Supply Chain
                </h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium">{productData.origin.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{productData.origin.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="font-medium text-xs">{productData.origin.coordinates}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-gray-600" />
                Sustainability Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{productData.sustainability.carbonFootprint}</div>
                  <p className="text-gray-500">Carbon Footprint</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{productData.sustainability.waterUsage}</div>
                  <p className="text-gray-500">Water Usage</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{productData.sustainability.recycledContent}</div>
                  <p className="text-gray-500">Recycled Content</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{productData.sustainability.energyEfficiency}</div>
                  <p className="text-gray-500">Energy Efficiency</p>
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('journey')}
                className="w-full bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center text-sm font-medium">
                  <Truck className="w-4 h-4 mr-2" />
                  Supply Chain Journey
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('details')}
                className="w-full bg-white border border-gray-300 text-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center text-sm font-medium">
                  <Factory className="w-4 h-4 mr-2 text-gray-600" />
                  Product Details
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentView('scan')}
                className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-600 transition-colors"
              >
                <span className="flex items-center justify-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan New Product
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
