"use strict";

module.exports = (sequelize, DataTypes) => {
  const WorkflowBoard = sequelize.define(
    "WorkflowBoard",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "forms_templates", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "workflow_boards",
      timestamps: true,
      underscored: true,
    }
  );

  WorkflowBoard.associate = (models) => {
    WorkflowBoard.belongsTo(models.FormsTemplate, {
      foreignKey: "template_id",
      as: "template",
    });

    WorkflowBoard.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "creator",
    });

    models.FormsTemplate.hasMany(WorkflowBoard, {
      foreignKey: "template_id",
      as: "boards",
    });

    models.User.hasMany(WorkflowBoard, {
      foreignKey: "created_by",
      as: "createdBoards",
    });
  };

  return WorkflowBoard;
};
