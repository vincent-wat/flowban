require("dotenv").config();
const express = require("express");
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/tasksRoutes");
const columnRoutes = require("./routes/columnRoutes");
const formTemplateRoutes = require("./routes/formTemplateRoutes"); 
const formInstanceRoutes = require("./routes/formInstancesRoutes");
const userActionsLogs = require("./routes/userActionLogsRoutes");
const workflowBoardRoutes = require('./routes/workflowBoardRoutes');
const workflowStagesRoutes = require('./routes/workflowStagesRoutes'); 
const pool = require("./models/db");
const cors = require("cors");
const path = require("path"); 
const fs = require("fs");

const https = require("https");
const { Server } = require("socket.io");

const options = {
  key: fs.readFileSync("./certs/localhost.key"),
  cert: fs.readFileSync("./certs/localhost.crt"),
};

const app = express();
const server = https.createServer(options, app); 

const io = new Server(server, {
  cors: {
    origin: "https://localhost:3001",
    methods: ["GET", "POST"]
  }
});

//Load SSL certificate and key from the certs folder


// Attach io to app so it can be used in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3001", "https://localhost:3001"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("Welcome to the Flowban API!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);

//workflow routes
app.use('/api/forms', formTemplateRoutes);
app.use("/api/formInstance", formInstanceRoutes);
app.use("/api/userActionsLogs", userActionsLogs); 
app.use('/api/workflowBoards', workflowBoardRoutes);
app.use('/api/workflowStages', workflowStagesRoutes);

// Test Route
app.post("/signuptest", (req, res) => {
  try {
    const { input } = req.body;
    console.log(input);
  } catch (error) {
    console.log("Error in signuptest POST request");
    console.error(error.message);
  }
});

// Ensure Upload Directories Exist
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
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
    console.log("Created Directory:", templateDir);
  }
};
ensureTemplateDirectory();

// Start Server
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
  });
}

module.exports = app;
