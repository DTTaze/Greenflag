"use strict";
console.log("\x1b[33m%s\x1b[0m", "models/index.js");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);

require("dotenv").config();

const env = process.env.NODE_ENV || "development";
const configPath = path.resolve(__dirname, "../config/config.js");
const config = require(configPath)[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log("config.use_env_variable = ", config.use_env_variable);
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log("config.database = ", config.database);
  console.log("config.username = ", config.username);
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
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
