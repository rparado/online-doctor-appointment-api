import express from 'express';
import {
  bookAppointment,
  getAllAppointmentsByPatient,
  getAppointmentById,
  getDoctorAppointments,
  cancelAppointment,
  getAvailableSlots,
  updateAppointment,
} from '../controllers/appointmentController.js';

import {authenticateToken} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Book an appointment
router.post('/book', bookAppointment);

// Get ALL appointments
router.get('/patients', authenticateToken, getAllAppointmentsByPatient);

// Get appointment by ID
router.get('/:id', getAppointmentById);

// Get all appointments for a doctor on a specific date
router.get('/doctor/:appointmentDate',authenticateToken, getDoctorAppointments);

// Cancel (or update) an appointment
router.put('/cancel/:appointmentId', cancelAppointment);

// Update appointment details (e.g., reschedule)
router.put('/change/:appointmentId', updateAppointment);

// Delete an appointment
router.delete('/:id', cancelAppointment);

// Check available slots for a doctor on a specific date
router.get('/slots/:doctorId/:appointmentDate', getAvailableSlots);

export default router;