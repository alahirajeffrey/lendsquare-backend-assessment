import express, { Express, Request, Response } from "express";
import limiter from "./middlewares/rateLimiter.middleware";
import authRouter from "./routes/auth.route";
import walletRouter from "./routes/wallet.route";
import transactionRouter from "./routes/transaction.route";
import helmet from "helmet";

const server: Express = express();

server.use(express.json());
// setup rate limiter
server.use(limiter);
// setup helmet
server.use(helmet());

// setup routes here
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/wallet", walletRouter);
server.use("/api/v1/transaction", transactionRouter);

server.get("/api/v1/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "welcome" });
});

export default server;
