const Sequelize = require("sequelize");

const databaseName = "DabneyBackbone";

const db = new Sequelize(
  databaseName,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);
module.exports = db;
