import {User, Doctor, MedicalRecord} from '../models/index.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// Create a new medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const { patientId, doctorId, diagnosis, prescription, notes } = req.body;
    let fileUrl = null;

    if (req.file) {
      fileUrl = req.file.filename; // Assuming filename is saved via multer
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId,
      diagnosis,
      prescription,
      notes,
      fileUrl,
    });

    res.status(201).json({ status: 'success', data: record });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all medical records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      include: [
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Doctor, as: 'doctor', attributes: ['firstName', 'lastName'] },
      ],
    });
    res.status(200).json({ status: 'success', data: records });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get medical record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id, {
      include: [
        { model: User, as: 'patient', attributes: ['firstName', 'lastName'] },
        { model: Doctor, as: 'doctor', attributes: ['firstName', 'lastName'] },
      ],
    });

    if (!record) {
      return res.status(404).json({ status: 'error', message: 'Medical record not found' });
    }

    res.status(200).json({ status: 'success', data: record });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update a medical record
export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, prescription, notes } = req.body;
    let updateData = { diagnosis, prescription, notes };

    if (req.file) {
      const record = await MedicalRecord.findByPk(id);
      if (record && record.fileUrl) {
        const oldPath = path.join('uploads', record.fileUrl);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      updateData.fileUrl = req.file.filename;
    }

    await MedicalRecord.update(updateData, { where: { id } });

    res.status(200).json({ status: 'success', message: 'Medical record updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete a medical record
export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await MedicalRecord.findByPk(id);

    if (record && record.fileUrl) {
      const filePath = path.join('uploads', record.fileUrl);
      fs.existsSync(filePath) && fs.unlinkSync(filePath);
    }

    await MedicalRecord.destroy({ where: { id } });

    res.status(200).json({ status: 'success', message: 'Medical record deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get records for a specific patient
export const getRecordsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [{ model: Doctor, as: 'doctor', attributes: ['firstName', 'lastName'] }],
    });

    res.status(200).json({ status: 'success', data: records });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
