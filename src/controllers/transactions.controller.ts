import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import db from "../knexfile";
import { ApiResponse } from "../types/response.type";

/**
 * fund user account
 * @param req
 * @param res
 */
export const fundAccount = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const walletId = req.params.walletId;
    const { amount } = req.body;

    // check if wallet exists
    const [walletExists] = await db("wallets").where({ walletId: walletId });
    if (!walletExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "you cannot fund an account that does not exitst" });
    }

    // fund account
    await db("wallets")
      .where({ walletId: walletId })
      .update({ balance: amount });

    return res.status(StatusCodes.OK).json({ message: "account funded" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *
 * @param req
 * @param res
 */
export const transferFunds = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "transfer successful" });
};

/**
 *
 * @param req
 * @param res
 */
export const withdrawal = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "withdrawal successful" });
};
