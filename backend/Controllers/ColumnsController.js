const { Router } = require("express");
const { Column } = require("../models");
const { col } = require("sequelize");

// get all columns from database
async function getAllColumns(req, res) {
  try {
    const columns = await Column.findAll();
    res.json(columns);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
// get an individual column
async function getColumn(req, res) {
  try {
    const column = await Column.findByPk(req.params.id);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    res.json(column);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

// get all columns based on Board ID
async function getAllColumnsForBoard(req, res) {
  try {
    const columns = await Column.findAll({
      where: { board_id: req.params.board_id },
    });

    //io.emit("getAllColumnsForBoard", columns);
    res.json(columns);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}
// add a column
async function addColumn(req, res) {
  try {
    const column = await Column.create({
      name: req.body.name,
      board_id: req.body.board_id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.json(column);
  } catch (error) {
    res.status(500).json({ error: "Column not created" });
  }
}

// delete a column from database
async function deleteColumn(req, res) {
  try {
    const column = await Column.findByPk(req.params.id);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }
    await column.destroy();
    res.json({ message: "Column deleted" });
  } catch (error) {
    res.status(500).json({ error: "Column not deleted" });
  }
}
// delete all columns associated with the same board_id
async function deleteAllColumnsForBoard(req, res) {
  try {
    await Column.destroy({
      where: { board_id: req.params.board_id },
    });
    res.json({ message: "All columns for board deleted" });
  } catch (error) {
    res.status(500).json({ error: "Column not deleted" });
  }
}

// update column
async function updateColumn(req, res) {
  try {
    const column = await Column.findByPk(req.params.id);
    if (!column) {
      return res.status(404).json({ error: "Column not found" });
    }

    const updateData = { name: req.body.name };
    if (req.body.board_id) {
      updateData.board_id = req.body.board_id;
      updateData.updated_at = new Date();
    }

    await column.update(updateData);
    // Emit the updated column event to all connected clients
    res.json(column);
  } catch (error) {
    res.status(500).json({ error: "Column not updated" });
  }
}

module.exports = {
  getAllColumns,
  getColumn,
  getAllColumnsForBoard,
  addColumn,
  deleteColumn,
  deleteAllColumnsForBoard,
  updateColumn,
};
