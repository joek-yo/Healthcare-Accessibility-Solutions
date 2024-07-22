const express = require('express');
const router = express.Router();
const EHR = require('../models/EHR');
const authenticateToken = require('../middleware/auth');

// Create new EHR record
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const ehr = new EHR({
            patientId: req.user.id,
            personalInfo: req.body.personalInfo,
            medicalHistory: req.body.medicalHistory,
            medications: req.body.medications,
            appointments: req.body.appointments
        });
        await ehr.save();
        res.status(201).json(ehr);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get EHR record by patient ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const ehr = await EHR.findOne({ patientId: req.params.id });
        if (!ehr) {
            return res.status(404).json({ message: 'EHR not found' });
        }
        res.json(ehr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
