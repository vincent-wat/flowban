const { DataTypes } = require("sequelize");
const sequelize = require("./database");
const FormTemplate = require("./FormsTemplate");
const User = require("./User");

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
        model: FormTemplate,
        key: "id",
      },
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, 
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
  },
  {
    tableName: "form_instances",
    timestamps: true, 
    underscored: true,
  }
);

// Define Associations
FormInstance.belongsTo(FormTemplate, { foreignKey: "template_id", as: "template" });
FormInstance.belongsTo(User, { foreignKey: "submitted_by", as: "submitter" });

module.exports = FormInstance;
