import knex from "knex";
import dotenv from "dotenv";
import config from "./config/config";

dotenv.config();

const db = knex({
  client: "mysql",
  connection: {
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    port: config.MYSQL_PORT,
  },
});

export default db;
