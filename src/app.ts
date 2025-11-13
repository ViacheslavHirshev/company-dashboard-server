import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import configurePassport from "./config/passport";
import authRouter from "./routes/auth/auth.route";
import refreshRouter from "./routes/refresh/refresh.route";
import profileRouter from "./routes/profile/profile.route";
import dashboardRouter from "./routes/dashboard/dashboard.route";
import companiesRouter from "./routes/companies/companies.route";
import swaggerDocs from "./config/swagger";
import { PORT } from "./config/constants";
import path from "path";

// import { createUser } from "./services/userService";

const app = express();

configurePassport();

// Express middleware
app.use(express.json());
app.use(cors());

const staticPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(staticPath));

// Authentication
app.use("/refresh", refreshRouter);
app.use("/auth", authRouter);

// App routes
app.use("/profile", profileRouter);
app.use("/dashboard", dashboardRouter);
app.use("/companies", companiesRouter);

// API swagger docs
swaggerDocs(app, PORT);

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
  res.status(err.status || 500).json({ message: err.message });
});

export default app;
