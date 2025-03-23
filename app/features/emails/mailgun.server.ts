import formData from "form-data"; // erm..
import Mailgun from "mailgun.js";

import { config } from "~/utils/config.server";

const mailgun = new Mailgun(formData);
export const mailgunClient = mailgun.client({
  username: "api",
  key: config.MAILGUN_API_KEY!,
  url: "https://api.eu.mailgun.net",
});
