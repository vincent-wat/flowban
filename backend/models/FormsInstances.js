//tracks the forms status
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FormInstance = sequelize.define('FormInstance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  template_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'FormsTemplate',
      key: 'id'
    }
  },
  submitted_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'in progress'
  },
  pdf_file_path: {
    type: DataTypes.STRING
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

module.exports = FormInstance;