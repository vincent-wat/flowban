const { DataTypes } = require('sequelize');
const sequelize = require("./database");

const FormsTemplate = sequelize.define(
  "FormsTemplate",
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
    },
    pdf_file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      references: {
        model: "users", 
        key: "id",
      },
    },
    fields_metadata: {
      type: DataTypes.JSONB,
      allowNull: true, 
    },
  },
  {
    tableName: "forms_templates", 
    timestamps: true, 
    underscored: true, 
  }
);


module.exports = FormsTemplate;