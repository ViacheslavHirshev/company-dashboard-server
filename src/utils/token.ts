import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/constants";

export function generateAccessToken(userId: number, roleId: number) {
  return jwt.sign({ userId, roleId }, ACCESS_SECRET!, {
    expiresIn: "30m",
  });
}

export function generateRefreshToken(userId: number, roleId: number) {
  return jwt.sign({ userId, roleId }, REFRESH_SECRET!, {
    expiresIn: "5d",
  });
}
