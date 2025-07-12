import React from 'react';
import { Leaf, Award, MapPin, Truck, Factory, Shield, ChevronRight } from 'lucide-react';

const OverviewView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-xl bg-gray-300"></div>
                <div>
                  <h1 className="text-2xl font-bold">{productData.name}</h1>
                  <p className="text-green-100">{productData.brand}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-semibold">Blockchain Verified</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-2xl text-center">
                <Leaf className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-800">Sustainability</h3>
                <div className="text-3xl font-bold text-green-600">{productData.sustainability.overallScore}/10</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl text-center">
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-800">Certifications</h3>
                <div className="text-3xl font-bold text-blue-600">{productData.manufacturing.certifications.length}</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl text-center">
                <MapPin className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-purple-800">Origin</h3>
                <div className="text-lg font-bold text-purple-600">{productData.origin.country}</div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setCurrentView('journey')}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-xl flex justify-between items-center"
              >
                <span className="flex items-center"><Truck className="w-5 h-5 mr-3" /> Supply Chain Journey</span>
                <ChevronRight />
              </button>

              <button
                onClick={() => setCurrentView('details')}
                className="w-full bg-white border p-4 rounded-xl flex justify-between items-center"
              >
                <span className="flex items-center"><Factory className="w-5 h-5 mr-3" /> Product Details</span>
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
