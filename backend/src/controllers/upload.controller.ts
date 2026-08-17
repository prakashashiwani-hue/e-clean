import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { S3Service } from "../services/s3.service";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

export class UploadController {
  public static async presignUploads(req: AuthenticatedRequest, res: Response) {
    try {
      const contentType = (req.body?.contentType as string) ?? "image/jpeg";
      const count = Math.min(Math.max(Number(req.body?.count) || 1, 1), 5);

      const ext = ALLOWED_TYPES[contentType];
      if (!ext) {
        return res
          .status(400)
          .json({ success: false, error: `Unsupported content type: ${contentType}` });
      }

      if (!S3Service.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: "S3 is not configured. Add S3_* vars to backend/.env",
        });
      }

      const uploads = await S3Service.presignUploads({
        contentType,
        count,
        userId: req.user!.id,
        ext,
      });

      return res.json({ success: true, uploads });
    } catch (error: any) {
      console.error("presign failed:", error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to create upload URLs" });
    }
  }
}
