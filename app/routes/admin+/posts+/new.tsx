import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { validationError } from "@rvf/remix";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

import { requireAdmin, requireAdminId } from "~/auth.server";
import { PostForm, validator } from "~/components/PostForm";
import { prisma } from "~/db.server";

dayjs.extend(utc);
dayjs.extend(timezone);

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
        hackerNewsLink: parsed.data.hackerNewsLink,
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
