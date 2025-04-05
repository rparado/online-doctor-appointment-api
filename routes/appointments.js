import express from 'express';
import {
  bookAppointment,
  getDoctorAppointments,
  cancelAppointment,
  getAvailableSlots,
} from '../controllers/appointmentController.js';

const router = express.Router();

// Route to book an appointment
router.post('/book', bookAppointment);

// Route to get all appointments for a doctor on a specific date
router.get('/doctor/:doctorId/:appointmentDate', getDoctorAppointments);

// Route to cancel an appointment
router.put('/cancel/:appointmentId', cancelAppointment);

// Route to check available slots
router.get('/slots/:doctorId/:appointmentDate', getAvailableSlots);

export default router;
