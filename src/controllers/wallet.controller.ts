import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

/**
 * refresh access token
 * @param req
 * @param res
 */
export const createWallet = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "account funded" });
};
