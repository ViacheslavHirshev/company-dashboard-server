import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import { getDashboardData } from "./dashboard.controller";

const userDashboardRouter = Router();

userDashboardRouter.use(jwtAuthMiddleware);

userDashboardRouter.get("/", getDashboardData);

export default userDashboardRouter;
