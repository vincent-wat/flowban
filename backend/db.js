require('dotenv').config();  // Load environment variables
const { Client } = require('pg');  // Import 'pg' for PostgreSQL

// Create PostgreSQL client
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

// Export the client for use in other files
module.exports = client;
