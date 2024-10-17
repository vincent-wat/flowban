require('dotenv').config();  // Load .env file variables

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection setup , the .env contains variables
const client = new Client({
  user: process.env.PG_USER , 
  host: process.env.PG_HOST ,       
  database: process.env.PG_DATABASE , 
  password: process.env.PG_PASSWORD , 
  port: process.env.PG_PORT || 5432,
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error:', err.stack));

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running');
});


app.get('/timestamp', (req, res) => {
  client.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error fetching data from PostgreSQL');
    } else {
      res.json({ timestamp: result.rows[0].now });  
    }
  });
});
// Route to check if the database is working, try this when port 5432 is open
app.get('/db-status', (req, res) => {
  client.query('SELECT version()', (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ status: 'Error', message: 'Database connection failed' });
    } else {
      res.json({ status: 'Success', message: 'Database is working', version: result.rows[0].version });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


