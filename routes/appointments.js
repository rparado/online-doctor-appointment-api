import express from 'express';
import {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  cancelAppointment,
  getAvailableSlots,
  updateAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

// Book an appointment
router.post('/book', bookAppointment);

// Get ALL appointments
router.get('/', getAllAppointments);

// Get appointment by ID
router.get('/:id', getAppointmentById);

// Get all appointments for a doctor on a specific date
router.get('/doctor/:doctorId/:appointmentDate', getDoctorAppointments);

// Cancel (or update) an appointment
router.put('/cancel/:appointmentId', cancelAppointment);

// Update appointment details (e.g., reschedule)
router.put('/:id', updateAppointment);

// Delete an appointment
router.delete('/:id', cancelAppointment);

// Check available slots for a doctor on a specific date
router.get('/slots/:doctorId/:appointmentDate', getAvailableSlots);

export default router;