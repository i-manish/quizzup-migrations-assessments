const Sequelize = require("sequelize");

const config = {
  database: process.env.REPORTBEE_DATABASE_NAME,
  username: process.env.REPORTBEE_DATABASE_USER,
  password: process.env.REPORTBEE_DATABASE_PASSWORD,
  host: process.env.REPORTBEE_DATABASE_HOST,
  dialect: "mysql",
};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    operationsAliases: false,
  }
);

module.exports = sequelize;
