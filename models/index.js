import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import userModel from './user.js';
import doctorModel from './doctor.js';
import specializationModel from './specialization.js';
import appointmentModel from './appointment.js';
import paymentModel from './payment.js';
import availabilityModel from './availability.js';
import medicalRecordModel from './medical_record.js';
import userProfileModel from './user_profile.js';
import patientModel from './patient.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false
});

// Initialize models
const User = userModel(sequelize, DataTypes);
const Doctor = doctorModel(sequelize, DataTypes);
const Specialization = specializationModel(sequelize, DataTypes);
const Appointment = appointmentModel(sequelize, DataTypes);
const Payment = paymentModel(sequelize, DataTypes);
const Availability = availabilityModel(sequelize, DataTypes);
const MedicalRecord = medicalRecordModel(sequelize, DataTypes);
const UserProfile = userProfileModel(sequelize, DataTypes);
const Patient = patientModel(sequelize, DataTypes);

// Define associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

Doctor.belongsTo(Specialization, { foreignKey: 'specializationId' });

// 🔹 **Fix: Add Doctor ↔ Availability Relationship**
Doctor.hasMany(Availability, { foreignKey: 'doctorId' }); // One Doctor has many Availabilities
Availability.belongsTo(Doctor, { foreignKey: 'doctorId' }); // Each Availability belongs to one Doctor

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(User, { foreignKey: 'patientId' });

Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

MedicalRecord.belongsTo(User, { foreignKey: 'patientId' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

const models = {
  User,
  Doctor,
  Specialization,
  Appointment,
  Payment,
  Availability,
  MedicalRecord,
  UserProfile,
  Patient,
};


Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize, User, UserProfile, Doctor, Specialization, Appointment, Payment, Availability, MedicalRecord, Patient };
export default { sequelize, User, UserProfile, Doctor, Specialization, Appointment, Payment, Availability, MedicalRecord, Patient };
