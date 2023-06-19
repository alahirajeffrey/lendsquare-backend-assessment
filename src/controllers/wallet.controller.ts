import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { ApiResponse } from "../types/response.type";
import db from "../database/knexfile";
import { Wallet } from "../types/wallet.type";
import * as uuid from "uuid";

/**
 * checks if a user has a wallet with user id
 * @param userId : string
 * @returns : null or wallet details
 */
const checkWalletExistsWithUserId = async (userId: string): Promise<Wallet> => {
  return await db
    .queryBuilder()
    .select()
    .from("wallets")
    .where({ userId: userId })
    .first();
};

/**
 * checks if a user has a wallet with wallet id
 * @param userId : string
 * @returns : null or wallet details
 */
const checkWalletExistsWithWalletId = async (
  walletId: string
): Promise<Wallet> => {
  return await db
    .queryBuilder()
    .select()
    .from("wallets")
    .where({ id: walletId })
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
    const walletExists = await checkWalletExistsWithUserId(userId);
    if (walletExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "you cannot create more than one wallet" });
    }

    // create wallet
    const walletId = uuid.v4();
    await db
      .queryBuilder()
      .insert({
        userId: userId,
        balance: 0,
        id: walletId,
      })
      .into("wallets");

    return res.status(StatusCodes.CREATED).json({
      message: "wallet created",
      data: {
        id: walletId,
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
    const walletExists = await checkWalletExistsWithUserId(userId);
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

/**
 *  get wallet details via wallet id
 * @param req: request object containing userId params
 * @param res: response object
 */
export const getWalletDetailsWithWalletId = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { walletId } = req.params;

    // check if wallet exists
    const walletExists = await checkWalletExistsWithWalletId(walletId);
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
