const { FormAssignment, FormInstance, User, WorkflowStage } = require('../models');

  const assignUserToFormInstance = async (req, res) => {
    const { form_instance_id, stage_id, assigned_user_id, role } = req.body;
  
    try {
      if (!form_instance_id || !stage_id || !assigned_user_id || !role) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      const existing = await FormAssignment.findOne({
        where: {
          form_instance_id,
          stage_id,
          assigned_user_id,
        },
      });
  
      if (existing) {
        return res.status(409).json({ error: "User is already assigned at this stage." });
      }
  
      const assignment = await FormAssignment.create({
        form_instance_id,
        stage_id,
        assigned_user_id,
        role,
        approval_status: "pending",
        approved_at: null,
        comment: null,
      });
  
      return res.status(201).json({
        message: "User assigned to form instance successfully.",
        assignment,
      });
    } catch (err) {
      console.error("Error assigning user:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", message: err.message });
    }
  };
  
  const getAssignmentsByFormInstance = async (req, res) => {
    const { formInstanceId } = req.params;
  
    try {
      const assignments = await FormAssignment.findAll({
        where: { form_instance_id: formInstanceId },
        include: [
          {
            model: User,
            as: 'assignedUser',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: WorkflowStage,
            as: 'stage',
            attributes: ['id', 'stage_name', 'stage_order']
          }
        ],        
        order: [['stage_id', 'ASC']],
      });
  
      res.json(assignments);
    } catch (err) {
      res
        .status(500)
        .json({ error: 'Internal Server Error', message: err.message });
    }
  };
  
  const getAssignmentsByUser = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const assignments = await FormAssignment.findAll({
        where: { assigned_user_id: userId },
        include: [
          {
            model: FormInstance,
            as: 'formInstance',
            attributes: ['id', 'status', 'template_id'],
          },
          {
            model: WorkflowStage,
            as: 'stage',
            attributes: ['id', 'stage_name', 'stage_order'],
          },
        ],
        order: [['form_instance_id', 'ASC'], ['stage_id', 'ASC']],
      });
  
      res.json(assignments);
    } catch (err) {
      res
        .status(500)
        .json({ error: 'Internal Server Error', message: err.message });
    }
  };
  
  const updateAssignmentStatus = async (req, res) => {
    const { assignmentId } = req.params;
    const { approval_status, comment } = req.body;
  
    try {
      const assignment = await FormAssignment.findByPk(assignmentId);
  
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found.' });
      }
  
      //Prevent unauthorized updates
      if (assignment.assigned_user_id !== req.user.id) {
        return res.status(403).json({ error: 'You are not allowed to update this assignment.' });
      }
  
      if (approval_status) {
        assignment.approval_status = approval_status;
        assignment.approved_at = new Date();
      }
  
      if (comment !== undefined) {
        assignment.comment = comment;
      }
  
      await assignment.save();
  
      res.json({ message: 'Assignment updated.', assignment });
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
  };
  
  const suggestUserForFormStage = async (req, res) => {
    const { form_instance_id, stage_id, assigned_user_id, role } = req.body;
  
    try {
      if (!form_instance_id || !stage_id || !assigned_user_id || !role) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      const existing = await FormAssignment.findOne({
        where: {
          form_instance_id,
          stage_id,
          assigned_user_id,
          approval_status: 'suggested',
        },
      });
  
      if (existing) {
        return res.status(409).json({ error: "This user has already been suggested for this stage." });
      }
  
      const assignment = await FormAssignment.create({
        form_instance_id,
        stage_id,
        assigned_user_id,
        role,
        approval_status: "suggested",
        approved_at: null,
        comment: null,
      });
  
      return res.status(201).json({
        message: "Suggested approver added.",
        assignment,
      });
    } catch (err) {
      console.error("Error suggesting user:", err);
      res.status(500).json({ error: "Server Error", message: err.message });
    }
  };
  
  
  
  module.exports = {
    getAssignmentsByFormInstance,
    getAssignmentsByUser,
    updateAssignmentStatus,
    assignUserToFormInstance,
    suggestUserForFormStage,
  }  