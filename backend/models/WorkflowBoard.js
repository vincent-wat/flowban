const { DataTypes } = require("sequelize");
const sequelize = require("./database"); 
const FormsTemplate = require("./FormsTemplate");
const User = require("./User"); 

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

// Define associations
WorkflowBoard.belongsTo(FormsTemplate, {
  foreignKey: "template_id",
  as: "template",
});

WorkflowBoard.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

FormsTemplate.hasMany(WorkflowBoard, {
  foreignKey: "template_id",
  as: "boards",
});

User.hasMany(WorkflowBoard, {
  foreignKey: "created_by",
  as: "createdBoards",
});

module.exports = WorkflowBoard;
