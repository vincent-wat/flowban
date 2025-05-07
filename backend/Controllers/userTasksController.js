const { UserTasks, Task, User } = require("../models");
const { sendAssignedTaskEmail } = require("../middleware/sendEmail");

async function getAllEntries(req, res) {
  try {
    const allEntries = await UserTasks.findAll();
    res.json(allEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function createUserTask(req, res) {
  try {
    const { user_id, task_id } = req.body;

    const newUserTask = await UserTasks.create({
      user_id,
      task_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({
      message: "User task created successfully",
      task: newUserTask,
    });
  } catch (error) {
    console.error("Error creating user task:", error);
    return res.status(500).json({ error: "Error creating user task" });
  }
}

async function getUserTask(req, res) {
  try {
    const { user_id, task_id } = req.params;
    const userTask = await UserTasks.findOne({
      where: { user_id, task_id },
    });

    if (!userTask) {
      return res.status(404).json({ error: "User task not found" });
    }
    return res.status(200).json(userTask);
  } catch (error) {
    console.error("Error fetching user task:", error);
    return res.status(500).json({ error: "Error fetching user task" });
  }
}

async function deleteUserTask(req, res) {
  try {
    const { task_id } = req.params;
    const deletedUserTask = await UserTasks.destroy({
      where: { task_id },
    });

    if (!deletedUserTask) {
      return res.status(404).json({ error: "User task not found" });
    }
    return res.status(200).json({ message: "User task deleted successfully" });
  } catch (error) {
    console.error("Error deleting user task:", error);
    return res.status(500).json({ error: "Error deleting user task" });
  }
}

async function getUserTasksByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const userTasks = await UserTasks.findAll({
      where: { user_id },
    });

    return res.status(200).json(userTasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return res.status(500).json({ error: "Error fetching user tasks" });
  }
}

async function taskNotification(req, res) {
  try {
    const { email, task } = req.body;
    console.log("Email:", email);
    console.log("Task:", task);

    await sendAssignedTaskEmail(email, task);
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending assigned task email:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
}

module.exports = {
  getAllEntries,
  createUserTask,
  getUserTask,
  deleteUserTask,
  getUserTasksByUserId,
  taskNotification,
};
