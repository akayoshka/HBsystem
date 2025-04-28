const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const {
  getTestClient,
  setupTestDb,
  closeTestDb,
  createTestUser,
  createTestDoctor,
  generateAuthToken
} = require('../setup');

describe('Doctor Routes Integration Tests', () => {
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
  
  describe('GET /api/doctor/getalldoctors', () => {
    it('should get all doctors', async () => {
      // Arrange
      const user1 = await createTestUser({ isDoctor: true });
      const user2 = await createTestUser({ isDoctor: true });
      
      const doctor1 = await createTestDoctor(user1.id, { specialization: 'Cardiology' });
      const doctor2 = await createTestDoctor(user2.id, { specialization: 'Neurology' });
      
      // Act
      const response = await request
        .get('/api/doctor/getalldoctors');
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.doctors');
      expect(response.body.data.doctors).toBeInstanceOf(Array);
      expect(response.body.data.doctors.length).toBeGreaterThanOrEqual(2);
      
      // Check if doctors are in the response
      const doctorIds = response.body.data.doctors.map(d => d.id);
      expect(doctorIds).toContain(doctor1.id);
      expect(doctorIds).toContain(doctor2.id);
      
      // Check specializations
      const specializations = response.body.data.doctors.map(d => d.specialization);
      expect(specializations).toContain('Cardiology');
      expect(specializations).toContain('Neurology');
    });
  });
  
  describe('GET /api/doctor/getdoctor/:id', () => {
    it('should get doctor by ID', async () => {
      // Arrange
      const user = await createTestUser({ isDoctor: true });
      const doctor = await createTestDoctor(user.id, {
        specialization: 'Pediatrics',
        experience: 8,
        fees: 150
      });
      
      // Act
      const response = await request
        .get(`/api/doctor/getdoctor/${doctor.id}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.doctor');
      expect(response.body.data.doctor).toHaveProperty('id', doctor.id);
      expect(response.body.data.doctor).toHaveProperty('specialization', 'Pediatrics');
      expect(response.body.data.doctor).toHaveProperty('experience', 8);
      expect(response.body.data.doctor).toHaveProperty('fees', 150);
    });
    
    it('should return error if doctor not found', async () => {
      // Arrange
      const nonExistentId = 9999;
      
      // Act
      const response = await request
        .get(`/api/doctor/getdoctor/${nonExistentId}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Врач не найден');
    });
  });
  
  describe('POST /api/doctor/applyfordoctor', () => {
    it('should apply for doctor role successfully', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      const applicationData = {
        specialization: 'Dermatology',
        experience: 5,
        fees: 120
      };
      
      // Act
      const response = await request
        .post('/api/doctor/applyfordoctor')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('Заявка на роль врача успешно отправлена');
    });
    
    it('should return error if application already exists', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      // Create an application first
      const doctor = await createTestDoctor(user.id, { isDoctor: false });
      
      const applicationData = {
        specialization: 'Dermatology',
        experience: 5,
        fees: 120
      };
      
      // Act
      const response = await request
        .post('/api/doctor/applyfordoctor')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Заявка уже существует');
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      const user = await createTestUser();
      const token = generateAuthToken(user.id);
      
      const invalidData = {
        // Missing required fields
        experience: -1, // Invalid negative experience
        fees: -50 // Invalid negative fees
      };
      
      // Act
      const response = await request
        .post('/api/doctor/applyfordoctor')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('PUT /api/doctor/acceptdoctor', () => {
    it('should accept doctor application successfully', async () => {
      // Arrange
      const admin = await createTestUser({ isAdmin: true });
      const user = await createTestUser();
      const doctor = await createTestDoctor(user.id, { isDoctor: false });
      
      const adminToken = generateAuthToken(admin.id, true);
      
      // Act
      const response = await request
        .put('/api/doctor/acceptdoctor')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: user.id });
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('Заявка на роль врача успешно принята');
    });
    
    it('should return error if not admin', async () => {
      // Arrange
      const regularUser = await createTestUser();
      const applicant = await createTestUser();
      const doctor = await createTestDoctor(applicant.id, { isDoctor: false });
      
      const userToken = generateAuthToken(regularUser.id);
      
      // Act
      const response = await request
        .put('/api/doctor/acceptdoctor')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ id: applicant.id });
      
      // Assert
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Доступ запрещен');
    });
  });
  
  describe('GET /api/doctor/getnotdoctors', () => {
    it('should get doctor applications for admin', async () => {
      // Arrange
      const admin = await createTestUser({ isAdmin: true });
      const user = await createTestUser();
      const doctor = await createTestDoctor(user.id, { isDoctor: false });
      
      const adminToken = generateAuthToken(admin.id, true);
      
      // Act
      const response = await request
        .get('/api/doctor/getnotdoctors')
        .set('Authorization', `Bearer ${adminToken}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      // Исправлено: API возвращает applications вместо doctors
      expect(response.body).toHaveProperty('data.applications');
      expect(response.body.data.applications).toBeInstanceOf(Array);
      
      // Должна быть хотя бы одна заявка (которую мы создали)
      expect(response.body.data.applications.length).toBeGreaterThan(0);
    });
    
    it('should return error if not admin', async () => {
      // Arrange
      const regularUser = await createTestUser();
      const userToken = generateAuthToken(regularUser.id);
      
      // Act
      const response = await request
        .get('/api/doctor/getnotdoctors')
        .set('Authorization', `Bearer ${userToken}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Доступ запрещен');
    });
  });
  
  describe('PUT /api/doctor/rejectdoctor', () => {
    it('should reject doctor application successfully', async () => {
      // Arrange
      const admin = await createTestUser({ isAdmin: true });
      const user = await createTestUser();
      const doctor = await createTestDoctor(user.id, { isDoctor: false });
      
      const adminToken = generateAuthToken(admin.id, true);
      
      // Act
      const response = await request
        .put('/api/doctor/rejectdoctor')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: user.id });
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      // Исправлено: В сообщении API есть слово "успешно"
      expect(response.body.message).toContain('Заявка на роль врача успешно отклонена');
    });
  });
});