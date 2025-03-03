import { Link, Outlet, useLocation } from "@remix-run/react";
import z from "zod";

import links from "../links.json";

// I'm loading all the links into memory here.
// If there are ever a _lot_ of them that might be a problem.
// For now, It doesn't matter.
const linkSchema = z.record(
  z.string(),
  z.object({
    ids: z.array(z.string()),
    outboundLinks: z.array(z.object({})),
    inboundLinks: z.array(
      z.object({
        title: z.string(),
        slug: z.string(),
      }),
    ),
  }),
);
const validatedLinks = linkSchema.parse(links);

export default function Wiki() {
  const slug = useLocation().pathname.slice(1);
  const backlinks = validatedLinks[slug] ?? { inboundLinks: [] };
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <Outlet />

      <div>
        <h1>Backlinks</h1>

        <ul>
          {backlinks.inboundLinks.map((link) => (
            <li key={link.slug}>
              <a href={link.slug}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
