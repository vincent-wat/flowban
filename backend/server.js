require("dotenv").config();
const express = require("express");
//const sequelize = require('./models/database');
const User = require("./models/user");
const routes = require("./routes/userRoutes");
const pool = require("./models/db");
const cors = require("cors");

const app = express();
//const PORT = process.env.PORT || 3000;
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Flowban API!");
});

// routes will handle all the get,post,put in the routes file
app.use("/api/users", routes);

app.post("/signuptest", (req, res) => {
  try {
    const { input } = req.body;
    console.log(input);
  } catch (error) {
    console.log("Error is post at signuptest");
    console.error(error.message);
  }
});

// Sync the database
// sequelize.sync()
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((err) => {
//     console.error('Error creating database & tables:', err);
//   });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
