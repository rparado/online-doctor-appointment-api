import { Appointment, Availability, MedicalRecord, User, Doctor, Specialization,UserProfile } from '../models/index.js';
import { Op } from 'sequelize';

// POST /api/appointments
// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentDate, timeslot } = req.body;

    // Ensure all required fields are provided
    if (!doctorId || !patientId || !appointmentDate || !timeslot) {
      return res.status(400).json({ status: 'error', message: 'Missing required fields.' });
    }
    const normalizedDate = new Date(new Date(appointmentDate).toISOString().split('T')[0]);

    // Check if the slot is already booked for the same doctor, date, and timeslot
    const existing = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate: normalizedDate,
        timeslot
      }
    });

    if (existing) {
      const errorMessage = 'Time slot already booked for this doctor on that date.';
      console.error('Error:', errorMessage);

      return res.status(400).json({
        status: 'error',
        message: errorMessage
      });
      
    }
   

    // Get count for queue number
    const count = await Appointment.count({
      where: {
        doctorId,
        appointmentDate: normalizedDate
      }
    });

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      appointmentDate: normalizedDate,
      timeslot,
      queueNumber: count + 1
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment created successfully.',
      data: appointment
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};


// Get all appointments
export const getAllAppointmentsByPatient = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'fee', 'biography'],
          include: [
            {
              model: Specialization,
              attributes: ['name'],
            },
            {
              model: UserProfile,
              as: 'userProfile',
              attributes: ['firstName','middleName','phoneNumber', 'lastName'],
            },
          ],
        },
      ],
    });
    if (!appointments) {
      return res.status(404).json({ status: 'error', message: 'You have no appointments.' });
    }
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error) {
    console.error(error);
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
    const { appointmentDate } = req.params;
    const parsedDate = new Date(appointmentDate);
    if (!appointmentDate || isNaN(parsedDate)) {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing appointment date' });
    }
    const humanReadableDate = parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Ensure user is authenticated and has doctor role
    const loggedInUserId = req.user?.id;
    if (!loggedInUserId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    // Find doctor associated with the logged-in user
    const doctor = await Doctor.findOne({ where: { userId: loggedInUserId } });

    if (!doctor) {
      return res.status(404).json({ status: 'error', message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.findAll({
      where: {
        doctorId: doctor.id,
        appointmentDate,
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['firstName', 'middleName', 'lastName', 'phoneNumber', 'address'],
              required: false
            },
          ],
        },
      ],
      order: [['timeslot', 'ASC']],
    });
    if (!appointments.length) {
      return res.status(200).json({
        status: 'success',
        message: `No appointments on ${humanReadableDate}`,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: `Appointments on ${humanReadableDate}`,
      data: appointments,
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// PUT /api/appointments/:id
// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, timeslot, status } = req.body;

    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    appointment.appointmentDate = appointmentDate ?? appointment.appointmentDate;
    appointment.timeslot = timeslot ?? appointment.timeslot;
    appointment.status = status ?? appointment.status;

    await appointment.save();

    res.json({ status: 'success', message: 'Appointment updated', data: appointment });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Appointment not found' });
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

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ status: 'success', message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// GET /api/appointments/available-slots/:doctorId?date=YYYY-MM-DD
// Get available slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  const { doctorId, appointmentDate } = req.params;

  const allSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const booked = await Appointment.findAll({
    where: { doctorId, appointmentDate },
    attributes: ['timeslot']
  });

  const bookedSlots = booked.map(appt => appt.timeslot);
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  res.json(availableSlots);
};