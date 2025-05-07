"use strict";

const fs         = require("fs");
const path       = require("path");
const dns        = require("node:dns");
const { Sequelize, DataTypes } = require("sequelize");

dns.setDefaultResultOrder("ipv4first");   

const basename = path.basename(__filename);
const env      = process.env.NODE_ENV || "production";
const config   = require("../config/config.js")[env];

console.log("NODE_ENV      =", env);
console.log("DATABASE_URL  =", process.env.DATABASE_URL);

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    pool: { max: 5, min: 0, idle: 10000 },
    logging: false,          
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      ...config,
      logging: false,
    }
  );
}

const db = {};

db.FormsTemplate = require("./FormsTemplate")(sequelize, DataTypes);

const excludeFiles = ["database.js", "db.js", "list.js", "queries.js"];

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !excludeFiles.includes(file)
  )
  .forEach((file) => {
    console.log(`Loading model: ${file}`);
    const modelFactory = require(path.join(__dirname, file));
    if (typeof modelFactory !== "function") {
      throw new Error(
        `ERROR: ${file} does not export a function! It exports ${typeof modelFactory}`
      );
    }
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
