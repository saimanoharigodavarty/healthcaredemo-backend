const Appointment = require("../models/appointments");
const User = require("../models/models");

exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate } = req.body;

        const patient = await User.findOne({
            _id: patientId,
            role: "patient"
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const doctor = await User.findOne({
            _id: doctorId,
            role: "doctor"
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Check doctor's working day
        const selectedDate = new Date(appointmentDate);

        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        const day = days[selectedDate.getDay()];

        const schedule = doctor.schedule.find(
            item => item.day === day
        );

        if (!schedule) {
            return res.status(400).json({
                message: "Doctor is not available on this day"
            });
        }

        // Check double booking
        const existingAppointment = await Appointment.findOne({
            doctorId: doctorId,
            appointmentDate: new Date(appointmentDate),
            status: { $ne: "cancelled" }
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: "Appointment already exists"
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            status: "confirmed"
        });

        res.status(201).json({
            message: "Appointment created successfully",
            appointment
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctorId: req.params.doctorId
        }).populate("patientId");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getPatientAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            patientId: req.params.patientId
        }).populate("doctorId");
        res.json(appointments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(
            req.params.id
        );
        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }
        res.json({
            message: "Appointment deleted"
        });
    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAvailableSlots = async (req, res) => {

    try {

        const { doctorId, date } = req.query;

        // Find doctor
        const doctor = await User.findOne({
            _id: doctorId,
            role: "doctor"
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        // Find day of week
        const selectedDate = new Date(date);

        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        const day = days[selectedDate.getDay()];

        // Find doctor's schedule for that day
        const schedule = doctor.schedule.find(
            item => item.day === day
        );

        if (!schedule) {
            return res.json({
                message: "Doctor is not available on this day",
                availableSlots: []
            });
        }

        // Create slots
        const availableSlots = [];

        let start = parseInt(schedule.startTime.split(":")[0]);
        let end = parseInt(schedule.endTime.split(":")[0]);

        for (let hour = start; hour < end; hour++) {

            availableSlots.push(
                `${hour.toString().padStart(2, "0")}:00`
            );

            availableSlots.push(
                `${hour.toString().padStart(2, "0")}:30`
            );

        }

        // Get existing appointments
        const appointments = await Appointment.find({
            doctorId: doctorId,
            appointmentDate: {
                $gte: new Date(date + "T00:00:00"),
                $lt: new Date(date + "T23:59:59")
            },
            status: { $ne: "cancelled" }
        });

        // Remove booked slots
        appointments.forEach(appointment => {

            const appointmentTime = new Date(
                appointment.appointmentDate
            );

            const hour = appointmentTime
                .getHours()
                .toString()
                .padStart(2, "0");

            const minute = appointmentTime
                .getMinutes()
                .toString()
                .padStart(2, "0");

            const bookedTime = `${hour}:${minute}`;

            const index = availableSlots.indexOf(bookedTime);

            if (index !== -1) {
                availableSlots.splice(index, 1);
            }

        });

        res.json({
            doctorId,
            date,
            availableSlots
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};