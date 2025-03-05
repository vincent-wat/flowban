module.exports = {
  up: async (queryInterface, Sequelize) => {
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
