const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const {
  getTestClient,
  setupTestDb,
  closeTestDb,
  createTestUser,
  generateAuthToken // Добавлен импорт функции generateAuthToken
} = require('../setup');

describe('Auth Routes Integration Tests', () => {
  let request;
  
  // Выполняется перед всеми тестами
  beforeAll(async () => {
    request = getTestClient();
    await setupTestDb();
  });
  
  // Выполняется после всех тестов
  afterAll(async () => {
    await closeTestDb();
    // Добавляем задержку для корректного закрытия соединений
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      
      // Act
      const response = await request
        .post('/api/auth/register')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Пользователь успешно зарегистрирован');
    });
    
    it('should return error when email already exists', async () => {
      // Arrange
      const existingUser = await createTestUser({
        email: 'existing@example.com'
      });
      
      const userData = {
        firstname: 'Duplicate',
        lastname: 'User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      // Act
      const response = await request
        .post('/api/auth/register')
        .send(userData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      // Изменено с 'error' на 'fail' в соответствии с API
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Email уже используется');
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      const invalidUserData = {
        firstname: 'J', // Слишком короткое имя
        lastname: 'D',  // Слишком короткая фамилия
        email: 'invalid-email', // Неверный формат email
        password: '123' // Слишком короткий пароль
      };
      
      // Act
      const response = await request
        .post('/api/auth/register')
        .send(invalidUserData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const userPassword = 'password123';
      const user = await createTestUser({
        email: 'login.test@example.com',
        password: userPassword  // Note: Password will be hashed by the User model hooks
      });
      
      const loginData = {
        email: 'login.test@example.com',
        password: userPassword
      };
      
      // Act
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('email', loginData.email);
    });
    
    it('should return error for incorrect password', async () => {
      // Arrange
      const user = await createTestUser({
        email: 'wrong.password@example.com',
        password: 'correct-password'
      });
      
      const loginData = {
        email: 'wrong.password@example.com',
        password: 'wrong-password'
      };
      
      // Act
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Неверные учетные данные');
    });
    
    it('should return error for non-existent user', async () => {
      // Arrange
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      // Act
      const response = await request
        .post('/api/auth/login')
        .send(loginData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Неверные учетные данные');
    });
  });
  
  describe('POST /api/auth/logout', () => {
    it('should logout a user successfully', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      // Act
      const response = await request
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('Выход выполнен успешно');
      
      // Should clear token cookie
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]);
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      expect(tokenCookie).toBe('token=');
    });
    
    it('should return error if not authenticated', async () => {
      // Act
      const response = await request
        .post('/api/auth/logout');
      
      // Assert
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Не авторизован');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user information', async () => {
      // Arrange
      const user = await createTestUser({
        firstname: 'Current',
        lastname: 'User'
      });
      const token = generateAuthToken(user.id);
      
      // Act
      const response = await request
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('id', user.id);
      expect(response.body.data.user).toHaveProperty('firstname', 'Current');
      expect(response.body.data.user).toHaveProperty('lastname', 'User');
    });
    
    it('should return error if not authenticated', async () => {
      // Act
      const response = await request
        .get('/api/auth/me');
      
      // Assert
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Не авторизован');
    });
  });
});