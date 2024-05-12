
const mongoose = require('mongoose')



const DoctorSchema = new mongoose.Schema({
    name: String,
    //specialist: String,
    //bio: String,
    //schedule: String,
    //clinics: String,
    email: String,
    password: String
})

const DoctorModel = mongoose.model("doctors", DoctorSchema);

module.exports = DoctorModel;
