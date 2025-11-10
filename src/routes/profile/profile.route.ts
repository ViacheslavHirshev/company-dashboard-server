import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  changeAvatar,
  updateProfileData,
  changePassword,
  getProfile,
} from "./profile.controller";
import { uploadAvatar } from "../../config/multer";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const profileRouter = Router();

profileRouter.use(jwtAuthMiddleware);
profileRouter.use(roleAccessMiddlware("user", "admin", "superadmin"));

profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfileData);
profileRouter.patch("/", uploadAvatar.single("avatar"), changeAvatar);
profileRouter.put("/password-change", changePassword);

export default profileRouter;

/**
 * @openapi
 * /app/profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's profile information including name, avatar, and role.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     avatar:
 *                       type: string
 *                       example: "https://api.example.com/uploads/avatars/john.png"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /app/profile:
 *   put:
 *     summary: Update user profile data
 *     description: Updates the user's first and last name. Requires authentication.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Michael"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *     responses:
 *       200:
 *         description: Successfully updated user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data updated
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     firstName:
 *                       type: string
 *                       example: "Michael"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *       400:
 *         description: Missing or invalid fields
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /app/profile:
 *   patch:
 *     summary: Update or delete user avatar
 *     description: Uploads a new avatar image or deletes the existing one if `deleteAvatar=true` is provided.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               deleteAvatar:
 *                 type: boolean
 *                 description: Set true to delete the current avatar
 *                 example: false
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: New avatar image file
 *     responses:
 *       200:
 *         description: Avatar updated or deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar updated
 *                 avatar:
 *                   type: string
 *                   example: "https://api.example.com/uploads/avatars/new-avatar.png"
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /app/profile/password-change:
 *   put:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the current and new password.
 *     tags:
 *       - Profile
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
 *                 example: OldPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPass456
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated
 *       400:
 *         description: Missing or invalid fields
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */
