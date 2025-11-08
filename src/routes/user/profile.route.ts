import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  changeUserData,
  changeUserPassword,
  getUserData,
} from "./profile.controller";
import { uploadAvatar } from "../../config/multer";

const userProfileRouter = Router();

userProfileRouter.use(jwtAuthMiddleware);

/**
 * @openapi
 * /app/profile:
 *   get:
 *     tags:
 *       - User Profile
 *     summary: Get user data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: User not found
 */
userProfileRouter.get("/", getUserData);

/**
 * @openapi
 * /app/profile/profile-change:
 *   post:
 *     tags:
 *       - User Profile
 *     summary: Change firstName, lastName or avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized request
 */
userProfileRouter.post(
  "/profile-change",
  uploadAvatar.single("avatar"),
  changeUserData
);

/**
 * @openapi
 * /app/profile/password-change:
 *   post:
 *     tags:
 *       - User Profile
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdateResponse'
 *       401:
 *         description: Current password incorrect or user not authorized
 */
userProfileRouter.post("/password-change", changeUserPassword);

export default userProfileRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         role_id:
 *           type: integer
 *
 *     UserUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User data updated
 *         user:
 *           $ref: '#/components/schemas/User'
 */
