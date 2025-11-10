import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  adminGetCompanies,
  adminGetCompany,
  userAddNewCompany,
  userDeleteCompany,
  userGetCompanies,
  userGetCompany,
  userUpdateCompanyInfo,
  userUpdateCompanyLogo,
} from "./companies.controller";
import { uploadLogo } from "../../config/multer";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const companiesRouter = Router();

companiesRouter.use(jwtAuthMiddleware);

companiesRouter.get("/", roleAccessMiddlware("user"), userGetCompanies);

companiesRouter.get(
  ["/admin", "/superadmin"],
  roleAccessMiddlware("admin", "superadmin"),
  adminGetCompanies
);

companiesRouter.post(
  "/",
  roleAccessMiddlware("user"),
  uploadLogo.single("logo"),
  userAddNewCompany
);

companiesRouter.get(
  ["/admin/:id", "/superadmin/:id"],
  roleAccessMiddlware("admin", "superadmin"),
  adminGetCompany
);

companiesRouter.get("/:id", roleAccessMiddlware("user"), userGetCompany);

companiesRouter.put("/:id", roleAccessMiddlware("user"), userUpdateCompanyInfo);

companiesRouter.patch(
  "/:id",
  roleAccessMiddlware("user"),
  uploadLogo.single("logo"),
  userUpdateCompanyLogo
);
companiesRouter.delete("/:id", roleAccessMiddlware("user"), userDeleteCompany);

export default companiesRouter;
