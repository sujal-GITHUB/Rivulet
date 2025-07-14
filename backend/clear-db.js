const mongoose = require('./config/db');
const User = require('./models/User');

const clearInvalidRoles = async () => {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connection.asPromise();
    console.log('✅ Database connected successfully');
    
    // Find users with invalid roles (not 1 or 2)
    const invalidUsers = await User.find({ role: { $nin: [1, 2] } });
    console.log(`Found ${invalidUsers.length} users with invalid roles:`, invalidUsers.map(u => ({ email: u.email, role: u.role })));
    
    if (invalidUsers.length > 0) {
      // Update invalid roles to CUSTOMER (role 2)
      const result = await User.updateMany(
        { role: { $nin: [1, 2] } },
        { role: 2 }
      );
      console.log(`✅ Updated ${result.modifiedCount} users to CUSTOMER role`);
    } else {
      console.log('✅ No users with invalid roles found');
    }
    
    // Verify all users now have valid roles
    const allUsers = await User.find({});
    console.log('📊 Current users:');
    allUsers.forEach(user => {
      console.log(`- ${user.email}: role ${user.role} (${user.role === 1 ? 'PARTNER' : 'CUSTOMER'})`);
    });
    
    console.log('🎉 Database cleanup completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  }
};

clearInvalidRoles(); 