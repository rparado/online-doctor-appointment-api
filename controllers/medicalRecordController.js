import { MedicalRecord, Patient } from '../models/index.js';
import multer from 'multer';
import path from 'path';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  },
});

// Multer middleware
export const upload = multer({ storage: storage });

/**
 * Add a new medical record with optional file upload.
 */
export const addMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis, treatment, notes, date } = req.body;
    const file = req.file; // Multer stores the uploaded file here

    if (!patientId || !doctorId || !diagnosis || !treatment || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Save file path if a file is uploaded
    const filePath = file ? `/uploads/${file.filename}` : null;

    const newRecord = await MedicalRecord.create({
      patientId,
      doctorId,
      diagnosis,
      treatment,
      notes,
      date,
      filePath,
    });

    return res.status(201).json({ message: "Medical record added successfully!", data: newRecord });
  } catch (error) {
    console.error("Error adding medical record:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Get all medical records for a specific patient.
 */
export const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [{ model: Patient, attributes: ['id', 'name', 'email'] }],
    });

    if (!records.length) {
      return res.status(404).json({ message: "No medical records found for this patient." });
    }

    return res.status(200).json({ data: records });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
