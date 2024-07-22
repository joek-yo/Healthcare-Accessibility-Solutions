const express = require('express');
const EHR = require('../models/EHR');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Create a new EHR record
router.post('/', authenticateToken, async (req, res) => {
    try {
        const ehr = new EHR(req.body);
        await ehr.save();
        res.status(201).send(ehr);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create EHR record' });
    }
});

// Get EHR record by patientId
router.get('/:patientId', authenticateToken, async (req, res) => {
    try {
        const ehr = await EHR.findOne({ patientId: req.params.patientId });
        if (!ehr) return res.status(404).send({ error: 'EHR record not found' });
        res.send(ehr);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve EHR record' });
    }
});

// Update EHR record
router.put('/:patientId', authenticateToken, async (req, res) => {
    try {
        const ehr = await EHR.findOneAndUpdate({ patientId: req.params.patientId }, req.body, { new: true });
        if (!ehr) return res.status(404).send({ error: 'EHR record not found' });
        res.send(ehr);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update EHR record' });
    }
});

// Delete EHR record
router.delete('/:patientId', authenticateToken, async (req, res) => {
    try {
        const ehr = await EHR.findOneAndDelete({ patientId: req.params.patientId });
        if (!ehr) return res.status(404).send({ error: 'EHR record not found' });
        res.send({ message: 'EHR record deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete EHR record' });
    }
});

module.exports = router;
