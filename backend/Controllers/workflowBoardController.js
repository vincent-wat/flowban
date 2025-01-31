const pool = require('../models/db');
const queries = require('../models/queries');

const createWorkflowBoard = async (req, res) => {
    try {
        const { name, description, template_id, created_by } = req.body;

        const result = await pool.query(queries.createWorkFlowBoard, [name, description, template_id, created_by]);
        res.status(201).json({ message: 'Workflow board created successfully', board: result.rows[0] });
    } catch (error) {
        console.error('Error creating workflow board:', error);
        res.status(500).json({ error: 'Error creating workflow board' });
    }
};

const getAllWorkflowBoards = async (req, res) => {
    try {
        const result = await pool.query(queries.allWorkFlowBoard);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching workflow boards:', error);
        res.status(500).json({ error: 'Error fetching workflow boards' });
    }
};

const getWorkflowBoardById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(queries.WorkFlowBoardByID, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workflow board not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching workflow board:', error);
        res.status(500).json({ error: 'Error fetching workflow board' });
    }
};

const updateWorkflowBoard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, template_id } = req.body;

        const result = await pool.query(queries.updateWorkFlowBoard, [name, description, template_id, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workflow board not found' });
        }
        res.status(200).json({ message: 'Workflow board updated successfully', board: result.rows[0] });
    } catch (error) {
        console.error('Error updating workflow board:', error);
        res.status(500).json({ error: 'Error updating workflow board' });
    }
};

const deleteWorkflowBoard = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(queries.deleteWorkFlowBoard, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workflow board not found' });
        }
        res.status(200).json({ message: 'Workflow board deleted successfully' });
    } catch (error) {
        console.error('Error deleting workflow board:', error);
        res.status(500).json({ error: 'Error deleting workflow board' });
    }
};


module.exports = {
    createWorkflowBoard,
    getAllWorkflowBoards,
    getWorkflowBoardById,
    updateWorkflowBoard,
    deleteWorkflowBoard,
};
