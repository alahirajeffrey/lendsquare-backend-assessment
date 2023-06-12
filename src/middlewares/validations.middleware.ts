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

export const validateFundAccount = {};

export const validateTransfer = {};

export const validateWithdrawal = {};
