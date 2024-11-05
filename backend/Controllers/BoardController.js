const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");

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

  module.exports = {
    getUserBoards,
    getAllBoards
  };