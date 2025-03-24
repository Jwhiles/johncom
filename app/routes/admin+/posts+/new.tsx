import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { validationError } from "@rvf/remix";

import { requireAdmin, requireAdminId } from "~/auth.server";
import { prisma } from "~/db.server";
import { PostForm, validator } from "~/features/posts/PostForm";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function action({ request }: ActionFunctionArgs) {
  const adminId = await requireAdminId(request);

  if (request.method === "POST") {
    const parsed = await validator.validate(await request.formData());
    if (parsed.error) {
      return validationError(parsed.error, parsed.submittedData);
    }

    // Create the post
    await prisma.post.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        body: parsed.data.body,
        date: parsed.data.createdDate,
        author: {
          connect: { id: adminId },
        },
        tags: {
          connectOrCreate: parsed.data.tags.map((name) => ({
            where: { name },
            create: {
              name,
              slug: slugify(name),
            },
          })),
        },
        draft: !parsed.data.readyToPublish,
      },
    });

    return redirect("/admin");
  }

  throw new Response("Invalid method", { status: 400 });
}

export default function NewPost() {
  return <PostForm mode={{ type: "create" }} />;
}
