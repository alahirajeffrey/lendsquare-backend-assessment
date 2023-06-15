import { Joi } from "express-validation";

export const validateRegisterUser = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const validateLoginUser = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const validateFundAccount = {
  body: Joi.object({
    amount: Joi.number().required(),
  }),
  params: Joi.object({
    walletId: Joi.string().uuid().required(),
  }),
};

export const validateTransfer = {};

export const validateWithdrawal = {};

export const validateCreateWallet = {
  body: Joi.object({
    userId: Joi.string().uuid().required(),
  }),
};

export const validateGetWalletDetails = {
  params: Joi.object({
    walletId: Joi.string().uuid().required(),
  }),
};
