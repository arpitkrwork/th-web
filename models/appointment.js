const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  therapist: String,
  date: String,
  time: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
