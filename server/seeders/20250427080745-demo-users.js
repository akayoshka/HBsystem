'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    // Хешируем пароль для тестовых пользователей
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    return queryInterface.bulkInsert('users', [
      {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        isDoctor: false,
        gender: 'neither',
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
        isDoctor: false,
        gender: 'male',
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        isAdmin: false,
        isDoctor: true,
        gender: 'female',
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};