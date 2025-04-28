const { StatusCodes } = require('http-status-codes');
const { AppError, globalErrorHandler } = require('../../../utils/errorHandler');

describe('ErrorHandler Utilities', () => {
  describe('AppError', () => {
    it('should create an operational error with correct properties', () => {
      // Arrange
      const message = 'Test error message';
      const statusCode = StatusCodes.BAD_REQUEST;
      
      // Act
      const error = new AppError(message, statusCode);
      
      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });
    
    it('should set status to error for server errors', () => {
      // Arrange
      const message = 'Internal server error';
      const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      
      // Act
      const error = new AppError(message, statusCode);
      
      // Assert
      expect(error.status).toBe('error');
    });
  });
  
  describe('globalErrorHandler', () => {
    let req, res, next;
    
    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
      
      // Save and restore NODE_ENV
      process.env.NODE_ENV_ORIGINAL = process.env.NODE_ENV;
    });
    
    afterEach(() => {
      // Restore NODE_ENV
      process.env.NODE_ENV = process.env.NODE_ENV_ORIGINAL;
    });
    
    it('should handle operational errors correctly in production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const error = new AppError('Test operational error', StatusCodes.BAD_REQUEST);
      
      // Act
      globalErrorHandler(error, req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Test operational error'
      });
    });
    
    it('should handle non-operational errors as internal server errors in production', () => {
      // Arrange
      process.env.NODE_ENV = 'production';
      const error = new Error('Unexpected error');
      
      // Act
      globalErrorHandler(error, req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Что-то пошло не так!'
      });
    });
    
    it('should include error details in development mode', () => {
      // Arrange
      process.env.NODE_ENV = 'development';
      const error = new AppError('Development error', StatusCodes.BAD_REQUEST);
      
      // Act
      globalErrorHandler(error, req, res, next);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'fail',
        message: 'Development error',
        stack: expect.any(String)
      }));
    });
  });
});