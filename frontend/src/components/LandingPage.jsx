import React from 'react';
import { QrCode, Shield, Globe, Users, Star, ArrowRight, CheckCircle, User, LogOut } from 'lucide-react';

const LandingPage = ({ setCurrentView, isAuthenticated, userData, onLogout }) => {
  // Helper to check authentication and route accordingly
  const handleScanClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentView('scan');
    } else {
      setCurrentView('/role-selection'); // Direct to role selection
    }
  };

  // Helper to check if user is customer
  const isCustomer = userData?.role === 2 || userData?.role === 'CUSTOMER';
  
  // Helper to handle dashboard navigation
  const handleDashboardClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                Rivulet
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated && !isCustomer ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-gray-900 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={handleScanClick}
                  className="bg-gray-900 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Start Scanning</span>
                  <span className="sm:hidden">Scan</span>
                </button>
              )}
              
              {/* User Profile / Sign In */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 sm:space-x-2 bg-white border border-gray-300 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:block">
                      {userData?.username || 'User'}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500 border-b border-gray-100">
                        Signed in as {userData?.username || 'User'}
                      </div>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentView('/role-selection')}
                  className="flex items-center space-x-1 sm:space-x-2 bg-white border border-gray-300 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-20 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Blockchain-Powered Transparency</span>
            </div>
            
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
              Discover the
              <span className="text-gray-900"> Truth</span>
              <br />
              Behind Every Product
            </h1>
            
            <p className="text-base xs:text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Scan any product's QR code to unlock its complete supply chain journey. 
              Verify authenticity, sustainability, and ethical sourcing in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              {isAuthenticated && !isCustomer ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleScanClick}
                  className="bg-gray-900 cursor-pointer text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <QrCode className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Scan Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </span>
                </button>
              )}
              <button
                onClick={() => setCurrentView('/role-selection')}
                className="bg-white border cursor-pointer border-gray-300 text-gray-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Join US
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Why Choose Rivulet?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of product transparency with blockchain-powered verification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Blockchain Verified</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Every product detail is verified and stored on the blockchain, ensuring complete transparency and immutability.
              </p>
              <div className="flex items-center text-gray-700 font-medium text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                Tamper-proof records
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Global Supply Chain</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Track products from raw materials to your hands. See every step of the journey with detailed location data.
              </p>
              <div className="flex items-center text-gray-700 font-medium text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                Real-time tracking
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-8 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Sustainability Score</h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                Get instant sustainability ratings and certifications. Make informed choices for a better planet.
              </p>
              <div className="flex items-center text-gray-700 font-medium text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                Eco-friendly insights
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600">
              Three simple steps to unlock product transparency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Scan QR Code</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Point your camera at any product's QR code to instantly connect to our blockchain network.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">View Journey</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Explore the complete supply chain journey with verified data from manufacturers to retailers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-lg sm:text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Make Informed Choice</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get sustainability scores, certifications, and make conscious purchasing decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Ready to Discover the Truth?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Join millions of conscious consumers who trust Rivulet for product transparency
          </p>
          
          {isAuthenticated && !isCustomer ? (
            <button
              onClick={handleDashboardClick}
              className="bg-gray-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </span>
            </button>
          ) : (
            <button
              onClick={handleScanClick}
              className="bg-gray-900 cursor-pointer text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-base sm:text-lg hover:bg-gray-800 transition-colors"
            >
              <span className="flex items-center">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Scan Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </span>
            </button>
          )}
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-600 text-xs sm:text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>100% blockchain verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span className="text-xl font-bold">Rivulet</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span>© 2025 Rivulet. All rights reserved.</span>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 