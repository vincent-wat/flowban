"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("forms_templates", [
      {
        id: 1,
        name: "Time Conflict Form",
        description: "Form used to report and resolve time conflicts.",
        pdf_file_path: "/uploads/templates/time_conflict_petition.pdf",
        created_by: 1, 
        fields_metadata: JSON.stringify({
          fields: ["conflict_reason", "conflict_date", "resolution_notes"],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: "Affidavit",
        description: "Form for requesting official leave.",
        pdf_file_path: "/uploads/templates/file-affidavit.pdf",
        created_by: 3,
        fields_metadata: JSON.stringify({
          fields: ["leave_type", "start_date", "end_date", "reason"],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: "Expense Reimbursement Form",
        description: "Form to request reimbursement for expenses.",
        pdf_file_path: "/uploads/templates/expense_reimbursement.pdf",
        created_by: 5, 
        fields_metadata: JSON.stringify({
          fields: ["expense_type", "amount", "receipt_upload"],
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("forms_templates", null, {});
  },
};

