
const mongoose = require('mongoose')



const SchedSchema = new mongoose.Schema({
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
})

const SchedModel = mongoose.model("Schedule", SchedSchema);

module.exports = SchedModel;
