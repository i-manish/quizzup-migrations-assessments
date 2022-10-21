const Sequelize = require("sequelize");

const config = {
  database: process.env.QUIZZUP_DATABASE_NAME,
  username: process.env.QUIZZUP_DATABASE_USER,
  password: process.env.QUIZZUP_DATABASE_PASSWORD,
  host: process.env.QUIZZUP_DATABASE_HOST,
  dialect: "postgres",
};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  Object.assign(config, { host: config.host })
);

module.exports = sequelize;
