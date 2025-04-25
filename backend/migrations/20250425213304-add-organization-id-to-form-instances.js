"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("form_instances", "organization_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "organizations", 
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL", 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("form_instances", "organization_id");
  }
};
