const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../../utils/errorHandler');

// Mock the models
jest.mock('../../../models', () => {
  const mockModels = require('../mocks/modelMocks');
  return mockModels;
});

// Import the service after mocking dependencies
const userService = require('../../../services/userService');
const { User } = require('../../../models');

describe('UserService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        isAdmin: false,
        isDoctor: false
      };
      
      User.findByPk.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('firstname', 'Test');
      expect(result).toHaveProperty('lastname', 'User');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;
      User.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId))
        .rejects
        .toThrow(new AppError('Пользователь не найден', StatusCodes.NOT_FOUND));
      
      expect(User.findByPk).toHaveBeenCalledWith(userId);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users except current user', async () => {
      // Arrange
      const currentUserId = 1;
      const mockUsers = [
        { id: 2, firstname: 'User1', lastname: 'Test1', email: 'user1@example.com' },
        { id: 3, firstname: 'User2', lastname: 'Test2', email: 'user2@example.com' }
      ];
      
      User.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getAllUsers(currentUserId);

      // Assert
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('firstname', 'User1');
      expect(result[1]).toHaveProperty('firstname', 'User2');
    });
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        firstname: 'New',
        lastname: 'User',
        email: 'newuser@example.com',
        password: 'password123'
      };
      
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ ...userData, id: 1 });

      // Act
      const result = await userService.registerUser(userData);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toBe('Пользователь успешно зарегистрирован');
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const userData = {
        firstname: 'Existing',
        lastname: 'User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      User.findOne.mockResolvedValue({ id: 1, email: userData.email });

      // Act & Assert
      await expect(userService.registerUser(userData))
        .rejects
        .toThrow(new AppError('Email уже используется', StatusCodes.BAD_REQUEST));
      
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        firstname: 'Updated',
        lastname: 'User',
        mobile: '1234567890'
      };
      
      const mockUser = {
        id: userId,
        firstname: 'Original',
        lastname: 'User',
        email: 'test@example.com',
        update: jest.fn().mockResolvedValue(true)
      };
      
      User.findByPk.mockResolvedValue(mockUser);

      // Act
      const result = await userService.updateUserProfile(userId, updateData);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(result).toBe('Профиль пользователя успешно обновлен');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;
      const updateData = {
        firstname: 'Updated',
        lastname: 'User'
      };
      
      User.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUserProfile(userId, updateData))
        .rejects
        .toThrow(new AppError('Пользователь не найден', StatusCodes.NOT_FOUND));
      
      expect(User.findByPk).toHaveBeenCalledWith(userId);
    });
  });

  // Add more tests for other userService methods as needed
});