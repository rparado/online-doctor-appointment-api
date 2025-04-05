
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import adminRouter from './admin/admin.js';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import userRoutes from './routes/users.js';
import availabilityRoutes from './routes/availability.js';
import medicalRecordRoutes from './routes/medical_records.js';
import paymentRoutes from './routes/payments.js';
import userProfileRoutes from './routes/user_profile.js';
import { Doctor, UserProfile, User } from './models/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.use('/admin', adminRouter);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/user-profiles', userProfileRoutes);

const PORT = process.env.PORT || 3000;
// app.get('/debug-doctors', async (req, res) => {


//   try {
//     console.log("🚀 Fetching doctors...");
    
//     // Fetch doctors with their names via UserProfile
//     const doctors = await Doctor.findAll({
//     include: [
//       {
//       model: User,
//       include: [{ model: UserProfile, attributes: ['fullname'] }] // Join UserProfile to Doctor
//       }
//     ]
//     });

//     // Log the fetched doctors to check the data structure
//     console.log("✅ Doctors found:", doctors.map(d => ({
//     doctorId: d.id,
//     name: d.User?.UserProfile?.fullname || 'No Name',
//     })));

//     // Return the doctors as value-label pairs for the dropdown
//     const availableValues = doctors.map(doctor => ({
//     value: doctor.id,  // The value to store (doctor ID)
//     label: doctor.User?.UserProfile?.fullname || 'No Name',  // The label to display (doctor name)
//     }));

//     // Log the availableValues to make sure it is correct
//     console.log("Available values for doctorId:", availableValues);

//     return availableValues;
//   } catch (error) {
//     console.error("❌ Error fetching doctors:", error);
//     return [];  // Return an empty array in case of an error
//   }
// });
sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
