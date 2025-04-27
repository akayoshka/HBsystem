'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Связь с Doctor
      User.hasOne(models.Doctor, {
        foreignKey: 'userId',
        as: 'doctorInfo'
      });
      
      // Связь с Appointment (как пациент)
      User.hasMany(models.Appointment, {
        foreignKey: 'userId',
        as: 'patientAppointments'
      });
      
      // Связь с Appointment (как врач)
      User.hasMany(models.Appointment, {
        foreignKey: 'doctorId',
        as: 'doctorAppointments'
      });
      
      // Связь с Notification
      User.hasMany(models.Notification, {
        foreignKey: 'userId',
        as: 'notifications'
      });
    }

    // Проверка пароля
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // Получение профиля пользователя (без конфиденциальных данных)
    toProfile() {
      const { id, firstname, lastname, email, isAdmin, isDoctor, age, gender, mobile, address, status, pic, createdAt, updatedAt } = this;
      return { id, firstname, lastname, email, isAdmin, isDoctor, age, gender, mobile, address, status, pic, createdAt, updatedAt };
    }
  }
  
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100]
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDoctor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: 'neither'
    },
    mobile: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    pic: {
      type: DataTypes.STRING,
      defaultValue: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Хеширование пароля перед созданием пользователя
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      // Хеширование пароля перед обновлением пользователя
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });
  
  return User;
};