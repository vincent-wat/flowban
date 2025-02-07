# Flowban

### how to run 
##### backend
- cd backend
- **Option 1:** node server.js
- **Option 2:** npm start (11-6-2024 - Backend now runs on nodemon automatically when you use this)
#### for database connection
- create your database in local machine for now
- check for new install under at the bottom of this file
- Create a .env file and add the following to the .env file:


### color scheme
- C51D34 Red
- 2E2E30 Dark Gray
- 808080 Light Gray
- F5F5F5 White

### Database Commands

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_role VARCHAR(50)[],
    password_reset_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    board_id INT REFERENCES boards(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    column_id INT REFERENCES columns(id) ON DELETE CASCADE,
    title VARCHAR(100),
    description TEXT NOT NULL
);


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE roles 
ADD CONSTRAINT roles_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION update_roles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION update_roles_timestamp();

INSERT INTO roles (name, description, created_by) VALUES
('admin', 'Has full access to the workflow system', 1),
('user', 'General user role used in another feature', 1),
('collaborator', 'Used in a different feature for collaboration', 1);

ALTER TABLE users DROP COLUMN IF EXISTS role;

ALTER TABLE users 
ADD COLUMN role_id INTEGER NOT NULL DEFAULT 1, 
ADD CONSTRAINT users_role_id_fkey 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

### Roles

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);

INSERT INTO roles (name, description, created_at, updated_at)
VALUES
    ('user', 'Default role for regular users', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('admin', 'Administrator with full permissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('collaborator', 'Can assist in certain workflow tasks', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);




----------
# WorkFlow
### DB commands 
CREATE TABLE workflow_boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_id INT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES forms_templates (id) ON DELETE CASCADE
);

CREATE TABLE workflow_stages (
  id SERIAL PRIMARY KEY,
  template_id INT NOT NULL,
  stage_name VARCHAR(255) NOT NULL,
  stage_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES forms_templates (id) ON DELETE CASCADE
);

CREATE TABLE form_instances (
  id SERIAL PRIMARY KEY,
  template_id INT NOT NULL,
  submitted_by INT NOT NULL,
  status VARCHAR(255) DEFAULT 'Initializing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pdf_file_path TEXT,
  FOREIGN KEY (template_id) REFERENCES forms_templates (id) ON DELETE CASCADE
);

CREATE TABLE forms_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  pdf_file_path TEXT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fields_metadata JSONB
);


#### Installs
npm i multer 
