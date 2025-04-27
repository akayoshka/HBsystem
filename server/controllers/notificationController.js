// controllers/notificationController.js
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { notificationService } = require('../services');
const { Notification } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { NotificationResponseDto } = require('../dto/notificationDto');

/**
 * @desc    Получение всех уведомлений для пользователя
 * @route   GET /api/notification/getallnotifs
 * @access  Private
 */
const getallnotifs = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { isRead, limit = 10, page = 1 } = req.query;
  
  // Фильтры для запроса
  const filters = { userId };
  if (isRead !== undefined) {
    filters.isRead = isRead === 'true';
  }
  
  // Параметры пагинации
  const offset = (page - 1) * limit;
  const { count, rows: notifications } = await Notification.findAndCountAll({
    where: filters,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']]
  });
  
  const formattedNotifications = notifications.map(notification => 
    new NotificationResponseDto(notification)
  );
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: formattedNotifications.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: {
      notifications: formattedNotifications
    }
  });
});

/**
 * @desc    Получение уведомления по ID
 * @route   GET /api/notification/:id
 * @access  Private
 */
const getNotificationById = asyncHandler(async (req, res) => {
  const notificationId = parseInt(req.params.id);
  const userId = req.userId;
  
  const notification = await Notification.findByPk(notificationId);
  
  if (!notification) {
    throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
  }
  
  // Проверка, принадлежит ли уведомление текущему пользователю
  if (notification.userId !== userId && !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  const formattedNotification = new NotificationResponseDto(notification);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      notification: formattedNotification
    }
  });
});

/**
 * @desc    Создание уведомления (для админа)
 * @route   POST /api/notification
 * @access  Private/Admin
 */
const createNotification = asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  
  const notification = await notificationService.createNotification({
    userId,
    content
  });
  
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Уведомление успешно создано',
    data: {
      notification
    }
  });
});

/**
 * @desc    Пометка уведомления как прочитанного
 * @route   PUT /api/notification/markasread
 * @access  Private
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.body;
  const userId = req.userId;
  
  const notification = await Notification.findByPk(notificationId);
  
  if (!notification) {
    throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
  }
  
  // Проверка, принадлежит ли уведомление текущему пользователю
  if (notification.userId !== userId && !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  // Обновляем статус
  notification.isRead = true;
  await notification.save();
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Уведомление отмечено как прочитанное'
  });
});

/**
 * @desc    Пометка всех уведомлений пользователя как прочитанных
 * @route   PUT /api/notification/markallasread
 * @access  Private
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  await Notification.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Все уведомления отмечены как прочитанные'
  });
});

/**
 * @desc    Удаление уведомления
 * @route   DELETE /api/notification/:id
 * @access  Private
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = parseInt(req.params.id);
  const userId = req.userId;
  
  const notification = await Notification.findByPk(notificationId);
  
  if (!notification) {
    throw new AppError('Уведомление не найдено', StatusCodes.NOT_FOUND);
  }
  
  // Проверка, принадлежит ли уведомление текущему пользователю
  if (notification.userId !== userId && !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  await notification.destroy();
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Уведомление успешно удалено'
  });
});

/**
 * @desc    Удаление всех прочитанных уведомлений пользователя
 * @route   DELETE /api/notification/deleteread
 * @access  Private
 */
const deleteReadNotifications = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  await Notification.destroy({
    where: { userId, isRead: true }
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Все прочитанные уведомления удалены'
  });
});

/**
 * @desc    Получение количества непрочитанных уведомлений
 * @route   GET /api/notification/unread/count
 * @access  Private
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  const count = await Notification.count({
    where: { userId, isRead: false }
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      unreadCount: count
    }
  });
});

module.exports = {
  getallnotifs,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount
};