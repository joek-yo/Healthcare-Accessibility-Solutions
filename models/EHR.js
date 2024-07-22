const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// Define the EHR schema
const ehrSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    personalInfo: {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        contact: {
            email: { type: String, required: true },
            phone: { type: String, required: true }
        }
    },
    medicalHistory: [
        {
            condition: { type: String, required: true },
            treatment: { type: String },
            date: { type: Date, required: true }
        }
    ],
    medications: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true }
        }
    ],
    appointments: [
        {
            date: { type: Date, required: true },
            doctor: { type: String, required: true },
            notes: { type: String }
        }
    ]
}, { timestamps: true });

// Load environment variables
require('dotenv').config();

// Encryption key (use an environment variable in production)
const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIGNING_KEY;

if (!encKey || !sigKey) {
    throw new Error('Encryption and signing keys must be set in environment variables');
}

// Apply encryption plugin
ehrSchema.plugin(encrypt, { 
    encryptionKey: encKey, 
    signingKey: sigKey, 
    encryptedFields: ['personalInfo', 'medicalHistory', 'medications', 'appointments']
});

module.exports = mongoose.model('EHR', ehrSchema);
