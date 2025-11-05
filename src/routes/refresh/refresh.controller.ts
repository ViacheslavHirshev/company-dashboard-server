import { NextFunction, Request, Response } from "express";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../../config/constants";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/token";

export function refreshController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken: string = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  try {
    if (!refreshToken) throw { status: 403, message: "Verification error" };

    jwt.verify(
      refreshToken,
      REFRESH_SECRET!,
      (err: Error | null, user: any) => {
        if (err) throw { status: 403, message: "Verification error" };

        const accessToken = generateAccessToken(user.id, user.role_id);
        res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
          httpOnly: true,
          secure: true,
        });

        res
          .status(200)
          .json({ message: "Access token refreshed successfully" });
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
}
