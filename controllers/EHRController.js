const EHR = require('../models/EHR');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('A token is required for authentication');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Encrypt data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();
};

// Decrypt data
const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, process.env.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Create new EHR
const createEHR = async (req, res) => {
    try {
        const { patientId, doctorId, symptoms, diagnosis, treatment, notes } = req.body;
        const newEHR = new EHR({
            patientId,
            doctorId,
            symptoms: encryptData(symptoms),
            diagnosis: encryptData(diagnosis),
            treatment: encryptData(treatment),
            notes: encryptData(notes)
        });
        const savedEHR = await newEHR.save();
        res.status(201).json(savedEHR);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get EHR by patient ID
const getEHRByPatientId = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const ehrRecords = await EHR.find({ patientId }).populate('doctorId', 'name');
        const decryptedRecords = ehrRecords.map(record => ({
            ...record._doc,
            symptoms: decryptData(record.symptoms),
            diagnosis: decryptData(record.diagnosis),
            treatment: decryptData(record.treatment),
            notes: decryptData(record.notes)
        }));
        res.status(200).json(decryptedRecords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { verifyToken, createEHR, getEHRByPatientId };
