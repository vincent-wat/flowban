const { Router } = require("express");
const { Board } = require("../models");
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
    const { name } = req.body;
    const result = await pool.query(queries.addBoard, [name]);
    res.json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
}

module.exports = {
  getBoardbyID,
  getAllBoards,
  updateBoard,
  deleteBoard,
  addBoard,
};
