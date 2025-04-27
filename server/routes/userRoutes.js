const express = require('express');
const router = express.Router();
const { 
  getUser, 
  getAllUsers, 
  updateProfile, 
  deleteUser, 
  getCurrentUserProfile,
  searchUsers,
  getUserStats,
  uploadProfileImage,
  healthCheck
} = require('../controllers/userController');
const { auth, adminAuth, ownerOrAdminAuth } = require('../middleware/auth');
const { 
  userIdValidator, 
  updateProfileValidator, 
  deleteUserValidator 
} = require('../validators/userValidators');
const validate = require('../utils/validationResult');
const { uploadProfileImage: uploadImage } = require('../utils/fileUpload');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для работы с пользователями
 */

/**
 * @swagger
 * /api/user/health:
 *   get:
 *     summary: Проверка доступности сервиса
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервис доступен
 */
router.get('/health', healthCheck);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Получение профиля текущего пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о текущем пользователе
 */
router.get('/profile', auth, getCurrentUserProfile);

/**
 * @swagger
 * /api/user/getuser/{id}:
 *   get:
 *     summary: Получение пользователя по ID
 *     tags: [Users]
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
 *         description: Информация о пользователе
 */
router.get('/getuser/:id', auth, userIdValidator, validate, ownerOrAdminAuth('id'), getUser);

/**
 * @swagger
 * /api/user/getallusers:
 *   get:
 *     summary: Получение всех пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех пользователей
 */
router.get('/getallusers', auth, adminAuth, getAllUsers);

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Поиск пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Результаты поиска пользователей
 */
router.get('/search', auth, adminAuth, searchUsers);

/**
 * @swagger
 * /api/user/stats:
 *   get:
 *     summary: Получение статистики пользователей
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статистика пользователей
 */
router.get('/stats', auth, adminAuth, getUserStats);

/**
 * @swagger
 * /api/user/updateprofile:
 *   put:
 *     summary: Обновление профиля пользователя
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female, neither]
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               pic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 */
router.put('/updateprofile', auth, updateProfileValidator, validate, updateProfile);

/**
 * @swagger
 * /api/user/upload-profile-image:
 *   post:
 *     summary: Загрузка изображения профиля
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Изображение профиля успешно загружено
 */
router.post('/upload-profile-image', auth, uploadImage, uploadProfileImage);

/**
 * @swagger
 * /api/user/deleteuser:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Users]
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
 *         description: Пользователь успешно удален
 */
router.delete('/deleteuser', auth, adminAuth, deleteUserValidator, validate, deleteUser);

module.exports = router;
