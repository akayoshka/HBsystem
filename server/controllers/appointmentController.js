const asyncHandler = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { appointmentService, notificationService } = require('../services');
const { AppointmentResponseDto } = require('../dto/appointmentDto');
const { AppError } = require('../utils/errorHandler');
const { Appointment, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * @desc    Получение всех записей на прием
 * @route   GET /api/appointment/getallappointments
 * @access  Private
 */
const getallappointments = asyncHandler(async (req, res) => {
  const { search, status, date } = req.query;
  const userId = req.userId;
  
  let filters = {};
  
  // Если задан параметр поиска, ищем записи по ID пользователя или врача
  if (search) {
    filters = {
      [Op.or]: [
        { userId: search },
        { doctorId: search }
      ]
    };
  }
  
  // Если нет параметра поиска, но есть авторизованный пользователь, показываем только его записи
  // else if (userId) {
  //   filters = {
  //     [Op.or]: [
  //       { userId },
  //       { doctorId: userId } // Если пользователь также является врачом
  //     ]
  //   };
  // }
  
  // Фильтрация по статусу
  if (status) {
    filters.status = status;
  }
  
  // Фильтрация по дате
  if (date) {
    filters.date = date;
  }
  
  const appointments = await Appointment.findAll({
    where: filters,
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      },
      {
        model: User,
        as: 'doctor',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      }
    ],
    order: [['date', 'DESC'], ['time', 'DESC']]
  });
  
  const formattedAppointments = appointments.map(appointment => new AppointmentResponseDto(appointment));
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: formattedAppointments.length,
    data: {
      appointments: formattedAppointments
    }
  });
});

/**
 * @desc    Получение записи на прием по ID
 * @route   GET /api/appointment/:id
 * @access  Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      },
      {
        model: User,
        as: 'doctor',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      }
    ]
  });
  
  if (!appointment) {
    throw new AppError('Запись на прием не найдена', StatusCodes.NOT_FOUND);
  }
  
  // Проверка доступа к записи (только владелец записи, врач или админ)
  if (appointment.userId !== req.userId && 
      appointment.doctorId !== req.userId && 
      !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  const formattedAppointment = new AppointmentResponseDto(appointment);
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      appointment: formattedAppointment
    }
  });
});

/**
 * @desc    Создание записи на прием
 * @route   POST /api/appointment/bookappointment
 * @access  Private
 */
const bookappointment = asyncHandler(async (req, res) => {
  const { doctorId, date, time, doctorname } = req.body;
  const userId = req.userId;
  
  // Проверка, существует ли уже запись на это время и дату у данного врача
  const existingAppointment = await Appointment.findOne({
    where: {
      doctorId,
      date,
      time,
      status: 'Pending'
    }
  });
  
  if (existingAppointment) {
    throw new AppError('Это время уже занято. Пожалуйста, выберите другое время.', StatusCodes.BAD_REQUEST);
  }
  
  // Создание записи на прием
  const appointment = await Appointment.create({
    userId,
    doctorId,
    date,
    time,
    status: 'Pending'
  });
  
  // Находим информацию о пациенте
  const patient = await User.findByPk(userId);
  
  // Создаем уведомление для пациента
  await notificationService.createNotification({
    userId,
    content: `Вы записались на прием к Dr. ${doctorname} на ${date} ${time}`
  });
  
  // Создаем уведомление для врача
  await notificationService.createNotification({
    userId: doctorId,
    content: `У вас новая запись на прием с ${patient.firstname} ${patient.lastname} на ${date} в ${time}`
  });
  
  // Получаем полную информацию о созданной записи
  const newAppointment = await Appointment.findByPk(appointment.id, {
    include: [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      },
      {
        model: User,
        as: 'doctor',
        attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
      }
    ]
  });
  
  const formattedAppointment = new AppointmentResponseDto(newAppointment);
  
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Запись на прием успешно создана',
    data: {
      appointment: formattedAppointment
    }
  });
});

/**
 * @desc    Отметка о завершении приема
 * @route   PUT /api/appointment/completed
 * @access  Private
 */
