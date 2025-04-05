export default (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    specializationId: { type: DataTypes.INTEGER, allowNull: false },
    fee: { type: DataTypes.FLOAT, allowNull: false },
    archived: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    timestamps: true,
  });

  // Associations
  Doctor.associate = (models) => {
    Doctor.belongsTo(models.User, { foreignKey: 'userId' }); // Doctor belongs to User
    models.User.hasOne(models.UserProfile, { foreignKey: 'userId' }); // User has one Profile
    Doctor.belongsTo(models.Specialization, { foreignKey: 'specializationId' }); // Doctor belongs to Specialization
    Doctor.hasMany(models.Availability, { foreignKey: 'doctorId' }); // Doctor has many Availabilities
    Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' }); // Doctor has many Appointments
    Doctor.hasMany(models.MedicalRecord, { foreignKey: 'doctorId' }); // Doctor has many Medical Records

    Doctor.hasOne(models.UserProfile, {
      sourceKey: 'userId',  // Connect via userId
      foreignKey: 'userId', // UserProfile also uses userId
      as: 'userProfile'      // Name the relation
    });
  };

  return Doctor;
};
