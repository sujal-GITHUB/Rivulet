import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import Header from './Header';

const JourneyView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl">
          <Header title="Supply Chain Journey" onBack={() => setCurrentView('overview')} />

          <div className="p-6">
            {productData.journey.map((step, i) => (
              <div key={i} className="flex items-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span>{step.step} - {step.status} ({step.date})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyView;
