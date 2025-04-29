const { Router } = require("express");
const { Board, UserBoard } = require("../models");
const router = Router();

// Returns Board by ID, will be updated
async function getBoardbyID(req, res) {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// Returns All Boards
async function getAllBoards(req, res) {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// Update a board's name by ID
async function updateBoard(req, res) {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    board.name = req.body.name;
    board.updated_at = new Date();
    await board.save();
    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// Delete a board by ID
async function deleteBoard(req, res) {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    await board.destroy();
    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// Add a board
async function addBoard(req, res) {
  try {
    const { name, user_id } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: "Board name is required" });
    }

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Create the board with explicit values
    const board = await Board.create({
      name,
      created_at: new Date(),
      updated_at: new Date()
    });

    console.log("Board created:", board.toJSON());

    // Add an entry to the user_boards table
    await UserBoard.create({
      user_id,
      board_id: board.id,
      permissions: "owner" // Default permission for the creator
    });

    console.log("UserBoard association created for user_id:", user_id, "board_id:", board.id);

    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error);
    
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Duplicate entry",
        message: "A board with this name already exists"
      });
    }
    
    res.status(500).json({ error: "Board not created", message: error.message });
  }
}
/*
async function addBoard(req, res) {
  try {
    const { name, user_id } = req.body;

    // Create the board
    const board = await Board.create({
      name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Add an entry to the user_boards table
    await UserBoard.create({
      user_id,
      board_id: board.id,
      permissions: "owner", // Default permission for the creator
    });

    res.status(201).json(board);
  } catch (error) {
    console.error("Error creating board:", error.message);
    res.status(500).json({ error: "Board not created", message: error.message });
  }
}
  */

module.exports = {
  getBoardbyID,
  getAllBoards,
  updateBoard,
  deleteBoard,
  addBoard,
};
