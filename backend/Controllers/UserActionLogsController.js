const pool = require('../models/db');
const queries = require('../models/queries');

async function createUserActionLog(req, res) {
  try {
    const { form_instance_id, user_id, action, field_name } = req.body;
    if (!form_instance_id || !user_id || !action) {
      return res.status(400).json({ error: 'Missing required fields (form_instance_id, user_id, or action)' });
    }
    const values = [form_instance_id, user_id, action, field_name];
    const result = await pool.query(queries.createUserActionLog, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user action log:', error.message);
    res.status(500).json({ error: 'Failed to create user action log' });
  }
}

async function getUserActionLogsByFormInstanceId(req, res) {
  try {
    const { form_instance_id } = req.params;
    if (!form_instance_id) {
      return res.status(400).json({ error: 'Form instance ID is required' });
    }
    const values = [form_instance_id];
    const result = await pool.query(queries.getUserActionLogsByFormInstanceId, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching user action logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch user action logs' });
  }
}

module.exports = {
  createUserActionLog,
  getUserActionLogsByFormInstanceId,
};
