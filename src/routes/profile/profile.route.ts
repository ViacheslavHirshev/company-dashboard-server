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
