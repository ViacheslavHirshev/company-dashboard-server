import { Router } from "express";
import { signInController, signUpController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUpController);

authRouter.post("/sign-in", signInController);

export default authRouter;
