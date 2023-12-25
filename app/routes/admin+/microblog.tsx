import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { z } from "zod";

import { requireAdmin, requireAdminId } from "~/auth.server";
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

const MicroBlogSchema = z.object({
  content: z.string(),
  createdDate: z.string(),
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
    await prisma.microBlog.create({
      data: {
        content: parsed.data.content,
        createdAt: parsed.data.createdDate,
        updatedAt: parsed.data.createdDate,
        createdBy: {
          connect: { id: adminId },
        },
      },
    });
    return null;
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
        data.append("date", createdDate);

        submit(data, { method: "post" });
        event.preventDefault();
      }}
      method="POST"
    >
      <RichTextEditor id="content" name="content" />
      <button type="submit">Save</button>
    </Form>
  );
}
