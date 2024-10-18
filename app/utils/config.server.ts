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
});

const config = configValidator.parse(process.env);
export { config };
