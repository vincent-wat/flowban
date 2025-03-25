"use strict";

module.exports = (sequelize, DataTypes) => {
  const Column = sequelize.define(
    "Column",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "board",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "column",
      underscored: true,
      timestamps: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );

  Column.associate = (models) => {
    Column.belongsTo(models.Board, {
      foreignKey: "board_id",
    });
    Column.hasMany(models.Task, {
      foreignKey: "column_id",
    });
  };
  return Column;
};
