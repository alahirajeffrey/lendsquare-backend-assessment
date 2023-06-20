import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { ApiResponse } from "../types/response.type";
import jwt from "jsonwebtoken";
import db from "../database/knexfile";
import config from "../config/config";
import * as uuid from "uuid";
import { User } from "../types/user.type";
/**
 * check if user exists
 * @param email : string
 */
const checkUserExistsByEmail = async (email: string): Promise<User> => {
  return await db
    .queryBuilder()
    .select()
    .from("users")
    .where({ email: email })
    .first();
};

/**
 * registers a new user
 * @param req : request object containing email and password
 * @param res : response object
 * @returns : status code, message and user data
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response<ApiResponse>> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // ensure two users cannot register with same email
    const userExists = await checkUserExistsByEmail(email);
    if (userExists) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "user alreasy exists" });
    }

    // hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user: User = {
      id: uuid.v4(),
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
      email: email,
    };

    // save to db
    await db.queryBuilder().insert(user).into("users");

    return res.status(StatusCodes.CREATED).json({
      message: "user registered successfully",
      data: {
        id: user.id,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
      },
    });
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
    const accessToken = jwt.sign(
      { id: userExists.id },
      config.JWT_SECRET || "secret",
      {
        expiresIn: config.EXPIRES_IN || "1d",
      }
    );

    return (
      res.status(StatusCodes.OK).json({ accessToken: accessToken }) || "30m"
    );
  } catch (error: any) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
