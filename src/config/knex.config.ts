import dotenv from "dotenv";

dotenv.config();

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "mysql",
      password: process.env.MYSQL_PASSWORD || "password",
      database: process.env.MYSQL_DATABASE || "test",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
  // Add other environments if needed (e.g., production, testing)
};
