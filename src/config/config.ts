import dotenv from "dotenv";

dotenv.config();

const config = {
  MYSQL_HOST: String(process.env.MYSQL_HOST),
  MYSQL_USER: String(process.env.MYSQL_USER),
  MYSQL_PASSWORD: String(process.env.MYSQL_PASSWORD),
  MYSQL_DATABASE: String(process.env.MYSQL_DATABASE),
  MYSQL_PORT: Number(process.env.MYSQL_PORT),

  NODE_ENV: String(process.env.NODE_ENV),

  JWT_SECRET: process.env.JWT_SECRET || "secret",
  // EXPIRES_IN:
  //   process.env.NODE_ENV == "production" || "development"
  //     ? String(process.env.EXPIRES_IN)
  //     : "30m",

  EXPIRES_IN: process.env.EXPIRES_IN || "1d",
};

export default config;