const completed = asyncHandler(async (req, res) => {
  const { appointid, doctorId, doctorname } = req.body;
  
  // Находим запись на прием
  const appointment = await Appointment.findByPk(appointid);
  
  if (!appointment) {
    throw new AppError('Запись на прием не найдена', StatusCodes.NOT_FOUND);
  }
  
  // Проверка прав (только врач, которому назначена запись, или админ)
  if (appointment.doctorId !== req.userId && !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  // Обновляем статус
  appointment.status = 'Completed';
  await appointment.save();
  
  // Создаем уведомление для пациента
  await notificationService.createNotification({
    userId: appointment.userId,
    content: `Ваш прием с ${doctorname} завершен`
  });
  
  // Находим информацию о пациенте
  const patient = await User.findByPk(appointment.userId);
  
  // Создаем уведомление для врача
  await notificationService.createNotification({
    userId: doctorId,
    content: `Ваш прием с ${patient.firstname} ${patient.lastname} завершен`
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Прием успешно отмечен как завершенный'
  });
});

/**
 * @desc    Отмена записи на прием
 * @route   PUT /api/appointment/cancel/:id
 * @access  Private
 */
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointmentId = parseInt(req.params.id);
  
  // Находим запись на прием
  const appointment = await Appointment.findByPk(appointmentId);
  
  if (!appointment) {
    throw new AppError('Запись на прием не найдена', StatusCodes.NOT_FOUND);
  }
  
  // Проверка прав (только пациент, врач или админ)
  if (appointment.userId !== req.userId && 
      appointment.doctorId !== req.userId && 
      !req.user.isAdmin) {
    throw new AppError('Доступ запрещен', StatusCodes.FORBIDDEN);
  }
  
  // Проверка, что запись еще не завершена
  if (appointment.status === 'Completed') {
    throw new AppError('Нельзя отменить завершенный прием', StatusCodes.BAD_REQUEST);
  }
  
  // Обновляем статус
  appointment.status = 'Cancelled';
  await appointment.save();
  
  // Находим информацию о пациенте и враче
  const patient = await User.findByPk(appointment.userId);
  const doctor = await User.findByPk(appointment.doctorId);
  
  // Создаем уведомление для пациента
  await notificationService.createNotification({
    userId: appointment.userId,
    content: `Ваш прием с Dr. ${doctor.firstname} ${doctor.lastname} на ${appointment.date} ${appointment.time} отменен`
  });
  
  // Создаем уведомление для врача
  await notificationService.createNotification({
    userId: appointment.doctorId,
    content: `Прием с ${patient.firstname} ${patient.lastname} на ${appointment.date} ${appointment.time} отменен`
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Запись на прием успешно отменена'
  });
});

/**
 * @desc    Получение статистики по записям на прием
 * @route   GET /api/appointment/stats
 * @access  Private/Admin
 */
const getAppointmentStats = asyncHandler(async (req, res) => {
  // Общее количество записей
  const totalAppointments = await Appointment.count();
  
  // Количество по статусам
  const pendingCount = await Appointment.count({ where: { status: 'Pending' } });
  const completedCount = await Appointment.count({ where: { status: 'Completed' } });
  const cancelledCount = await Appointment.count({ where: { status: 'Cancelled' } });
  
  // Статистика по датам (за последние 7 дней)
  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const appointmentsByDate = await Appointment.findAll({
    attributes: ['date', [sequelize.fn('COUNT', 'date'), 'count']],
    where: {
      createdAt: {
        [Op.gte]: lastWeek
      }
    },
    group: ['date'],
    order: [['date', 'ASC']]
  });
  
  // Топ-5 врачей по количеству записей
  const topDoctors = await Appointment.findAll({
    attributes: [
      'doctorId', 
      [sequelize.fn('COUNT', 'doctorId'), 'appointmentCount']
    ],
    include: [
      {
        model: User,
        as: 'doctor',
        attributes: ['firstname', 'lastname', 'pic']
      }
    ],
    group: ['doctorId', 'doctor.id', 'doctor.firstname', 'doctor.lastname', 'doctor.pic'],
    order: [[sequelize.fn('COUNT', 'doctorId'), 'DESC']],
    limit: 5
  });
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      totalAppointments,
      statusStats: {
        pending: pendingCount,
        completed: completedCount,
        cancelled: cancelledCount
      },
      appointmentsByDate: appointmentsByDate.map(item => ({
        date: item.date,
        count: parseInt(item.get('count'))
      })),
      topDoctors: topDoctors.map(doctor => ({
        id: doctor.doctorId,
        name: `${doctor.doctor.firstname} ${doctor.doctor.lastname}`,
        appointmentCount: parseInt(doctor.get('appointmentCount')),
        pic: doctor.doctor.pic
      }))
    }
  });
});

/**
 * @desc    Проверка доступности времени
 * @route   GET /api/appointment/available
 * @access  Public
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;
  
  if (!doctorId || !date) {
    throw new AppError('Необходимо указать doctorId и date', StatusCodes.BAD_REQUEST);
  }
  
  // Получаем все занятые слоты на указанную дату
  const bookedSlots = await Appointment.findAll({
    where: {
      doctorId,
      date,
      status: 'Pending'
    },
    attributes: ['time']
  });
  
  // Список всех возможных временных слотов (пример)
  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];
  
  // Фильтруем занятые слоты
  const bookedTimesSet = new Set(bookedSlots.map(slot => slot.time));
  const availableSlots = allTimeSlots.filter(time => !bookedTimesSet.has(time));
  
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      date,
      doctorId,
      availableSlots,
      bookedSlots: Array.from(bookedTimesSet)
    }
  });
});

module.exports = {
  getallappointments,
  getAppointmentById,
  bookappointment,
  completed,
  cancelAppointment,
  getAppointmentStats,
  checkAvailability
};