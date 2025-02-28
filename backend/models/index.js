"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// Load our config.js and pick the environment block
const config = require(path.join(__dirname, "..", "config", "config.js"))[env];
const db = {};

// Create a new Sequelize instance using our config.
// If you had a "use_env_variable" approach, you could do that here instead.
let sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, { ...config });

// Read all other model files in this directory, require them, and initialize them.
fs.readdirSync(__dirname)
  .filter((file) => {
    // Skip non-JS files and this index.js itself
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// If any of your models have associations, call them here
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the Sequelize instance plus all models in `db`
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
