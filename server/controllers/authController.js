const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { userService } = require('../services');
const { UserRegistrationDto, UserLoginDto } = require('../dto/userDto');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

/**
 * @desc    Регистрация нового пользователя
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const registrationDto = new UserRegistrationDto(req.body);
  
  const message = await userService.registerUser(registrationDto);
  
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Вход пользователя
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const loginDto = new UserLoginDto(req.body);
  
  const { token, message } = await userService.loginUser(loginDto);
  
  // Отправляем токен в cookie (более безопасный вариант)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 день
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message,
    token,
    data: {
      user: await userService.getUserById(jwt.decode(token).userId)
    }
  });
});

/**
 * @desc    Выход пользователя
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Очистка cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Выход выполнен успешно'
  });
});

/**
 * @desc    Получение текущего пользователя
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      user
    }
  });
});

/**
 * @desc    Смена пароля
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw new AppError('Текущий и новый пароли обязательны', StatusCodes.BAD_REQUEST);
  }
  
  const userId = req.userId;
  await userService.changePassword(userId, currentPassword, newPassword);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Пароль успешно изменен'
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword
};