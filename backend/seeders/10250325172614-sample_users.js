"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        email: "john.doe@example.com",
        password: "password",
        phone_number: "123456789",
        first_name: "John",
        last_name: "Doe",
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        email: "jane.doe@example.com",
        password: "password",
        phone_number: "987654321",
        first_name: "Jane",
        last_name: "Doe",
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        email: "alice.smith@example.com",
        password: "password",
        phone_number: "123123123",
        first_name: "Alice",
        last_name: "Smith",
        organization_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        email: "bob.jones@example.com",
        password: "password",
        phone_number: "456456456",
        first_name: "Bob",
        last_name: "Jones",
        organization_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        email: "carol.white@example.com",
        password: "password",
        phone_number: "789789789",
        first_name: "Carol",
        last_name: "White",
        organization_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Hash passwords
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
