import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ActionFunctionArgs, json } from "@remix-run/node";

import { requireAdmin } from "~/auth.server";
import { config } from "~/utils/config.server";

const R2 = new S3Client({
  region: "auto",
  endpoint: config.CLOUDFLARE_S3_URL,
  credentials: {
    accessKeyId: config.R2_ACCESS_KEY_ID,
    secretAccessKey: config.R2_SECRET_ACCESS_KEY,
  },
});

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const { filename, contentType } = await request.json();

  // Generate a unique filename to prevent collisions
  const uniqueFilename = `${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: uniqueFilename,
    ContentType: contentType,
  });
  console.log(command);

  const preSignedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });

  console.log(preSignedUrl);
  return json({
    preSignedUrl,
    publicUrl: `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`,
  });
}
