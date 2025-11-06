import { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { app_user } from "../../../generated/prisma/client";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { createUser } from "../../services/userService";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../../config/constants";

export async function signUpController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }

    await createUser(firstName, lastName, email, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export async function signInController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw new Error("All fields required");

    passport.authenticate(
      "local-login",
      { session: false },
      (err: Error | null, user: app_user, info?: { message?: string }) => {
        if (err) {
          throw err;
        }

        if (!user && info?.message) {
          throw new Error(info.message);
        }

        const { id, firstname, lastname, email, role_id } = user;

        const accessToken = generateAccessToken(id, role_id);
        const refreshToken = generateRefreshToken(id, role_id);

        res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
          httpOnly: true,
          secure: true,
        });

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
          httpOnly: true,
          secure: true,
        });

        res.status(200).json({
          userData: { firstname, lastname, email },
          message: "User successfully loged-in",
        });
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
}
