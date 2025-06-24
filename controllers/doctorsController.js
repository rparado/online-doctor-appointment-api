// controllers/doctorController.js
import { Doctor, UserProfile, Specialization, Availability, Appointment, User } from '../models/index.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { archived: false },
      attributes: ['id', 'userId', 'specializationId', 'fee', 'biography'],
      include: [
        {
          model: Specialization,
          attributes: ['name'],
        },
        {
          model: Availability,
          attributes: ['day', 'startTime', 'endTime'], 
        },
      ],
    });

    const doctorWithProfile = await Promise.all(
      doctors.map(async (doctor) => {
        const profile = await UserProfile.findOne({
          where: { userId: doctor.userId },
          attributes: ['firstName', 'middleName', 'lastName', 'avatar', 'gender'],
        });

        const doc = doctor.toJSON(); 

        return {
          id: doc.id,
          userId: doc.userId,
          specializationId: doc.specializationId,
          fee: doc.fee,
          biography: doc.biography,
          profile,
          specialization: doc.Specialization?.name || null,
          availabilities: doc.Availabilities || [],
        };
      })
    );

    return res.status(200).json({
      status: 'success',
      message: 'Doctors list fetch successfully!',
      data: doctorWithProfile,
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getDoctorDetailById = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findByPk(doctorId, {
      include: [
        {
          model: Specialization,
          attributes: ['name']
        },
        {
          model: Availability,
          attributes: ['day', 'startTime', 'endTime']
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({ status: 'error', message: 'Doctor not found' });
    }

    const profile = await UserProfile.findOne({
      where: { userId: doctor.userId },
      attributes: ['firstName','middleName' ,'lastName', 'avatar', 'gender', 'phoneNumber', 'address']
    });

    const doctorData = doctor.toJSON();

    const response = {
      id: doctorData.id,
      userId: doctorData.userId,
      fee: doctorData.fee,
      biography: doctorData.biography,
      specialization: doctorData.Specialization?.name || null,
      availabilities: doctorData.Availabilities || [],
      profile
    };

    res.json({ status: 'success', data: response });
  } catch (err) {
    console.error('Error getting doctor detail:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    // Find doctor by logged-in user ID
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get appointments for this doctor and include patient details
    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.id },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['firstName','middleName' ,'lastName']
            }
          ]
        }
      ]
    });

    // Extract unique patients
    const seen = new Set();
    const patients = [];

    for (const appt of appointments) {
      const patient = appt.patient;
      if (patient && !seen.has(patient.id)) {
        seen.add(patient.id);
        patients.push({
          id: patient.id,
          email: patient.email,
          firstName: patient.profile?.firstName,
          lastName: patient.profile?.lastName
        });
      }
    }

    return res.status(200).json(patients);
  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};