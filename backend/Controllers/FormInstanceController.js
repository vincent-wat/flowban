const { FormInstance, FormsTemplate, user, FormAssignment, WorkflowStage } = require("../models");
const path = require("path"); 

async function createFormInstance(req, res) {
  try {
    console.log("Processing form submission...");
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { template_id, submitted_by } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join("uploads/userForms", req.file.filename);

    const templateExists = await FormsTemplate.findByPk(template_id);
    if (!templateExists) {
      return res.status(404).json({ error: "Template not found" });
    }
    //issue here
    /*const userExists = await user.findByPk(submitted_by);
    if (!userExists) {
      return res.status(404).json({ error: "Submitting user not found" });
    }*/

    const newFormInstance = await FormInstance.create({
      template_id,
      submitted_by,
      pdf_file_path: filePath,
    });

    const initializingStage = await WorkflowStage.findOne({
      where: { stage_name: 'Initializing' },
    });
    
    if (!initializingStage) {
      return res.status(500).json({ error: "Initializing stage not found" });
    }

    await FormAssignment.create({
      form_instance_id: newFormInstance.id,
      stage_id: initializingStage.id,
      assigned_user_id: submitted_by,
      role: 'approver',
      approval_status: 'pending',
    });
    

    console.log("Form Instance Created:", newFormInstance);

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


async function getAllFormInstancesofTemplate(req, res) {
  try {
    const { templateId } = req.params;

    const formInstances = await FormInstance.findAll({
      where: { template_id: templateId },
    });

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
  const userId = req.user.id;
  const io = req.app.get("io");

  try {
    const formInstance = await FormInstance.findByPk(id);
    if (!formInstance) {
      return res.status(404).json({ error: "Form instance not found" });
    }

    const currentStageName = formInstance.status;

    const currentStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id,
        stage_name: currentStageName,
      },
    });

    if (!currentStage) {
      return res.status(400).json({ error: "Current stage not found in workflow stages" });
    }

    //user assignment
    const assignment = await FormAssignment.findOne({
      where: {
        form_instance_id: formInstance.id,
        stage_id: currentStage.id,
        assigned_user_id: userId,
      },
    });

    if (!assignment) {
      return res.status(403).json({ error: "You are not assigned to approve this form at this stage." });
    }

    if (!["approver", "final_approver"].includes(assignment.role)) {
      return res.status(403).json({ error: "You do not have approval permissions for this form." });
    }

    if (assignment.approval_status !== "pending") {
      return res.status(400).json({ error: `This form is currently marked as '${assignment.approval_status}', and cannot be approved.` });
    }    

    // Update assignment
    assignment.approval_status = "approved";
    assignment.approved_at = new Date();
    assignment.comment = req.body.comment || null;
    await assignment.save();

    // approvers at this stage are done
    const pendingAssignments = await FormAssignment.findAll({
      where: {
        form_instance_id: formInstance.id,
        stage_id: currentStage.id,
        approval_status: "pending",
        role: ["approver", "final_approver"],
      },
    });

    if (pendingAssignments.length > 0) {
      return res.status(200).json({
        message: "Your approval has been recorded. Awaiting others at this stage.",
      });
    }

    // next stage
    const nextStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id,
        stage_order: currentStage.stage_order + 1,
      },
    });

    if (!nextStage) {
      return res.status(200).json({ message: "Form has reached the final stage." });
    }

    await formInstance.update({ status: nextStage.stage_name });

    io.emit("formUpdated", { id, newStatus: nextStage.stage_name });

    return res.status(200).json({ message: `Form moved to ${nextStage.stage_name} stage.` });
  } catch (error) {
    console.error("Error approving form:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

const denyFormInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { denial_reason } = req.body;

    const formInstance = await FormInstance.findByPk(id);
    if (!formInstance) {
      return res.status(404).json({ message: 'Form not found.' });
    }

    if (formInstance.status === 'denied') {
      return res.status(400).json({ message: 'This form has already been denied.' });
    }
    if (!denial_reason || denial_reason.trim() === '') {
      return res.status(400).json({ message: 'A denial reason is required.' });
    }

    // Reset form status and denial reason
    formInstance.status = 'Initializing';
    formInstance.denial_reason = denial_reason;
    await formInstance.save();

    const initializingStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id,
        stage_name: 'Initializing',
      },
    });

    if (!initializingStage) {
      return res.status(500).json({ message: 'Initializing stage not found.' });
    }

    await FormAssignment.update(
      {
        approval_status: 'pending',
        approved_at: null,
        comment: null,
      },
      {
        where: {
          form_instance_id: id,
          stage_id: initializingStage.id,
          assigned_user_id: formInstance.submitted_by,
        },
      }
    );

    return res.status(200).json({ message: 'Form denied successfully and reassigned for re-approval.', formInstance });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createFormInstance,
  getFormInstanceById,
  getAllFormInstancesofTemplate,
  updateFormInstance,
  deleteFormInstance,
  approveFormInstance,
  denyFormInstance,
};
