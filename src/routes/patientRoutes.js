const express = require("express");
const router = express.Router();
const patientController = require("../controller/patient");
const doctorController = require("../controller/doctor");

router.get("/", doctorController.getPatients);
router.get("/:id", doctorController.getPatient);
router.get("/name/:name", doctorController.getPatientbyname);
router.post("/", patientController.createPatient);
router.put("/:id", doctorController.replacePatient);
router.patch("/:id", doctorController.updatePatient);
router.delete("/:id", doctorController.deletePatient);

module.exports = router;