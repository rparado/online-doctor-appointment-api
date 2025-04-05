export default (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    doctorId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'Doctors',  // Ensure it matches the actual table name
        key: 'doctorId'
      },
      onDelete: 'CASCADE'  // Delete availability if doctor is removed
    },
    day: { 
      type: DataTypes.ENUM(
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
      ), 
      allowNull: false 
    },
    startTime: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    endTime: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
  }, {
    timestamps: true,
  });

  // Associations
  Availability.associate = (models) => {
    Availability.belongsTo(models.Doctor, { 
      foreignKey: 'doctorId', 
      as: 'doctor',
      onDelete: 'CASCADE' 
    }); 
  };

  return Availability;
};
