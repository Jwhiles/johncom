import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const webmentions = await prisma.webmention.findMany({
    where: {
      approved: false,
    },
  });

  return { webmentions };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const data = await request.formData();
  const source = data.get("source");
  const target = data.get("target");

  if (typeof source !== "string") {
    throw new Error("no source");
  }
  if (typeof target !== "string") {
    throw new Error("no target");
  }

  if (request.method === "DELETE") {
    const wm = await prisma.webmention.delete({
      where: {
        target_source: {
          target,
          source,
        },
      },
    });

    return wm;
  }

  if (request.method === "POST") {
    const wm = await prisma.webmention.update({
      where: {
        target_source: {
          target,
          source,
        },
      },
      data: {
        approved: true,
      },
    });

    return wm;
  }
  throw new Response("invalid method", { status: 400 });
}

export default function Admin() {
  const { webmentions } = useLoaderData<typeof loader>();
  return (
    <ul className="my-4">
      {webmentions.map((webmention) => {
        return (
          <li className="list-none" key={webmention.source + webmention.target}>
            <p className="text-xs font-bold">
              {webmention.authorName} - {webmention.authorUrl}
            </p>
            {webmention.authorPhoto ? (
              <img
                className="h-8 w-8 rounded-full"
                src={webmention.authorPhoto}
                alt=""
              />
            ) : null}
            <p>{webmention.wmProperty}</p>
            <p>{webmention.contentText}</p>
            <div className="flex">
              <Form method="POST">
                <input type="hidden" name="source" value={webmention.source} />
                <input type="hidden" name="target" value={webmention.target} />
                <button type="submit">Approve</button>
              </Form>
              <Form method="DELETE">
                <input type="hidden" name="source" value={webmention.source} />
                <input type="hidden" name="target" value={webmention.target} />
                <button type="submit">Delete </button>
              </Form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
