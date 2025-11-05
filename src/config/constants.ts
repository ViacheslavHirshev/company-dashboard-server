import { config } from "dotenv";

config();

export const PORT = Number(process.env.PORT) || 3000;
export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
