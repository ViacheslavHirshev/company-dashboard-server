import { NextFunction, Request, Response } from "express";
import { ACCESS_SECRET } from "../config/constants";
import jwt from "jsonwebtoken";

export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const accessToken: string | null = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

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
