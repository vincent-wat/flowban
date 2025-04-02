"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("board", [
      {
        id: 1,
        name: "Board 1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Board 2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Board 3",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("board", null, {});
  },
};
