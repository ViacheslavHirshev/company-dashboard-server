import { Router } from "express";
import { refreshController } from "./refresh.controller";

const refreshRouter = Router();

refreshRouter.get("/", refreshController);

export default refreshRouter;

/**
 * @openapi
 * /refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Verifies a valid refresh token and returns a new access token.
 *       The refresh token must be provided in the `Authorization` header as a Bearer token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification error
 *       500:
 *         description: Internal server error
 */
