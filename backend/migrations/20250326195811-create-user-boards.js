"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_boards", {
      user_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      board_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "board",
          key: "id",
        },
      },
      permissions: {
        type: Sequelize.ENUM("owner", "viewer", "editor"),
        allowNull: false,
        defaultValue: "owner",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_boards");
  },
};
