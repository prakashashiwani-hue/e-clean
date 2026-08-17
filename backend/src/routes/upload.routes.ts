import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const uploadRouter = Router();

uploadRouter.post("/presign", requireAuth, UploadController.presignUploads);

export { uploadRouter };
