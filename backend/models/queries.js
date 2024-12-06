// used to create shorthand for common queries to the database

// User Queries
const getUsers = "SELECT * FROM users";
const postUser =
  "INSERT INTO users (email, password, phone_number, first_name, last_name, user_role) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *";
const getColumns = "SELECT * FROM columns";
const deleteUser = "DELETE FROM users WHERE id = $1";
const updateUser = `
  UPDATE users
  SET email = $1, phone_number = $2, first_name = $3, last_name = $4, user_role = $5
  WHERE id = $6
  RETURNING *;
`;
const insertResetToken = `
  UPDATE users
  SET password_reset_token = $1
  WHERE email = $2
`;

// Reset password and delete reset token
const resetPassword = `
  UPDATE users
  SET password = $1, password_reset_token = NULL, updated_at = NOW()
  WHERE password_reset_token = $2
  `;

const getcurrUser = 'SELECT id, email, phone_number, first_name, last_name FROM users WHERE id = $1';

// Finds a user using their ID
const findUser = `
  SELECT * FROM users WHERE id = $1
`;

//Finds a user using their email
const findUserByEmail = `
  SELECT * FROM users WHERE email = $1
`;

//Finds a user using their reset token
const findUserByResetToken = `
  SELECT * FROM users WHERE password_reset_token = $1
`;

// Board Queries
const getBoards = "SELECT * FROM boards";
const getUserBoards = `SELECT * FROM boards WHERE id = $1`;
const getAllBoards = "SELECT * FROM boards";
const deleteBoardQuery = "DELETE FROM boards WHERE id = $1 RETURNING *";
const updateBoardNameQuery =
  "UPDATE boards SET name = $1 WHERE id = $2 RETURNING *";
const addBoard = "INSERT INTO boards (name) VALUES ($1) RETURNING *";

// Column Queries
const getAllColumns = "SELECT * FROM columns";
const getColumn = "SELECT * FROM columns WHERE id = $1";
const getAllColumnsForBoard = "SELECT * FROM columns WHERE board_id = $1";
const addColumn =
  "INSERT INTO columns (name, board_id) VALUES ($1, $2) RETURNING *";
const deleteColumn = "DELETE FROM columns WHERE id = $1 RETURNING *";
const deleteAllColumnsForBoard =
  "DELETE FROM columns WHERE board_id = $1 RETURNING *";
const updateColumnName =
  "UPDATE columns SET name = $1 WHERE id = $2 RETURNING *";

// Task Queries
const getAllTasks = "SELECT * FROM tasks";
const getTask = "SELECT * FROM tasks WHERE id = $1";
const getAllTasksForColumn = "SELECT * FROM tasks WHERE column_id = $1";
const deleteTask = "DELETE FROM tasks WHERE id = $1 RETURNING *";
const deleteAllTasksForColumn =
  "DELETE FROM tasks WHERE column_id = $1 RETURNING *";
const addTask =
  "INSERT INTO tasks (column_id, title, description) VALUES ($1,$2,$3) RETURNING *";
const updateTaskDescription =
  "UPDATE tasks SET description = $1 WHERE id = $2 RETURING *";
const updateTaskTitle = "UPDATE tasks SET title = $1 WHERE id = $2 RETURING *";



//FromsTemplate 

const createTemplate = `
INSERT INTO forms_templates (name, description, pdf_file_path, created_by, fields_metadata)
VALUES ($1, $2, $3, $4, $5) RETURNING *
`;
const getallTemplate ='SELECT * FROM forms_templates';
const getTemplatebyid = 'SELECT * FROM forms_templates WHERE id = $1';

const updateTemplate =  `
UPDATE forms_templates
SET name = $1, description = $2, pdf_file_path = $3, fields_metadata = $4, updated_at = NOW()
WHERE id = $5 RETURNING *;
`;
const deleteTemplate = 'DELETE FROM forms_templates WHERE id = $1 RETURNING *';


