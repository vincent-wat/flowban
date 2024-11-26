//saves forms changess
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FormFieldValue = sequelize.define('FormFieldValue', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    form_instance_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FormInstance',
        key: 'id'
      }
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    field_value: {
      type: DataTypes.TEXT
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false
  });
  
  module.exports = FormFieldValue;