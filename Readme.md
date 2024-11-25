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

