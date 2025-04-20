'use strict';
 
 module.exports = {
   async up(queryInterface, Sequelize) {
     await queryInterface.createTable('user_roles', {
       id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },
       user_id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
           model: 'users',
           key: 'id',
         },
         onDelete: 'CASCADE',
       },
       role_id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
           model: 'roles',
           key: 'id',
         },
         onDelete: 'CASCADE',
       },
       assigned_at: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
       },
       created_at: {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
       },
       updated_at: {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
       },
     });
 
     await queryInterface.addConstraint('user_roles', {
       fields: ['user_id', 'role_id'],
       type: 'unique',
       name: 'user_roles_user_id_role_id_key'
     });
   },
 
   async down(queryInterface, Sequelize) {
     await queryInterface.dropTable('user_roles');
   }
 };
 