require("dotenv").config();
const express = require("express");
//const sequelize = require('./models/database');
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const columnRoutes = require("./routes/columnRoutes");
const formTemplateRoutes = require("./routes/formTemplateRoutes"); 
const formInstanceRoutes = require("./routes/formInstancesRoutes");
const formFieldValueRoutes = require("./routes/formFieldValueRoutes");
const userActionsLogs = require("./routes/userActionLogsRoutes");
const workflowBoardRoutes = require('./routes/workflowBoardRoutes');
const workflowStagesRoutes = require('./routes/workflowStagesRoutes'); 
const pool = require("./models/db");
const cors = require("cors");
const path = require("path"); // Import path
const fs = require("fs");

const app = express();
//const PORT = process.env.PORT || 3000;
const PORT = 3000;

app.use(express.json());
// to connect our backend to the frontend
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the Flowban API!");
});

// routes will handle all the get,post,put in the routes file
app.use("/api/users", userRoutes);

// Set up board routes
app.use("/api/boards", boardRoutes);

// routes for columns
app.use("/api/columns", columnRoutes);
// routes for tasks
app.use("/api/tasks", taskRoutes);

//workflow 
app.use('/api/forms', formTemplateRoutes);

app.use("/api/formInstance", formInstanceRoutes);

app.use("/api/formFieldValue", formFieldValueRoutes);

app.use("/api/userActionsLogs", userActionsLogs); 

app.use('/api/workflowBoards', workflowBoardRoutes);

app.use('/api/workflowStages', workflowStagesRoutes);


app.post("/signuptest", (req, res) => {
  try {
    const { input } = req.body;
    console.log(input);
  } catch (error) {
    console.log("Error is post at signuptest");
    console.error(error.message);
  }
});

const ensureUploadsDirectory = () => {
  const userFormsDir = path.join(__dirname, '../uploads/userForms');
  if (!fs.existsSync(userFormsDir)) {
      fs.mkdirSync(userFormsDir, { recursive: true });
      console.log('Created directory:', userFormsDir);
  }
};
ensureUploadsDirectory();

const ensureTemplateDirectory = () => {
  const templateDir = path.join(__dirname, '../uploads/templates');
  if(!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir,{recursive: true});
    console.log("Created Directory:",templateDir);
  }
};
ensureTemplateDirectory();





if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
module.exports = app;