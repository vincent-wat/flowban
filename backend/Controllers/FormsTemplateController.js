const queries = require("../models/queries");
const pool = require("../models/db");

async function createFormTemplate(req, res) {
  try {
    const { name, description, pdf_file_path, created_by, fields_metadata } = req.body;
    const values = [name, description, pdf_file_path, created_by, fields_metadata];
    const newTemplate = await pool.query(queries.createTemplate, values);
    res.status(201).json(newTemplate.rows[0]);
  } catch (error) {
    console.error('Error creating form template:', error);
    res.status(500).json({ error: 'Failed to create form template' });
  }
}

async function getAllFormTemplates(req, res) {
  try {
    if (!queries.getallTemplate) {
      throw new Error('Query is undefined or null'); 
    }
    console.log('Executing Query:', queries.getallTemplate); 
    const templates = await pool.query(queries.getallTemplate);

    res.status(200).json(templates.rows);
  } catch (error) {
    console.error('Error fetching form templates:', error.message);
    res.status(500).json({ error: 'Failed to fetch form templates' });
  }
}


async function getFormTemplateById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required to fetch a form template' });
    }
    const values = [id];
    console.log('Executing Query:', queries.getTemplatebyid, 'with ID:', id);
    const template = await pool.query(queries.getTemplatebyid, values);
    if (template.rows.length > 0) {
      res.status(200).json(template.rows[0]);
    } else {
      res.status(404).json({ error: 'Form template not found' });
    }
  } catch (error) {
    console.error('Error fetching form template:', error.message);
    res.status(500).json({ error: 'Failed to fetch form template' });
  }
}


async function updateFormTemplate(req, res) {
  try {
    const { id } = req.params;
    const { name, description, pdf_file_path, fields_metadata } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required to update a form template' });
    }
    if (!name || !pdf_file_path || !fields_metadata) {
      return res.status(400).json({ error: 'Missing required fields (name, pdf_file_path, or fields_metadata)' });
    }
    const values = [name, description, pdf_file_path, fields_metadata, id];

    console.log('Executing Update Query:', queries.updateTemplate, 'with values:', values);
    const updatedTemplate = await pool.query(queries.updateTemplate, values);

    if (updatedTemplate.rows.length > 0) {
      res.status(200).json({ message: 'Form template updated successfully', updatedTemplate: updatedTemplate.rows[0] });
    } else {
      res.status(404).json({ error: 'Form template not found' });
    }
  } catch (error) {
    console.error('Error updating form template:', error.message);
    res.status(500).json({ error: 'Failed to update form template' });
  }
}

async function deleteFormTemplate(req, res) {
  try {
    const { id } = req.params;
    const deletedTemplate = await pool.query(queries.deleteTemplate, [id]);
    if (deletedTemplate.rows.length > 0) {
      res.status(200).json({ message: 'Form template deleted successfully' });
    } else {
      res.status(404).json({ error: 'Form template not found' });
    }
  } catch (error) {
    console.error('Error deleting form template:', error);
    res.status(500).json({ error: 'Failed to delete form template' });
  }
}

module.exports = {
  createFormTemplate,
  getAllFormTemplates,
  getFormTemplateById,
  updateFormTemplate,
  deleteFormTemplate
};
