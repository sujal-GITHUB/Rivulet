import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 p-6 text-white relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"></div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    
    <div className="relative z-10 flex items-center space-x-4">
      <button
        onClick={onBack}
        className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-white/80 text-sm">Track your product's journey</p>
      </div>
    </div>
  </div>
);

export default Header;
