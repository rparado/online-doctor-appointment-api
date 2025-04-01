export default (sequelize, DataTypes) => {
    return sequelize.define('Payment', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      appointmentId: { type: DataTypes.INTEGER, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      status: { 
        type: DataTypes.ENUM('pending', 'completed', 'failed'), 
        allowNull: false, 
        defaultValue: 'pending' 
      },
      transactionId: { type: DataTypes.STRING},
    }, {
      timestamps: true,
      underscored: true
    });
  };
  