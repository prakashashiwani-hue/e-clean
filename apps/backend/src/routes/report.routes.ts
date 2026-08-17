import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const reportRouter = Router();

reportRouter.get("/", requireAuth, ReportController.listReports);
reportRouter.get("/:id", requireAuth, ReportController.getReportById);

export { reportRouter };
