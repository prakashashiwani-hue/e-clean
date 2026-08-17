import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/env";

const client = config.s3Bucket
  ? new S3Client({
      region: config.s3Region,
      credentials:
        config.s3AccessKeyId && config.s3SecretAccessKey
          ? {
              accessKeyId: config.s3AccessKeyId,
              secretAccessKey: config.s3SecretAccessKey,
            }
          : undefined,
    })
  : null;

export const S3Service = {
  isConfigured(): boolean {
    return Boolean(client && config.s3Bucket && config.s3AccessKeyId);
  },

  publicUrl(key: string): string {
    if (config.s3PublicUrl) {
      return `${config.s3PublicUrl.replace(/\/+$/, "")}/${key}`;
    }
    return `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${key}`;
  },

  async presignUploads(params: {
    contentType: string;
    count: number;
    userId: string;
    ext: string;
  }): Promise<{ key: string; uploadUrl: string; url: string }[]> {
    const { contentType, count, userId, ext } = params;
    const uploads: { key: string; uploadUrl: string; url: string }[] = [];

    for (let i = 0; i < count; i++) {
      const key = `reports/${crypto.randomUUID()}.${ext}`;
      const uploadUrl = await getSignedUrl(
        client!,
        new PutObjectCommand({
          Bucket: config.s3Bucket,
          Key: key,
          ContentType: contentType,
          Metadata: { userId },
        }),
        { expiresIn: 600 }
      );
      uploads.push({ key, uploadUrl, url: this.publicUrl(key) });
    }

    return uploads;
  },
};
