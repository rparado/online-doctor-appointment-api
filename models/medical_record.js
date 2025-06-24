import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define('MedicalRecord', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    },
    followup_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  });

  (MedicalRecord).associate = (models) => {
    MedicalRecord.belongsTo(models.Appointment, { foreignKey: 'appointmentId' });
    MedicalRecord.belongsTo(models.Doctor, { as: 'doctor', foreignKey: 'doctorId' });
    MedicalRecord.belongsTo(models.User, { as: 'patient', foreignKey: 'patientId' });
  };

  return MedicalRecord;
};
