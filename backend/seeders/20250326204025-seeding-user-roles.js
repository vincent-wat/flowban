'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('user_roles', [
      {
        user_id: 1,
        role_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        role_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        role_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 5,
        role_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_roles', null, {});
    
    // Reset the sequence for the table
    if (queryInterface.sequelize.options.dialect === 'postgres') {
      await queryInterface.sequelize.query(`
        ALTER SEQUENCE user_roles_id_seq RESTART WITH 1;
      `);
    }
  }
};
