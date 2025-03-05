require('dotenv').config();
const express = require("express");
const sequelize = require('./models/database');
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');

const Column = require('./models/KanbanBoardDB/columns');
const Task = require('./models/KanbanBoardDB/tasks');
const Board = require('./models/KanbanBoardDB/boards');

const app = express();
app.use(express.json());

app.use('/boards', boardRoutes);
app.use('/columns', columnRoutes);
app.use('/tasks', taskRoutes);


const port = 3000;
//Sync the model with the database
//only use once so the tables are created and synced
// or to reset the tables
// (async () => {
//   await Column.sync({ force: true });
//   await Task.sync({ force: true });
//   await Board.sync({ force: true });
//   console.log("Database synced");
// })();

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    console.log(`Server is running on http://localhost:${port}`);
}); 

