const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Helper function to generate a valid JWT token for testing
const generateTestToken = (userId, isAdmin = false, isDoctor = false) => {
  return jwt.sign(
    {
      userId,
      isAdmin,
      isDoctor
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Helper function to create a test user in the database
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstname: 'Test',
    lastname: 'User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    isAdmin: false,
    isDoctor: false
  };
  
  const user = await User.create({
    ...defaultUser,
    ...userData
  });
  
  return user;
};

// Helper function to clean up test data
const cleanupTestData = async (models = []) => {
  for (const model of models) {
    await model.destroy({ where: {}, force: true });
  }
};

module.exports = {
  generateTestToken,
  createTestUser,
  cleanupTestData
};