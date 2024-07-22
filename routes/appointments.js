const express = require('express');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const router = express.Router();

router.post('/book', async (req, res) => {
  try {
    const { patientId, providerId, dateTime } = req.body;
    const newAppointment = new Appointment({ patient: patientId, provider: providerId, dateTime });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient provider');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

module.exports = router;
