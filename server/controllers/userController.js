const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { userService } = require('../services');
const { UserUpdateDto, UserResponseDto } = require('../dto/userDto');
const { AppError } = require('../utils/errorHandler');

/**
 * @desc    Получение пользователя по ID
 * @route   GET /api/user/getuser/:id
 * @access  Private (Owner/Admin)
 */
const getUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);
  
  const user = await userService.getUserById(userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * @desc    Получение всех пользователей
 * @route   GET /api/user/getallusers
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * @desc    Обновление профиля пользователя
 * @route   PUT /api/user/updateprofile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const updateDto = new UserUpdateDto(req.body);
  
  const message = await userService.updateUserProfile(userId, updateDto);
  
  // Получаем обновленные данные пользователя
  const updatedUser = await userService.getUserById(userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message,
    data: {
      user: updatedUser
    }
  });
});

/**
 * @desc    Удаление пользователя
 * @route   DELETE /api/user/deleteuser
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    throw new AppError('ID пользователя обязателен', StatusCodes.BAD_REQUEST);
  }
  
  const message = await userService.deleteUser(userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Получение профиля текущего пользователя
 * @route   GET /api/user/profile
 * @access  Private
 */
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  const user = await userService.getUserById(userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * @desc    Поиск пользователей
 * @route   GET /api/user/search
 * @access  Private/Admin
 */
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    throw new AppError('Поисковый запрос обязателен', StatusCodes.BAD_REQUEST);
  }
  
  const users = await userService.searchUsers(query);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

/**
 * @desc    Получение статистики пользователей
 * @route   GET /api/user/stats
 * @access  Private/Admin
 */
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      stats
    }
  });
});

/**
 * @desc    Загрузка изображения профиля
 * @route   POST /api/user/upload-profile-image
 * @access  Private
 */
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Пожалуйста, загрузите изображение', StatusCodes.BAD_REQUEST);
  }
  
  // Формируем URL для доступа к изображению
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  // Обновляем профиль пользователя с новым URL изображения
  await userService.updateUserProfile(req.userId, { pic: imageUrl });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Изображение профиля успешно загружено',
    data: {
      imageUrl
    }
  });
});

/**
 * @desc    Проверка доступности сервиса
 * @route   GET /api/user/health
 * @access  Public
 */
const healthCheck = asyncHandler(async (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Сервис доступен',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

module.exports = {
  getUser,
  getAllUsers,
  updateProfile,
  deleteUser,
  getCurrentUserProfile,
  searchUsers,
  getUserStats,
  uploadProfileImage,
  healthCheck
};