export default (sequelize, DataTypes) => {
    return sequelize.define('MedicalRecord', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      patientId: { type: DataTypes.INTEGER, allowNull: false },
      doctorId: { type: DataTypes.INTEGER, allowNull: false },
      diagnosis: { type: DataTypes.TEXT, allowNull: false },
      treatment: { type: DataTypes.TEXT, allowNull: false },
      prescription: { type: DataTypes.TEXT },
      notes: { type: DataTypes.TEXT },
    }, {
      timestamps: true,
      underscored: true
    });
  };