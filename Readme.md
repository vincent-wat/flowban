# Flowban

### how to run 
##### backend
- cd backend
- node server.js
#### for database connection
- create your database in local machine for now
- check for new install under at the bottom of this file
- Create a .env file and add the following to the .env file:
DB_NAME=FlowBan
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_DIALECT=postgres
PORT=5432

- change DB_NAME to whatever you name your db and add in information for user and password
- Once you complete modifing the .env run this command : node testConnection.js

### New installs / packages 
- npm install sequelize pg pg-hstore
- npm install dotenv
------



##### frontend
- cd frontend
- npm install
- npm start
### color scheme
- C51D34
- 2E2E30
- 808080
- F5F5F5
### New installs / packages
- npm install react-router-dom
- npm i axios

### Database Commands

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_role VARCHAR(50)[]
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

## Commands to add some basic users
INSERT INTO users (email, password, phone_number, first_name, last_name, user_role)
VALUES 
('alice.smith@example.com', 'password123', '123-456-7890', 'Alice', 'Smith', ARRAY['admin']),
('bob.jones@example.com', 'password456', '234-567-8901', 'Bob', 'Jones', ARRAY['user']),
('carol.white@example.com', 'password789', '345-678-9012', 'Carol', 'White', ARRAY['editor']),
('dave.miller@example.com', 'password321', '456-789-0123', 'Dave', 'Miller', ARRAY['admin']),
('eve.johnson@example.com', 'password654', '567-890-1234', 'Eve', 'Johnson', ARRAY['user']),
('frank.brown@example.com', 'password987', '678-901-2345', 'Frank', 'Brown', ARRAY['editor']),
('grace.wilson@example.com', 'password135', '789-012-3456', 'Grace', 'Wilson', ARRAY['user']),
('henry.moore@example.com', 'password246', '890-123-4567', 'Henry', 'Moore', ARRAY['admin']),
('irene.taylor@example.com', 'password369', '901-234-5678', 'Irene', 'Taylor', ARRAY['user']),
('jackie.anderson@example.com', 'password111', '012-345-6789', 'Jackie', 'Anderson', ARRAY['editor']);

