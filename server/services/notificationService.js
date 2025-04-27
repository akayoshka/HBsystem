const { Notification, User } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { NotificationResponseDto } = require('../dto/notificationDto');

/**
 * Сервис для работы с уведомлениями
 */
class NotificationService {
  /**
   * Получить все уведомления для пользователя
   * @param {number} userId - ID пользователя
   * @param {object} options - Опции запроса (фильтрация, пагинация)
   * @returns {Promise<{count: number, notifications: NotificationResponseDto[]}>} - Количество и DTO с данными уведомлений
   */
  async getNotificationsForUser(userId, options = {}) {
    const { isRead, limit = 10, page = 1 } = options;
    
    // Фильтры для запроса
    const filters = { userId };
    if (isRead !== undefined) {
      filters.isRead = isRead;
    }
    
    // Параметры пагинации
    const offset = (page - 1) * limit;
    
    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: filters,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    return {
      count,
      notifications: notifications.map(notification => new NotificationResponseDto(notification))
    };
  }
  
  /**
   * Получить уведомление по ID
   * @param {number} notificationId - ID уведомления
   * @returns {Promise<NotificationResponseDto>} - DTO с данными уведомления
   */
  async getNotificationById(notificationId) {
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
    }
    
    return new NotificationResponseDto(notification);
  }
  
  /**
   * Создать уведомление
   * @param {object} notificationData - Данные для создания уведомления
   * @returns {Promise<NotificationResponseDto>} - DTO с данными созданного уведомления
   */
  async createNotification(notificationData) {
    const { userId, content } = notificationData;
    
    // Проверка существования пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('Пользователь не найден', StatusCodes.NOT_FOUND);
    }
    
    // Создаем уведомление
    const notification = await Notification.create({
      userId,
      content,
      isRead: false
    });
    
    return new NotificationResponseDto(notification);
  }
  
  /**
   * Отметить уведомление как прочитанное
   * @param {number} notificationId - ID уведомления
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешной отметке
   */
  async markNotificationAsRead(notificationId, userId) {
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
    }
    
    // Проверка, принадлежит ли уведомление данному пользователю
    if (notification.userId !== userId) {
      throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
    }
    
    // Обновляем статус
    await notification.update({ isRead: true });
    
    return 'Уведомление отмечено как прочитанное';
  }
  
  /**
   * Отметить все уведомления пользователя как прочитанные
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешной отметке
   */
  async markAllNotificationsAsRead(userId) {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    
    return 'Все уведомления отмечены как прочитанные';
  }
  
  /**
   * Удалить уведомление
   * @param {number} notificationId - ID уведомления
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешном удалении
   */
  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
    }
    
    // Проверка, принадлежит ли уведомление данному пользователю
    if (notification.userId !== userId) {
      throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
    }
    
    // Удаляем уведомление
    await notification.destroy();
    
    return 'Уведомление успешно удалено';
  }
  
  /**
   * Удалить все прочитанные уведомления пользователя
   * @param {number} userId - ID пользователя
   * @returns {Promise<string>} - Сообщение об успешном удалении
   */
  async deleteReadNotifications(userId) {
    await Notification.destroy({
      where: { userId, isRead: true }
    });
    
    return 'Все прочитанные уведомления удалены';
  }
  
  /**
   * Получить количество непрочитанных уведомлений пользователя
   * @param {number} userId - ID пользователя
   * @returns {Promise<number>} - Количество непрочитанных уведомлений
   */
  async getUnreadNotificationsCount(userId) {
    const count = await Notification.count({
      where: { userId, isRead: false }
    });
    
    return count;
  }
}

module.exports = new NotificationService();