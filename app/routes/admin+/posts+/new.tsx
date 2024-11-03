import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { z } from "zod";

import { requireAdmin, requireAdminId } from "~/auth.server";
import { MarkdownEditor } from "~/components/MarkdownEditor";
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

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Post content is required"),
  tags: z.string().transform((str) =>
    str
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
  createdDate: z.string(),
  slug: z.string(),
  hackerNewsLink: z
    .union([z.string().url().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
});

export async function action({ request }: ActionFunctionArgs) {
  const adminId = await requireAdminId(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (request.method === "POST") {
    const parsed = PostSchema.safeParse(data);
    if (!parsed.success) {
      throw new Response(parsed.error.message, { status: 400 });
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
      },
    });

    return redirect("/admin");
  }

  throw new Response("Invalid method", { status: 400 });
}

export default function NewPost() {
  const submit = useSubmit();

  return (
    <Form
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const createdDate = dayjs.tz(dayjs(), dayjs.tz.guess()).format();
        data.append("createdDate", createdDate);

        submit(data, { method: "post" });
        event.preventDefault();
      }}
      method="POST"
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          Content
        </label>
        <MarkdownEditor id="body" name="body" />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="javascript, react, web"
        />
      </div>

      <div>
        <label htmlFor="hackerNewsLink" className="block text-sm font-medium">
          Hacker News Link (optional)
        </label>
        <input
          type="url"
          id="hackerNewsLink"
          name="hackerNewsLink"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Create Post
      </button>
    </Form>
  );
}
