import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import {
  fundAccount,
  transferFunds,
  withdrawal,
} from "../controllers/transactions.controller";
import {
  validateFundAccount,
  validateTransfer,
  validateWithdrawal,
} from "../middlewares/validations.middleware";

const transactionRouter = Router();

transactionRouter.patch(
  "/fund-account",
  passport.authenticate("jwt", { session: false }),
  validate(validateFundAccount, {}, {}),
  fundAccount
);

transactionRouter.patch(
  "/transfer",
  passport.authenticate("jwt", { session: false }),
  validate(validateTransfer, {}, {}),
  transferFunds
);

transactionRouter.patch(
  "/withdrawal",
  passport.authenticate("jwt", { session: false }),
  validate(validateWithdrawal, {}, {}),
  withdrawal
);

export default transactionRouter;
