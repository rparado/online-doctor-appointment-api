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
      type: DataTypes.DATE,
      allowNull: false
    },
    queueNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  });


  (Appointment).associate = (models) => {
    Appointment.belongsTo(models.User, { as: 'doctor', foreignKey: 'doctorId' });
    Appointment.belongsTo(models.User, { as: 'patient', foreignKey: 'patientId' });
    Appointment.hasOne(models.MedicalRecord, { foreignKey: 'appointmentId' });
  };

  return Appointment;
};
