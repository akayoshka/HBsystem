const { User } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { UserResponseDto } = require('../dto/userDto');
const { Op } = require('sequelize');

/**
 * Сервис для работы с пользователями
 */
class UserService {
  /**
   * Генерация JWT-токена
   * @param {Object} user - Пользователь
   * @returns {string} - JWT-токен
   */
  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
      }
    );
  }

  /**
   * Получить пользователя по ID
   * @param {number} userId - ID пользователя
   * @returns {Promise<UserResponseDto>} - DTO с данными пользователя
   */
  async getUserById(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    return new UserResponseDto(user);
  }
  
  /**
   * Получить всех пользователей (кроме текущего)
   * @param {number} currentUserId - ID текущего пользователя
   * @returns {Promise<UserResponseDto[]>} - Массив DTO с данными пользователей
   */
  async getAllUsers(currentUserId) {
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId }
      }
    });
    
    return users.map(user => new UserResponseDto(user));
  }
  
  /**
   * Регистрация пользователя
   * @param {object} userData - Данные пользователя
   * @returns {Promise<string>} - Сообщение об успешной регистрации
   */
  async registerUser(userData) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email: userData.email } });
    
    if (existingUser) {
      throw new AppError('Email уже используется', StatusCodes.BAD_REQUEST);
    }
    
    // Создаем нового пользователя
    await User.create(userData);
    
    return 'Пользователь успешно зарегистрирован';
  }
  
  /**
   * Вход пользователя
   * @param {object} loginData - Данные для входа
   * @returns {Promise<object>} - Токен JWT и сообщение
   */
  async loginUser(loginData) {
    const { email, password } = loginData;
    
    // Ищем пользователя по email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new AppError('Неверные учетные данные', StatusCodes.UNAUTHORIZED);
    }
    
    // Проверяем пароль
    const isPasswordValid = await user.checkPassword(password);
    
    if (!isPasswordValid) {
      throw new AppError('Неверные учетные данные', StatusCodes.UNAUTHORIZED);
    }
    
    // Генерируем JWT-токен
    const token = this.generateToken(user);
    
    return {
      token,
      message: 'Пользователь успешно вошел в систему'
    };
  }
  
  /**
   * Обновление профиля пользователя
   * @param {number} userId - ID пользователя
   * @param {object} updateData - Данные для обновления
   * @returns {Promise<string>} - Сообщение об успешном обновлении
   */
  async updateUserProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Обновляем данные пользователя
    await user.update(updateData);
    
    return 'Профиль пользователя успешно обновлен';
  }
  
  /**
   * Удаление пользователя
   * @param {number} userId - ID пользователя для удаления
   * @returns {Promise<string>} - Сообщение об успешном удалении
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Удаляем пользователя
    await user.destroy();
    
    return 'Пользователь успешно удален';
  }
  
  /**
   * Смена пароля пользователя
   * @param {number} userId - ID пользователя
   * @param {string} currentPassword - Текущий пароль
   * @param {string} newPassword - Новый пароль
   * @returns {Promise<string>} - Сообщение об успешной смене пароля
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Проверяем текущий пароль
    const isPasswordValid = await user.checkPassword(currentPassword);
    
    if (!isPasswordValid) {
      throw new AppError('Текущий пароль неверен', StatusCodes.UNAUTHORIZED);
    }
    
    // Обновляем пароль
    await user.update({ password: newPassword });
    
    return 'Пароль успешно изменен';
  }
  
  /**
   * Поиск пользователей по имени, фамилии или email
   * @param {string} query - Поисковый запрос
   * @returns {Promise<UserResponseDto[]>} - Массив DTO с данными пользователей
   */
  async searchUsers(query) {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { firstname: { [Op.iLike]: `%${query}%` } },
          { lastname: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
    
    return users.map(user => new UserResponseDto(user));
  }
  
  /**
   * Получение статистики пользователей
   * @returns {Promise<Object>} - Объект со статистикой
   */
  async getUserStats() {
    // Общее количество пользователей
    const totalUsers = await User.count();
    
    // Количество администраторов
    const adminCount = await User.count({
      where: { isAdmin: true }
    });
    
    // Количество врачей
    const doctorCount = await User.count({
      where: { isDoctor: true }
    });
    
    // Количество обычных пользователей
    const regularUserCount = totalUsers - (adminCount + doctorCount);
    
    // Количество пользователей по статусу
    const pendingCount = await User.count({
      where: { status: 'pending' }
    });
    
    const acceptedCount = await User.count({
      where: { status: 'accepted' }
    });
    
    const rejectedCount = await User.count({
      where: { status: 'rejected' }
    });
    
    // Пользователи, созданные за последний месяц
    const lastMonthCount = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    });
    
    // Пользователи по полу
    const maleCount = await User.count({
      where: { gender: 'male' }
    });
    
    const femaleCount = await User.count({
      where: { gender: 'female' }
    });
    
    const otherGenderCount = await User.count({
      where: { gender: 'neither' }
    });
    
    return {
      totalUsers,
      adminCount,
      doctorCount,
      regularUserCount,
      statusStats: {
        pending: pendingCount,
        accepted: acceptedCount,
        rejected: rejectedCount
      },
      lastMonthCount,
      genderStats: {
        male: maleCount,
        female: femaleCount,
        other: otherGenderCount
      }
    };
  }
}

module.exports = new UserService();