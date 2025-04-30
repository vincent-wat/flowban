"use strict";

module.exports = (sequelize, DataTypes) => {
  const ArchivedForm = sequelize.define(
    "ArchivedForm",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      original_form_instance_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submitted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pdf_file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      denial_reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      archived_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "archived_forms",
      underscored: true,
      timestamps: false, 
    }
  );

  return ArchivedForm;
};
