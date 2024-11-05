const users = require("../models/user");
const pool = require("../models/db");
const queries = require("../models/queries");

const getUserBoards = async (req, res) => {
    try {
      const { id } = req.params;
      const userBoards = await pool.query(queries.getUserBoards, [id]);
      res.json(userBoards);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };