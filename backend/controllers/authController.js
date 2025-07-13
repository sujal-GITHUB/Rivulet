const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const contract = require("../config/blockchain");

// Mock user database (in production, use a real database)
const users = new Map();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Role mapping
const ROLES = {
  MANUFACTURER: 1,
  LOGISTICS_PARTNER: 2,
  CERTIFIER: 3,
  ADMIN: 4
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, walletAddress, role } = req.body;

    // Validate input
    if (!username || !email || !password || !walletAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      username,
      email,
      password: hashedPassword,
      walletAddress,
      role: ROLES[role] || ROLES.MANUFACTURER,
      createdAt: new Date()
    };

    // Store user
    users.set(email, user);

    // Add user to blockchain with role
    try {
      await contract.addUser(walletAddress, user.role);
    } catch (error) {
      console.error('Error adding user to blockchain:', error);
      return res.status(500).json({ error: 'Failed to register user on blockchain' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email, 
        walletAddress, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email, 
        walletAddress: user.walletAddress, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify JWT token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      valid: true, 
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Add user to blockchain (admin only)
exports.addUser = async (req, res) => {
  try {
    const { walletAddress, role } = req.body;

    // Verify admin token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Add user to blockchain
    await contract.addUser(walletAddress, role);

    res.json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { walletAddress, role } = req.body;

    // Verify admin token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Update user role on blockchain
    await contract.updateUserRole(walletAddress, role);

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove user (admin only)
exports.removeUser = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // Verify admin token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Remove user from blockchain
    await contract.removeUser(walletAddress);

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Remove user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user role
exports.getUserRole = async (req, res) => {
  try {
    const { address } = req.params;

    const role = await contract.getUserRole(address);
    res.json({ role: role.toString() });
  } catch (error) {
    console.error('Get user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to verify JWT token
exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check role
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== ROLES[role]) {
      return res.status(403).json({ error: `Access denied. ${role} role required.` });
    }
    next();
  };
}; 