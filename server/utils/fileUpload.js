const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorHandler');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');

// Создаем директорию для загрузок, если её нет
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Настройка локального хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Создаем уникальное имя файла
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Функция проверки типа файла
const fileFilter = (req, file, cb) => {
  // Принимаем только изображения
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Разрешены только изображения!', StatusCodes.BAD_REQUEST), false);
  }
};

// Создание загрузчика Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB максимальный размер
  }
});

module.exports = {
  uploadProfileImage: upload.single('profileImage')
};
