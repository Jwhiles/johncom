import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { z } from "zod";

import { prisma } from "~/db.server";
import { sendNewCommentsEmail } from "~/features/emails/mailgun.server";
import { sanitiseHtml } from "~/features/markdown/index.server";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.post_id) {
    throw new Error("no post id");
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: params.post_id,
    },
  });

  return json({
    comments,
  });
}

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
  if (!params.post_id) {
    throw new Error("no post id");
  }

  const result = await validator.validate(await request.formData());
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const comments = await prisma.comment.create({
    data: {
      content: sanitiseHtml(result.data.content),
      authorEmail: result.data.email,
      postId: params.post_id,
      name: result.data.name,
      responseToId: result.data.responseToId,
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
