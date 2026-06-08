const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("\x1b[32m%s\x1b[0m", "Connected to the database successfully");
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "Unable to connect to the database", error);
  }
};

export default connection;
