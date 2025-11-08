import { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { app_user } from "../../../generated/prisma/client";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { createUser } from "../../services/userService";

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
    res.status(200).json({ message: "User created successfully" });
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
          return next(err);
        }

        if (!user && info?.message) {
          return res.status(400).json({ message: info.message });
        }

        const { id, firstname, lastname, role_id, avatar } = user;

        const accessToken = generateAccessToken(id, role_id);
        const refreshToken = generateRefreshToken(id, role_id);

        res.status(200).json({
          userData: { id, firstname, lastname, avatar },
          tokens: {
            accessToken,
            refreshToken,
          },
          message: "User successfully loged-in",
        });
      }
    )(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
