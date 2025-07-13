import React from 'react';
import { Leaf, Award, MapPin, Truck, Factory, Shield, ChevronRight, QrCode, Sparkles, Globe, Badge } from 'lucide-react';

const OverviewView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 p-8 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-5 sm:mb-0">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{productData.name}</h1>
                    <p className="text-green-100 text-md">{productData.brand}</p>
                  </div>
                </div>
                <div className='flex flex-col items-center gap-2'>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-semibold">Blockchain Verified</span>
                </div>
                <div className="rounded-xl">
                <div className="flex items-center gap-4 justify-between">
                  <span className="text-white/90 text-sm">Product ID</span>
                  <span className="font-mono text-white font-semibold">#{productData.id || '12345'}</span>
                </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Sustainability</h3>
                  <div className="text-4xl font-bold text-green-600">{productData.sustainability.overallScore}/10</div>
                  <p className="text-green-600 text-sm mt-2">Excellent Score</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                                     <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                     <Badge className="w-8 h-8 text-white" />
                   </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Certifications</h3>
                  <div className="text-4xl font-bold text-blue-600">{productData.manufacturing.certifications.length}</div>
                  <p className="text-blue-600 text-sm mt-2">Quality Assured</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200/50 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 rounded-2xl"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">Origin</h3>
                  <div className="text-2xl font-bold text-purple-600">{productData.origin.country}</div>
                  <p className="text-purple-600 text-sm mt-2">Ethically Sourced</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setCurrentView('journey')}
                className="w-full bg-gradient-to-r cursor-pointer from-blue-400 via-blue-600 to-blue-400 text-white p-6 rounded-2xl flex justify-between items-center hover:shadow-xl transition-all duration-300 transform hover:scale-102 group"
              >
                <span className="flex items-center text-lg font-semibold">
                  <Truck className="w-6 h-6 mr-3" />
                  Supply Chain Journey
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => setCurrentView('details')}
                className="w-full cursor-pointer bg-white/80 backdrop-blur-sm border border-gray-200 p-6 rounded-2xl flex justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:scale-102 group"
              >
                <span className="flex items-center text-lg font-semibold text-gray-700">
                  <Factory className="w-6 h-6 mr-3 text-gray-600" />
                  Product Details
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button
                onClick={() => setCurrentView('scan')}
                className="w-full bg-gradient-to-r cursor-pointer from-gray-500 via-gray-600 to-gray-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  <Sparkles className="w-5 h-5 mr-2" />
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
