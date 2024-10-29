const { DataTypes } = require('sequelize');
const sequelize = require('./database');  // Import the sequelize instance from database.js

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9\-+()]*$/,
    },
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_roles: {
    type: DataTypes.ENUM('Admin', 'User', 'Moderator'),
    allowNull: false,
    defaultValue: 'User',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
