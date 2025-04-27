'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isDoctor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      age: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      gender: {
        type: Sequelize.STRING,
        defaultValue: 'neither'
      },
      mobile: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      address: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      pic: {
        type: Sequelize.STRING,
        defaultValue: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};