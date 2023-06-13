import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response.type";
import db from "../knexfile";

/**
 * create a wallet for user
 * @param req : request object containing userId
 * @param res : response object
 */
export const createWallet = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { userId } = req.body;
    // check if wallet already exists
    const [walletExists] = await db("wallets")
      .where({ userId: userId })
      .first();
    if (walletExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "you cannot create more than one wallet" });
    }

    // create wallet
    await db("wallets").insert({ userId: userId, balance: 0 });

    return res.status(StatusCodes.OK).json({ message: "wallet created" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
