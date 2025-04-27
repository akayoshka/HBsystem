// controllers/doctorController.js
const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { doctorService, notificationService } = require('../services');
const { DoctorResponseDto, DoctorApplicationDto } = require('../dto/doctorDto');
const { AppError } = require('../utils/errorHandler');
const { Op } = require('sequelize');
const { Doctor, User } = require('../models');

/**
 * @desc    Получение всех врачей
 * @route   GET /api/doctor/getalldoctors
 * @access  Public
 */
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctorService.getAllDoctors();
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: doctors.length,
    data: {
      doctors
    }
  });
});

/**
 * @desc    Получение информации о враче по ID
 * @route   GET /api/doctor/getdoctor/:id
 * @access  Public
 */
const getDoctorById = asyncHandler(async (req, res) => {
  const doctorId = parseInt(req.params.id);
  
  const doctor = await doctorService.getDoctorById(doctorId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      doctor
    }
  });
});

/**
 * @desc    Получение заявок на роль врача (для админа)
 * @route   GET /api/doctor/getnotdoctors
 * @access  Private/Admin
 */
const getNotDoctors = asyncHandler(async (req, res) => {
  const applications = await doctorService.getDoctorApplications();
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: applications.length,
    data: {
      applications
    }
  });
});

/**
 * @desc    Подача заявки на роль врача
 * @route   POST /api/doctor/applyfordoctor
 * @access  Private
 */
const applyForDoctor = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const doctorData = new DoctorApplicationDto({
    userId,
    ...req.body
  });
  
  const message = await doctorService.applyForDoctor(userId, doctorData);
  
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Обновление информации о враче
 * @route   PUT /api/doctor/updatedoctor
 * @access  Private
 */
const updateDoctor = asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  // Проверяем, является ли пользователь врачом
  const doctor = await Doctor.findOne({ where: { userId } });
  
  if (!doctor) {
    throw new AppError('Вы не являетесь врачом', StatusCodes.FORBIDDEN);
  }
  
  const updatedDoctor = await doctorService.updateDoctor(doctor.id, req.body);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Информация о враче успешно обновлена',
    data: {
      doctor: updatedDoctor
    }
  });
});

/**
 * @desc    Принятие заявки на роль врача
 * @route   PUT /api/doctor/acceptdoctor
 * @access  Private/Admin
 */
const acceptDoctor = asyncHandler(async (req, res) => {
  const { id } = req.body;
  
  const message = await doctorService.acceptDoctorApplication(id);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Отклонение заявки на роль врача
 * @route   PUT /api/doctor/rejectdoctor
 * @access  Private/Admin
 */
const rejectDoctor = asyncHandler(async (req, res) => {
  const { id } = req.body;
  
  const message = await doctorService.rejectDoctorApplication(id);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Удаление врача
 * @route   PUT /api/doctor/deletedoctor
 * @access  Private/Admin
 */
const deleteDoctor = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  const message = await doctorService.deleteDoctor(userId);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message
  });
});

/**
 * @desc    Поиск и фильтрация врачей
 * @route   GET /api/doctor/search
 * @access  Public
 */
const searchDoctors = asyncHandler(async (req, res) => {
  const { specialization, minExperience, maxFees, searchTerm } = req.query;
  
  const filters = {};
  
  // Фильтр по специализации
  if (specialization) {
    filters.specialization = { [Op.iLike]: `%${specialization}%` };
  }
  
  // Фильтр по опыту
  if (minExperience) {
    filters.experience = { [Op.gte]: parseInt(minExperience) };
  }
  
  // Фильтр по стоимости
  if (maxFees) {
    filters.fees = { [Op.lte]: parseFloat(maxFees) };
  }
  
  // Общий поиск по имени/фамилии врача
  let userFilter = {};
  if (searchTerm) {
    userFilter = {
      [Op.or]: [
        { firstname: { [Op.iLike]: `%${searchTerm}%` } },
        { lastname: { [Op.iLike]: `%${searchTerm}%` } }
      ]
    };
  }
  
  // Получаем только подтвержденных врачей
  filters.isDoctor = true;
  
  // Запрос к базе данных
  const doctors = await Doctor.findAll({
    where: filters,
    include: [
      {
        model: User,
        as: 'user',
        where: userFilter,
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic', 'mobile']
      }
    ]
  });
  
  const formattedDoctors = doctors.map(doctor => new DoctorResponseDto(doctor));
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: formattedDoctors.length,
    data: {
      doctors: formattedDoctors
    }
  });
});

/**
 * @desc    Получение статистики по врачам
 * @route   GET /api/doctor/stats
 * @access  Private/Admin
 */
const getDoctorStats = asyncHandler(async (req, res) => {
  // Общее количество врачей
  const totalDoctors = await Doctor.count({
    where: { isDoctor: true }
  });
  
  // Количество ожидающих заявок
  const pendingApplications = await Doctor.count({
    where: { isDoctor: false }
  });
  
  // Статистика по специализациям
  const specializations = await Doctor.findAll({
    where: { isDoctor: true },
    attributes: ['specialization', [sequelize.fn('COUNT', 'specialization'), 'count']],
    group: ['specialization'],
    order: [[sequelize.fn('COUNT', 'specialization'), 'DESC']]
  });
  
  // Доктора с наивысшими гонорарами
  const topFeesDoctors = await Doctor.findAll({
    where: { isDoctor: true },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstname', 'lastname', 'pic']
      }
    ],
    order: [['fees', 'DESC']],
    limit: 5
  });
  
  // Доктора с наибольшим опытом
  const mostExperiencedDoctors = await Doctor.findAll({
    where: { isDoctor: true },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['firstname', 'lastname', 'pic']
      }
    ],
    order: [['experience', 'DESC']],
    limit: 5
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      totalDoctors,
      pendingApplications,
      specializations: specializations.map(s => ({
        name: s.specialization,
        count: s.get('count')
      })),
      topFeesDoctors: topFeesDoctors.map(d => ({
        id: d.id,
        name: `${d.user.firstname} ${d.user.lastname}`,
        fees: d.fees,
        specialization: d.specialization,
        pic: d.user.pic
      })),
      mostExperiencedDoctors: mostExperiencedDoctors.map(d => ({
        id: d.id,
        name: `${d.user.firstname} ${d.user.lastname}`,
        experience: d.experience,
        specialization: d.specialization,
        pic: d.user.pic
      }))
    }
  });
});

module.exports = {
  getAllDoctors,
  getDoctorById,
  getNotDoctors,
  applyForDoctor,
  updateDoctor,
  acceptDoctor,
  rejectDoctor,
  deleteDoctor,
  searchDoctors,
  getDoctorStats
};