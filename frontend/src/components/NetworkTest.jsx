import React, { useState, useEffect } from 'react';
import { API_URL, getEnvironment } from '../config/api';

const NetworkTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Environment Detection',
        test: () => {
          const env = getEnvironment();
          const hostname = window.location.hostname;
          const protocol = window.location.protocol;
          return {
            success: true,
            message: `Environment: ${env}, Hostname: ${hostname}, Protocol: ${protocol}`
          };
        }
      },
      {
        name: 'API URL Configuration',
        test: () => {
          return {
            success: true,
            message: `API URL: ${API_URL}`
          };
        }
      },
      {
        name: 'Backend Connectivity',
        test: async () => {
          try {
            const response = await fetch(`${API_URL}/api/products`);
            if (response.ok) {
              return {
                success: true,
                message: `✅ Backend connected successfully (Status: ${response.status})`
              };
            } else {
              return {
                success: false,
                message: `❌ Backend responded with error (Status: ${response.status})`
              };
            }
          } catch (error) {
            return {
              success: false,
              message: `❌ Backend connection failed: ${error.message}`
            };
          }
        }
      },
      {
        name: 'CORS Test',
        test: async () => {
          try {
            const response = await fetch(`${API_URL}/api/products`, {
              method: 'OPTIONS'
            });
            return {
              success: true,
              message: `✅ CORS preflight successful (Status: ${response.status})`
            };
          } catch (error) {
            return {
              success: false,
              message: `❌ CORS preflight failed: ${error.message}`
            };
          }
        }
      }
    ];

    for (const test of tests) {
      try {
        const result = await test.test();
        setTestResults(prev => [...prev, { name: test.name, ...result }]);
      } catch (error) {
        setTestResults(prev => [...prev, { 
          name: test.name, 
          success: false, 
          message: `❌ Test failed: ${error.message}` 
        }]);
      }
    }

    setIsTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Network Connectivity Test</h2>
      
      <div className="mb-4">
        <button 
          onClick={runTests}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="p-3 border rounded">
            <div className="font-semibold">{result.name}</div>
            <div className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-sm space-y-1">
          <li>• Make sure your backend server is running on port 3001</li>
          <li>• Ensure both devices are on the same network</li>
          <li>• Check if your firewall is blocking port 3001</li>
          <li>• Try accessing the backend URL directly in your mobile browser</li>
          <li>• Verify the network IP address is correct</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkTest; 