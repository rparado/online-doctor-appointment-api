import express from 'express';
import multer from 'multer';
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getRecordsByPatient
} from '../controllers/medicalRecordController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/medicalRecords/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post('/create',authenticateToken, upload.single('file'), createMedicalRecord);
router.get('/', getAllMedicalRecords);
router.get('/:id', getMedicalRecordById);
router.get('/patient/:patientId', getRecordsByPatient);
router.put('/:id', upload.single('file'), updateMedicalRecord);
router.delete('/:id', deleteMedicalRecord);

export default router;