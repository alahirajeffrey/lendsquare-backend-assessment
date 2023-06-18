import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import {
  createWallet,
  getWalletDetailsWithUserId,
  getWalletDetailsWithWalletId,
} from "../controllers/wallet.controller";
import {
  validateCreateWallet,
  validateGetWalletDetailsWithUserId,
  validateGetWalletDetailsWithWalletId,
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
  validate(validateGetWalletDetailsWithUserId, {}, {}),
  getWalletDetailsWithUserId
);

walletRouter.get(
  "/:walletId",
  passport.authenticate("jwt", { session: false }),
  validate(validateGetWalletDetailsWithWalletId, {}, {}),
  getWalletDetailsWithWalletId
);

export default walletRouter;
