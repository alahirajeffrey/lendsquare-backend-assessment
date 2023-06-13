import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { ApiResponse } from "../types/response.type";
import jwt from "jsonwebtoken";
import db from "../knexfile";
import logger from "../helpers/logger";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_SECRET || "refresh_secret";
const ACCESS_EXPIRESIN = process.env.EXPIRESIN || "1d";
const REFRESH_EXPIRESIN = process.env.EXPIRESIN || "1d";

/**
 * check if user exists
 * @param email : string
 */
const checkUserExistsByEmail = async (email: string) => {
  return await db("users").where({ email: email }).first();
};

/**
 * registers a new user
 * @param req : request object containing email and password
 * @param res : response object
 * @returns : status code and message
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // ensure two users cannot register with same email
    const [userExists] = await checkUserExistsByEmail(email);

    // remove later
    logger.log(userExists);

    if (userExists) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "user alreasy exists" });
    }

    // hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // save to db
    await db("users").insert({
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      email: email,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "user registered successfully" });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

/**
 *
 * @param req : request object containing email and password
 * @param res : response object
 * @returns : access token
 */
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password } = req.body;

    //check if user exists
    const userExists = await checkUserExistsByEmail(email);

    // remove later
    logger.log(userExists);

    if (!userExists)
      return res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "user does not exist" });

    // check if password matches
    const passwordMatches = await bcrypt.compare(password, userExists.password);
    if (!passwordMatches) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "incorrect password" });
    }

    // generate access tokens if password match
    const accessToken = jwt.sign({ id: userExists.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_EXPIRESIN,
    });

    // generate refresh tokens
    const refreshToken = jwt.sign({ id: userExists.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_EXPIRESIN,
    });

    return res
      .status(StatusCodes.OK)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error: any) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
