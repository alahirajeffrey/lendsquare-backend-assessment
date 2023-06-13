import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

const db = knex({
  client: "mysql2",
  connection: {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "mysql",
    password: process.env.MYSQL_PASSWORD || "password",
    database: process.env.MYSQL_DATABASE || "test",
    port: 3306,
  },
});

export default db;
