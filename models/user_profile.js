// models/user_profile.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserProfile = sequelize.define('UserProfile', {
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
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isProfileUpdated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
  });

  return UserProfile;
};
