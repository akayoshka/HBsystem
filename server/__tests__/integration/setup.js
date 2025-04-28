const supertest = require('supertest');
const app = require('../../server'); // Импортируем экземпляр Express-приложения
const { sequelize } = require('../../models');
const { User, Doctor, Appointment } = require('../../models');
const jwt = require('jsonwebtoken');

// Функция для создания HTTP-клиента Supertest
const getTestClient = () => {
  return supertest(app);
};

// Функция для настройки тестовой базы данных
const setupTestDb = async () => {
  try {
    // Проверяем, существует ли связь с базой данных
    await sequelize.authenticate();
    
    // Если используем SQLite для тестов, просто синхронизируем модели
    if (process.env.DB_DIALECT === 'sqlite' || sequelize.options.dialect === 'sqlite') {
      await sequelize.sync({ force: true });
      console.log('Test database initialized successfully (SQLite)');
    } else {
      // Если используем PostgreSQL, более сложная логика
      try {
        // Сначала удаляем данные из всех таблиц
        await sequelize.query('TRUNCATE TABLE "appointments", "doctors", "notifications", "users" CASCADE;');
      } catch (truncateError) {
        console.log('Tables might not exist yet, creating them...');
      }
      
      // Затем синхронизируем модели с базой данных
      await sequelize.sync({ force: true });
      console.log('Test database initialized successfully (PostgreSQL)');
    }
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

// Функция для закрытия соединения с базой данных
const closeTestDb = async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing test database connection:', error);
    throw error;
  }
};

// Функция для создания тестового пользователя
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    firstname: 'Test',
    lastname: 'User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    isAdmin: false,
    isDoctor: false,
    status: 'accepted'
  };
  
  try {
    const user = await User.create({
      ...defaultUser,
      ...userData
    });
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
};

// Функция для создания тестового врача
const createTestDoctor = async (userId, doctorData = {}) => {
  const defaultDoctor = {
    userId,
    specialization: 'General Medicine',
    experience: 5,
    fees: 100,
    isDoctor: true
  };
  
  try {
    const doctor = await Doctor.create({
      ...defaultDoctor,
      ...doctorData
    });
    
    return doctor;
  } catch (error) {
    console.error('Error creating test doctor:', error);
    throw error;
  }
};

// Функция для создания тестовой записи на прием
const createTestAppointment = async (appointmentData = {}) => {
  const defaultAppointment = {
    date: '2023-12-01',
    time: '10:00',
    status: 'Pending'
  };
  
  try {
    const appointment = await Appointment.create({
      ...defaultAppointment,
      ...appointmentData
    });
    
    return appointment;
  } catch (error) {
    console.error('Error creating test appointment:', error);
    throw error;
  }
};

// Функция для генерации JWT-токена
const generateAuthToken = (userId, isAdmin = false, isDoctor = false) => {
  return jwt.sign(
    { userId, isAdmin, isDoctor },
    process.env.JWT_SECRET || 'test-jwt-secret',
    { expiresIn: '1h' }
  );
};

module.exports = {
  getTestClient,
  setupTestDb,
  closeTestDb,
  createTestUser,
  createTestDoctor,
  createTestAppointment,
  generateAuthToken
};