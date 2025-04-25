"use strict";

module.exports = (sequelize, DataTypes) => {
  const FormInstance = sequelize.define(
    "FormInstance",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "forms_templates",
          key: "id",
        },
      },
      submitted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Initializing",
      },
      pdf_file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      denial_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "Denial reason cannot be empty if the form is denied.",
          },
        },
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      
    },
    {
      tableName: "form_instances",
      timestamps: true,
      underscored: true,
    }
  );

  FormInstance.associate = (models) => {
    FormInstance.belongsTo(models.FormsTemplate, {
      foreignKey: "template_id",
      as: "template",
    });

    FormInstance.belongsTo(models.User, {
      foreignKey: "submitted_by",
      as: "submitter",
    });
  };

  return FormInstance; 
};
