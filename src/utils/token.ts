import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/constants";

export function generateAccessToken(id: number, role_id: number) {
  return jwt.sign({ id, role_id }, ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(id: number, role_id: number) {
  return jwt.sign({ id, role_id }, REFRESH_SECRET!, {
    expiresIn: "5d",
  });
}
