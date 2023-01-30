import { getListOfTags } from "~/contentful.server";
import { useLoaderData, Link } from "@remix-run/react";
import { json, LoaderArgs } from "@remix-run/cloudflare";


export const loader = async ({ context }: LoaderArgs) => {
  const tags = await getListOfTags(context);
  const t = tags.items.map((tag) => {
    return {
      id: tag.sys.id,
      name: tag.fields.tagName,
    };
  });
  return json({ tags: t });
};

export default function Post() {
  const { tags } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>John's blog</h1>
      <br />
      <ol>
        {tags.map(({ name, id }) => {
          return (
            <li key={id}>
              <Link className="justify-between flex" prefetch="intent" to={id}>
                {name}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
