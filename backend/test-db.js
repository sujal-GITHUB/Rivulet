const mongoose = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const testDatabase = async () => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Wait for connection
    await mongoose.connection.asPromise();
    console.log('✅ Database connected successfully');
    
    // Test creating a user
    console.log('🔍 Testing user creation...');
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      walletAddress: '0x1234567890123456789012345678901234567890',
      role: 2 // CUSTOMER role
    });
    
    await testUser.save();
    console.log('✅ User created successfully');
    
    // Test finding the user
    console.log('🔍 Testing user retrieval...');
    const foundUser = await User.findOne({ email: 'test@example.com' });
    console.log('✅ User found:', foundUser.username);
    
    // Test password verification
    console.log('🔍 Testing password verification...');
    const isValid = await bcrypt.compare('testpassword123', foundUser.password);
    console.log('✅ Password verification:', isValid);
    
    // Clean up test user
    await User.findOneAndDelete({ email: 'test@example.com' });
    console.log('✅ Test user cleaned up');
    
    console.log('🎉 All database tests passed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
};

testDatabase(); 