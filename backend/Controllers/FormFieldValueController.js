const pool = require('../models/db');
const queries = require('../models/queries'); 

async function createFormFieldValue(req, res) {
  try {
    const { form_instance_id, field_name, field_value } = req.body;
    if (!form_instance_id || !field_name) {
      return res.status(400).json({ error: 'Missing required fields (form_instance_id or field_name)' });
    }
    const values = [form_instance_id, field_name, field_value];
    const result = await pool.query(queries.createFormFieldValue, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating form feild value:', error.message);
    res.status(500).json({ error: 'Failed to create form field value' });
  }
}

async function getFormFieldValuesByInstanceId(req, res) {
  try {
    const { form_instance_id } = req.params;
    if (!form_instance_id) {
      return res.status(400).json({ error: 'Form instance ID is required' });
    }
    const values = [form_instance_id];
    const result = await pool.query(queries.getFormFieldValuesByInstanceId, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching form field values:', error.message);
    res.status(500).json({ error: 'Failed to fetch form field values' });
  }
}

async function updateFormFieldValue(req, res) {
  try {
    const { id } = req.params;
    const { field_value } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const values = [field_value, id];
    const result = await pool.query(queries.updateFormFieldValue, values);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Form field valie updated successfully', updatedFieldValue: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Form field value not found' });
    }
  } catch (error) {
    console.error('Error updating form field value:', error.message);
    res.status(500).json({ error: 'Failed to update form field value' });
  }
}

async function deleteFormFieldValue(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    const values = [id];
    const result = await pool.query(queries.deleteFormFieldValue, values);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Form field value deleted successfully' });
    } else {
      res.status(404).json({ error: 'Form field value not found' });
    }
  } catch (error) {
    console.error('Error deleting form field value:', error.message);
    res.status(500).json({ error: 'Fialed to delete form field value' });
  }
}

module.exports = {
  createFormFieldValue,
  getFormFieldValuesByInstanceId,
  updateFormFieldValue,
  deleteFormFieldValue,
};
