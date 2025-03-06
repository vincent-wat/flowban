"use strict";
const { Board } = require("./boards");

module.exports = (sequelize, DataTypes) => {
  const Column = sequelize.define(
    "Column",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      board_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Board,
          key: "id",
        },
      },
    },
    {
      tableName: "columns",
      timestamps: false,
    }
  );
  return Column;
};

// Sync the model with the database
// not sure if neccessary
// (async () => {
//     await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
//     console.log("Database synced");
//   })();
