const pool = require('../models/db');
const queries = require('../models/queries');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/userForms')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `form_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function createFormInstance(req, res) {
  try {
    const { template_id, submitted_by } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const filePath = `/uploads/userForms/${req.file.filename}`;
    const result = await pool.query(
      queries.createFormInstance,
      [template_id, submitted_by, filePath]
    );

    res.status(201).json({ 
      message: 'Form instance created successfully', 
      formInstance: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating form instance:', error);
    res.status(500).json({ error: 'Failed to create form instance' });
  }
}


async function getFormInstanceById(req, res) {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const values = [userId];
    const result = await pool.query(queries.getFormInstanceById, values);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: 'Form instance not found' });
    }
  } catch (error) {
    console.error('Error fetching form instance:', error.message);
    res.status(500).json({ error: 'Failed to fetch form instance' });
  }
}

async function getAllFormInstances(req, res) {
  try {
    const result = await pool.query(queries.getAllFormInstances);
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No form instances found', data: [] });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching form instances:', error.message);
    res.status(500).json({ error: 'Failed to fetch form instances' });
  }
}

async function updateFormInstance(req, res) {
  try {
    const { id } = req.params;
    const { status, pdf_file_path } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const instanceCheck = await pool.query(queries.checkFormInstanceExists, [id]);
    if (instanceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Form instance not found' });
    }

    const values = [status, pdf_file_path, id];
    const result = await pool.query(queries.updateFormInstance, values);
    res.status(200).json({ message: 'Form instance updated successfully', updatedInstance: result.rows[0] });
  } catch (error) {
    console.error('Error updating form instance:', error.message);
    res.status(500).json({ error: 'Failed to update form instance' });
  }
}

async function deleteFormInstance(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const instanceCheck = await pool.query(queries.checkFormInstanceExists, [id]);
    if (instanceCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Form instance not found' });
    }

    const values = [id];
    await pool.query(queries.deleteFormInstance, values);
    res.status(200).json({ message: 'Form instance deleted successfully' });
  } catch (error) {
    console.error('Error deleting form instance:', error.message);
    res.status(500).json({ error: 'Failed to delete form instance' });
  }
}

const approveFormInstance = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to approve form with ID: ${id}`);

  try {
    // Check if form instance exists
    const formInstance = await pool.query(
      queries.status,[id]);

    if (formInstance.rows.length === 0) {
      console.log(`Form instance with ID ${id} not found`);
      return res.status(404).json({ error: "Form instance not found" });
    }

    const currentStage = formInstance.rows[0].status;
    console.log(`Current stage for form ${id}: ${currentStage}`);

    // Get the next stage from workflow_stage table
    const nextStage = await pool.query(
      queries.nextStages,[currentStage]);

    console.log("Next stage result:", nextStage.rows);

    if (nextStage.rows.length === 0) {
      console.log(`No further stages for form ${id}`);
      return res.status(400).json({ error: "No further stages available" });
    }

    const newStage = nextStage.rows[0].stage_name;
    console.log(`Updating form ${id} to new stage: ${newStage}`);

    // Update the form instance to the next stage
    await pool.query(
      queries.setStage,[newStage, id]);

    res.status(200).json({ message: `Form moved to ${newStage} stage.` });
  } catch (error) {
    console.error("Error approving form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const denyFormInstance = async (req, res) => {
  const { id } = req.params;

  try {
    // Move form back to "Initializing"
    await pool.query(
      queries.resetStage,[id]);

    res.status(200).json({ message: "Form moved back to Initializing stage." });
  } catch (error) {
    console.error("Error denying form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createFormInstance,
  getFormInstanceById,
  getAllFormInstances,
  updateFormInstance,
  deleteFormInstance,
  upload,
  approveFormInstance,
  denyFormInstance,
};
