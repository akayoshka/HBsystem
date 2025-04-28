// Import the database models
const { sequelize } = require('../models');

// Function to sync the test database before tests
const setupTestDatabase = async () => {
  // Sync the database. force: true will drop the tables if they exist
  await sequelize.sync({ force: true });
};

// Function to close database connection after tests
const closeTestDatabase = async () => {
  await sequelize.close();
};

module.exports = {
  setupTestDatabase,
  closeTestDatabase
};