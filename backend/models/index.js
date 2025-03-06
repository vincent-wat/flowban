"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "..", "config", "config.js"))[env];

const db = {
  
};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
});

db.FormsTemplate = require("./FormsTemplate")(sequelize, Sequelize.DataTypes);

const excludeFiles = ["database.js", "db.js", "list.js", "task.js", "queries.js"];

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && 
      file !== basename && 
      file.slice(-3) === ".js" &&
      !excludeFiles.includes(file) 
    );
  })
  .forEach((file) => {
    console.log(`Loading model: ${file}`); 

    const modelDef = require(path.join(__dirname, file));

    if (typeof modelDef !== "function") {
      throw new Error(`ERROR: ${file} does not export a function! It exports ${typeof modelDef}`);
    }

    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set Up Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export Sequelize Instance & Models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

