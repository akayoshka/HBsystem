const { Doctor, User, Appointment } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { DoctorResponseDto } = require('../dto/doctorDto');
const { Op } = require('sequelize');
const notificationService = require('./notificationService');

/**
 * Сервис для работы с докторами
 */
class DoctorService {
  /**
   * Получить всех врачей
   * @returns {Promise<DoctorResponseDto[]>} - Массив DTO с данными врачей
   */
  async getAllDoctors() {
    const doctors = await Doctor.findAll({
      where: { isDoctor: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
        }
      ]
    });
    
    return doctors.map(doctor => new DoctorResponseDto(doctor));
  }
  
  /**
   * Получить доктора по ID
   * @param {number} doctorId - ID доктора
   * @returns {Promise<DoctorResponseDto>} - DTO с данными доктора
   */
  async getDoctorById(doctorId) {
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
        }
      ]
    });
    
    if (!doctor) {
      throw new AppError('Врач не найден', StatusCodes.NOT_FOUND);
    }
    
    return new DoctorResponseDto(doctor);
  }
  
  /**
   * Получить заявки на роль врача (неподтвержденные)
   * @returns {Promise<DoctorResponseDto[]>} - Массив DTO с данными заявок
   */
  async getDoctorApplications() {
    const applications = await Doctor.findAll({
      where: { isDoctor: false },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
        }
      ]
    });
    
    return applications.map(application => new DoctorResponseDto(application));
  }
  
  /**
   * Подать заявку на роль врача
   * @param {number} userId - ID пользователя
   * @param {object} doctorData - Данные врача
   * @returns {Promise<string>} - Сообщение об успешной подаче заявки
   */
  async applyForDoctor(userId, doctorData) {
    // Проверяем, существует ли уже заявка
    const existingApplication = await Doctor.findOne({ where: { userId } });
    
    if (existingApplication) {
      throw new AppError('Заявка уже существует', StatusCodes.BAD_REQUEST);
    }
    
    // Создаем заявку
    await Doctor.create({
      userId,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      fees: doctorData.fees,
      isDoctor: false
    });
    
    return 'Заявка на роль врача успешно отправлена';
  }
  
  /**
   * Обновление информации о враче
   * @param {number} doctorId - ID доктора
   * @param {object} updateData - Данные для обновления
   * @returns {Promise<DoctorResponseDto>} - DTO с обновленными данными доктора
   */
  async updateDoctor(doctorId, updateData) {
    const doctor = await Doctor.findByPk(doctorId);
    
    if (!doctor) {
      throw new AppError('Врач не найден', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем только разрешенные поля
    const allowedFields = ['specialization', 'experience', 'fees'];
    const filteredData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });
    
    await doctor.update(filteredData);
    
    // Получаем обновленные данные с информацией о пользователе
    const updatedDoctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
        }
      ]
    });
    
    return new DoctorResponseDto(updatedDoctor);
  }
  
  /**
   * Принять заявку на роль врача
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешном принятии заявки
   */
  async acceptDoctorApplication(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    const doctorApplication = await Doctor.findOne({ where: { userId } });
    
    if (!doctorApplication) {
      throw new AppError('Заявка не найдена', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем статус пользователя
    await user.update({ isDoctor: true, status: 'accepted' });
    
    // Обновляем статус заявки
    await doctorApplication.update({ isDoctor: true });
    
    // Создаем уведомление
    await notificationService.createNotification({
      userId,
      content: 'Поздравляем! Ваша заявка на роль врача была принята.'
    });
    
    return 'Заявка на роль врача успешно принята';
  }
  
  /**
   * Отклонить заявку на роль врача
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешном отклонении заявки
   */
  async rejectDoctorApplication(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем статус пользователя
    await user.update({ isDoctor: false, status: 'rejected' });
    
    // Удаляем заявку
    await Doctor.destroy({ where: { userId } });
    
    // Создаем уведомление
    await notificationService.createNotification({
      userId,
      content: 'К сожалению, Ваша заявка на роль врача была отклонена.'
    });
    
    return 'Заявка на роль врача успешно отклонена';
  }
  
  /**
   * Удалить врача
   * @param {number} userId - ID пользователя-врача
   * @returns {Promise<string>} - Сообщение об успешном удалении
   */
  async deleteDoctor(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем статус пользователя
    await user.update({ isDoctor: false });
    
    // Удаляем запись о враче
    await Doctor.destroy({ where: { userId } });
    
    // Удаляем связанные записи на прием (опционально)
    // await Appointment.destroy({ where: { doctorId: userId } });
    
    return 'Врач успешно удален';
  }
  
  /**
   * Поиск врачей по различным критериям
   * @param {object} filters - Фильтры для поиска
   * @returns {Promise<DoctorResponseDto[]>} - Массив найденных врачей
   */
  async searchDoctors(filters = {}) {
    const { specialization, minExperience, maxFees, searchTerm } = filters;
    
    const whereCondition = { isDoctor: true };
    
    // Фильтр по специализации
    if (specialization) {
      whereCondition.specialization = { [Op.iLike]: `%${specialization}%` };
    }
    
    // Фильтр по опыту
    if (minExperience) {
      whereCondition.experience = { [Op.gte]: parseInt(minExperience) };
    }
    
    // Фильтр по стоимости
    if (maxFees) {
      whereCondition.fees = { [Op.lte]: parseFloat(maxFees) };
    }
    
    // Фильтр по имени/фамилии (через связанного пользователя)
    let userWhere = {};
    if (searchTerm) {
      userWhere = {
        [Op.or]: [
          { firstname: { [Op.iLike]: `%${searchTerm}%` } },
          { lastname: { [Op.iLike]: `%${searchTerm}%` } }
        ]
      };
    }
    
    const doctors = await Doctor.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
          where: Object.keys(userWhere).length ? userWhere : undefined,
          attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
        }
      ]
    });
    
    return doctors.map(doctor => new DoctorResponseDto(doctor));
  }
}

module.exports = new DoctorService();