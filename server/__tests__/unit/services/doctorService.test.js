const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../../utils/errorHandler');

// Mock the models and notification service
jest.mock('../../../models', () => {
  const mockModels = require('../mocks/modelMocks');
  return mockModels;
});

jest.mock('../../../services/notificationService', () => ({
  createNotification: jest.fn().mockResolvedValue({})
}));

// Import the service after mocking dependencies
const doctorService = require('../../../services/doctorService');
const notificationService = require('../../../services/notificationService');
const { Doctor, User } = require('../../../models');

describe('DoctorService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getAllDoctors', () => {
    it('should return all doctors', async () => {
      // Arrange
      const mockDoctors = [
        {
          id: 1,
          userId: 1,
          specialization: 'Cardiology',
          experience: 5,
          fees: 150,
          isDoctor: true,
          user: {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com'
          }
        },
        {
          id: 2,
          userId: 2,
          specialization: 'Neurology',
          experience: 8,
          fees: 200,
          isDoctor: true,
          user: {
            id: 2,
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane@example.com'
          }
        }
      ];
      
      Doctor.findAll.mockResolvedValue(mockDoctors);

      // Act
      const result = await doctorService.getAllDoctors();

      // Assert
      expect(Doctor.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('specialization', 'Cardiology');
      expect(result[1]).toHaveProperty('specialization', 'Neurology');
    });
  });

  describe('getDoctorById', () => {
    it('should return doctor if found', async () => {
      // Arrange
      const doctorId = 1;
      const mockDoctor = {
        id: doctorId,
        userId: 1,
        specialization: 'Cardiology',
        experience: 5,
        fees: 150,
        isDoctor: true,
        user: {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com'
        }
      };
      
      Doctor.findByPk.mockResolvedValue(mockDoctor);

      // Act
      const result = await doctorService.getDoctorById(doctorId);

      // Assert
      expect(Doctor.findByPk).toHaveBeenCalledWith(doctorId, expect.any(Object));
      expect(result).toHaveProperty('id', doctorId);
      expect(result).toHaveProperty('specialization', 'Cardiology');
    });

    it('should throw error if doctor not found', async () => {
      // Arrange
      const doctorId = 999;
      Doctor.findByPk.mockResolvedValue(null);

      // Act & Assert
      await expect(doctorService.getDoctorById(doctorId))
        .rejects
        .toThrow(new AppError('Врач не найден', StatusCodes.NOT_FOUND));
      
      expect(Doctor.findByPk).toHaveBeenCalledWith(doctorId, expect.any(Object));
    });
  });

  describe('applyForDoctor', () => {
    it('should create doctor application successfully', async () => {
      // Arrange
      const userId = 1;
      const doctorData = {
        specialization: 'Cardiology',
        experience: 5,
        fees: 150
      };
      
      Doctor.findOne.mockResolvedValue(null);
      Doctor.create.mockResolvedValue({ id: 1, userId, ...doctorData, isDoctor: false });

      // Act
      const result = await doctorService.applyForDoctor(userId, doctorData);

      // Assert
      expect(Doctor.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(Doctor.create).toHaveBeenCalledWith({
        userId,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        fees: doctorData.fees,
        isDoctor: false
      });
      expect(result).toBe('Заявка на роль врача успешно отправлена');
    });

    it('should throw error if application already exists', async () => {
      // Arrange
      const userId = 1;
      const doctorData = {
        specialization: 'Cardiology',
        experience: 5,
        fees: 150
      };
      
      Doctor.findOne.mockResolvedValue({ id: 1, userId });

      // Act & Assert
      await expect(doctorService.applyForDoctor(userId, doctorData))
        .rejects
        .toThrow(new AppError('Заявка уже существует', StatusCodes.BAD_REQUEST));
      
      expect(Doctor.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(Doctor.create).not.toHaveBeenCalled();
    });
  });

  describe('acceptDoctorApplication', () => {
    it('should accept doctor application successfully', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        update: jest.fn().mockResolvedValue(true)
      };
      
      const mockDoctorApplication = {
        id: 1,
        userId,
        update: jest.fn().mockResolvedValue(true)
      };
      
      User.findByPk.mockResolvedValue(mockUser);
      Doctor.findOne.mockResolvedValue(mockDoctorApplication);

      // Act
      const result = await doctorService.acceptDoctorApplication(userId);

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith(userId);
      expect(Doctor.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(mockUser.update).toHaveBeenCalledWith({ isDoctor: true, status: 'accepted' });
      expect(mockDoctorApplication.update).toHaveBeenCalledWith({ isDoctor: true });
      expect(notificationService.createNotification).toHaveBeenCalled();
      expect(result).toBe('Заявка на роль врача успешно принята');
    });

    // Add more tests for error cases
  });

  // Add more tests for other doctorService methods as needed
});