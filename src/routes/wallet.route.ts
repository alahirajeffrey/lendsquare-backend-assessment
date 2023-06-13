import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import "../config/passport.config";
import { createWallet } from "../controllers/wallet.controller";
import { validateCreateWallet } from "../middlewares/validations.middleware";

const walletRouter = Router();

walletRouter.patch(
  "/create-wallet",
  passport.authenticate("jwt", { session: false }),
  validate(validateCreateWallet, {}, {}),
  createWallet
);

export default walletRouter;
