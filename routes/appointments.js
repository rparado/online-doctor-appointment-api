// routes/appointments.js
import express from 'express';
import { Appointment, Doctor, User, Availability } from '../models/index.js';

const router = express.Router();

// Get all appointments
router.get('/', async (req, res) => {
  const appointments = await Appointment.findAll({ include: [Doctor, User] });
  res.json(appointments);
});

// Book an appointment (Queue system)
router.post('/book', async (req, res) => {
  const { doctorId, patientId, date, time } = req.body;

  try {
    // Check if doctor is available at that time
    const isAvailable = await Availability.findOne({
      where: { doctorId, date, time }
    });

    if (!isAvailable) {
      return res.status(400).json({ error: 'Doctor is not available at this time.' });
    }

    // Get the latest queue number for this doctor on the same date
    const lastAppointment = await Appointment.findOne({
      where: { doctorId, date },
      order: [['queue_number', 'DESC']]
    });

    const queue_number = lastAppointment ? lastAppointment.queue_number + 1 : 1;

    // Create the appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      time,
      queue_number,
      status: 'pending'
    });

    res.json({ message: 'Appointment booked successfully.', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status (Admin or Doctor)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });

    appointment.status = status;
    await appointment.save();

    res.json({ message: 'Appointment status updated.', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
