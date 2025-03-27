const { Router } = require("express");
//const Board = require("../models/board");
const { Board } = require("../models");
const router = Router();

// create new board
router.post("/", async (req, res) => {
  try {
    const board = await Board.create({
      name: req.body.name,
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: "Board not created" });
  }
});

// get all boards
router.get("/", async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// get board by id
router.get("/:id", async (req, res) => {
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
});

// update board by id
router.put("/:id", async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    board.name = req.body.name;
    await board.save();
    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// delete board by id
router.delete("/:id", async (req, res) => {
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
});

module.exports = router;
