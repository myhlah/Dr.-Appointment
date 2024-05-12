
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientname: String,
    age: Number,
    gender: String,
    //contactn: Number,
    email: String,
    preferred_clinic: String,
    appointment_date: String,
    appointment_time: String,
    reason: String,
    status: String,
    note: String
        
})

const PatientModel = mongoose.model("patients", PatientSchema);

module.exports = PatientModel;
