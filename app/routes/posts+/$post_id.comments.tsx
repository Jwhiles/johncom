import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";

import { prisma } from "~/db.server";

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
export async function action({ params, request }: ActionFunctionArgs) {
  if (!params.post_id) {
    throw new Error("no post id");
  }

  const data = await request.formData();
  const content = data.get("content");
  const email = data.get("email");
  const name = data.get("name");

  if (typeof content !== "string") {
    throw new Error("no content");
  }
  if (typeof email !== "string") {
    throw new Error("no email");
  }
  if (typeof name !== "string") {
    throw new Error("no name");
  }

  const comments = await prisma.comment.create({
    data: {
      content,
      authorEmail: email,
      postId: params.post_id,
      name,
    },
  });

  return json({
    comments,
  });
}
