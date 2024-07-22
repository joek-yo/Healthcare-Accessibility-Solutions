const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateTime: Date,
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
