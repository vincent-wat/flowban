/*require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});

// Function to check database connection
async function checkDatabaseConnection() {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to the PostgreSQL database successfully!");

    // You can perform a simple query to ensure everything is working
    const res = await client.query("SELECT NOW() AS current_time");
    console.log("Current Time:", res.rows[0].current_time);

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error("Error connecting to the PostgreSQL database:", err);
  } finally {
    //await pool.end(); // Close the pool
  }
}

// Run the connection check
checkDatabaseConnection();

module.exports = pool;
*/