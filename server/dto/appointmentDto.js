
/**
 * DTO для создания записи на прием
 */
class AppointmentCreateDto {
  constructor(data) {
    this.userId = data.userId;
    this.doctorId = data.doctorId;
    this.date = data.date;
    this.time = data.time;
  }
}

/**
 * DTO для ответа с данными о записи на прием
 */
class AppointmentResponseDto {
  constructor(appointment) {
    this.id = appointment.id;
    this.userId = appointment.userId;
    this.doctorId = appointment.doctorId;
    this.date = appointment.date;
    this.time = appointment.time;
    this.status = appointment.status;
    this.createdAt = appointment.createdAt;
    this.updatedAt = appointment.updatedAt;
    
    // Добавляем информацию о пациенте, если она есть
    if (appointment.patient) {
      this.patient = {
        id: appointment.patient.id,
        firstname: appointment.patient.firstname,
        lastname: appointment.patient.lastname,
        email: appointment.patient.email,
        pic: appointment.patient.pic
      };
    }
    
    // Добавляем информацию о враче, если она есть
    if (appointment.doctor) {
      this.doctor = {
        id: appointment.doctor.id,
        firstname: appointment.doctor.firstname,
        lastname: appointment.doctor.lastname,
        email: appointment.doctor.email,
        pic: appointment.doctor.pic
      };
    }
  }
}

module.exports = {
  AppointmentCreateDto,
  AppointmentResponseDto
};