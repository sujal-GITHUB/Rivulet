import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
import RoleSelection from './components/RoleSelection';

import { API_URL } from './config/api';
const MOCK_PRODUCT_ID = 1;

// Wrapper components to handle URL parameters
const LoginWrapper = ({ onLogin, onNavigate }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role');
  
  return <Login onLogin={onLogin} onNavigate={onNavigate} defaultRole={role} />;
};

const RegisterWrapper = ({ onRegister, onNavigate }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role');
  
  return <Register onRegister={onRegister} onNavigate={onNavigate} defaultRole={role} />;
};

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

  // Helper: is the current user a customer?
  const isCustomer = userData && (userData.role === 2 || userData.role === 'CUSTOMER');

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
        // Redirect customers to /scan, partners to /dashboard
        if (data.user.role === 2 || data.user.role === 'CUSTOMER') {
          navigate('/scan');
        } else {
          navigate('/dashboard');
        }
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
        // Redirect customers to /scan, partners to /dashboard
        if (data.user.role === 2 || data.user.role === 'CUSTOMER') {
          navigate('/scan');
        } else {
          navigate('/dashboard');
        }
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
      // Use the QR scan endpoint instead of product endpoint
      const response = await fetch(`${API_URL}/api/qr/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: JSON.stringify({ productId }) })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Product not found or invalid QR code');
      }
      
      const result = await response.json();
      setProductData(result.product);

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
      1: 'PARTNER',
      2: 'CUSTOMER'
    };
    return roles[roleNumber] || 'USER';
  };

  return (
    <div className="font-sans">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={
          <LandingPage 
            setCurrentView={path => navigate(path)} 
            isAuthenticated={isAuthenticated}
            userData={userData}
            onLogout={handleLogout}
          />
        } />
        <Route path="/role-selection" element={
          <RoleSelection onNavigate={path => navigate(path)} />
        } />
        <Route path="/login" element={
          <LoginWrapper onLogin={handleLogin} onNavigate={path => navigate(path)} />
        } />
        <Route path="/register" element={
          <RegisterWrapper onRegister={handleRegister} onNavigate={path => navigate(path)} />
        } />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            isCustomer ? (
              <Navigate to="/scan" replace />
            ) : (
              <Dashboard 
                userRole={getRoleName(userData?.role)} 
                userData={userData}
                onLogout={handleLogout}
              />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Product scanning routes */}
        <Route path="/scan" element={
          <ScanView
            handleScan={handleScan}
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

      {/* QR Scanner - rendered outside Routes */}
      {showQRScanner && (
        <QRCodeScanner
          onScanSuccess={handleQRScanSuccess}
          onClose={() => setShowQRScanner(false)}
          isMobile={window.innerWidth <= 768}
        />
      )}
    </div>
  );
};

export default App;
