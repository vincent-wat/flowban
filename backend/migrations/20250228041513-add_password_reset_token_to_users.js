module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "password_reset_token", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "password_reset_token");
  }
};
