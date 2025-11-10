import { Router } from "express";
import { refreshController } from "./refresh.controller";

const refreshRouter = Router();

refreshRouter.get("/", refreshController);

export default refreshRouter;
