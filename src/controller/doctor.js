const User = require("../models/models");

exports.getPatients = async (req, res) => {
  const patients = await User.find();
  res.json(patients);
};

exports.getPatient = async (req, res) => {
  const patient = await User.findById(req.params.id);
  res.json(patient);
};

exports.getPatientbyname = async (req, res) => {
  const patient = await User.findOne({ name: req.params.name });
  res.json(patient);
};

exports.updatePatient = async (req, res) => {
  const patient = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(patient);
};

exports.replacePatient = exports.updatePatient;

exports.deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
};