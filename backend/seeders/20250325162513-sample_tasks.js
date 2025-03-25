"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("task", [
      {
        title: "Task 1",
        description: "Description for Task 1",
        column_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Task 2",
        description: "Description for Task 2",
        column_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Task 3",
        description: "Description for Task 3",
        column_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("task", null, {});
  },
};
