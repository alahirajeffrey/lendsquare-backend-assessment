import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import db from "../knexfile";
import { ApiResponse } from "../types/response.type";
import { Wallet } from "../types/wallet.type";
import * as uuid from "uuid";
import logger from "../helpers/logger";

/**
 *
 * @param walletId : string
 * @returns : wallet object or null
 */
const checkWalletExists = async (walletId: string): Promise<Wallet> => {
  return await db
    .queryBuilder()
    .select()
    .from("wallets")
    .where({ id: walletId })
    .first();
};
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
    const walletExists = await checkWalletExists(walletId);
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
      .json({ message: "transaction details", data: transactions });
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
    const walletExists = await checkWalletExists(walletId);
    if (!walletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "wallet does not exist" });
    }

    //Check current account balance and calculate new balance
    const walletBalance = walletExists.balance;
    const balanceAfterFunding = amount + walletBalance;

    // start database transaction
    db.transaction(async (trx) => {
      try {
        //update account balance
        await trx
          .queryBuilder()
          .where("id", walletId)
          .update({ balance: balanceAfterFunding });

        // create transaction object
        const transactionDetails = {
          id: uuid.v4(),
          senderWalletId: walletExists.id,
          recieverWalletId: null,
          transactionType: "fund",
        };

        // save wallet transaction to db
        await trx.queryBuilder().insert(transactionDetails);

        await trx.commit();
        logger.info("Transaction committed successfully");
      } catch (error: any) {
        await trx.rollback();
        logger.error(`Knex transaction failed : ${error.messager}`);
      }
    });

    return res.status(StatusCodes.OK).json({ message: "account funded" });
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
    const walletId = req.params.walletId;
    const { amount } = req.body;

    // check if wallet exists
    const walletExists = await checkWalletExists(walletId);
    if (!walletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "wallet does not exist" });
    }

    // check if user has sufficient balance
    const walletBalance = walletExists.balance;
    if (walletBalance > amount) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "insufficient balance" });
    }

    // determing balance after withdrawal
    const balanceAfterWithdrawal = walletBalance - amount;

    // start database transaction
    db.transaction(async (trx) => {
      try {
        // update wallet balance
        await trx
          .queryBuilder()
          .update({ balance: balanceAfterWithdrawal })
          .where("id", walletExists.id);

        // save transaction to database
        // create transaction object
        const transactionDetails = {
          id: uuid.v4(),
          senderWalletId: walletExists.id,
          recieverWalletId: null,
          transactionType: "withdrawal",
        };

        // save wallet transaction to db
        await trx.queryBuilder().insert(transactionDetails);

        // commit database transaction
        await trx.commit();
        logger.info("Transaction committed successfully");
      } catch (error: any) {
        await trx.rollback();
        logger.error(`Knex transaction failed : ${error.messager}`);
      }
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "withdrawal successful" });
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
    const { senderWalletId, recieverWalletId } = req.params;
    const { amount } = req.body;
    //check if sender and reciever's wallets exist
    const senderWalletExists = await checkWalletExists(senderWalletId);
    if (!senderWalletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "wallet does not exist" });
    }

    const recieverWalletExists = await checkWalletExists(recieverWalletId);
    if (!recieverWalletExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "reciever's wallet does not exist" });
    }

    // get sender's and reciever's balances
    const senderWalletBalance = senderWalletExists.balance;
    const recieverWalletBalance = recieverWalletExists.balance;

    // check if user has sufficient balance
    if (amount > senderWalletBalance) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "insufficient balance" });
    }

    // determine current balance of both sender and reciepient
    const senderWalletBalanceAfterTransfer = senderWalletBalance - amount;
    const recieverWalletBalanceAfterTransfer = recieverWalletBalance + amount;

    // use transactions scoping to update sender's abnd reciepient's accounts
    db.transaction(async (trx) => {
      try {
        // update wallet balances
        await trx
          .queryBuilder()
          .update({ balance: senderWalletBalanceAfterTransfer })
          .where("id", senderWalletId);

        await trx
          .queryBuilder()
          .update({ balance: recieverWalletBalanceAfterTransfer })
          .where("id", recieverWalletId);

        // create transaction object
        const transactionDetails = {
          id: uuid.v4(),
          senderWalletId: senderWalletId,
          recieverWalletId: recieverWalletId,
          transactionType: "transfer",
        };

        // save wallet transaction to db
        await trx.queryBuilder().insert(transactionDetails);

        // commit database transaction
        await trx.commit();
        logger.info("Transaction committed successfully");
      } catch (error: any) {
        await trx.rollback();
        logger.error(`Knex transaction failed : ${error.messager}`);
      }
    });
    return res.status(StatusCodes.OK).json({ message: "transfer successful" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
