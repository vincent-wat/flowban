const { UserBoard, Board } = require("../models");
const { deleteUser } = require("./UserController");

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
    const userBoard = await UserBoard.findOne({
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
module.exports = {
  createUserBoard,
  getUserBoardsByUserId,
  updatePermissions,
  getAllEntries,
  getUserBoard,
  deleteUserBoard,
  getAllBoardsForUser,
  getUserRole,
};
