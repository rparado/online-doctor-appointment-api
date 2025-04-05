import { Appointment } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Book an appointment for a doctor.
 */
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate } = req.body;

    if (!doctorId || !patientId || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required: doctorId, patientId, appointmentDate." });
    }

    // 1️⃣ Check if doctor has reached the daily limit (100 patients)
    const appointmentCount = await Appointment.count({
      where: {
        doctorId,
        appointmentDate,
        status: { [Op.not]: 'canceled' },
      },
    });

    if (appointmentCount >= 100) {
      return res.status(400).json({ message: "Doctor has reached the maximum daily appointments." });
    }

    // 2️⃣ Book the appointment
    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      status: 'pending',
    });

    return res.status(201).json({ message: "Appointment booked successfully!", data: newAppointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get all appointments for a specific doctor on a specific date.
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.params;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({ message: "Doctor ID and appointment date are required." });
    }

    // Fetch appointments for the doctor on the given date
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate,
        status: { [Op.not]: 'canceled' }, // Exclude canceled appointments
      },
      include: [{ association: 'patient', attributes: ['id', 'email'] }], // Include patient details
    });

    return res.status(200).json({ data: appointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Cancel an appointment.
 */
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Update status to 'canceled'
    appointment.status = 'canceled';
    await appointment.save();

    return res.status(200).json({ message: "Appointment canceled successfully!" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get available slots for a doctor.
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.params;

    const booked = await Appointment.count({
      where: { doctorId, appointmentDate, status: { [Op.not]: 'canceled' } },
    });

    return res.status(200).json({ availableSlots: 100 - booked });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
