// Mock for Sequelize models
const mockUser = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };
  
  const mockDoctor = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };
  
  const mockAppointment = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };
  
  const mockNotification = {
    findByPk: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    count: jest.fn(),
    findAndCountAll: jest.fn()
  };
  
  // Mock for Sequelize Op operators
  const mockOp = {
    eq: Symbol('eq'),
    ne: Symbol('ne'),
    gt: Symbol('gt'),
    gte: Symbol('gte'),
    lt: Symbol('lt'),
    lte: Symbol('lte'),
    and: Symbol('and'),
    or: Symbol('or'),
    like: Symbol('like'),
    iLike: Symbol('iLike'),
    notLike: Symbol('notLike')
  };
  
  module.exports = {
    User: mockUser,
    Doctor: mockDoctor,
    Appointment: mockAppointment,
    Notification: mockNotification,
    Op: mockOp
  };