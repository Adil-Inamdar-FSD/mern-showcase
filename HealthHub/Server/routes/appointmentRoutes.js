const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointments,
  cancelAppointment,
  clearCancelledAppointment,
} = require("../controller/appointmentController");

router.post("/book-appointment", createAppointment);

router.get("/get-appointments", getAppointments);

router.put("/cancel-appointment/:id", cancelAppointment);

router.delete("/clear-cancelled-appointments", clearCancelledAppointment);

module.exports = router;
