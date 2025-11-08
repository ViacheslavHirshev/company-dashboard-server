import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../../types/types";

export async function getDashboardData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.user as TTokenPayload;
}
