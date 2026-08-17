import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "db/client";

export class ReportController {
  public static async listReports(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const reports = await prisma.report.findMany({
        where: userId ? { userId } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          images: true,
          cleanup: true,
          verification: true,
        },
      });

      return res.json({ success: true, count: reports.length, data: reports });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getReportById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const report = await prisma.report.findUnique({
        where: { id },
        include: {
          images: true,
          cleanup: true,
          verification: true,
        },
      });

      if (!report) {
        return res.status(404).json({ success: false, error: "Report not found" });
      }

      return res.json({ success: true, data: report });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
