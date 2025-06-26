
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
//import userProfileRoutes from './routes/user_profile.js';
import { Doctor, UserProfile, User } from './models/index.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/admin', adminRouter);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/payments', paymentRoutes);
//app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/profile', userProfileRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
