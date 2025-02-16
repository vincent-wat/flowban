const WorkflowBoard = require("../models/WorkflowBoard");

const createWorkflowBoard = async (req, res) => {
    try {
      const { name, description, template_id, created_by } = req.body;
  
      const newBoard = await WorkflowBoard.create({
        name,
        description,
        template_id,
        created_by,
      });
  
      return res.status(201).json({
        message: "Workflow board created successfully",
        board: newBoard,
      });
    } catch (error) {
      console.error("Error creating workflow board:", error);
      return res.status(500).json({ error: "Error creating workflow board" });
    }
  };

  const getAllWorkflowBoards = async (req, res) => {
    try {
      const workflowBoards = await WorkflowBoard.findAll();
  
      return res.status(200).json(workflowBoards);
    } catch (error) {
      console.error("Error fetching workflow boards:", error);
      return res.status(500).json({ error: "Error fetching workflow boards" });
    }
  };

  const getWorkflowBoardById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workflowBoard = await WorkflowBoard.findByPk(id);
  
      if (!workflowBoard) {
        return res.status(404).json({ error: "Workflow board not found" });
      }
  
      return res.status(200).json(workflowBoard);
    } catch (error) {
      console.error("Error fetching workflow board:", error);
      return res.status(500).json({ error: "Error fetching workflow board" });
    }
  };

  const updateWorkflowBoard = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, template_id } = req.body;
  
      const workflowBoard = await WorkflowBoard.findByPk(id);
  
      if (!workflowBoard) {
        return res.status(404).json({ error: "Workflow board not found" });
      }
  
      await workflowBoard.update({
        name: name || workflowBoard.name,
        description: description || workflowBoard.description,
        template_id: template_id || workflowBoard.template_id,
      });
  
      return res.status(200).json({
        message: "Workflow board updated successfully",
        board: workflowBoard,
      });
    } catch (error) {
      console.error("Error updating workflow board:", error);
      return res.status(500).json({ error: "Error updating workflow board" });
    }
  };

  const deleteWorkflowBoard = async (req, res) => {
    try {
      const { id } = req.params;
  
      const workflowBoard = await WorkflowBoard.findByPk(id);
  
      if (!workflowBoard) {
        return res.status(404).json({ error: "Workflow board not found" });
      }

      await workflowBoard.destroy();
  
      return res.status(200).json({ message: "Workflow board deleted successfully" });
    } catch (error) {
      console.error("Error deleting workflow board:", error);
      return res.status(500).json({ error: "Error deleting workflow board" });
    }
  };


module.exports = {
    createWorkflowBoard,
    getAllWorkflowBoards,
    getWorkflowBoardById,
    updateWorkflowBoard,
    deleteWorkflowBoard,
};
