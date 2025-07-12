import React, { useState } from 'react';
import ScanView from './components/ScanView';
import ScanningView from './components/ScanningView';
import OverviewView from './components/OverviewView';
import JourneyView from './components/JourneyView';
import DetailsView from './components/DetailsView';

const API_URL = "http://localhost:3001";
const MOCK_PRODUCT_ID = 1;

const App = () => {
  const [currentView, setCurrentView] = useState('scan');
  const [scanProgress, setScanProgress] = useState(0);
  const [userPoints, setUserPoints] = useState(1247);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setCurrentView('scanning');
    setIsLoading(true);
    setError(null);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 20, 100));
    }, 300);

    try {
      const response = await fetch(`${API_URL}/api/product/${MOCK_PRODUCT_ID}`);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setProductData(data);

      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        setCurrentView('overview');
        setIsLoading(false);
        setUserPoints(prev => prev + 50);
      }, 1500);
    } catch (err) {
      clearInterval(interval);
      setError(err.message);
      setIsLoading(false);
      setTimeout(() => setCurrentView('scan'), 3000);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'scan':
        return (
          <ScanView
            handleScan={handleScan}
            isLoading={isLoading}
            error={error}
            MOCK_PRODUCT_ID={MOCK_PRODUCT_ID}
            userPoints={userPoints}
          />
        );
      case 'scanning':
        return <ScanningView scanProgress={scanProgress} />;
      case 'overview':
        return (
          <OverviewView
            productData={productData}
            setCurrentView={setCurrentView}
          />
        );
      case 'journey':
        return (
          <JourneyView
            productData={productData}
            setCurrentView={setCurrentView}
          />
        );
      case 'details':
        return (
          <DetailsView
            productData={productData}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return <ScanView handleScan={handleScan} />;
    }
  };

  return <div className="font-sans bg-gray-100">{renderCurrentView()}</div>;
};

export default App;
