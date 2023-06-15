import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import db from "../knexfile";
import { ApiResponse } from "../types/response.type";

/**
 * get all a wallet's transactions
 * @param req : request object with walletId as params
 * @param res : response object
 */
export const getWalletTransactions = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { walletId } = req.params;

    // Check to see if wallet extists
    const walletExists = await db
      .queryBuilder()
      .select()
      .from("wallets")
      .where({ id: walletId })
      .first();

    if (!walletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "wallet does not exist" });
    }

    // get transactions
    const transactions = await db
      .queryBuilder()
      .select()
      .from("transactions")
      .where({ senderWalletId: walletId });

    return res
      .status(StatusCodes.OK)
      .json({ message: "transaction details", data: { transactions } });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
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
    //Check current account balance
    //update account balance

    return res.status(StatusCodes.OK).json({ message: "account funded" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *  transfer funds to another user
 * @param req
 * @param res
 */
export const transferFunds = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    //check if sender and reciever's wallets exist
    // get sender's and reciever's balances
    // check if user has sufficient balance
    // determine current balance of both sender and reciepient
    // use transactions scoping to update sender's abnd reciepient's accounts
    return res.status(StatusCodes.OK).json({ message: "transfer successful" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *  withdraw funds
 * @param req
 * @param res
 */
export const withdrawal = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    // check if wallet exists
    // check if user has sufficient balance
    // determing balance after withdrawal
    // update account
    return res
      .status(StatusCodes.OK)
      .json({ message: "withdrawal successful" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
