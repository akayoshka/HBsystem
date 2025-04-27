const userDto = require('./userDto');
const doctorDto = require('./doctorDto');
const appointmentDto = require('./appointmentDto');
const notificationDto = require('./notificationDto');

module.exports = {
  ...userDto,
  ...doctorDto,
  ...appointmentDto,
  ...notificationDto
};