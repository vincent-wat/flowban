"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        email: "john.doe@example.com",
        password: "password",
        phone_number: "123456789",
        first_name: "John",
        last_name: "Doe",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "jane.doe@example.com",
        password: "password",
        phone_number: "987654321",
        first_name: "Jane",
        last_name: "Doe",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "alice.smith@exmaple.com",
        password: "password",
        phone_number: "123123123",
        first_name: "Alice",
        last_name: "Smith",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "bob.jones@exmpale.com",
        password: "password",
        phone_number: "456456456",
        first_name: "Bob",
        last_name: "Jones",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "carol.white@example.com",
        password: "password",
        phone_number: "789789789",
        first_name: "Carol",
        last_name: "White",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
