const express = require("express");
const router = express.Router();

const appointmentController = require("../controller/appointmentController");
const auth = require("../middleware/auth");
const allowRole = require("../middleware/role");

// Create a new appointment
router.post("/",auth,allowRole("patient"),appointmentController.createAppointment);
router.get("/available", appointmentController.getAvailableSlots);
router.get("/doctor/:doctorId", appointmentController.getDoctorAppointments);
router.get("/patient/:patientId", appointmentController.getPatientAppointments);
router.patch("/:id", appointmentController.updateAppointment);
router.delete("/:id", appointmentController.deleteAppointment);
module.exports = router;