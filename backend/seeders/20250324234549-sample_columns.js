"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("column", [
      {
        name: "Column 1",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 2",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 3",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 1",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 2",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 3",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 1",
        board_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 2",
        board_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Column 3",
        board_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("column", null, {});
  },
};
