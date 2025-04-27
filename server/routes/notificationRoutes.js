const express = require('express');
const router = express.Router();
const { 
  getallnotifs, 
  getNotificationById,
  createNotification, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount
} = require('../controllers/notificationController');
const { auth, adminAuth } = require('../middleware/auth');
const { 
  notificationIdValidator,
  createNotificationValidator,
  markAsReadValidator,
  deleteNotificationValidator,
  filterNotificationsValidator
} = require('../validators/notificationValidators');
const validate = require('../utils/validationResult');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API для работы с уведомлениями
 */

/**
 * @swagger
 * /api/notification/getallnotifs:
 *   get:
 *     summary: Получение всех уведомлений пользователя
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Список уведомлений пользователя
 */
router.get('/getallnotifs', auth, filterNotificationsValidator, validate, getallnotifs);

/**
 * @swagger
 * /api/notification/{id}:
 *   get:
 *     summary: Получение уведомления по ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация об уведомлении
 */
router.get('/:id', auth, notificationIdValidator, validate, getNotificationById);

/**
 * @swagger
 * /api/notification/unread/count:
 *   get:
 *     summary: Получение количества непрочитанных уведомлений
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Количество непрочитанных уведомлений
 */
router.get('/unread/count', auth, getUnreadCount);

/**
 * @swagger
 * /api/notification:
 *   post:
 *     summary: Создание уведомления (для админа)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Уведомление успешно создано
 */
router.post('/', auth, adminAuth, createNotificationValidator, validate, createNotification);

/**
 * @swagger
 * /api/notification/markasread:
 *   put:
 *     summary: Пометка уведомления как прочитанного
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Уведомление отмечено как прочитанное
 */
router.put('/markasread', auth, markAsReadValidator, validate, markAsRead);

/**
 * @swagger
 * /api/notification/markallasread:
 *   put:
 *     summary: Пометка всех уведомлений пользователя как прочитанных
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Все уведомления отмечены как прочитанные
 */
router.put('/markallasread', auth, markAllAsRead);

/**
 * @swagger
 * /api/notification/{id}:
 *   delete:
 *     summary: Удаление уведомления
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Уведомление успешно удалено
 */
router.delete('/:id', auth, deleteNotificationValidator, validate, deleteNotification);

/**
 * @swagger
 * /api/notification/deleteread:
 *   delete:
 *     summary: Удаление всех прочитанных уведомлений пользователя
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Все прочитанные уведомления удалены
 */
router.delete('/deleteread', auth, deleteReadNotifications);

module.exports = router;