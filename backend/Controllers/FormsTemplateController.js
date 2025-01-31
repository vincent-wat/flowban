const queries = require("../models/queries");
const pool = require("../models/db");

async function createAndUploadTemplate(req, res) {
  try {
    console.log('Inside createAndUploadTemplate controller function');
    console.log('File received:', req.file);
    console.log('Body received:', req.body);
    const { filename } = req.file;
    if (!req.file || !filename) {
      return res.status(400).json({ error: 'Template file is required' });
    }

    const { name, description, created_by, fields_metadata } = req.body;
    if (!name || !description || !created_by) {
      return res.status(400).json({ error: 'Missing required fields (name, description, created_by)' });
    }
    const pdf_file_path = `/uploads/templates/${filename}`;
    const metadata = fields_metadata ? JSON.stringify(fields_metadata) : null;
    const values = [name, description, pdf_file_path, created_by, metadata];
    const newTemplate = await pool.query(queries.createTemplate, values);
    res.status(201).json({
      message: 'Template created and uploaded successfully',
      template: newTemplate.rows[0],
    });
  } catch (error) {
    console.error('Error creating and uploading template:', error);
    res.status(500).json({ error: 'Failed to create and upload template' });
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
  createAndUploadTemplate,
  getAllFormTemplates,
  getFormTemplateById,
  updateFormTemplate,
  deleteFormTemplate,
};
