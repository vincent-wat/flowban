"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserActionsAuditLog = sequelize.define(
    "UserActionsAuditLog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      form_instance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "form_instances", 
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      field_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "user_actions_audit_logs",
      timestamps: false,
    }
  );

  UserActionsAuditLog.associate = (models) => {
    UserActionsAuditLog.belongsTo(models.FormInstance, {
      foreignKey: "form_instance_id",
      as: "formInstance",
    });

    UserActionsAuditLog.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return UserActionsAuditLog;
};
