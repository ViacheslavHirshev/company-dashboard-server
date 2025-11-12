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

  if (!accessToken) {
    throw { status: 401, message: "User not authorized" };
  }

  try {
    jwt.verify(accessToken, ACCESS_SECRET!, (err, payload) => {
      if (err) throw { status: 401, message: "Access token outdated" };

      req.user = payload;
      next();
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
