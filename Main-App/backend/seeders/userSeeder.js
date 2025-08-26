const User = require('../models/user');
const bcrypt = require('bcrypt');

// Admin user data
const adminUser = {
  username: 'admin',
  email: 'admin@chooflex.com',
  password: 'admin123',
  isAdmin: true,
  banned: false
};

const seedAdmin = async () => {
  try {
    console.log('👤 Starting admin user seeding...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    
    // Create admin user
    const admin = new User({
      ...adminUser,
      password: hashedPassword
    });
    
    const savedAdmin = await admin.save();
    console.log('✅ Admin user created successfully');
    console.log(`   📧 Email: ${adminUser.email}`);
    console.log(`   🔑 Password: ${adminUser.password}`);
    console.log(`   👑 Admin: ${adminUser.isAdmin}`);
    
    return savedAdmin;
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }
};

module.exports = { seedAdmin, adminUser };
