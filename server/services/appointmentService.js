const { Appointment, User } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { AppointmentResponseDto } = require('../dto/appointmentDto');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * Сервис для работы с записями на прием
 */
class AppointmentService {
  /**
   * Получить все записи на прием с фильтрацией
   * @param {object} filters - Объект с фильтрами
   * @returns {Promise<AppointmentResponseDto[]>} - Массив DTO с данными записей
   */
  async getAllAppointments(filters = {}) {
    const queryOptions = {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    };
    
    // Добавляем фильтры, если они есть
    if (Object.keys(filters).length > 0) {
      queryOptions.where = filters;
    }
    
    const appointments = await Appointment.findAll(queryOptions);
    
    return appointments.map(appointment => new AppointmentResponseDto(appointment));
  }
  
  /**
   * Получить записи на прием для пользователя (пациента или врача)
   * @param {number} userId - ID пользователя
   * @param {object} additionalFilters - Дополнительные фильтры
   * @returns {Promise<AppointmentResponseDto[]>} - Массив DTO с данными записей
   */
  async getAppointmentsForUser(userId, additionalFilters = {}) {
    const filters = {
      [Op.or]: [
        { userId },
        { doctorId: userId }
      ],
      ...additionalFilters
    };
    
    return this.getAllAppointments(filters);
  }
  
  /**
   * Получить запись на прием по ID
   * @param {number} appointmentId - ID записи
   * @returns {Promise<AppointmentResponseDto>} - DTO с данными записи
   */
  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        }
      ]
    });
    
    if (!appointment) {
      throw new AppError('Запись на прием не найдена', StatusCodes.NOT_FOUND);
    }
    
    return new AppointmentResponseDto(appointment);
  }
  
  /**
   * Создать запись на прием
   * @param {object} appointmentData - Данные для создания записи
   * @returns {Promise<AppointmentResponseDto>} - DTO с данными созданной записи
   */
  async createAppointment(appointmentData) {
    const { userId, doctorId, date, time } = appointmentData;
    
    // Проверка, существует ли уже запись на это время и дату у данного врача
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        date,
        time,
        status: 'Pending'
      }
    });
    
    if (existingAppointment) {
      throw new AppError('Это время уже занято. Пожалуйста, выберите другое время.', StatusCodes.BAD_REQUEST);
    }
    
    // Создаем запись
    const appointment = await Appointment.create({
      userId,
      doctorId,
      date,
      time,
      status: 'Pending'
    });
    
    // Получаем полную информацию о созданной записи
    const newAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        }
      ]
    });
    
    return new AppointmentResponseDto(newAppointment);
  }
  
  /**
   * Создать запись на прием с защитой от гонки
   * @param {object} appointmentData - Данные для создания записи
   * @returns {Promise<AppointmentResponseDto>} - DTO с данными созданной записи
   */
  async createAppointmentSafe(appointmentData) {
    const { userId, doctorId, date, time } = appointmentData;
    
    // Используем транзакцию для атомарной операции
    const transaction = await sequelize.transaction();
    
    try {
      // Сначала проверяем доступность с блокировкой строки
      const existingAppointment = await Appointment.findOne({
        where: {
          doctorId,
          date,
          time,
          status: 'Pending'
        },
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      if (existingAppointment) {
        await transaction.rollback();
        throw new AppError('Это время уже занято. Пожалуйста, выберите другое время.', StatusCodes.BAD_REQUEST);
      }
      
      // Создаем запись
      const appointment = await Appointment.create({
        userId,
        doctorId,
        date,
        time,
        status: 'Pending'
      }, { transaction });
      
      // Завершаем транзакцию
      await transaction.commit();
      
      // Получаем полную информацию о созданной записи
      const newAppointment = await Appointment.findByPk(appointment.id, {
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
          },
          {
            model: User,
            as: 'doctor',
            attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
          }
        ]
      });
      
      return new AppointmentResponseDto(newAppointment);
    } catch (error) {
      // В случае ошибки откатываем транзакцию
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }
  
  /**
   * Обновить статус записи на прием
   * @param {number} appointmentId - ID записи
   * @param {string} status - Новый статус (Completed, Cancelled)
   * @returns {Promise<AppointmentResponseDto>} - DTO с обновленными данными записи
   */
  async updateAppointmentStatus(appointmentId, status) {
    const appointment = await Appointment.findByPk(appointmentId);
    
    if (!appointment) {
      throw new AppError('Запись на прием не найдена', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем статус
    appointment.status = status;
    await appointment.save();
    
    // Получаем обновленные данные записи
    const updatedAppointment = await Appointment.findByPk(appointmentId, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
        }
      ]
    });
    
    return new AppointmentResponseDto(updatedAppointment);
  }
  
  /**
   * Проверка доступности временных слотов для врача
   * @param {number} doctorId - ID врача
   * @param {string} date - Дата в формате YYYY-MM-DD
   * @returns {Promise<object>} - Объект с доступными и занятыми слотами
   */
  async checkAvailability(doctorId, date) {
    // Получаем все занятые слоты на указанную дату
    const bookedSlots = await Appointment.findAll({
      where: {
        doctorId,
        date,
        status: 'Pending'
      },
      attributes: ['time']
    });
    
    // Список всех возможных временных слотов (пример)
    const allTimeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];
    
    // Фильтруем занятые слоты
    const bookedTimesSet = new Set(bookedSlots.map(slot => slot.time));
    const availableSlots = allTimeSlots.filter(time => !bookedTimesSet.has(time));
    
    return {
      date,
      doctorId,
      availableSlots,
      bookedSlots: Array.from(bookedTimesSet)
    };
  }
  
  /**
   * Получить статистику по записям на прием
   * @returns {Promise<object>} - Объект со статистикой
   */
  async getAppointmentStats() {
    // Общее количество записей
    const totalAppointments = await Appointment.count();
    
    // Количество по статусам
    const pendingCount = await Appointment.count({ where: { status: 'Pending' } });
    const completedCount = await Appointment.count({ where: { status: 'Completed' } });
    const cancelledCount = await Appointment.count({ where: { status: 'Cancelled' } });
    
    // Статистика по датам (за последние 7 дней)
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const appointmentsByDate = await Appointment.findAll({
      attributes: ['date', [sequelize.fn('COUNT', 'date'), 'count']],
      where: {
        createdAt: {
          [Op.gte]: lastWeek
        }
      },
      group: ['date'],
      order: [['date', 'ASC']]
    });
    
    // Топ-5 врачей по количеству записей
    const topDoctors = await Appointment.findAll({
      attributes: [
        'doctorId', 
        [sequelize.fn('COUNT', 'doctorId'), 'appointmentCount']
      ],
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['firstname', 'lastname', 'pic']
        }
      ],
      group: ['doctorId', 'doctor.id', 'doctor.firstname', 'doctor.lastname', 'doctor.pic'],
      order: [[sequelize.fn('COUNT', 'doctorId'), 'DESC']],
      limit: 5
    });
    
    return {
      totalAppointments,
      statusStats: {
        pending: pendingCount,
        completed: completedCount,
        cancelled: cancelledCount
      },
      appointmentsByDate: appointmentsByDate.map(item => ({
        date: item.date,
        count: parseInt(item.get('count'))
      })),
      topDoctors: topDoctors.map(doctor => ({
        id: doctor.doctorId,
        name: `${doctor.doctor.firstname} ${doctor.doctor.lastname}`,
        appointmentCount: parseInt(doctor.get('appointmentCount')),
        pic: doctor.doctor.pic
      }))
    };
  }
}

module.exports = new AppointmentService();