import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    timeslot: {
      type: DataTypes.STRING, // e.g., "10:00 AM"
      allowNull: false,
    },
    queueNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    remarks: {
       type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    }
  });


  (Appointment).associate = (models) => {
    Appointment.belongsTo(models.User, { foreignKey: 'doctorId' });
    Appointment.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
    Appointment.hasOne(models.MedicalRecord, { foreignKey: 'appointmentId' });
    Appointment.belongsTo(models.Doctor, { as: 'doctor', foreignKey: 'doctorId' });
  };

  return Appointment;
};
