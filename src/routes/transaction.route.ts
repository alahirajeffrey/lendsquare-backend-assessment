import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import {
  fundAccount,
  getWalletTransactions,
  transferFunds,
  withdrawal,
} from "../controllers/transactions.controller";
import {
  validateFundAccount,
  validateGetWalletTransactions,
  validateTransfer,
  validateWithdrawal,
} from "../middlewares/validations.middleware";

const transactionRouter = Router();

transactionRouter.get(
  "/wallet/:walletId",
  passport.authenticate("jwt", { session: false }),
  validate(validateGetWalletTransactions, {}, {}),
  getWalletTransactions
);

transactionRouter.patch(
  "/fund-account/wallet/:walletId",
  passport.authenticate("jwt", { session: false }),
  validate(validateFundAccount, {}, {}),
  fundAccount
);

transactionRouter.patch(
  "/transfer/wallet/:senderWalletId/:receiverWalletId",
  passport.authenticate("jwt", { session: false }),
  validate(validateTransfer, {}, {}),
  transferFunds
);

transactionRouter.patch(
  "/withdrawal/wallet/:walletId",
  passport.authenticate("jwt", { session: false }),
  validate(validateWithdrawal, {}, {}),
  withdrawal
);

export default transactionRouter;
