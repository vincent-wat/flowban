'use strict';

module.exports = (sequelize, DataTypes) => {
  const FormAssignment = sequelize.define('FormAssignment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    form_instance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'form_assignments',
    underscored: true,
  });

  FormAssignment.associate = function(models) {
    FormAssignment.belongsTo(models.FormInstance, {
      foreignKey: 'form_instance_id',
      as: 'formInstance',
    });

    FormAssignment.belongsTo(models.WorkflowStage, {
      foreignKey: 'stage_id',
      as: 'stage',
    });

    FormAssignment.belongsTo(models.User, {
      foreignKey: 'assigned_user_id',
      as: 'assignedUser',
    });
  };

  return FormAssignment;
};
