import React from 'react';
import { Award, Shield, ExternalLink } from 'lucide-react';
import Header from './Header';

const DetailsView = ({ productData, setCurrentView }) => {
  if (!productData) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl">
          <Header title="Product Details" onBack={() => setCurrentView('overview')} />

          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-bold">Certifications:</h3>
              {productData.manufacturing.certifications.map((cert, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="font-bold">Blockchain:</h3>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{productData.blockchain.hash}</span>
              </div>
              <a href="#" className="flex items-center text-blue-600">
                <ExternalLink className="w-4 h-4 mr-1" /> View on Explorer
              </a>
            </div>

            <button
              onClick={() => setCurrentView('scan')}
              className="w-full bg-gray-200 p-4 rounded-xl"
            >
              Scan Another Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;
