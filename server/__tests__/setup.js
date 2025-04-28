// Set environment to test
process.env.NODE_ENV = 'test';

// Set up environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DB_NAME_TEST = 'healthbooker_test';

// Mock any global dependencies if needed
// For example, we can mock certain modules that might cause side effects
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));