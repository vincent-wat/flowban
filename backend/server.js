require('dotenv').config();  
const express = require('express'); 
const sequelize = require('./models/database'); 
const User = require('./models/User');  

const app = express();  
const PORT = process.env.PORT || 3000;  

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Flowban API!');
});

// Sync the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Error creating database & tables:', err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
