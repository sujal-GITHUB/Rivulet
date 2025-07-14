
const isNgrok = window.location.protocol === 'https:' && window.location.hostname.includes('ngrok');

// Check if we're accessing via network IP (for mobile access)
const isNetworkAccess = window.location.hostname !== 'localhost' && 
                       !window.location.hostname.includes('ngrok') && 
                       !window.location.hostname.includes('127.0.0.1');

// Get the current hostname for network access
const getNetworkBackendUrl = () => {
  const currentHost = window.location.hostname;
  return `http://${currentHost}:3001`;
};

const backendNgrokUrl = import.meta.env.VITE_BACKEND_NGROK_URL;

const getBackendUrl = () => {
  if (isNgrok) {
    // Use backend ngrok URL from environment variable
    return backendNgrokUrl;
  } else if (isNetworkAccess) {
    return getNetworkBackendUrl();
  } else {
    return "http://localhost:3001";
  }
};

export const API_URL = getBackendUrl();

// Helper function to get the current environment
export const getEnvironment = () => {
  if (isNgrok) {
    return 'ngrok';
  } else if (window.location.hostname === 'localhost') {
    return 'localhost';
  } else if (isNetworkAccess) {
    return 'network';
  } else {
    return 'production';
  }
}; 