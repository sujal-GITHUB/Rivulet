import React from 'react';
import { Calendar, CheckCircle, ArrowRight, MapPin, Truck, Factory, Store, Package, ArrowLeft, Route } from 'lucide-react';

const JourneyView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  const getStepIcon = (step) => {
    const stepLower = step.toLowerCase();
    if (stepLower.includes('manufacture') || stepLower.includes('factory')) return <Factory className="w-4 h-4" />;
    if (stepLower.includes('transport') || stepLower.includes('shipping')) return <Truck className="w-4 h-4" />;
    if (stepLower.includes('warehouse') || stepLower.includes('storage')) return <Package className="w-4 h-4" />;
    if (stepLower.includes('retail') || stepLower.includes('store')) return <Store className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('done')) return 'text-green-700 bg-green-50 border-green-200';
    if (statusLower.includes('in progress') || statusLower.includes('processing')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900 p-6 text-white relative">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Route className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Supply Chain Journey</h1>
                <p className="text-gray-300 text-sm">Track your product's complete journey</p>
              </div>
            </div>
            
            {/* Back Button */}
            <button
              onClick={() => setCurrentView('overview')}
              className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors flex items-center"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </button>
          </div>

          <div className="p-6">
            {/* Journey Steps */}
            <div className="space-y-4 mb-6">
              {productData.journey.map((step, i) => (
                <div key={i} className="relative">
                  {/* Timeline connector */}
                  {i < productData.journey.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-300"></div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    {/* Step indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 bg-gray-100 rounded-lg">
                            {getStepIcon(step.step)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{step.step}</h3>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>{step.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                          {step.status}
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-gray-600">
                        <ArrowRight className="w-3 h-3 mr-1 text-gray-500" />
                        <span>Step {i + 1} of {productData.journey.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Journey Complete</h3>
                  <p className="text-gray-600 text-xs">All {productData.journey.length} steps verified on blockchain</p>
                </div>
                <div className="bg-gray-900 text-white p-2 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('overview')}
                className="w-full bg-gray-900 text-white p-4 rounded-lg flex justify-between items-center hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center text-sm font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setCurrentView('scan')}
                className="w-full bg-white border border-gray-300 text-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center text-sm font-medium">
                  <Package className="w-4 h-4 mr-2 text-gray-600" />
                  Scan Another Product
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyView;
