// models/appointment.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    doctorId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: 'Doctors', key: 'id' } 
    },
    patientId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      references: { model: 'Users', key: 'id' } 
    },
    date: { type: DataTypes.DATE, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    queue_number: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
      type: DataTypes.ENUM('pending', 'ongoing', 'completed'), 
      defaultValue: 'pending' 
    },
  }, {
    timestamps: true,
  });

  return Appointment;
};
