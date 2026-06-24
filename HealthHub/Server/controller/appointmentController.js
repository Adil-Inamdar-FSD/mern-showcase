const Appointment = require("../model/appointmentModel");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { name, doctor, date, time, phone, email, problem } = req.body;

    if (!name || !doctor || !date || !time || !phone || !email || !problem) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const appointment = await Appointment.create({
      name,
      doctor,
      date,
      time,
      phone,
      email,
      problem,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "Cancelled",
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCancelledAppointment = async (req, res) => {
  try {
    await Appointment.deleteMany({
      status: "Cancelled",
    });

    return res.status(200).json({
      success: true,
      message: "Cancelled appointments removed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  cancelAppointment,
  clearCancelledAppointment
};
