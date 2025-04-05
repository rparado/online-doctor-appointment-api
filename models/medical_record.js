import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Patient } from './Patient.js';

export const MedicalRecord = sequelize.define('MedicalRecord', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Patients', key: 'id' } },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  diagnosis: { type: DataTypes.STRING, allowNull: false },
  treatment: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: true }, // Store uploaded file path
});

// Establish relationship with Patient model
MedicalRecord.belongsTo(Patient, { foreignKey: 'patientId' });
