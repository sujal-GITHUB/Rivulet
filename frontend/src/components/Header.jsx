import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
    <div className="flex items-center space-x-3">
      <button
        onClick={onBack}
        className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  </div>
);

export default Header;
