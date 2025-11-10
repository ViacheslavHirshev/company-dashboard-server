import { NextFunction, Request, Response } from "express";
import { TTokenPayload } from "../types/types";
import { getRoleName } from "../services/userService";

export const roleAccessMiddlware =
  (...allowed: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { roleId } = req.user as TTokenPayload;
    const roleName = await getRoleName(roleId);

    if (!roleName || !allowed.includes(roleName)) {
      return res.status(403).json({ message: "Forbidden: access denied" });
    }

    next();
  };
