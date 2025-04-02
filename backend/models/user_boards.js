"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserBoard = sequelize.define(
    "UserBoard",
    {
      user_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      board_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "board",
          key: "id",
        },
      },
      permissions: {
        type: DataTypes.ENUM("owner", "viewer", "editor"),
        allowNull: false,
        defaultValue: "owner",
      },
    },
    {
      tableName: "user_boards",
      underscored: true,
      timestamps: false,
    }
  );
  UserBoard.associate = (models) => {
    UserBoard.belongsTo(models.User, {
      foreignKey: "user_id",
    });
    UserBoard.belongsTo(models.Board, {
      foreignKey: "board_id",
    });
  };
  return UserBoard;
};
