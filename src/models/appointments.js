const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    appointmentDate:{
        type:Date,
        required:true
    },
    status: {
        type: String,
        enum: ["confirmed", "completed", "cancelled"],
        default: "confirmed"
    }
})
const Appointment = mongoose.model("Appointment",dataSchema);
module.exports = Appointment;