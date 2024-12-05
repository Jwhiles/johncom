import { ActionFunctionArgs, json } from "@remix-run/node";
import { validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { z } from "zod";

import { prisma } from "~/db.server";
import { sendNewCommentsEmail } from "~/features/emails/mailgun.server";
import { sanitiseHtml } from "~/features/markdown/index.server";

const CommentSchema = z.object({
  content: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  responseToId: z.string().optional(),
  reallyDifficultCaptcha: z.union([
    z.literal("horse", {
      errorMap: () => ({ message: "I think you spelt something wrong" }),
    }),
    z.literal("dog", {
      errorMap: () => ({ message: "I think you spelt something wrong" }),
    }),
    z.literal("elephant", {
      errorMap: () => ({ message: "I think you spelt something wrong" }),
    }),
  ]),
});
export const validator = withZod(CommentSchema);

export async function action({ params, request }: ActionFunctionArgs) {
  if (!params.post_slug) {
    throw new Error("no post id");
  }

  const result = await validator.validate(await request.formData());
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const comments = await prisma.comment.create({
    data: {
      approved: true,
      content: sanitiseHtml(result.data.content),
      authorEmail: result.data.email,
      post: {
        connect: {
          slug: params.post_slug,
        },
      },
      name: result.data.name,
      ...(result.data.responseToId
        ? {
            responseTo: {
              connect: {
                id: result.data.responseToId,
              },
            },
          }
        : {}),
    },
  });

  const admin = await prisma.admin.findFirst();
  if (admin) {
    await sendNewCommentsEmail({ adminEmail: admin.email });
  }

  return json({
    comments,
  });
}
