import { Router } from "express";
import { validate } from "express-validation";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../middlewares/validations.middleware";
import { registerUser, loginUser } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(validateRegisterUser, {}, {}),
  registerUser
);

authRouter.post("/login", validate(validateLoginUser, {}, {}), loginUser);

export default authRouter;
