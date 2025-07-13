import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ScanView from './components/ScanView';
import ScanningView from './components/ScanningView';
import OverviewView from './components/OverviewView';
import JourneyView from './components/JourneyView';
import DetailsView from './components/DetailsView';
import QRCodeScanner from './components/QRCodeScanner';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

const API_URL = "http://localhost:3001";
const MOCK_PRODUCT_ID = 1;

const App = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [userPoints, setUserPoints] = useState(1247);
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();

  // Check authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserData(data.user);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUserData(data.user);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setUserData(data.user);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/');
  };

  const handleScan = async (productId = MOCK_PRODUCT_ID) => {
    navigate('/scanning');
    setIsLoading(true);
    setError(null);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 20, 100));
    }, 300);

    try {
      const response = await fetch(`${API_URL}/api/product/${productId}`);
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setProductData(data);

      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(100);
        navigate('/scan/overview');
        setIsLoading(false);
        setUserPoints(prev => prev + 50);
      }, 1500);
    } catch (err) {
      clearInterval(interval);
      setError(err.message);
      setIsLoading(false);
      setTimeout(() => navigate('/scan'), 3000);
    }
  };

  const handleQRScanSuccess = (scanData) => {
    setProductData(scanData.product);
    setShowQRScanner(false);
    navigate('/scan/overview');
    setUserPoints(prev => prev + 50);
  };

  const getRoleName = (roleNumber) => {
    const roles = {
      1: 'MANUFACTURER',
      2: 'LOGISTICS_PARTNER', 
      3: 'CERTIFIER',
      4: 'ADMIN'
    };
    return roles[roleNumber] || 'USER';
  };

  return (
    <div className="font-sans">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LandingPage setCurrentView={path => navigate(path)} />} />
        <Route path="/login" element={
          <Login onLogin={handleLogin} onNavigate={path => navigate(path)} />
        } />
        <Route path="/register" element={
          <Register onRegister={handleRegister} onNavigate={path => navigate(path)} />
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Dashboard 
              userRole={getRoleName(userData?.role)} 
              userData={userData}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* QR Scanner */}
        {showQRScanner && (
          <QRCodeScanner
            onScanSuccess={handleQRScanSuccess}
            onClose={() => setShowQRScanner(false)}
            isMobile={window.innerWidth <= 768}
          />
        )}

        {/* Product scanning routes */}
        <Route path="/scan" element={
          <ScanView
            handleScan={handleScan}
            onQRScan={() => setShowQRScanner(true)}
            isLoading={isLoading}
            error={error}
            MOCK_PRODUCT_ID={MOCK_PRODUCT_ID}
            userPoints={userPoints}
          />
        } />
        <Route path="/scanning" element={<ScanningView scanProgress={scanProgress} />} />
        <Route path="/scan/overview" element={
          <OverviewView
            productData={productData}
            setCurrentView={path => navigate(path)}
          />
        } />
        <Route path="/details" element={
          <DetailsView
            productData={productData}
            setCurrentView={path => navigate(path)}
          />
        } />
        <Route path="/journey" element={
          <JourneyView
            productData={productData}
            setCurrentView={path => navigate(path)}
          />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

export default App;
