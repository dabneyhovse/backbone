const Sequelize = require("sequelize");

const databaseName = "DabneyBackbone";

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false,
  }
);
module.exports = db;
