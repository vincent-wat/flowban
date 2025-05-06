const { FormInstance, FormsTemplate, User, FormAssignment, WorkflowStage, Role} = require("../models");
const path = require("path"); 

async function createFormInstance(req, res) {
  try {
    console.log("Processing form submission...");
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { template_id,suggestedAssignments } = req.body;
    const organizationId = req.user.organization_id;
    const submittedBy = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join("uploads/userForms", req.file.filename);

    const templateExists = await FormsTemplate.findByPk(template_id);
    if (!templateExists) {
      return res.status(404).json({ error: "Template not found" });
    }

    const newFormInstance = await FormInstance.create({
      template_id,
      submitted_by: submittedBy,
      pdf_file_path: filePath,
      organization_id: organizationId,
    });

    const initializingStage = await WorkflowStage.findOne({
      where: { template_id, stage_name: 'Initializing' },
    });

    if (!initializingStage) {
      return res.status(500).json({ error: "Initializing stage not found" });
    }

    await FormAssignment.create({
      form_instance_id: newFormInstance.id,
      stage_id: initializingStage.id,
      assigned_user_id: submittedBy,
      role: 'approver',
      approval_status: 'pending',
    });
    const parsedSuggestedAssignments = suggestedAssignments
      ? JSON.parse(suggestedAssignments)
      : [];
    console.log("Parsed suggested assignments:", parsedSuggestedAssignments);

    if (parsedSuggestedAssignments.length > 0) {
      for (const assignment of parsedSuggestedAssignments) {
        const { stage_id, assigned_user_id } = assignment;

        await FormAssignment.create({
          form_instance_id: newFormInstance.id,
          stage_id,
          assigned_user_id,
          role: 'approver',
          approval_status: 'suggested',
        });
      }
    }

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
    const organizationId = req.user.organization_id;
    console.log("req.user =", req.user);

    //console.log("→ Filtering with template_id:", templateId, "organization_id:", organizationId);

    const formInstances = await FormInstance.findAll({
      where: {
        template_id: templateId,
        organization_id: organizationId,
      },
      include: [
        {
          model: FormAssignment,
          as: "assignedUsers",
          include: [
            {
              model: User,
              as: "assignedUser", 
              attributes: ["id", "first_name", "last_name"],
            },
          ],
        },
        {
          model: User,
          as: "submitter", 
          attributes: ["id", "first_name", "last_name", "email"]
        }
      ]
    });
    

    console.log("→ Found formInstances:", formInstances);

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
    const formInstance = await FormInstance.findByPk(id, {
      attributes: ['id', 'template_id', 'submitted_by', 'pdf_file_path', 'status', 'organization_id']
    });
    
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

    if (!["approver", "final_approver", "admin"].includes(assignment.role)) {
      return res.status(403).json({ error: "You do not have approval permissions for this form." });
    }

    if (assignment.approval_status !== "pending") {
      return res.status(400).json({ error: `This form is currently marked as '${assignment.approval_status}', and cannot be approved.` });
    }

    assignment.approval_status = "approved";
    assignment.approved_at = new Date();
    assignment.comment = req.body.comment || null;
    await assignment.save();

    if (currentStageName === "Admin Approval") {
      await FormAssignment.update(
        { approval_status: "pending" },
        {
          where: {
            form_instance_id: formInstance.id,
            approval_status: "suggested"
          }
        }
      );
      console.log(`Converted all suggested assignments to pending for form ${formInstance.id}`);
    }    

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

    if (nextStage.stage_name === "Admin Approval") {
      const adminUser = await User.findOne({
        include: [{
          model: Role,
          as: "roles",
          where: { name: "admin" },
          through: { attributes: [] },
        }],
        where: {
          organization_id: formInstance.organization_id,
        },
      });

      

      if (!adminUser) {
        console.error("Admin user not found for this organization. Skipping admin assignment.");
      } else {
        await FormAssignment.create({
          form_instance_id: formInstance.id,
          stage_id: nextStage.id,
          assigned_user_id: adminUser.id,
          role: "admin",
          approval_status: "pending",
        });
        console.log(`Assigned Admin (User ID: ${adminUser.id}) to Admin Approval stage.`);
      }
    }

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
    const io = req.app.get("io");
    const userId = req.user.id; 

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

    const currentStageName = formInstance.status;
    console.log(`Denying form at stage: ${currentStageName}`);

    const currentStage = await WorkflowStage.findOne({
      where: {
        template_id: formInstance.template_id,
        stage_name: currentStageName,
      },
    });

    if (!currentStage) {
      return res.status(400).json({ message: "Current workflow stage not found." });
    }

    const assignment = await FormAssignment.findOne({
      where: {
        form_instance_id: formInstance.id,
        stage_id: currentStage.id,
        assigned_user_id: userId,
      },
    });

    if (!assignment) {
      return res.status(403).json({ error: "You are not assigned to deny this form at this stage." });
    }

    if (!["approver", "final_approver", "admin"].includes(assignment.role)) {
      return res.status(403).json({ error: "You do not have permission to deny this form." });
    }

    if (assignment.approval_status !== "pending") {
      return res.status(400).json({ error: `This form is currently marked as '${assignment.approval_status}', and cannot be denied.` });
    }


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

    if (currentStageName === "Admin Approval") {
      await FormAssignment.destroy({
        where: {
          form_instance_id: id,
          approval_status: "suggested",
        },
      });
      console.log(`Deleted suggested assignments for form ${id} after denial.`);
    } else {
      await FormAssignment.update(
        {
          approval_status: "pending",
          approved_at: null,
          comment: null,
        },
        {
          where: {
            form_instance_id: id,
            approval_status: "pending",
          },
        }
      );
      console.log(`Reset pending assignments at stage ${currentStageName} for form ${id}.`);
    }

    io.emit("formUpdated", { id, newStatus: initializingStage.stage_name });

    return res.status(200).json({ message: 'Form denied successfully and reassigned for re-approval.', formInstance });
  } catch (error) {
    console.error("Error denying form:", error);
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
