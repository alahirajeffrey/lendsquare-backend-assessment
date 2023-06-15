import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import {
  createWallet,
  getWalletDetailsWithUserId,
} from "../controllers/wallet.controller";
import {
  validateCreateWallet,
  validateGetWalletDetails,
} from "../middlewares/validations.middleware";

const walletRouter = Router();

walletRouter.post(
  "/create-wallet",
  passport.authenticate("jwt", { session: false }),
  validate(validateCreateWallet, {}, {}),
  createWallet
);

walletRouter.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  validate(validateGetWalletDetails, {}, {}),
  getWalletDetailsWithUserId
);

export default walletRouter;
