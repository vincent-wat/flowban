//Template model of form data
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FormsTemplate = sequelize.define('FormsTemplate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  pdf_file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  fields_metadata: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});