'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("form_instances", [
      {
        template_id: 1,
        submitted_by: 1,
        organization_id: 1, 
        status: "Initializing",
        created_at: new Date(),
        updated_at: new Date(),
        pdf_file_path: "/uploads/userForms/User1",
        denial_reason: "some reason",
      },
      {
        template_id: 2,
        submitted_by: 3,
        organization_id: 2,
        status: "Initializing",
        created_at: new Date(),
        updated_at: new Date(),
        pdf_file_path: "/uploads/userForms/User2",
        denial_reason: "some reason",
      },
      {
        template_id: 3,
        submitted_by: 5,
        organization_id: 1, 
        status: "Initializing",
        created_at: new Date(),
        updated_at: new Date(),
        pdf_file_path: "/uploads/userForms/User3",
        denial_reason: "some reason",
      },
      {
        template_id: 3,
        submitted_by: 5,
        organization_id: 1,
        status: "Completed",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), //15 days
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
        pdf_file_path: "/uploads/userForms/form_1746051803112.pdf",
        denial_reason: "some reason",
      },
      {
        template_id: 3,
        submitted_by: 1,
        organization_id: 1,
        status: "Completed",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), //15 days
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
        pdf_file_path: "/uploads/userForms/form_1746051803112.pdf",
        denial_reason: "some reason",
      },
      {
        template_id: 3,
        submitted_by: 5,
        organization_id: 1,
        status: "Completed",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), //15 days
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), 
        pdf_file_path: "/uploads/userForms/form_1746051803112.pdf",
        denial_reason: "some reason",
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("form_instances", null, {});
  },
};
