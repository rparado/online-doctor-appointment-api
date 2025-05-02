import { Appointment, Availability, MedicalRecord } from '../models/index.js';
import { Op } from 'sequelize';
// POST /api/appointments
// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, timeSlot } = req.body;

    // Count existing appointments for queue number
    const appointmentCount = await Appointment.count({
      where: { doctorId, appointmentDate },
    });

    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      queueNumber: appointmentCount + 1,
      status: 'Scheduled',
    });

    res.status(201).json({ status: 'success', data: newAppointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Doctor, include: ['Specialization'] },
      ],
    });
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Doctor, include: ['Specialization'] },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }
    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get appointments for a doctor on a specific date
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.params;

    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate,
      },
      order: [['timeSlot', 'ASC']],
    });

    res.json({ status: 'success', data: appointments });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// PUT /api/appointments/:id
// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, timeSlot, status } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    appointment.appointmentDate = appointmentDate ?? appointment.appointmentDate;
    appointment.timeSlot = timeSlot ?? appointment.timeSlot;
    appointment.status = status ?? appointment.status;

    await appointment.save();

    res.json({ status: 'success', message: 'Appointment updated', data: appointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// DELETE /api/appointments/:id
// Cancel an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({ status: 'success', message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// GET /api/appointments/available-slots/:doctorId?date=YYYY-MM-DD
// Get available slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.params;

    const availabilities = await DoctorAvailability.findAll({
      where: {
        doctorId,
        day: new Date(appointmentDate).toLocaleString('en-US', { weekday: 'long' }),
      },
    });

    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate,
      },
    });

    const bookedSlots = appointments.map((a) => a.timeSlot);
    const availableSlots = availabilities.filter(
      (slot) => !bookedSlots.includes(slot.startTime)
    );

    res.json({ status: 'success', data: availableSlots });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};