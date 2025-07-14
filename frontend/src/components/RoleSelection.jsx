import React from 'react';
import { Users, Shield, Package, Truck, ArrowLeft, QrCode, LogIn } from 'lucide-react';

const RoleSelection = ({ onNavigate }) => {
  const handleCustomerSignIn = () => {
    onNavigate('/login?role=customer');
  };

  const handleCustomerSignUp = () => {
    onNavigate('/register?role=customer');
  };

  const handlePartnerSignIn = () => {
    onNavigate('/login?role=partner');
  };

  const handlePartnerSignUp = () => {
    onNavigate('/register?role=partner');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl w-full">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('/home')}
          className="flex items-center text-gray-600 cursor-pointer hover:text-gray-800 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Your Path</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Select how you'd like to access Rivulet's blockchain traceability network
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Customer Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 hover:shadow-md transition-shadow">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">Customer</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Scan QR codes, view product insights, and verify authenticity
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <QrCode className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Scan product QR codes
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Verify product authenticity
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Package className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                View supply chain journey
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Track product history
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleCustomerSignIn}
                className="w-full bg-gray-900 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign In as Customer
              </button>
              <button
                onClick={handleCustomerSignUp}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign Up as Customer
              </button>
            </div>
          </div>

          {/* Other Roles Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 hover:shadow-md transition-shadow">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2"> Partner</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Register products, manage supply chains, and add certifications
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Package className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Register and manage products
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Truck className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Track shipments and deliveries
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Add certifications and verifications
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 sm:mr-3 text-gray-600" />
                Manage users and system settings
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handlePartnerSignIn}
                className="w-full bg-gray-900 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign In as Partner
              </button>
              <button
                onClick={handlePartnerSignUp}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign Up as Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 