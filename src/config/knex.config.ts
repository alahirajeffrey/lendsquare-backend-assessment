import config from "../config/config";
require("ts-node/register");

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      port: config.MYSQL_PORT,
    },
    migrations: {
      directory: "../database/migrations",
    },
    seeds: {
      directory: "../database/seeds",
    },
  },
  testing: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: "../database/migrations",
    },
    seeds: {
      directory: "../database/seeds",
    },
  },
};
