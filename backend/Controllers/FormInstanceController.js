const pool = require('../models/db');
const queries = require('../models/queries'); 


async function createFormInstance(req, res) {
  try {
    const { template_id, submitted_by, status, pdf_file_path } = req.body;
    if (!template_id || !submitted_by || !pdf_file_path) {
      return res.status(400).json({ error: 'Missing required fields (template_id, submitted_by, or pdf_file_path)' });
    }
    const values = [template_id, submitted_by, status || 'in progress', pdf_file_path];
    const result = await pool.query(queries.createFormInstance, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating form instance:', error.message);
    res.status(500).json({ error: 'Failed to create form instance' });
  }
}

async function getFormInstanceById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'I is required' });
    }
    const values = [id];
    const result = await pool.query(queries.getFormInstanceById, values);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Form instance not found' });
    }
  } catch (error) {
    console.error('Error fetching form instance:', error.message);
    res.status(500).json({ error: 'Failed to fetch form instance' });
  }
}

async function getAllFormInstances(req, res) {
  try {
    const result = await pool.query(queries.getAllFormInstances);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching form instances:', error.message);
    res.status(500).json({ error: 'Failed to etch form instances' });
  }
}

async function updateFormInstance(req, res) {
  try {
    const { id } = req.params;
    const { status, pdf_file_path } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const values = [status, pdf_file_path, id];
    const result = await pool.query(queries.updateFormInstance, values);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Form instance updated successfully', updatedInstance: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Form instance not found' });
    }
  } catch (error) {
    console.error('Error updating form instance:', error.message);
    res.status(500).json({ error: 'Failed to update form instance' });
  }
}

async function deleteFormInstance(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const values = [id];
    const result = await pool.query(queries.deleteFormInstance, values);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Form instnce deleted successfully' });
    } else {
      res.status(404).json({ error: 'Form instance not found' });
    }
  } catch (error) {
    console.error('Error deleting form instance:', error.message);
    res.status(500).json({ error: 'Failed to delete form instance' });
  }
}

module.exports = {
  createFormInstance,
  getFormInstanceById,
  getAllFormInstances,
  updateFormInstance,
  deleteFormInstance,
};
