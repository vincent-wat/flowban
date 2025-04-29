'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forms_templates', 'created_by_organization', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('forms_templates', 'created_by_organization');
  }
};
