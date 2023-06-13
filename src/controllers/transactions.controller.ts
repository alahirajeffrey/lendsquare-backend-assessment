import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

/**
 * refresh access token
 * @param req
 * @param res
 */
export const fundAccount = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "account funded" });
};

export const transferFunds = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "transfer successful" });
};

export const withdrawal = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "withdrawal successful" });
};
