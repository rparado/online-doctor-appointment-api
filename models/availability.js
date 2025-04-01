export default (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    day: { 
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), 
      allowNull: false 
    },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
  }, {
    timestamps: true,
  });

  // Associations
  Availability.associate = (models) => {
    Availability.belongsTo(models.Doctor, { foreignKey: 'doctorId' }); // Availability belongs to Doctor
  };

  return Availability;
};
