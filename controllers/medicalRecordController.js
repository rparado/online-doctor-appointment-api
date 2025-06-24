import {User, Doctor, MedicalRecord} from '../models/index.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// Create a new medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
	  appointmentId,
      diagnosis,
      treatment,
      prescription,
      notes,
      followup_date
    } = req.body;

    // Check if record already exists for same patient, doctor, and follow-up date
    const existingRecord = await MedicalRecord.findOne({
      where: {
        patientId,
        doctorId,
		appointmentId,
        followup_date
      }
    });

    if (existingRecord) {
      return res.status(409).json({
        status: 'fail',
        message: 'A medical record already exists for this patient, doctor, and follow-up date.'
      });
    }

    let file = null;
    if (req.file) {
      file = req.file.filename;
    }

    const record = await MedicalRecord.create({
      patientId,
      doctorId,
	  appointmentId,
      diagnosis,
      treatment,
      prescription,
      notes,
      followup_date,
      file
    });

    return res.status(201).json({
      status: 'success',
	  message: "Medical record successfully added!",
      data: record
    });

  } catch (error) {
    console.error('Medical record creation error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all medical records
export const getAllMedicalRecords = async (req, res) => {
	try {
		const doctorId = req.user.id; 

		const records = await MedicalRecord.findAll({
			where: { doctorId },
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