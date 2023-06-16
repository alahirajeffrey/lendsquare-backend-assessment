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

export const validateCreateWallet = {
  body: Joi.object({
    userId: Joi.string().uuid().required(),
  }),
};

export const validateGetWalletDetails = {
  params: Joi.object({
    userId: Joi.string().uuid().required(),
  }),
};

export const validateGetWalletTransactions = {
  params: Joi.object({
    walletId: Joi.string().uuid().required(),
  }),
};

export const validateWithdrawal = {
  body: Joi.object({
    amount: Joi.number().required(),
  }),
  params: Joi.object({
    walletId: Joi.string().uuid().required(),
  }),
};

export const validateTransfer = {
  body: Joi.object({
    amount: Joi.number().required(),
  }),
  params: Joi.object({
    senderWalletId: Joi.string().uuid().required(),
    receiverWalletId: Joi.string().uuid().required(),
  }),
};
