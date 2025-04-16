"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Addint new value to the enum type
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type t
          JOIN pg_enum e ON t.oid = e.enumtypid
          WHERE t.typname = 'enum_form_assignments_approval_status'
          AND e.enumlabel = 'suggested'
        ) THEN
          ALTER TYPE "enum_form_assignments_approval_status" ADD VALUE 'suggested';
        END IF;
      END$$;
    `);

    await queryInterface.changeColumn("form_assignments", "approval_status", {
      type: Sequelize.ENUM("suggested", "pending", "approved", "rejected"), 
      allowNull: false,
      defaultValue: "suggested",
    });
  },

  async down(queryInterface, Sequelize) {
    // PostgreSQL does not allow removing enum values
    // so we only revert the default
    await queryInterface.changeColumn("form_assignments", "approval_status", {
      type: Sequelize.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    });
  },
};
