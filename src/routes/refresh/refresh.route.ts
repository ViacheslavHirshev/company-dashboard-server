import { Router } from "express";
import { refreshController } from "./refresh.controller";

const refreshRouter = Router();

/**
 * @openapi
 * /refresh:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token using refresh token
 *     description: |
 *       Requires a valid refresh token passed in the `Authorization` header as `Bearer <refreshToken>`.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <refresh_token>
 *         description: Refresh token in Bearer format
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed successfully
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification error
 */
refreshRouter.get("/", refreshController);

export default refreshRouter;