//FormInstances
const createFormInstance =  `
INSERT INTO form_instances (template_id, submitted_by, status, pdf_file_path)
VALUES ($1, $2, $3, $4) RETURNING *
`;
const getFormInstanceById = `
SELECT * FROM form_instances WHERE id = $1
`;
const getAllFormInstances = `
SELECT fi.id, fi.status, ft.name AS template_name
FROM form_instances fi
JOIN forms_templates ft ON fi.template_id = ft.id;
`;
const updateFormInstance = `
UPDATE form_instances
SET status = $1, pdf_file_path = $2, updated_at = NOW()
WHERE id = $3 RETURNING *
`;
const deleteFormInstance = `
DELETE FROM form_instances WHERE id = $1 RETURNING *
`;

//FormFieldValue
const createFormFieldValue = `
  INSERT INTO form_field_values (form_instance_id, field_name, field_value)
  VALUES ($1, $2, $3) RETURNING *
`;

const getFormFieldValuesByInstanceId = `
  SELECT * FROM form_field_values WHERE form_instance_id = $1
`;

const updateFormFieldValue = `
  UPDATE form_field_values
  SET field_value = $1, updated_at = NOW()
  WHERE id = $2 RETURNING *
`;

const deleteFormFieldValue = `
  DELETE FROM form_field_values WHERE id = $1 RETURNING *
`;



//UserLog
const createUserActionLog = `
INSERT INTO user_actions_audit_logs (form_instance_id, user_id, action, field_name)
VALUES ($1, $2, $3, $4) RETURNING *
`;

const getUserActionLogsByFormInstanceId = `
SELECT * FROM user_actions_audit_logs WHERE form_instance_id = $1
`;

//file upload
const insertTemplate = `
    INSERT INTO forms_templates 
    (name, description, pdf_file_path, created_by, fields_metadata) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;


//workflow board
const createWorkFlowBoard = `
    INSERT INTO workflow_boards 
    (name, description, template_id, created_by) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`;

const allWorkFlowBoard = `
    SELECT * FROM workflow_boards`;

const WorkFlowBoardByID = `
    SELECT * FROM workflow_boards WHERE id = $1`;

const updateWorkFlowBoard = `
    UPDATE workflow_boards
    SET name = $1, description = $2, template_id = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *`;

const deleteWorkFlowBoard = `
    DELETE FROM workflow_boards WHERE id = $1 RETURNING *`;

//stages
const getStages = `
      SELECT * FROM workflow_stages
      WHERE template_id = $1
      ORDER BY stage_order ASC
    `;


module.exports = {
  // users exports
  getBoards,
  getColumns,
  getUsers,
  findUserByEmail,
  postUser,
  deleteUser,
  updateUser,
  findUser,
  getcurrUser,
  insertResetToken,
  findUserByResetToken,
  resetPassword,
  // boards exports
  getUserBoards,
  getAllBoards,
  deleteBoardQuery,
  updateBoardNameQuery,
  addBoard,
  // columns exports
  getAllColumns,
  getColumn,
  getAllColumnsForBoard,
  addColumn,
  deleteColumn,
  deleteAllColumnsForBoard,
  updateColumnName,
  // tasks exports
  getAllTasks,
  getTask,
  getAllTasksForColumn,
  deleteTask,
  deleteAllTasksForColumn,
  addTask,
  updateTaskDescription,
  updateTaskTitle,
  //Formtemplate
  createTemplate,
  getallTemplate,
  getTemplatebyid,
  updateTemplate,
  deleteTemplate,
  //FormInstance
  createFormInstance,
  getAllFormInstances,
  getFormInstanceById,
  updateFormInstance,
  deleteFormInstance,
  //FormFieldValue
  createFormFieldValue,
  getFormFieldValuesByInstanceId,
  updateFormFieldValue,
  deleteFormFieldValue,
  //UserActionLogs
  createUserActionLog,
  getUserActionLogsByFormInstanceId,
  //file upload
  insertTemplate,
  //workflowboard
  createWorkFlowBoard,
  allWorkFlowBoard,
  WorkFlowBoardByID,
  updateWorkFlowBoard,
  deleteWorkFlowBoard,
  //stages
  getStages
};
