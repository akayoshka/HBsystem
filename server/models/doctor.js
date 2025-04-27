'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    static associate(models) {
      // Связь с User
      Doctor.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }

    // Метод получения полной информации о докторе вместе с информацией о пользователе
    static async getFullDoctorInfo(doctorId) {
      return await Doctor.findByPk(doctorId, {
        include: [
          {
            model: sequelize.models.User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
          }
        ]
      });
    }

    // Метод получения всех докторов с информацией о пользователях
    static async getAllDoctorsWithUserInfo() {
      return await Doctor.findAll({
        where: { isDoctor: true },
        include: [
          {
            model: sequelize.models.User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'pic']
          }
        ]
      });
    }
  }
  
  Doctor.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fees: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    isDoctor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Doctor',
    tableName: 'doctors',
    timestamps: true
  });
  
  return Doctor;
};