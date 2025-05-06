const { UserBoard, Board, User } = require("../models");
const { jwtKanbanGenerator } = require("../utils/jwtGenerator");
const { sendKanbanInvite } = require("../middleware/sendEmail");
const { deleteUser } = require("./UserController");
const jwt = require("jsonwebtoken");

async function getAllEntries(req, res) {
  try {
    const allEntries = await UserBoard.findAll();
    res.json(allEntries);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
}

async function createUserBoard(req, res) {
  try {
    const { user_id, board_id, permissions = "owner" } = req.body;

    const newUserBoard = await UserBoard.create({
      user_id,
      board_id,
      permissions,
    });

    return res.status(201).json({
      message: "User board created successfully",
      board: newUserBoard,
    });
  } catch (error) {
    console.error("Error creating user board:", error);
    return res.status(500).json({ error: "Error creating user board" });
  }
}

async function getUserBoardsByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const userBoards = await UserBoard.findAll({
      where: { user_id },
    });

    return res.status(200).json(userBoards);
  } catch (error) {
    console.error("Error fetching user boards:", error);
    return res.status(500).json({ error: "Error fetching user boards" });
  }
}
async function getUserBoard(req, res) {
  try {
    const { user_id, board_id } = req.params;
    const userBoard = await UserBoard.findOne({
      where: { user_id, board_id },
    });

    if (!userBoard) {
      return res.status(404).json({ error: "User board not found" });
    }
    return res.status(200).json(userBoard);
  } catch (error) {
    console.error("Error fetching user board:", error);
    return res.status(500).json({ error: "Error fetching user board" });
  }
}

async function updatePermissions(req, res) {
  try {
    const { user_id, board_id } = req.params;
    const { permissions } = req.body;

    const userBoard = await UserBoard.findOne({
      where: { user_id, board_id },
    });

    if (!userBoard) {
      return res.status(404).json({ error: "User board not found" });
    }

    userBoard.permissions = permissions;
    await userBoard.save();

    return res.status(200).json(userBoard);
  } catch (error) {
    console.error("Error updating user board:", error);
    return res.status(500).json({ error: "Error updating user board" });
  }
}

async function deleteUserBoard(req, res) {
  try {
    const { user_id, board_id } = req.params;
    const userBoard = await UserBoard.destroy({
      where: { user_id, board_id },
    });

    if (!userBoard) {
      return res.status(404).json({ error: "User board not found" });
    }

    await userBoard.destroy();

    return res.status(200).json({ message: "User board deleted successfully" });
  } catch (error) {
    console.error("Error deleting user board:", error);
    return res.status(500).json({ error: "Error deleting user board" });
  }
}

async function getAllBoardsForUser(req, res) {
  try {
    const { user_id } = req.params;

    // Fetch user boards
    const userBoards = await UserBoard.findAll({
      where: { user_id },
    });

    if (userBoards.length === 0) {
      return res.status(404).json({ error: "No boards found for this user." });
    }

    // get all board IDs
    const boardIds = userBoards.map((userBoard) => userBoard.board_id);

    // Fetch all boards
    const boards = await Board.findAll({
      where: {
        id: boardIds,
      },
    });

    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching user boards from database:", error);
    return res
      .status(500)
      .json({ error: "Error fetching user boards from database" });
  }
}
async function getUserRole(req, res) {
  try {
    const { user_id, board_id } = req.params;
    const userBoard = await UserBoard.findOne({
      where: { user_id, board_id },
    });

    if (!userBoard) {
      return res.status(404).json({ error: "User board not found" });
    }
    return res.status(200).json(userBoard.permissions);
  } catch (error) {
    console.error("Error fetching user role:", error);
    return res.status(500).json({ error: "Error fetching user role" });
  }
}

// send invite link for kanban board
async function inviteToKanban(req, res) {
  console.log("invite to kanban called");
  try {
    const { email, board_id, role } = req.body;

    const token = jwtKanbanGenerator(email, board_id, role);

    await sendKanbanInvite(email, token, role);
    console.log("token:", token);

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.log("Error inviting user to kanban board:", error.message);
    res
      .status(500)
      .json({ error: "Failed to send invitation", details: error.message });
  }
}

async function acceptKanbanInvite(req, res) {
  console.log("Invite Accepted");
  try {
    console.log("accept invite called");
    const { token } = req.body;

    console.log("Received token:", token);

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    console.log("About to decode token");
    const decoded = jwt.verify(token, process.env.jwtSecret);

    console.log("Decoded token:", decoded);
    // get email and board_id from user
    const { email, board_id, role } = decoded;
    console.log("Email:", email, "Board_id", board_id, "Role", role);

    // find user in database to add to board
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_id = user.id;
    const permissions = role;

    // add to database
    const newUserBoard = await UserBoard.create({
      user_id,
      board_id,
      permissions,
    });

    return res.status(201).json({
      message: "User board created successfully",
      board: newUserBoard,
    });
  } catch (error) {
    console.error("Invite token error:", error);
    return res.status(400).json({ error: "Invalid" });
  }
}
module.exports = {
  createUserBoard,
  getUserBoardsByUserId,
  updatePermissions,
  getAllEntries,
  getUserBoard,
  deleteUserBoard,
  getAllBoardsForUser,
  getUserRole,
  inviteToKanban,
  acceptKanbanInvite,
};
