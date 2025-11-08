import { Router } from "express";
import { signInController, signUpController } from "./auth.controller";

const authRouter = Router();

/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User sign-up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: User was created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Empty field(s)
 *       500:
 *         description: Internal server error
 */
authRouter.post("/sign-up", signUpController);

/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User sign-in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successfull
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignInResponse'
 *       401:
 *         description: Wrong email or password
 */

authRouter.post("/sign-in", signInController);

export default authRouter;

/**
 * @openapi
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *
 *     SignInRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *
 *     SignInResponse:
 *       type: object
 *       properties:
 *         userData:
 *           type: object
 *           properties:
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *             email:
 *               type: string
 *         message:
 *           type: string
 *           example: User successfully loged-in
 *
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User created successfully
 */
