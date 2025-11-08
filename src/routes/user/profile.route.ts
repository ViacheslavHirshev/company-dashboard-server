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

userProfileRouter.get("/", getUserData);
userProfileRouter.post(
  "/profile-change",
  uploadAvatar.single("avatar"),
  changeUserData
);
userProfileRouter.post("/password-change", changeUserPassword);

export default userProfileRouter;
