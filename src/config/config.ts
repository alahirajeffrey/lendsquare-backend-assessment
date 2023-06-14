import dotenv from "dotenv";

dotenv.config();

const config = {
  MYSQL_HOST: String(process.env.MYSQL_HOST),
  MYSQL_USER: String(process.env.MYSQL_USER),
  MYSQL_PASSWORD: String(process.env.MYSQL_PASSWORD),
  MYSQL_DATABASE: String(process.env.MYSQL_DATABASE),
  MYSQL_PORT: Number(process.env.MYSQL_PORT),

  JWT_SECRET: String(process.env.JWT_SECRET),
  EXPIRES_IN: String(process.env.EXPIRES_IN),
};

export default config;
