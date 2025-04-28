const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const {
  getTestClient,
  setupTestDb,
  closeTestDb,
  createTestUser,
  generateAuthToken // Добавлен импорт функции generateAuthToken
} = require('../setup');

describe('User Routes Integration Tests', () => {
  let request;
  
  beforeAll(async () => {
    request = getTestClient();
    await setupTestDb();
  });
  
  afterAll(async () => {
    await closeTestDb();
    // Добавляем задержку для корректного закрытия соединений
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  describe('GET /api/user/profile', () => {
    it('should get user profile', async () => {
      // Arrange
      const user = await createTestUser({
        firstname: 'Profile',
        lastname: 'User'
      });
      const token = generateAuthToken(user.id);
      
      // Act
      const response = await request
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('id', user.id);
      expect(response.body.data.user).toHaveProperty('firstname', 'Profile');
      expect(response.body.data.user).toHaveProperty('lastname', 'User');
    });
    
    it('should return error if not authenticated', async () => {
      // Act
      const response = await request
        .get('/api/user/profile');
      
      // Assert
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Не авторизован');
    });
  });
  
  describe('GET /api/user/getuser/:id', () => {
    it('should get user by ID as owner', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      // Act
      const response = await request
        .get(`/api/user/getuser/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('id', user.id);
    });
    
    it('should get user by ID as admin', async () => {
      // Arrange
      const regularUser = await createTestUser();
      const adminUser = await createTestUser({
        isAdmin: true
      });
      const adminToken = generateAuthToken(adminUser.id, true);
      
      // Act
      const response = await request
        .get(`/api/user/getuser/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('id', regularUser.id);
    });
    
    it('should return error if not owner or admin', async () => {
      // Arrange
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const token = generateAuthToken(user1.id);
      
      // Act
      const response = await request
        .get(`/api/user/getuser/${user2.id}`)
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Доступ запрещен');
    });
    
    it('should return error if user not found', async () => {
      // Arrange
      const user = await createTestUser({isAdmin: true});
      const token = generateAuthToken(user.id, true); // Admin token
      const nonExistentId = 9999;
      
      // Act
      const response = await request
        .get(`/api/user/getuser/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Пользователь не найден');
    });
  });
  
  describe('PUT /api/user/updateprofile', () => {
    it('should update user profile', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      const updateData = {
        firstname: 'Updated',
        lastname: 'Profile',
        mobile: '1234567890'
      };
      
      // Act
      const response = await request
        .put('/api/user/updateprofile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Профиль пользователя успешно обновлен');
      expect(response.body).toHaveProperty('data.user');
      expect(response.body.data.user).toHaveProperty('firstname', 'Updated');
      expect(response.body.data.user).toHaveProperty('lastname', 'Profile');
      expect(response.body.data.user).toHaveProperty('mobile', '1234567890');
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      const invalidData = {
        firstname: 'A', // Слишком короткое имя
        email: 'invalid-email' // Неверный формат email
      };
      
      // Act
      const response = await request
        .put('/api/user/updateprofile')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      // Вероятно, здесь тоже нужно заменить 'error' на 'fail', если API возвращает 'fail'
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  // Add more tests for other user routes (getAllUsers, deleteUser, etc.)
});