import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Shield, 
  Users, 
  Plus, 
  FileText, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  QrCode,
  ArrowLeft,
  Award,
  Star,
  Calendar,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Download,
  X
} from 'lucide-react';
import { API_URL } from '../config/api';

const Dashboard = ({ userRole, userData, setCurrentView, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  useEffect(() => {
    // Load dashboard data based on user role
    loadDashboardData();
    
    // Test API connectivity
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection to:', API_URL);
        const response = await fetch(`${API_URL}/api/products`);
        console.log('API test response status:', response.status);
        if (response.ok) {
          console.log('✅ API connection successful');
        } else {
          console.log('❌ API connection failed:', response.status);
        }
      } catch (error) {
        console.log('❌ API connection error:', error.message);
      }
    };
    
    testApiConnection();
  }, [userRole]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch real products from backend
      const productsResponse = await fetch(`${API_URL}/api/products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products.map(product => ({
          id: product.id,
          name: product.name,
          status: product.journey.length > 0 ? 
            product.journey[product.journey.length - 1].status : 
            'Registered',
          location: product.journey.length > 0 ? 
            product.journey[product.journey.length - 1].location : 
            product.origin.farm
        })));
      } else {
        // Fallback to mock data if backend fails
        setProducts([
          { id: 1, name: "Organic Quinoa", status: "In Transit", location: "Warehouse A" },
          { id: 2, name: "Premium Coffee", status: "Certified", location: "Processing Plant" },
          { id: 3, name: "Fresh Vegetables", status: "Harvested", location: "Farm" }
        ]);
      }
      
      // Mock certifications data (can be enhanced later)
      setCertifications([
        {
          id: 1,
          name: "Organic Certification",
          type: "Organic",
          status: "Active",
          issuedDate: "2024-01-15",
          expiryDate: "2025-01-15",
          issuer: "USDA Organic",
          productId: "PROD001",
          description: "Certified organic farming practices",
          verificationUrl: "https://blockchain.verify/cert/001"
        },
        {
          id: 2,
          name: "Fair Trade Certification",
          type: "Fair Trade",
          status: "Active",
          issuedDate: "2024-02-20",
          expiryDate: "2025-02-20",
          issuer: "Fair Trade International",
          productId: "PROD002",
          description: "Fair trade practices and worker rights",
          verificationUrl: "https://blockchain.verify/cert/002"
        },
        {
          id: 3,
          name: "Sustainability Certification",
          type: "Sustainability",
          status: "Pending",
          issuedDate: null,
          expiryDate: null,
          issuer: "Green Standards",
          productId: "PROD003",
          description: "Environmental sustainability practices",
          verificationUrl: null
        }
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to mock data on error
      setProducts([
        { id: 1, name: "Organic Quinoa", status: "In Transit", location: "Warehouse A" },
        { id: 2, name: "Premium Coffee", status: "Certified", location: "Processing Plant" },
        { id: 3, name: "Fresh Vegetables", status: "Harvested", location: "Farm" }
      ]);
      setIsLoading(false);
    }
  };

  const generateProductQR = async (productId) => {
    setIsGeneratingQR(true);
    try {
      console.log(`Generating QR code for product ${productId} using API: ${API_URL}/api/qr/product/${productId}`);
      
      const response = await fetch(`${API_URL}/api/qr/product/${productId}`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to generate QR code: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('QR data received:', data);
      
      if (!data.qrCodeDataURL) {
        throw new Error('QR code data URL not found in response');
      }
      
      setQrData(data);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert(`Failed to generate QR code: ${error.message}`);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData?.qrCodeDataURL) return;
    
    const link = document.createElement('a');
    link.href = qrData.qrCodeDataURL;
    link.download = `product-qr-${qrData.productInfo?.id || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleConfig = () => {
    switch (userRole) {
      case 'CUSTOMER':
        return {
          title: 'Customer Dashboard',
          icon: Users,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'scan', label: 'Scan QR Code', icon: QrCode },
            { id: 'history', label: 'Scan History', icon: Clock },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'insights', label: 'Product Insights', icon: BarChart3 }
          ],
          color: 'indigo'
        };
      case 'PARTNER':
        return {
          title: 'Partner Dashboard',
          icon: Package,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'My Products', icon: Package },
            { id: 'register', label: 'Register Product', icon: Plus },
            { id: 'journey', label: 'Journey Management', icon: MapPin },
            { id: 'certifications', label: 'Certifications', icon: Award }
          ],
          color: 'blue'
        };
      default:
        return {
          title: 'Dashboard',
          icon: BarChart3,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 }
          ],
          color: 'gray'
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Certifications</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{certifications.filter(c => c.status === 'Active').length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Certifications</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{certifications.filter(c => c.status === 'Pending').length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Customer Quick Actions */}
          {userRole === 'CUSTOMER' && (
            <>
              <button 
                onClick={() => setCurrentView('scan')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Scan QR Code</p>
                  <p className="text-xs sm:text-sm text-gray-600">Verify product authenticity</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('history')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Scan History</p>
                  <p className="text-xs sm:text-sm text-gray-600">View recent scans</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('certifications')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Certifications</p>
                  <p className="text-xs sm:text-sm text-gray-600">View product certifications</p>
                </div>
              </button>
            </>
          )}

          {/* Partner Quick Actions */}
          {userRole === 'PARTNER' && (
            <>
              <button 
                onClick={() => setActiveTab('register')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Register Product</p>
                  <p className="text-xs sm:text-sm text-gray-600">Add new product</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('products')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">My Products</p>
                  <p className="text-xs sm:text-sm text-gray-600">Manage products</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('journey')}
                className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Journey Management</p>
                  <p className="text-xs sm:text-sm text-gray-600">Track supply chain</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-900">Product "Organic Quinoa" certified</p>
              <p className="text-xs sm:text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-900">Shipment "COFFEE-001" in transit</p>
              <p className="text-xs sm:text-sm text-gray-600">4 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-900">Certification "Fair Trade" expiring soon</p>
              <p className="text-xs sm:text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      {/* Certification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{certifications.filter(c => c.status === 'Active').length}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{certifications.filter(c => c.status === 'Pending').length}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{certifications.filter(c => c.status === 'Expired').length}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Certifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
            {(userRole === 'MANUFACTURER' || userRole === 'CERTIFIER' || userRole === 'ADMIN') && (
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {certifications.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No certifications found</p>
              <p className="text-sm text-gray-400">Certifications will appear here once added</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 font-medium text-gray-700">{cert.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Issuer:</span>
                          <span className="ml-2 font-medium text-gray-700">{cert.issuer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Product ID:</span>
                          <span className="ml-2 font-medium text-gray-700">{cert.productId}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-gray-600">
                            {cert.issuedDate ? `Issued: ${cert.issuedDate}` : 'Not issued yet'}
                          </span>
                        </div>
                        {cert.expiryDate && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-gray-400" />
                            <span className="text-gray-600">Expires: {cert.expiryDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        cert.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                        cert.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {cert.status}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        {cert.verificationUrl && (
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {(userRole === 'CERTIFIER' || userRole === 'ADMIN') && (
                          <>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPendingCertifications = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Pending Certifications</h3>
      </div>
      <div className="p-6">
        {certifications.filter(c => c.status === 'Pending').length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No pending certifications</p>
            <p className="text-sm text-gray-400">All certifications are up to date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.filter(c => c.status === 'Pending').map((cert) => (
              <div key={cert.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                    <p className="text-sm text-yellow-700 mt-1">Awaiting approval from {cert.issuer}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Products</h3>
      </div>
      <div className="p-6">
        {products.map(product => (
          <div key={product.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 rounded-lg px-4 transition-colors">
            <div>
              <h4 className="font-semibold text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                product.status === 'Certified' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                product.status === 'In Transit' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {product.status}
              </span>
              
              <button
                onClick={() => generateProductQR(product.id)}
                disabled={isGeneratingQR}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <QrCode className="w-3 h-3" />
                <span>View QR</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegisterProduct = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Register New Product</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin Farm</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origin Country</label>
            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors" />
          </div>
        </div>
        <button type="submit" className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Register Product
        </button>
      </form>
    </div>
  );

  const renderScanQR = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Scan QR Code</h3>
      <div className="text-center">
        <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-16 h-16 text-white" />
        </div>
        <p className="text-gray-600 mb-6">Click the button below to start scanning QR codes and discover product insights.</p>
        <button 
          onClick={() => setCurrentView('scan')}
          className="bg-gray-900 text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Start Scanning
        </button>
      </div>
    </div>
  );

  const renderScanHistory = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Scan History</h3>
      </div>
      <div className="p-6">
        <div className="text-center text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No scan history yet</p>
          <p className="text-sm">Start scanning QR codes to see your history here</p>
        </div>
      </div>
    </div>
  );

  const renderJourneyManagement = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Journey Management</h3>
      <p className="text-gray-600 mb-6">Update journey steps for your registered products.</p>
      
      <div className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors">
            <option value="">Choose a product...</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>

        {/* Journey Step Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Step Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              placeholder="e.g., Processing, Packaging, Shipping"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              placeholder="e.g., Warehouse A, Processing Plant"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors">
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
              placeholder="e.g., Temperature: 22°C, Humidity: 60%"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Add Journey Step
        </button>
      </div>
    </div>
  );

  const renderProductInsights = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Product Insights</h3>
      <div className="text-center text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No insights available yet</p>
        <p className="text-sm">Scan products to generate insights and analytics</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'products':
        return renderProducts();
      case 'register':
        return renderRegisterProduct();
      case 'journey':
        return renderJourneyManagement();
      case 'scan':
        return renderScanQR();
      case 'history':
        return renderScanHistory();
      case 'certifications':
        return renderCertifications();
      case 'pending':
        return renderPendingCertifications();
      case 'insights':
        return renderProductInsights();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="w-full">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gray-900 p-4 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{config.title}</h1>
                  <p className="text-gray-300 text-xs sm:text-sm">Welcome back, {userData?.username || 'User'}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  } else {
                    // Fallback: Clear user data and redirect to landing
                    localStorage.removeItem('userData');
                    localStorage.removeItem('userRole');
                    setCurrentView('landing');
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-4 sm:space-x-8 px-4 sm:px-8 min-w-max">
              {config.tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 border-b-2 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <TabIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 lg:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && qrData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gray-900 p-4 sm:p-6 text-white relative">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Product QR Code</h2>
                  <p className="text-gray-300 text-xs sm:text-sm">{qrData.productInfo?.name}</p>
                </div>
              </div>
              
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* QR Code Content */}
            <div className="p-4 sm:p-6">
              {/* QR Code Image */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <img 
                    src={qrData.qrCodeDataURL} 
                    alt="Product QR Code" 
                    className="w-48 h-48 sm:w-64 sm:h-64 mx-auto"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Scan this QR code to view complete product details and journey
                </p>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Product Information</h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{qrData.productInfo?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{qrData.productInfo?.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{qrData.productInfo?.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium">#{qrData.productInfo?.id}</span>
                  </div>
                </div>
              </div>

              {/* QR Data Preview */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">QR Code Contains</h3>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Complete product details</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Supply chain journey</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Certifications</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Sustainability metrics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    <span>Blockchain verification</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={downloadQRCode}
                  className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </button>
                
                <button
                  onClick={() => setShowQRModal(false)}
                  className="w-full bg-gray-100 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 