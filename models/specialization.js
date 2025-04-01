export default (sequelize, DataTypes) => {
    return sequelize.define('Specialization', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false},
    }, {
      timestamps: true
    });
  };