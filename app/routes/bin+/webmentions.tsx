import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";

import { prisma } from "~/db.server";

// {
//   "secret": "1234abcd",
//   "source": "http://rhiaro.co.uk/2015/11/1446953889",
//   "target": "http://aaronparecki.com/notes/2015/11/07/4/indiewebcamp",
//   "post": {
//     "type": "entry",
//     "author": {
//       "name": "Amy Guy",
//       "photo": "http://webmention.io/avatar/rhiaro.co.uk/829d3f6e7083d7ee8bd7b20363da84d88ce5b4ce094f78fd1b27d8d3dc42560e.png",
//       "url": "http://rhiaro.co.uk/about#me"
//     },
//     "url": "http://rhiaro.co.uk/2015/11/1446953889",
//     "published": "2015-11-08T03:38:09+00:00",
//     "name": "repost of http://aaronparecki.com/notes/2015/11/07/4/indiewebcamp",
//     "repost-of": "http://aaronparecki.com/notes/2015/11/07/4/indiewebcamp",
//     "wm-property": "repost-of"
//   }
// }

// This is intended to be called from webmention.io
const webmentionSchema = z.object({
  secret: z.string(),
  source: z.string().url(),
  target: z.string().url(), // TODO: add refinement so it has to be my site

  post: z.object({
    type: z.string(),
    author: z
      .object({
        name: z.string().optional(),
        photo: z.string().url().optional(),
        url: z.string().url().optional(),
      })
      .optional(),

    url: z.string().url().optional(),
    published: z.string().optional(),
    name: z.string().optional(),
    "repost-of": z.string().url().optional(),
    "wm-property": z.union([
      z.literal("repost-of"),
      z.literal("in-reply-to"),
      z.literal("like-of"),
      z.literal("repost-of"),
      z.literal("bookmark-of"),
      z.literal("mention-of"),
      z.literal("rsvp"),
    ]),
  }),
});

export async function action({ request }: ActionFunctionArgs) {
  // Ensure that the request method is POST
  if (request.method !== "POST") {
    return json({ error: "Invalid request method" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const parsed = webmentionSchema.parse(body);

    if (parsed.secret !== process.env.WEBMENTION_IO_SECRET) {
      throw new Response("invalid secret", { status: 400 });
    }

    await prisma.webmention.upsert({
      where: {
        target_source: {
          target: parsed.target,
          source: parsed.source,
        },
      },
      create: {
        source: parsed.source,
        target: parsed.target,
        raw: body,
      },
      update: {
        raw: body,
      },
    });

    return json({ ok: true });
  } catch (e) {
    console.error("failed to parse webmention body", e);
    throw new Response("failed to parse webmention body", { status: 400 });
  }
}
