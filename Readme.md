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

### New installs / packages
- npm install react-router-dom


