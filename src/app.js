const express = require("express");

const patientRoutes = require("./routes/patientRoutes");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const app = express();
app.use(express.json());//middleware to parse JSON request bodies
app.use("/api/auth", authRoutes);//calling authRoutes for authentication-related endpoints
app.use("/api/patients", patientRoutes);//calling patientRoutes for patient-related endpoints
app.use("/api/appointments", appointmentRoutes);//calling appointmentRoutes for appointment-related endpoints
module.exports = app;