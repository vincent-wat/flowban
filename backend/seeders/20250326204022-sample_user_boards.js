"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("user_boards", [
      {
        user_id: 1,
        board_id: 1,
        permissions: "owner",
      },
      {
        user_id: 3,
        board_id: 1,
        permissions: "viewer",
      },
      {
        user_id: 5,
        board_id: 1,
        permissions: "editor",
      },
      {
        user_id: 1,
        board_id: 2,
        permissions: "owner",
      },
      {
        user_id: 3,
        board_id: 2,
        permissions: "viewer",
      },
      {
        user_id: 5,
        board_id: 2,
        permissions: "editor",
      },
      {
        user_id: 1,
        board_id: 3,
        permissions: "owner",
      },
      {
        user_id: 3,
        board_id: 3,
        permissions: "viewer",
      },
      {
        user_id: 5,
        board_id: 3,
        permissions: "editor",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("user_boards", null, {});
  },
};
