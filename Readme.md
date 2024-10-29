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

### Database Commands
-- Create users table with the updated attributes
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    user_role VARCHAR(50)[]
);

-- Create boards table
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create columns table with a foreign key that points to boards
CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    board_id INT REFERENCES boards(id) ON DELETE CASCADE
);

-- Create tasks table with a foreign key that points to columns
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    column_id INT REFERENCES columns(id) ON DELETE CASCADE,
    title VARCHAR(100),
    description TEXT NOT NULL
);
