import React from 'react';
import { Calendar, CheckCircle, ArrowRight, MapPin, Truck, Factory, Store, Package } from 'lucide-react';
import Header from './Header';

const JourneyView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  const getStepIcon = (step) => {
    const stepLower = step.toLowerCase();
    if (stepLower.includes('manufacture') || stepLower.includes('factory')) return <Factory className="w-5 h-5" />;
    if (stepLower.includes('transport') || stepLower.includes('shipping')) return <Truck className="w-5 h-5" />;
    if (stepLower.includes('warehouse') || stepLower.includes('storage')) return <Package className="w-5 h-5" />;
    if (stepLower.includes('retail') || stepLower.includes('store')) return <Store className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('done')) return 'text-green-600 bg-green-50 border-green-200';
    if (statusLower.includes('in progress') || statusLower.includes('processing')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <Header title="Supply Chain Journey" onBack={() => setCurrentView('overview')} />

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Journey</h2>
              <p className="text-gray-600">Track your product's complete supply chain journey</p>
            </div>

            <div className="space-y-6">
              {productData.journey.map((step, i) => (
                <div key={i} className="relative">
                  {/* Timeline connector */}
                  {i < productData.journey.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-green-200 to-blue-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Step indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                            {getStepIcon(step.step)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{step.step}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{step.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                          {step.status}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 mr-2 text-green-500" />
                        <span>Step {i + 1} of {productData.journey.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary card */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Journey Complete</h3>
                  <p className="text-gray-600 text-sm">All {productData.journey.length} steps have been verified on the blockchain</p>
                </div>
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyView;
