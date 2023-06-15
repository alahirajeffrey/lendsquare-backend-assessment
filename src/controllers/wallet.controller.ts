import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response.type";
import db from "../knexfile";
import { Wallet } from "../types/wallet.type";
import * as uuid from "uuid";
import logger from "../helpers/logger";

/**
 * checks if a user already has a wallet
 * @param userId : string
 * @returns : null or wallet details
 */
const checkWalletExists = async (userId: string): Promise<Wallet> => {
  return await db
    .queryBuilder()
    .select()
    .from("wallets")
    .where({ userId: userId })
    .first();
};
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

    // ensure only one wallet can be created per user
    const walletExists = await checkWalletExists(userId);
    if (walletExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "you cannot create more than one wallet" });
    }

    // create wallet
    const walletId = uuid.v4();
    await db("wallets").insert({
      userId: userId,
      balance: 0,
      id: walletId,
    });

    return res.status(StatusCodes.OK).json({
      message: "wallet created",
      data: {
        walletId: walletId,
        balance: 0,
      },
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *  get wallet details via user id
 * @param req: request object containing userId params
 * @param res: response object
 */
export const getWalletDetailsWithUserId = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { userId } = req.params;

    // check if wallet exists
    const walletExists = await checkWalletExists(userId);
    if (!walletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "wallet does not exist" });
    }
    return res.status(StatusCodes.OK).json({
      message: "wallet found",
      data: {
        id: walletExists.id,
        balance: walletExists.balance,
        createdAt: walletExists.createdAt,
      },
    });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
