const pool = require('../models/db');
const queries = require('../models/queries');
const FormInstance = require("../models/FormsInstances");
const FormTemplate = require("../models/FormsTemplate");
const User = require("../models/User");
const WorkflowStage = require("../models/WorkflowStage");


async function createFormInstance(req, res) {
  try {
    const { template_id, submitted_by } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `../uploads/userForms/${req.file.filename}`;

    const templateExists = await FormTemplate.findByPk(template_id);
    if (!templateExists) {
      return res.status(404).json({ error: "Template not found" });
    }

    const userExists = await User.findByPk(submitted_by);
    if (!userExists) {
      return res.status(404).json({ error: "Submitting user not found" });
    }

    const newFormInstance = await FormInstance.create({
      template_id,
      submitted_by,
      pdf_file_path: filePath,
    });

    return res.status(201).json({
      message: "Form instance created successfully",
      formInstance: newFormInstance,
    });
  } catch (error) {
    console.error("Error creating form instance:", error);
    return res.status(500).json({ error: "Failed to create form instance" });
  }
}


async function getFormInstanceById(req, res) {
  try {
    const formInstanceId = req.params.id;

    if (!formInstanceId) {
      return res.status(400).json({ error: "ID is required" });
    }

    const formInstance = await FormInstance.findByPk(formInstanceId);

    if (!formInstance) {
      return res.status(404).json({ error: "Form instance not found" });
    }

    return res.status(200).json(formInstance);
  } catch (error) {
    console.error("Error fetching form instance:", error.message);
    return res.status(500).json({ error: "Failed to fetch form instance" });
  }
}

async function getAllFormInstances(req, res) {
  try {
    const formInstances = await FormInstance.findAll();

    if (formInstances.length === 0) {
      return res.status(200).json({ message: "No form instances found", data: [] });
    }

    return res.status(200).json(formInstances);
  } catch (error) {
    console.error("Error fetching form instances:", error.message);
    return res.status(500).json({ error: "Failed to fetch form instances" });
  }
}

async function updateFormInstance(req, res) {
  try {
    const { id } = req.params;
    const { status, pdf_file_path } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const formInstance = await FormInstance.findByPk(id);
    if (!formInstance) {
      return res.status(404).json({ error: "Form instance not found" });
    }

    await formInstance.update({
      status: status || formInstance.status,
      pdf_file_path: pdf_file_path || formInstance.pdf_file_path,
    });

    return res.status(200).json({
      message: "Form instance updated successfully",
      updatedInstance: formInstance,
    });
  } catch (error) {
    console.error("Error updating form instance:", error.message);
    return res.status(500).json({ error: "Failed to update form instance" });
  }
}

async function deleteFormInstance(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const formInstance = await FormInstance.findByPk(id);
    if (!formInstance) {
      return res.status(404).json({ error: "Form instance not found" });
    }

    await formInstance.destroy();

    return res.status(200).json({ message: "Form instance deleted successfully" });
  } catch (error) {
    console.error("Error deleting form instance:", error.message);
    return res.status(500).json({ error: "Failed to delete form instance" });
  }
}

const approveFormInstance = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get("io");

  console.log(`Received request to approve form with ID: ${id}`);

  try {
    const formInstance = await FormInstance.findByPk(id);

    if (!formInstance) {
      console.log(`Form instance with ID ${id} not found`);
      return res.status(404).json({ error: "Form instance not found" });
    }

    console.log(`Found form instance:`, formInstance.dataValues);

    const currentStageName = formInstance.status;
    console.log(`🔍 Current stage for form ${id}: ${currentStageName}`);

    const currentStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id, 
        stage_name: currentStageName, 
      },
    });

    if (!currentStage) {
      console.log(`Current stage "${currentStageName}" not found in workflow_stages`);
      return res.status(400).json({ error: "Current stage not found in workflow stages" });
    }

    console.log(`Found current stage in workflow_stages:`, currentStage.dataValues);

    const nextStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id,
        stage_order: currentStage.stage_order + 1,
      },
    });

    if (!nextStage) {
      console.log(`🚀 Form ${id} has reached the final stage: ${currentStageName}`);
      return res.status(200).json({ message: "Form has reached the final stage." });
    }

    const newStage = nextStage.stage_name;
    console.log(`🔄 Updating form ${id} to new stage: ${newStage}`);

    await formInstance.update({ status: newStage });

    io.emit("formUpdated", { id, newStatus: newStage });

    return res.status(200).json({ message: `Form moved to ${newStage} stage.` });
  } catch (error) {
    console.error("Error approving form:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const denyFormInstance = async (req, res) => {
  const { id } = req.params;
  const io = req.app.get("io");

  try {
    // Find the form instance
    const formInstance = await FormInstance.findByPk(id);

    if (!formInstance) {
      return res.status(404).json({ error: "Form instance not found" });
    }

    // Move form back to "Initializing"
    await formInstance.update({ status: "Initializing" });

    io.emit("formUpdated", { id, newStatus: "Initializing" });

    return res.status(200).json({ message: "Form moved back to Initializing stage." });
  } catch (error) {
    console.error("Error denying form:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFormInstance,
  getFormInstanceById,
  getAllFormInstances,
  updateFormInstance,
  deleteFormInstance,
  approveFormInstance,
  denyFormInstance,
};
