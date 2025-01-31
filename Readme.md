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
