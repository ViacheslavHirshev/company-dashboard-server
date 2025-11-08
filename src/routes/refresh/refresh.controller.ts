import { NextFunction, Request, Response } from "express";
import { REFRESH_SECRET } from "../../config/constants";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../utils/token";

export function refreshController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const refreshToken: string | null = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  try {
    if (!refreshToken)
      return res.status(403).json({ message: "Verification error" });

    jwt.verify(
      refreshToken,
      REFRESH_SECRET!,
      (err: Error | null, user: any) => {
        if (err) return next(err);

        const accessToken = generateAccessToken(user.id, user.role_id);

        res.status(200).json({
          message: "Access token refreshed",
          accessToken,
        });
      }
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
}
