import bcrypt from 'bcryptjs';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'doctor', 'patient'),
      defaultValue: 'patient',
    }
  });
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

 // Associate method to establish relationships
 User.associate = (models) => {
  User.hasOne(models.Doctor, { foreignKey: 'userId' }); // One User has one Doctor
  User.hasOne(models.UserProfile, { foreignKey: 'userId' }); // One User has one Profile
  User.hasMany(models.Appointment, { foreignKey: 'patientId' }); // One User can have many Appointments
  User.hasMany(models.MedicalRecord, { foreignKey: 'patientId' }); // One User can have many Medical Records
  User.hasOne(models.Patient, { foreignKey: 'userId' });
};
  return User;
};
