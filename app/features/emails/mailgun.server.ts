import formData from "form-data"; // erm..
import Mailgun from "mailgun.js";

import { config } from "~/utils/config.server";

enum EmailTemplates {
  ReplyToComment = "Reply To Comment Email",
  CommentApproved = "commentApproved",
}

const mailgun = new Mailgun(formData);
const mailgunClient = mailgun.client({
  username: "api",
  key: config.MAILGUN_API_KEY!,
  url: "https://api.eu.mailgun.net",
});

export const sendCommentApprovedEmail = async ({
  email,
  commentLink,
}: {
  email: string;
  commentLink: string;
}) => {
  try {
    await mailgunClient.messages.create(config.MAILGUN_DOMAIN, {
      // from: `John Admin <admin@${config.MAILGUN_DOMAIN}>`,
      to: email,
      template: EmailTemplates.CommentApproved,
      "v:commentLink": commentLink,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};
