const { DataTypes } = require("sequelize");
const sequelize = require("./database"); 
const FormsTemplate = require("./FormsTemplate"); 

const WorkflowStage = sequelize.define(
  "WorkflowStage",
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
      onDelete: "CASCADE",
    },
    stage_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stage_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "workflow_stages", 
    timestamps: false, 
  }
);

// Define associations
WorkflowStage.belongsTo(FormsTemplate, {
  foreignKey: "template_id",
  as: "template",
});

FormsTemplate.hasMany(WorkflowStage, {
  foreignKey: "template_id",
  as: "stages",
});

module.exports = WorkflowStage;
