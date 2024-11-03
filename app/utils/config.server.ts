/*
 * Get the config from environment and validate that it is correct
 */

import { z } from "zod";

const configValidator = z.object({
  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),

  // Contentful stuff
  SPACE_ID: z.string(),
  CDA_TOKEN: z.string(),
  PREVIEW_TOKEN: z.string(),

  // BlueSky
  BLUESKY_USERNAME: z.string(),
  BLUESKY_PASSWORD: z.string(),

  CLOUDFLARE_R2_TOKEN: z.string(),

  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_S3_URL: z.string(),
});

const config = configValidator.parse(process.env);
export { config };
