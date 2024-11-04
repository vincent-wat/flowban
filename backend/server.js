require('dotenv').config();  
const express = require('express'); 
//const sequelize = require('./models/database'); 
const User = require('./models/user');
const routes = require('./routes/userRoutes');
const pool = require('./models/db');
const cors = require('cors')

const app = express();  
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// to connect our backend to the frontend
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.get('/', (req, res) => {
  res.send('Welcome to the Flowban API!');
});


app.post("/signuptest", (req, res) => {
  try {
    const { input } = req.body;
    console.log(input);
  } catch (error) {
    console.log("Error is post at signuptest");
    console.error(error.message);
  }

});

app.use('/api/users', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
