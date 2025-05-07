module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear the roles table before inserting new data
    await queryInterface.bulkDelete("roles", null, {});

    return queryInterface.bulkInsert("roles", [
      {
        id: 1,
        name: "user",
        description: "Regular user role",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "admin",
        description: "Administrator role",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "owner",
        description: "Owner role",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};