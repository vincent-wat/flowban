'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('archived_forms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      original_form_instance_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      submitted_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pdf_file_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      denial_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      archived_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('archived_forms');
  },
};
