// controllers/prescriptionController.js

const Prescription = require("../model/priscriptionModel");

const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Prescription image required",
      });
    }

    const prescription = new Prescription({
      imageUrl: `/uploads/prescriptions/${req.file.filename}`,
    });

    const savedPrescription = await prescription.save();

    return res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully",
      data: savedPrescription,
    });
  } catch (error) {
    console.log("Prescription Upload Error:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadPrescription, getPrescriptions };
