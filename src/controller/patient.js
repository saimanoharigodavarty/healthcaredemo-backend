const User = require("../models/models");

exports.createPatient = async (req, res) => {
    if(patientExists=await User.findOne({ name: req.body.name })) {
        return res.status(400).json({ message: "Patient already exists" });
    }
  const patient = await User.create(req.body);
  res.status(201).json(patient);
};
