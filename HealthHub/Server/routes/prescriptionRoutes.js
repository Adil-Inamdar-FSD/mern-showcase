// routes/prescriptionRoutes.js

const express = require("express");
const router = express.Router();

const {
  uploadPrescription,
  getPrescriptions,
} = require("../controller/priscriptionController");

const upload = require("../middleware/uploadPrescriptionMiddleware");

router.post(
  "/upload-prescription",
  upload.single("prescription"),
  uploadPrescription,
);

router.get("/get-prescriptions", getPrescriptions);

module.exports = router;
