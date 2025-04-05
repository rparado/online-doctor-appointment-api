import express from 'express';
import {
  addMedicalRecord,
  getPatientMedicalRecords,
  upload, // Import multer upload middleware
} from '../controllers/medicalRecordController.js';

const router = express.Router();

// Route to add a new medical record with file upload
router.post('/add', upload.single('file'), addMedicalRecord);

// Route to get all medical records for a specific patient
router.get('/patient/:patientId', getPatientMedicalRecords);

export default router;
