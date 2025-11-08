import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../../types/types";

export async function getDashboardData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) throw { status: 403, message: "User not authorized" };

  const { userId } = req.user as TTokenPayload;
}
