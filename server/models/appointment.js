'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // Связь с User (как пациент)
      Appointment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'patient'
      });
      
      // Связь с User (как врач)
      Appointment.belongsTo(models.User, {
        foreignKey: 'doctorId',
        as: 'doctor'
      });
    }

    // Получить все встречи для пользователя (как пациента или врача)
    static async getAppointmentsForUser(userId) {
      return await Appointment.findAll({
        where: {
          [sequelize.Op.or]: [
            { userId: userId },
            { doctorId: userId }
          ]
        },
        include: [
          {
            model: sequelize.models.User,
            as: 'patient',
            attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
          },
          {
            model: sequelize.models.User,
            as: 'doctor',
            attributes: ['id', 'firstname', 'lastname', 'email', 'pic']
          }
        ],
        order: [['date', 'DESC'], ['time', 'DESC']]
      });
    }

    // Отметить встречу как завершенную
    async markAsCompleted() {
      this.status = 'Completed';
      return await this.save();
    }
  }
  
  Appointment.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: true
  });
  
  return Appointment;
};