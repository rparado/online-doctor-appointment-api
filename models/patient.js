
export default (sequelize, DataTypes) => {
    const Patient = sequelize.define('Patient', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        medicalHistory: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        archived: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      }, {
        timestamps: true,
      });
      Patient.associate = (models) => {
        Patient.belongsTo(models.User, { foreignKey: 'userId' });
        Patient.hasMany(models.MedicalRecord, { foreignKey: 'patientId' });
      };
    return Patient;
}

