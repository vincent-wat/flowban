"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const organizations = [
      {
        id: 1,
        name: "Flowban University",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Global Education",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return queryInterface.bulkInsert("organizations", organizations);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("organizations", null, {});
  },
};
