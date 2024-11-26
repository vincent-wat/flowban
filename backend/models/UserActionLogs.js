//history of a form
const {DataTypes} = require('sequelize');
const sequelize = require('../db');


const UserActionsAuditLog = sequelize.define('UserActionsAuditLog', {
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
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    field_name: {
      type: DataTypes.STRING
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false
  });
  
  module.exports = UserActionsAuditLog;