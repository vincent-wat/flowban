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

### sequelize stuff

- **Migrations**
  - npm install --save-dev sequelize-cli (To install sequelize)
  - npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string (Generates model file)
  - npx sequelize-cli db:migrate (runs all migration file)
  - npx sequelize-cli db:migrate:undo (undo all migrations)

- **Seeders**
  - npx sequelize-cli seed:generate --name demo-user (Generates seeder file)
  - npx sequelize-cli db:seed:all (adds seed to Database)
  - npx sequelize-cli db:seed:undo:all (Undo all seeding)


#### Installs
npm i multer 

## SSL Instructions
On macOS:
    Open Keychain Access (Cmd + Space, type "Keychain Access").
    Go to System → Certificates.
    Click File → Import Items
    Import localhost.crt
    Double-click it, expand *Trust*, and set **Always Trust**.

On Windows:
    Open Run (Win + R), type mmc, and press Enter.
    Go to File → Add/Remove Snap-in.
    Select Certificates → Computer Account → Next → Local Computer → Finish.
    In Certificates (Local Computer), expand Trusted Root Certification Authorities → Certificates.
    Right-click, choose Import, and select localhost.crt.