import React from 'react';
import { QrCode, Shield, Globe, Users, Star, ArrowRight, Sparkles, CheckCircle, Zap, Award } from 'lucide-react';

const LandingPage = ({ setCurrentView }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
                Rivulet
              </span>
            </div>
            <button
              onClick={() => setCurrentView('scan')}
              className="bg-gradient-to-r from-blue-500 cursor-pointer to-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Scanning
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Sparkles className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Blockchain-Powered Transparency</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Discover the
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Truth</span>
              <br />
              Behind Every Product
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Scan any product's QR code to unlock its complete supply chain journey. 
              Verify authenticity, sustainability, and ethical sourcing in seconds.
            </p>
            
            <div className="flex flex-col cursor-pointer sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => setCurrentView('scan')}
                className="bg-gradient-to-r cursor-pointer from-blue-400 via-blue-600 to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative flex items-center cursor-pointer">
                  <QrCode className="w-6 h-6 mr-2" />
                  Scan Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rivulet?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-semibold">
              Experience the future of product transparency with blockchain-powered verification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Blockchain Verified</h3>
              <p className="text-gray-600 mb-6">
                Every product detail is verified and stored on the blockchain, ensuring complete transparency and immutability.
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Tamper-proof records
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Supply Chain</h3>
              <p className="text-gray-600 mb-6">
                Track products from raw materials to your hands. See every step of the journey with detailed location data.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Real-time tracking
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sustainability Score</h3>
              <p className="text-gray-600 mb-6">
                Get instant sustainability ratings and certifications. Make informed choices for a better planet.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                Eco-friendly insights
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 font-semibold">
              Three simple steps to unlock product transparency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Scan QR Code</h3>
              <p className="text-gray-600 font-semibold">
                Point your camera at any product's QR code to instantly connect to our blockchain network.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">View Journey</h3>
              <p className="text-gray-600 font-semibold">
                Explore the complete supply chain journey with verified data from manufacturers to retailers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Make Informed Choice</h3>
              <p className="text-gray-600 font-semibold">
                Get sustainability scores, certifications, and make conscious purchasing decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500/10 to-blue-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to Discover the Truth?
          </h2>
          <p className="text-xl text-gray-700/90 mb-8">
            Join millions of conscious consumers who trust Rivulet for product transparency
          </p>
          
          <button
            onClick={() => setCurrentView('scan')}
            className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <span className="flex items-center cursor-pointer">
              <QrCode className="w-6 h-6 mr-2" />
              Scan Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </button>
          
          <div className="mt-8 flex justify-center items-center space-x-8 text-black/80 text-sm">
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