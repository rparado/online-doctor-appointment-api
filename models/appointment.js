export default (sequelize, DataTypes) => {
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
    appointmentDate: { type: DataTypes.DATEONLY, allowNull: false },
    queue_number: { type: DataTypes.INTEGER, allowNull: false },
    status: { 
      type: DataTypes.ENUM('pending', 'ongoing', 'completed'), 
      defaultValue: 'pending' 
    },
  }, {
    timestamps: true,
  });
  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User, { foreignKey: 'patientId' });
    Appointment.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
    Appointment.hasOne(models.MedicalRecord, { foreignKey: 'appointmentId' });
  };
  return Appointment;
};
