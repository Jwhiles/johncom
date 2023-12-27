import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const comments = await prisma.comment.findMany({
    where: {
      approved: false,
    },
  });

  return comments;
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const data = await request.formData();
  const commentId = data.get("commentId");

  if (typeof commentId !== "string") {
    throw new Error("no commentId");
  }

  if (request.method === "DELETE") {
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return comment;
  }

  if (request.method === "POST") {
    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        approved: true,
      },
    });

    return comment;
  }
  throw new Response("invalid method", { status: 400 });
}

export default function Admin() {
  const comments = useLoaderData<typeof loader>();
  return (
    <ul className="my-4">
      {comments.map((c) => {
        return (
          <li className="list-none" key={c.id}>
            <p className="text-xs font-bold">
              {c.name} - {c.authorEmail} - {c.postId}
            </p>
            <p>{c.content}</p>
            <div className="flex">
              <Form method="POST">
                <input type="hidden" name="commentId" value={c.id} />
                <button type="submit">Approve</button>
              </Form>
              <Form method="DELETE">
                <input type="hidden" name="commentId" value={c.id} />
                <button type="submit">Delete </button>
              </Form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
