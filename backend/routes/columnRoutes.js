const { Router } = require("express");
const Column = require("../models/KanbanBoardDB/columns");
const router = Router();

// create new column
router.post("/", async (req, res) => {
    try {
        const column = await Column.create({
            name: req.body.name,
            board_id: req.body.board_id
        });
        res.json(column);
    } catch (error) {
        res.status(500).json({ error: 'Column not created' });
    }
});

// update column by id
router.put("/name/:id", async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }
        await column.update({ name: req.body.name, board_id: req.body.board_id });
        res.json(column);
    } catch (error) {
        res.status(500).json({ error: 'Column not updated' });
        
    }
});


// get all columns
router.get("/", async (req, res) => {
    try {
        const columns = await Column.findAll();
        res.json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
        
    }
});

// get column by id
router.get("/:id", async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }
        res.json(column);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });   
        
    }   
});

// get all columns for board
router.get("/board/:board_id", async (req, res) => {
    try {
        const columns = await Column.findAll({
    where: { board_id: req.params.board_id }
    });
    res.json(columns);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
        
    }
});


// delete column by id
router.delete("/id/:id", async (req, res) => {
    try {
        const column = await Column.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }
        await column.destroy();
        res.json({ message: 'Column deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Column not deleted' });
        
    }
});

// delete all columns for board
router.delete("/board/:board_id", async (req, res) => {
    try {
        await Column.destroy({
            where: { board_id: req.params.board_id }
        });
        res.json({ message: 'All columns for board deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Column not deleted' });
    }
});


module.exports = router;
