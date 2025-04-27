// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  getDoctorById,
  getNotDoctors, 
  applyForDoctor, 
  updateDoctor,
  deleteDoctor, 
  acceptDoctor, 
  rejectDoctor,
  searchDoctors,
  getDoctorStats
} = require('../controllers/doctorController');
const { auth, adminAuth, doctorAuth } = require('../middleware/auth');
const { 
  doctorIdValidator,
  applyForDoctorValidator, 
  updateDoctorValidator,
  doctorActionValidator, 
  deleteDoctorValidator,
  searchDoctorsValidator
} = require('../validators/doctorValidators');
const validate = require('../utils/validationResult');

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API для работы с врачами
 */

/**
 * @swagger
 * /api/doctor/getalldoctors:
 *   get:
 *     summary: Получение всех врачей
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Список всех врачей
 */
router.get('/getalldoctors', getAllDoctors);

/**
 * @swagger
 * /api/doctor/getdoctor/{id}:
 *   get:
 *     summary: Получение информации о враче по ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о враче
 */
router.get('/getdoctor/:id', doctorIdValidator, validate, getDoctorById);

/**
 * @swagger
 * /api/doctor/search:
 *   get:
 *     summary: Поиск и фильтрация врачей
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxFees
 *         schema:
 *           type: number
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Результаты поиска врачей
 */
router.get('/search', searchDoctorsValidator, validate, searchDoctors);

/**
 * @swagger
 * /api/doctor/getnotdoctors:
 *   get:
 *     summary: Получение заявок на роль врача
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список заявок на роль врача
 */
router.get('/getnotdoctors', auth, adminAuth, getNotDoctors);

/**
 * @swagger
 * /api/doctor/stats:
 *   get:
 *     summary: Получение статистики по врачам
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика по врачам
 */
router.get('/stats', auth, adminAuth, getDoctorStats);

/**
 * @swagger
 * /api/doctor/applyfordoctor:
 *   post:
 *     summary: Подача заявки на роль врача
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *               fees:
 *                 type: number
 *     responses:
 *       201:
 *         description: Заявка успешно отправлена
 */
router.post('/applyfordoctor', auth, applyForDoctorValidator, validate, applyForDoctor);

/**
 * @swagger
 * /api/doctor/updatedoctor:
 *   put:
 *     summary: Обновление информации о враче
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *               fees:
 *                 type: number
 *     responses:
 *       200:
 *         description: Информация о враче успешно обновлена
 */
router.put('/updatedoctor', auth, doctorAuth, updateDoctorValidator, validate, updateDoctor);

/**
 * @swagger
 * /api/doctor/acceptdoctor:
 *   put:
 *     summary: Принятие заявки на роль врача
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Заявка успешно принята
 */
router.put('/acceptdoctor', auth, adminAuth, doctorActionValidator, validate, acceptDoctor);

/**
 * @swagger
 * /api/doctor/rejectdoctor:
 *   put:
 *     summary: Отклонение заявки на роль врача
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Заявка успешно отклонена
 */
router.put('/rejectdoctor', auth, adminAuth, doctorActionValidator, validate, rejectDoctor);

/**
 * @swagger
 * /api/doctor/deletedoctor:
 *   put:
 *     summary: Удаление врача
 *     tags: [Doctors]
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
 *     responses:
 *       200:
 *         description: Врач успешно удален
 */
router.put('/deletedoctor', auth, adminAuth, deleteDoctorValidator, validate, deleteDoctor);

module.exports = router;