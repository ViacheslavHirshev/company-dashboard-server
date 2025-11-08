import { NextFunction, Request, Response } from "express";
import { ACCESS_SECRET, ACCESS_TOKEN_COOKIE_NAME } from "../config/constants";
import jwt from "jsonwebtoken";

export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken: string = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  try {
    if (!accessToken) {
      throw { status: 403, message: "User not authorized" };
    }

    jwt.verify(accessToken, ACCESS_SECRET!, (err, payload) => {
      if (err) throw { status: 403, message: "Verification failed" };

      req.user = payload;
      next();
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
