"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("workflow_stages", [
      {
        template_id: 1,  
        stage_name: "Initializing",
        stage_order: 1,
      },
      {
        template_id: 1,
        stage_name: "Admin Approval",
        stage_order: 2,
      },
      {
        template_id: 1,
        stage_name: "Professor 1 Review",
        stage_order: 3,
      },
      {
        template_id: 1,
        stage_name: "Professor 2 Review",
        stage_order: 4,
      },
      {
        template_id: 1,
        stage_name: "Final Approval",
        stage_order: 5,
      },
      {
        template_id: 1,
        stage_name: "Completed",
        stage_order: 6,
      },
      {
        template_id: 3,  
        stage_name: "Initializing",
        stage_order: 1,
      },
      {
        template_id: 3,
        stage_name: "Admin Approval",
        stage_order: 2,
      },
      {
        template_id: 3,
        stage_name: "Professor 1 Review",
        stage_order: 3,
      },
      {
        template_id: 3,
        stage_name: "Professor 2 Review",
        stage_order: 4,
      },
      {
        template_id: 3,
        stage_name: "Final Approval",
        stage_order: 5,
      },
      {
        template_id: 3,
        stage_name: "Completed",
        stage_order: 6,
      },
      {
        template_id: 2,  
        stage_name: "Initializing",
        stage_order: 1,
      },
      {
        template_id: 2,
        stage_name: "Admin Approval",
        stage_order: 2,
      },
      {
        template_id: 2,
        stage_name: "Professor 1 Review",
        stage_order: 3,
      },
      {
        template_id: 2,
        stage_name: "Professor 2 Review",
        stage_order: 4,
      },
      {
        template_id: 2,
        stage_name: "Final Approval",
        stage_order: 5,
      },
      {
        template_id: 2,
        stage_name: "Completed",
        stage_order: 6,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("workflow_stages", null, {});
  },
};
