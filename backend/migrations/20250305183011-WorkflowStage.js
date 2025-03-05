module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("workflow_stages", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "forms_templates", // ✅ Ensure this table is created before this migration
          key: "id",
        },
        onDelete: "CASCADE",
      },
      stage_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stage_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("workflow_stages");
  },
};
