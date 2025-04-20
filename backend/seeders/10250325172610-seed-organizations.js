"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("organizations", [
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
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('organizations', 'id'),
        (SELECT MAX(id) FROM organizations)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("organizations", null, {});
  },
};
