const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const contract = require("../config/blockchain");
const User = require("../models/User");

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Only two roles
const ROLES = {
  PARTNER: 1,
  CUSTOMER: 2
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, walletAddress, role } = req.body;

    // Validate input
    if (!username || !email || !password || !walletAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists by email or wallet address
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const existingUserByWallet = await User.findOne({ walletAddress });
    if (existingUserByWallet) {
      return res.status(400).json({ error: 'User with this wallet address already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow 'partner' or 'customer' as role
    let userRole = ROLES.CUSTOMER;
    if (role && String(role).toLowerCase() === 'partner') userRole = ROLES.PARTNER;

    // Create user object
    const userData = {
      username,
      email,
      password: hashedPassword,
      walletAddress,
      role: userRole,
      createdAt: new Date()
    };

    // Save user to database
    const user = new User(userData);
    await user.save();

    // Add user to blockchain with role
    try {
      await contract.addUser(walletAddress, userData.role);
    } catch (error) {
      console.error('Error adding user to blockchain:', error);
      // Don't fail registration if blockchain fails, but log it
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email, 
        walletAddress, 
        role: userData.role 
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
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      if (error.keyPattern && error.keyPattern.walletAddress) {
        return res.status(400).json({ error: 'User with this wallet address already exists' });
      }
      return res.status(400).json({ error: 'User already exists' });
    }
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

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

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
    
    // Get fresh user data from database
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ 
      valid: true, 
      user: {
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Add user to blockchain (remove admin check, only allow PARTNER or CUSTOMER)
exports.addUser = async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    // Only allow PARTNER or CUSTOMER
    if (![ROLES.PARTNER, ROLES.CUSTOMER].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    await contract.addUser(walletAddress, role);
    res.json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user role (only allow PARTNER or CUSTOMER)
exports.updateUserRole = async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    if (![ROLES.PARTNER, ROLES.CUSTOMER].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    await User.findOneAndUpdate(
      { walletAddress },
      { role: role },
      { new: true }
    );
    await contract.updateUserRole(walletAddress, role);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove user (no change needed)
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

    // Remove user from database
    await User.findOneAndDelete({ walletAddress });

    // Remove user from blockchain
    await contract.removeUser(walletAddress);

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Remove user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user role (no change needed)
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

// Middleware to check role (only allow PARTNER or CUSTOMER)
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== ROLES[role]) {
      return res.status(403).json({ error: `Access denied. ${role} role required.` });
    }
    next();
  };
}; 