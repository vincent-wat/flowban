module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear the roles table before inserting new data
    await queryInterface.bulkDelete("roles", null, {});

    return queryInterface.bulkInsert("roles", [
      {
        name: "user",
        description: "Regular user role",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "admin",
        description: "Administrator role",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};