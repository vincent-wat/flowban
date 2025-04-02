"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("column", [
      {
        id: 1,
        name: "Column 1",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Column 2",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Column 3",
        board_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: "Column 1",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: "Column 2",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name: "Column 3",
        board_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name: "Column 1",
        board_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name: "Column 2",
        board_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 9,
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
