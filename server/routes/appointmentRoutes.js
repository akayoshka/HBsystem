const express = require('express');
const router = express.Router();
const { 
  getallappointments, 
  getAppointmentById,
  bookappointment, 
  completed, 
  cancelAppointment,
  getAppointmentStats,
  checkAvailability
} = require('../controllers/appointmentController');
const { auth, adminAuth, doctorAuth } = require('../middleware/auth');
const { 
  appointmentIdValidator,
  bookAppointmentValidator, 
  completeAppointmentValidator,
  filterAppointmentsValidator
} = require('../validators/appointmentValidators');
const validate = require('../utils/validationResult');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: API для работы с записями на прием
 */

/**
 * @swagger
 * /api/appointment/getallappointments:
 *   get:
 *     summary: Получение всех записей на прием
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: ID пользователя или врача для фильтрации
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Completed, Cancelled]
 *         description: Фильтр по статусу записи
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Фильтр по дате записи
 *     responses:
 *       200:
 *         description: Список записей на прием
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.get('/getallappointments', auth, filterAppointmentsValidator, validate, getallappointments);

/**
 * @swagger
 * /api/appointment/stats:
 *   get:
 *     summary: Получение статистики по записям на прием
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика по записям на прием
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       500:
 *         description: Ошибка сервера
 */
router.get('/stats', auth, adminAuth, getAppointmentStats);

/**
 * @swagger
 * /api/appointment/available:
 *   get:
 *     summary: Проверка доступности времени для записи
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID врача
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Дата в формате YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Доступные и занятые временные слоты
 *       400:
 *         description: Неверные параметры запроса
 *       500:
 *         description: Ошибка сервера
 */
router.get('/available', checkAvailability);

/**
 * @swagger
 * /api/appointment/{id}:
 *   get:
 *     summary: Получение записи на прием по ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи на прием
 *     responses:
 *       200:
 *         description: Информация о записи на прием
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Запись не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.get('/:id', auth, appointmentIdValidator, validate, getAppointmentById);

/**
 * @swagger
 * /api/appointment/bookappointment:
 *   post:
 *     summary: Создание записи на прием
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - time
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 description: ID врача
 *               date:
 *                 type: string
 *                 description: Дата приема (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 description: Время приема (HH:MM)
 *               doctorname:
 *                 type: string
 *                 description: Имя врача (опционально)
 *     responses:
 *       201:
 *         description: Запись на прием успешно создана
 *       400:
 *         description: Неверные данные или время уже занято
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.post('/bookappointment', auth, bookAppointmentValidator, validate, bookappointment);

/**
 * @swagger
 * /api/appointment/completed:
 *   put:
 *     summary: Отметка о завершении приема
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointid
 *               - doctorId
 *             properties:
 *               appointid:
 *                 type: integer
 *                 description: ID записи на прием
 *               doctorId:
 *                 type: integer
 *                 description: ID врача
 *               doctorname:
 *                 type: string
 *                 description: Имя врача (опционально)
 *     responses:
 *       200:
 *         description: Прием успешно отмечен как завершенный
 *       400:
 *         description: Неверные данные
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Запись не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.put('/completed', auth, completeAppointmentValidator, validate, completed);

/**
 * @swagger
 * /api/appointment/cancel/{id}:
 *   put:
 *     summary: Отмена записи на прием
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID записи на прием
 *     responses:
 *       200:
 *         description: Запись на прием успешно отменена
 *       400:
 *         description: Неверные данные или нельзя отменить завершенный прием
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен
 *       404:
 *         description: Запись не найдена
 *       500:
 *         description: Ошибка сервера
 */
router.put('/cancel/:id', auth, appointmentIdValidator, validate, cancelAppointment);

module.exports = router;