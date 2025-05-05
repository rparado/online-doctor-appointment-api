import Appointment from '../models/appointment.js';

export const getNextQueueNumber = async (doctorId, appointmentDate) => {
  const count = await Appointment.count({
    where: { doctorId, appointmentDate }
  });

  return count + 1;
};