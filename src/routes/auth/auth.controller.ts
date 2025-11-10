import { NextFunction, Request, Response } from "express";
import passport from "passport";
import type { app_user } from "../../../generated/prisma/client";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { createUser, getRoleName } from "../../services/userService";

export async function signUpController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await createUser(firstName, lastName, email, password);
    return res.status(200).json({ message: "User created successfully" });
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
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    passport.authenticate(
      "local-login",
      { session: false },
      async (
        err: Error | null,
        user: app_user,
        info?: { message?: string }
      ) => {
        if (err) {
          return next(err);
        }

        if (!user && info?.message) {
          return res.status(400).json({ message: info.message });
        }

        const { id, firstname, lastname, role_id, avatar } = user;

        const accessToken = generateAccessToken(id, role_id);
        const refreshToken = generateRefreshToken(id, role_id);
        const roleName = await getRoleName(role_id);

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        let avatarPath: string;

        if (avatar) {
          avatarPath = `${baseUrl}/uploads/avatars/${avatar}`;
        } else {
          avatarPath = `${baseUrl}/uploads/fallback.png`;
        }

        res.status(200).json({
          userData: {
            id,
            firstName: firstname,
            lastName: lastname,
            avatar: avatarPath,
            role: roleName,
          },
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
