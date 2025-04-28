const { jest: jestConfig } = require('@jest/globals');
const { StatusCodes } = require('http-status-codes');
const {
  getTestClient,
  setupTestDb,
  closeTestDb,
  createTestUser,
  createTestDoctor,
  generateAuthToken // Добавлен импорт функции generateAuthToken
} = require('../setup');
const { Appointment } = require('../../../models');

describe('Appointment Routes Integration Tests', () => {
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
  
  describe('POST /api/appointment/bookappointment', () => {
    it('should book appointment successfully', async () => {
      // Arrange
      const patient = await createTestUser();
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const patientToken = generateAuthToken(patient.id);
      
      const appointmentData = {
        doctorId: doctor.id,
        date: '2023-12-01',
        time: '10:00',
        doctorname: `Dr. ${doctor.firstname} ${doctor.lastname}`
      };
      
      // Act
      const response = await request
        .post('/api/appointment/bookappointment')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(appointmentData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('Запись на прием успешно создана');
      expect(response.body).toHaveProperty('data.appointment');
      expect(response.body.data.appointment).toHaveProperty('userId', patient.id);
      expect(response.body.data.appointment).toHaveProperty('doctorId', doctor.id);
      expect(response.body.data.appointment).toHaveProperty('date', '2023-12-01');
      expect(response.body.data.appointment).toHaveProperty('time', '10:00');
      expect(response.body.data.appointment).toHaveProperty('status', 'Pending');
    });
    
    it('should return error if time slot is already booked', async () => {
      // Arrange
      const patient1 = await createTestUser();
      const patient2 = await createTestUser();
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const patientToken1 = generateAuthToken(patient1.id);
      const patientToken2 = generateAuthToken(patient2.id);
      
      const appointmentData = {
        doctorId: doctor.id,
        date: '2023-12-02',
        time: '11:00',
        doctorname: `Dr. ${doctor.firstname} ${doctor.lastname}`
      };
      
      // Book the first appointment
      await request
        .post('/api/appointment/bookappointment')
        .set('Authorization', `Bearer ${patientToken1}`)
        .send(appointmentData);
      
      // Act - Try to book the same time slot
      const response = await request
        .post('/api/appointment/bookappointment')
        .set('Authorization', `Bearer ${patientToken2}`)
        .send(appointmentData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Это время уже занято');
    });
    
    it('should return validation errors for invalid data', async () => {
      // Arrange
      const patient = await createTestUser();
      const patientToken = generateAuthToken(patient.id);
      
      const invalidData = {
        // Missing doctorId
        date: 'invalid-date', // Invalid date format
        time: '10:00'
      };
      
      // Act
      const response = await request
        .post('/api/appointment/bookappointment')
        .set('Authorization', `Bearer ${patientToken}`)
        .send(invalidData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      // Проверяем, соответствует ли статус ответа API
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('GET /api/appointment/getallappointments', () => {
    it('should get all appointments for a user', async () => {
      // Arrange
      const patient = await createTestUser();
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const patientToken = generateAuthToken(patient.id);
      
      // Create test appointments
      await Appointment.create({
        userId: patient.id,
        doctorId: doctor.id,
        date: '2023-12-03',
        time: '09:00',
        status: 'Pending'
      });
      
      await Appointment.create({
        userId: patient.id,
        doctorId: doctor.id,
        date: '2023-12-04',
        time: '14:00',
        status: 'Pending'
      });
      
      // Act
      const response = await request
        .get('/api/appointment/getallappointments')
        .set('Authorization', `Bearer ${patientToken}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.appointments');
      expect(response.body.data.appointments).toBeInstanceOf(Array);
      expect(response.body.data.appointments.length).toBeGreaterThanOrEqual(2);
      
      // Check that appointments have correct data
      const appointments = response.body.data.appointments;
      const dates = appointments.map(a => a.date);
      expect(dates).toContain('2023-12-03');
      expect(dates).toContain('2023-12-04');
    });
    
    it('should filter appointments by date', async () => {
      // Arrange
      const patient = await createTestUser();
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const patientToken = generateAuthToken(patient.id);
      
      // Create test appointments with different dates
      await Appointment.create({
        userId: patient.id,
        doctorId: doctor.id,
        date: '2023-12-05',
        time: '09:00',
        status: 'Pending'
      });
      
      await Appointment.create({
        userId: patient.id,
        doctorId: doctor.id,
        date: '2023-12-06',
        time: '14:00',
        status: 'Pending'
      });
      
      // Act
      const response = await request
        .get('/api/appointment/getallappointments?date=2023-12-05')
        .set('Authorization', `Bearer ${patientToken}`);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('data.appointments');
      expect(response.body.data.appointments).toBeInstanceOf(Array);
      
      // Should only include appointments on 2023-12-05
      const appointments = response.body.data.appointments;
      appointments.forEach(appointment => {
        expect(appointment.date).toBe('2023-12-05');
      });
    });
  });
  
  describe('PUT /api/appointment/completed', () => {
    it('should mark appointment as completed', async () => {
      // Arrange
      const patient = await createTestUser();
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const doctorToken = generateAuthToken(doctor.id, false, true);
      
      // Create a test appointment
      const appointment = await Appointment.create({
        userId: patient.id,
        doctorId: doctor.id,
        date: '2023-12-07',
        time: '10:00',
        status: 'Pending'
      });
      
      const completionData = {
        appointid: appointment.id,
        doctorId: doctor.id,
        doctorname: `Dr. ${doctor.firstname} ${doctor.lastname}`
      };
      
      // Act
      const response = await request
        .put('/api/appointment/completed')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(completionData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.message).toContain('Прием успешно отмечен как завершенный');
      
      // Verify appointment is marked as completed
      const updatedAppointment = await Appointment.findByPk(appointment.id);
      expect(updatedAppointment.status).toBe('Completed');
    });
    
    it('should return error if appointment not found', async () => {
      // Arrange
      const doctor = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor.id);
      
      const doctorToken = generateAuthToken(doctor.id, false, true);
      
      const completionData = {
        appointid: 9999, // Non-existent appointment ID
        doctorId: doctor.id,
        doctorname: `Dr. ${doctor.firstname} ${doctor.lastname}`
      };
      
      // Act
      const response = await request
        .put('/api/appointment/completed')
        .set('Authorization', `Bearer ${doctorToken}`)
        .send(completionData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Запись на прием не найдена');
    });
    
    it('should return error if not the doctor for the appointment', async () => {
      // Arrange
      const patient = await createTestUser();
      const doctor1 = await createTestUser({ isDoctor: true });
      const doctor2 = await createTestUser({ isDoctor: true });
      await createTestDoctor(doctor1.id);
      await createTestDoctor(doctor2.id);
      
      const doctor2Token = generateAuthToken(doctor2.id, false, true);
      
      // Create a test appointment with doctor1
      const appointment = await Appointment.create({
        userId: patient.id,
        doctorId: doctor1.id, // Not doctor2
        date: '2023-12-08',
        time: '11:00',
        status: 'Pending'
      });
      
      const completionData = {
        appointid: appointment.id,
        doctorId: doctor2.id, // Doctor2 trying to complete doctor1's appointment
        doctorname: `Dr. ${doctor2.firstname} ${doctor2.lastname}`
      };
      
      // Act
      const response = await request
        .put('/api/appointment/completed')
        .set('Authorization', `Bearer ${doctor2Token}`)
        .send(completionData);
      
      // Assert
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
      expect(response.body).toHaveProperty('status', 'fail');
      expect(response.body.message).toContain('Доступ запрещен');
    });
  });
  
  // Add more tests for other appointment routes
});