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
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
import * as BlueSky from "~/features/bluesky/index.server";
import { stripAllHtml } from "~/features/markdown/index.server";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

const MicroBlogSchema = z.object({
  content: z.string(),
  createdDate: z.string(),
  inReplyToUrl: z
    .union([z.string().url().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
  inReplyToAuthor: z
    .union([z.string().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
  inReplyToTitle: z
    .union([z.string().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
});

export async function action({ request }: ActionFunctionArgs) {
  const adminId = await requireAdminId(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  if (request.method === "POST") {
    const parsed = MicroBlogSchema.safeParse(data);
    if (!parsed.success) {
      throw new Response(parsed.error.message, { status: 400 });
    }
    await prisma.note.create({
      data: {
        content: parsed.data.content,
        createdAt: parsed.data.createdDate,
        updatedAt: parsed.data.createdDate,
        createdBy: {
          connect: { id: adminId },
        },
        inReplyToUrl: parsed.data.inReplyToUrl,
        inReplyToAuthor: parsed.data.inReplyToAuthor,
        inReplyToTitle: parsed.data.inReplyToTitle,
      },
    });

    // Post to BlueSky
    await BlueSky.makePost(
      stripAllHtml(parsed.data.content),
      parsed.data.createdDate,
    );

    return redirect("/admin");
  }

  throw new Response("invalid method", { status: 400 });
}

export default function MicroBlog() {
  const submit = useSubmit();
  return (
    <Form
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);

        // Date is created on the client so we can capture the timezone.
        const createdDate = dayjs.tz(dayjs(), dayjs.tz.guess()).format();
        data.append("createdDate", createdDate);

        submit(data, { method: "post" });
        event.preventDefault();
      }}
      method="POST"
      className="flex flex-col gap-4"
    >
      <RichTextEditor id="content" name="content" />
      <input
        placeholder="https://inreplyto.com"
        type="text"
        name="inReplyToUrl"
      />
      <input
        placeholder="In reply to title"
        type="text"
        name="inReplyToTitle"
      />
      <input
        placeholder="In reply to author"
        type="text"
        name="inReplyToAuthor"
      />
      <button type="submit">Save</button>
    </Form>
  );
}
