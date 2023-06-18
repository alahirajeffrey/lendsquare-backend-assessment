import knex from "knex";
import dotenv from "dotenv";
import config from "../config/config";
import logger from "../helpers/logger";

dotenv.config();

let db;

logger.info(config.NODE_ENV);

if (config.NODE_ENV === "testing") {
  db = knex({
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations",
    },
  });
} else {
  db = knex({
    client: "mysql2",
    connection: {
      debug: true,
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      port: config.MYSQL_PORT,
    },
  });
}

export default db;
