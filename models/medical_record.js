export default (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define('MedicalRecord', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Patients', key: 'id' },
    },
    doctorId: { type: DataTypes.INTEGER, allowNull: false },
    diagnosis: { type: DataTypes.STRING, allowNull: false },
    treatment: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: true },
  }, {
    timestamps: true,
  });

  // Define associations
  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(models.Patient, { foreignKey: 'patientId' });
    MedicalRecord.belongsTo(models.Doctor, { foreignKey: 'doctorId' });
  };

  return MedicalRecord;
};
