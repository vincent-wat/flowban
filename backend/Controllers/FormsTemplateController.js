const path = require('path'); 
const FormTemplate = require("../models/FormsTemplate");

async function createAndUploadTemplate(req, res) {
  try {
    console.log("File received:", req.file);
    console.log("Request body:", req.body);

    const { name, description, created_by, fields_metadata } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Template file is required" });
    }

    if (!name || !description || !created_by) {
      return res.status(400).json({
        error: "Missing required fields (name, description, created_by)",
      });
    }

    const pdf_file_path = `/uploads/templates/${req.file.filename}`;
    const metadata = fields_metadata ? JSON.stringify(fields_metadata) : null;

    const newTemplate = await FormTemplate.create({
      name,
      description,
      pdf_file_path,
      created_by,
      fields_metadata: metadata,
    });

    return res.status(201).json({
      message: "Template created and uploaded successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating and uploading template:", error);
    return res.status(500).json({ error: "Failed to create and upload template" });
  }
}

async function getAllFormTemplates(req, res) {
  try {
    const templates = await FormTemplate.findAll();

    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching form templates:", error.message);
    return res.status(500).json({ error: "Failed to fetch form templates" });
  }
}

async function getFormTemplateById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required to fetch a form template" });
    }

    console.log("Fetching FormTemplate with ID:", id);
    const template = await FormTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Form template not found" });
    }
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching form template:", error.message);
    return res.status(500).json({ error: "Failed to fetch form template" });
  }
}

//THIS CURRENTLY DOES NOT CHANGE PHYSICAL FILE IN STORAGE SYSTEM FIX SOON
async function updateFormTemplate(req, res) {
  try {
    const { id } = req.params;
    const { name, description, pdf_file_path, fields_metadata } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required to update a form template" });
    }
    if (!name || !pdf_file_path || !fields_metadata) {
      return res.status(400).json({
        error: "Missing required fields (name, pdf_file_path, or fields_metadata)",
      });
    }

    console.log("Updating FormTemplate with ID:", id);

    const template = await FormTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Form template not found" });
    }

    await template.update({
      name,
      description,
      pdf_file_path,
      fields_metadata: JSON.stringify(fields_metadata),
    });

    return res.status(200).json({
      message: "Form template updated successfully",
      updatedTemplate: template,
    });
  } catch (error) {
    console.error("Error updating form template:", error.message);
    return res.status(500).json({ error: "Failed to update form template" });
  }
}

async function deleteFormTemplate(req, res) {
  try {
    const { id } = req.params;

    console.log("Deleting FormTemplate with ID:", id);

    const template = await FormTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Form template not found" });
    }
    await template.destroy();

    return res.status(200).json({ message: "Form template deleted successfully" });
  } catch (error) {
    console.error("Error deleting form template:", error.message);
    return res.status(500).json({ error: "Failed to delete form template" });
  }
}

async function getPdfById(req, res) {
  try {
    console.log("Received ID:", req.params.id);

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid template ID" });
    }

    const template = await FormTemplate.findByPk(id);

    if (!template) {
      return res.status(404).json({ error: "Template not found!" });
    }

    const pdfPath = template.pdf_file_path;

    if (!pdfPath) {
      return res.status(404).json({ error: "PDF path not found in template!" });
    }

    if (pdfPath.includes("..")) {
      return res.status(400).json({ error: "Invalid PDF path!" });
    }

    const filePath = path.join(__dirname, "..", pdfPath);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error fetching the PDF:", err);
        res.status(404).json({ error: "PDF not found!" });
      }
    });
  } catch (error) {
    console.error("Error retrieving template:", error);
    return res.status(500).json({ error: "Failed to retrieve template" });
  }
}

module.exports = {
  createAndUploadTemplate,
  getAllFormTemplates,
  getFormTemplateById,
  updateFormTemplate,
  deleteFormTemplate,
  getPdfById,
};
