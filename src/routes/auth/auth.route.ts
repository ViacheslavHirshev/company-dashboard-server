import { Router } from "express";
import {
  resetPassword,
  signInController,
  signUpController,
} from "./auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUpController);

authRouter.post("/sign-in", signInController);

authRouter.put("/reset-password", resetPassword);

export default authRouter;
