require('dotenv').config();
const sequelize = require('./models/database');  // Import the sequelize instance

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close(); 
  }
}

testConnection();
