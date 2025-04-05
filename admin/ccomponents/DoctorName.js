// components/DoctorName.js
import React from 'react';
import { useResource } from 'adminjs';

const DoctorName = ({ record }) => {
  const { resource } = useResource();
  const doctorId = record.params.doctorId;
  
  // Fetch the doctor's name from the Doctor resource
  const doctor = resource.getRecordById(doctorId);
  return doctor ? doctor.params.name : 'Unknown Doctor';
};

export default DoctorName;
