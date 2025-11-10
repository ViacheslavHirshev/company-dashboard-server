import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  getDashboardCompanies,
  getDashboardUsers,
  getDashboardAdmins,
  postDashboardAdmin,
  putDashboardAdmin,
  getDashboard,
  getDashboardAdmin,
  deleteDashboardAdmin,
} from "./dashboard.controller";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const dashboardRouter = Router();

dashboardRouter.use(jwtAuthMiddleware);

dashboardRouter.get("/", roleAccessMiddlware("user"), getDashboard);

dashboardRouter.get(
  ["/admin/users", "/superadmin/users"],
  roleAccessMiddlware("admin", "superadmin"),
  getDashboardUsers
);

dashboardRouter.get(
  ["/admin/companies", "/superadmin/companies"],
  roleAccessMiddlware("admin", "superadmin"),
  getDashboardCompanies
);

dashboardRouter.get(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  getDashboardAdmins
);

dashboardRouter.post(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  postDashboardAdmin
);

dashboardRouter.get(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  getDashboardAdmin
);

dashboardRouter.put(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  putDashboardAdmin
);

dashboardRouter.delete(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  deleteDashboardAdmin
);

export default dashboardRouter;
