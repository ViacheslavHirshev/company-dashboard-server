import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  getAllCompanies,
  getAllUsers,
  getAllAdmins,
  createAdmin,
  changeUser,
  getDashboard,
  getUserById,
  deleteUserById,
} from "./dashboard.controller";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const dashboardRouter = Router();

dashboardRouter.use(jwtAuthMiddleware);

dashboardRouter.get("/", roleAccessMiddlware("user"), getDashboard);

dashboardRouter.get(
  "/admin/users",
  roleAccessMiddlware("admin", "superadmin"),
  getAllUsers
);

dashboardRouter.get(
  "/admin/companies",
  roleAccessMiddlware("admin", "superadmin"),
  getAllCompanies
);

dashboardRouter.get(
  "/admin/users/:id",
  roleAccessMiddlware("admin", "superadmin"),
  getUserById
);

dashboardRouter.delete(
  "/admin/users/:id",
  roleAccessMiddlware("admin", "superadmin"),
  deleteUserById
);

dashboardRouter.put(
  "/admin/users/:id",
  roleAccessMiddlware("admin", "superadmin"),
  changeUser
);

dashboardRouter.get(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  getAllAdmins
);

dashboardRouter.post(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  createAdmin
);

export default dashboardRouter;
