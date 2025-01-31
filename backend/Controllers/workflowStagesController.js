const pool = require("../models/db");
const queries = require('../models/queries');

async function getStagesByTemplateId(req, res) {
  try {
    const { templateId } = req.params;
    const result = await pool.query(queries.getStages, [templateId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching workflow stages:', error);
    res.status(500).json({ error: 'Failed to fetch workflow stages' });
  }
}

module.exports = {
  getStagesByTemplateId,
};
