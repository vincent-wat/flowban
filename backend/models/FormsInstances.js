const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const FormInstance = sequelize.define('FormInstance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  template_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'forms_templates', 
      key: 'id',
    },
  },
  submitted_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'in progress',
  },
  pdf_file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'form_instances',
  timestamps: false, 
});

module.exports = FormInstance;
