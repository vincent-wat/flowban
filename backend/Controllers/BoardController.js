const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");

// Returns Board by ID, will be updated
const getUserBoards = async (req, res) => {
    try {
      const { id } = req.params;
      const userBoards = await pool.query(queries.getUserBoards, [id]);

      if (userBoards.rows.length === 0) {
        return res.status(404).json({ error: 'No boards found for this user.' });
      }

      res.json(userBoards);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  };

// Returns All Boards
const getAllBoards = async (req, res) => {
    try {
      const allBoards = await pool.query(queries.getAllBoards);
  
      if (allBoards.rows.length === 0) {
        return res.status(404).json({ error: 'No boards found.' });
      }
  
      res.json(allBoards.rows);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  };

// Update a board's name by ID
const updateBoardName = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const result = await pool.query(queries.updateBoardNameQuery, [name, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Board not found.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
};

// Delete a board by ID
const deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
      const result = await pool.query(queries.deleteBoardQuery, [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Board not found.' });
      }

      res.json({ message: 'Board deleted successfully.' });
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
};

// add a board
const addBoard = async (req, res) => {
  try {
    const {name} = req.body;
    const result = await pool.query(queries.addBoard,[name]);
    res.json(result.rows[0]);
  } catch (err) {
    res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
  }
}
 
  module.exports = {
    getUserBoards,
    getAllBoards,
    updateBoardName,
    deleteBoard,
    addBoard,
  };