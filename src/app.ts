import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import configurePassport from "./config/passport";
import authRouter from "./routes/auth/auth.route";
import refreshRouter from "./routes/refresh/refresh.route";
import { createUser } from "./services/userService";
import userProfileRouter from "./routes/user/profile.route";
import userDashboardRouter from "./routes/user/dashboard.route";
import userCompaniesRouter from "./routes/user/companies.route";
import adminProfileRouter from "./routes/admin/adminProfile.route";
import adminDashboardRouter from "./routes/admin/adminDashboard.route";
import adminCompaniesRouter from "./routes/admin/adminCompanies.route";
import superadminProfileRouter from "./routes/superadmin/superadminProfile.route";
import superadminDashboardRouter from "./routes/superadmin/superadminDashboard.route";
import superadminCompaniesRouter from "./routes/superadmin/superadminCompanies.route";

// ADD prisma typesafety
// ADD repository pattern
// ADD service functions for statistics
// ADD controlers to routes

const app = express();

configurePassport();

// Express middleware
app.use(express.json());
app.use(cors());

// Authentication
app.use("/refresh", refreshRouter);
app.use("/auth", authRouter);

// User routes
app.use("/app/profile", userProfileRouter);
app.use("/app/dashboard", userDashboardRouter);
app.use("/app/companies", userCompaniesRouter);

// Admin routes
app.use("/admin/profile", adminProfileRouter);
app.use("/admin/dashboard", adminDashboardRouter);
app.use("/admin/companies", adminCompaniesRouter);

//Superadmin routes
app.use("/superadmin/profile", superadminProfileRouter);
app.use("/superadmin/dashboard", superadminDashboardRouter);
app.use("/superadmin/companies", superadminCompaniesRouter);

// <---------- FOR FRESH SERVER START ---------->
// createUser(
//   "Super",
//   "Admin",
//   "superadmin@gmail.com",
//   "superpassword",
//   "superadmin"
// );
// <---------- FOR FRESH SERVER START ----------/>

// App level error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({ error: { message: err.message } });
});

export default app;
