import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

import { prisma } from "~/db.server";
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
  content: z.string(),
  email: z.string().email(),
  name: z.string(),
  responseToId: z.string().optional(),
  "cf-turnstile-response": z.string(),
});

export async function action({ params, request }: ActionFunctionArgs) {
  if (!params.post_id) {
    throw new Error("no post id");
  }
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const parsed = CommentSchema.safeParse(data);
  if (!parsed.success) {
    throw new Response(parsed.error.message, { status: 400 });
  }

  // now we check the cf-turnstile-response
  const cloudflareResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: parsed.data["cf-turnstile-response"],
      }),
    },
  );
  const js = await cloudflareResponse.json();
  console.log(js);
  if (!js.success) {
    throw new Response(js.error, { status: 400 });
  }

  const comments = await prisma.comment.create({
    data: {
      content: sanitiseHtml(parsed.data.content),
      authorEmail: parsed.data.email,
      postId: params.post_id,
      name: parsed.data.name,
      responseToId: parsed.data.responseToId,
    },
  });

  return json({
    comments,
  });
}
