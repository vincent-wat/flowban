require('dotenv').config();  // Load environment variables from .env

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  // Erick added to get port for database
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = sequelize;
