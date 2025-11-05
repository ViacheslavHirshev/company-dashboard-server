import express from "express";
import cors from "cors";
import configurePassport from "./config/passport";
import authRouter from "./routes/auth/auth.route";
import refreshRouter from "./routes/refresh/refresh.route";

const app = express();

configurePassport();

app.use(express.json());
app.use(cors());

app.use("/refresh", refreshRouter);

app.use("/auth", authRouter);

export default app;
