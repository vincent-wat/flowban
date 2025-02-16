const pool = require("../models/db");
const queries = require('../models/queries');

const WorkflowStage = require("../models/WorkflowStage");

const createWorkflowStage = async (req, res) => {
  try {
    const { template_id, stage_name, stage_order } = req.body;

    if (!template_id || !stage_name || stage_order === undefined) {
      return res.status(400).json({ error: "Missing required fields (template_id, stage_name, stage_order)" });
    }

    const newStage = await WorkflowStage.create({
      template_id,
      stage_name,
      stage_order,
    });

    return res.status(201).json({
      message: "Workflow stage created successfully",
      stage: newStage,
    });
  } catch (error) {
    console.error("Error creating workflow stage:", error);
    return res.status(500).json({ error: "Error creating workflow stage" });
  }
};

const updateWorkflowStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage_name, stage_order } = req.body;

    const workflowStage = await WorkflowStage.findByPk(id);

    if (!workflowStage) {
      return res.status(404).json({ error: "Workflow stage not found" });
    }

    await workflowStage.update({
      stage_name: stage_name || workflowStage.stage_name,
      stage_order: stage_order !== undefined ? stage_order : workflowStage.stage_order,
    });

    return res.status(200).json({
      message: "Workflow stage updated successfully",
      stage: workflowStage,
    });
  } catch (error) {
    console.error("Error updating workflow stage:", error);
    return res.status(500).json({ error: "Error updating workflow stage" });
  }
};

const getStagesByTemplateId = async (req, res) => {
  try {
    const { templateId } = req.params;

    // Fetch workflow stages for the given template ID
    const workflowStages = await WorkflowStage.findAll({
      where: { template_id: templateId },
      order: [["stage_order", "ASC"]], // Ensuring correct stage order
    });

    return res.status(200).json(workflowStages);
  } catch (error) {
    console.error("Error fetching workflow stages:", error);
    return res.status(500).json({ error: "Failed to fetch workflow stages" });
  }
};
const getWorkflowStageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the workflow stage using Sequelize
    const workflowStage = await WorkflowStage.findByPk(id);

    if (!workflowStage) {
      return res.status(404).json({ error: "Workflow stage not found" });
    }

    return res.status(200).json(workflowStage);
  } catch (error) {
    console.error("Error fetching workflow stage:", error);
    return res.status(500).json({ error: "Error fetching workflow stage" });
  }
};

const deleteWorkflowStage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the workflow stage by ID
    const workflowStage = await WorkflowStage.findByPk(id);

    if (!workflowStage) {
      return res.status(404).json({ error: "Workflow stage not found" });
    }

    // Delete the workflow stage
    await workflowStage.destroy();

    return res.status(200).json({ message: "Workflow stage deleted successfully" });
  } catch (error) {
    console.error("Error deleting workflow stage:", error);
    return res.status(500).json({ error: "Error deleting workflow stage" });
  }
};

module.exports = {
  createWorkflowStage,
  getStagesByTemplateId,
  getWorkflowStageById,
  updateWorkflowStage,
  deleteWorkflowStage,
};
