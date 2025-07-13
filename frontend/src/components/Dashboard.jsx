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
  Settings
} from 'lucide-react';

const Dashboard = ({ userRole, userData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:3001";

  useEffect(() => {
    // Load dashboard data based on user role
    loadDashboardData();
  }, [userRole]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch role-specific data
      // For now, we'll simulate data
      setTimeout(() => {
        setProducts([
          { id: 1, name: "Organic Quinoa", status: "In Transit", location: "Warehouse A" },
          { id: 2, name: "Premium Coffee", status: "Certified", location: "Processing Plant" },
          { id: 3, name: "Fresh Vegetables", status: "Harvested", location: "Farm" }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  };

  const getRoleConfig = () => {
    switch (userRole) {
      case 'MANUFACTURER':
        return {
          title: 'Manufacturer Dashboard',
          icon: Package,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'My Products', icon: Package },
            { id: 'register', label: 'Register Product', icon: Plus },
            { id: 'certifications', label: 'Certifications', icon: FileText }
          ],
          color: 'blue'
        };
      case 'LOGISTICS_PARTNER':
        return {
          title: 'Logistics Dashboard',
          icon: Truck,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'shipments', label: 'Active Shipments', icon: Truck },
            { id: 'tracking', label: 'Track Products', icon: MapPin },
            { id: 'history', label: 'History', icon: Clock }
          ],
          color: 'green'
        };
      case 'CERTIFIER':
        return {
          title: 'Certifier Dashboard',
          icon: Shield,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'pending', label: 'Pending Certifications', icon: FileText },
            { id: 'certified', label: 'Certified Products', icon: CheckCircle },
            { id: 'reports', label: 'Reports', icon: BarChart3 }
          ],
          color: 'purple'
        };
      case 'ADMIN':
        return {
          title: 'Admin Dashboard',
          icon: Users,
          tabs: [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Manage Users', icon: Users },
            { id: 'products', label: 'All Products', icon: Package },
            { id: 'settings', label: 'Settings', icon: Settings }
          ],
          color: 'red'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <Package className="w-8 h-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Transit</p>
            <p className="text-2xl font-bold text-gray-900">8</p>
          </div>
          <Truck className="w-8 h-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Certified</p>
            <p className="text-2xl font-bold text-gray-900">16</p>
          </div>
          <Shield className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Products</h3>
      </div>
      <div className="p-6">
        {products.map(product => (
          <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <p className="text-sm text-gray-600">{product.location}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status === 'Certified' ? 'bg-green-100 text-green-800' :
                product.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegisterProduct = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Register New Product</h3>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin Farm</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin Country</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Register Product
        </button>
      </form>
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
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <IconComponent className={`w-8 h-8 text-${config.color}-600`} />
          <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
        </div>
        <p className="text-gray-600">Welcome back, {userData?.username || 'User'}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {config.tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? `border-${config.color}-500 text-${config.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard; 