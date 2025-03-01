import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import ArenaClient from "~/features/arena";
import { config } from "~/utils/config.server";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const client = new ArenaClient(config.ARENA_TOKEN);
  const chans = await client.getUserChannels("john-whiles");
  console.log(chans);
  const channel = await client.getChannelContents("log-flower-arrangements", {
    per: 100,
    page: 1,
  });
  // TODO: paginate this once there are more than 100 blocks..

  if (!channel.contents) {
    return json({ blocks: [] }, apiDefaultHeaders);
  }

  const blocks = channel.contents
    .reduce(
      (acc, block) => {
        if (block.base_class !== "Block" || !block.image?.display?.url) {
          return acc;
        }

        acc.push({
          image: block.image.display.url,
          title: block.title || "",
          description: block.description || "",
        });
        return acc;
      },
      [] as Array<{ image: string; title: string; description: string }>,
    )
    .reverse();
  return json({ blocks }, apiDefaultHeaders);
};

export default function Now() {
  const { blocks } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="body">
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1>Flower Arrangements</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="grid gap-4">
          {blocks.slice(0, Math.ceil(blocks.length / 3)).map((block) => (
            <>
              <Image key={block.title} src={block.image} alt={block.title} />
            </>
          ))}
        </div>
        <div className="grid gap-4">
          {blocks
            .slice(
              Math.ceil(blocks.length / 3),
              Math.ceil((blocks.length * 2) / 3),
            )
            .map((block) => (
              <Image key={block.title} src={block.image} alt={block.title} />
            ))}
        </div>
        <div className="grid gap-4">
          {blocks.slice(Math.ceil((blocks.length * 2) / 3)).map((block) => (
            <Image key={block.title} src={block.image} alt={block.title} />
          ))}
        </div>
      </div>
    </>
  );
}

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <img
      className="h-auto max-w-full transition-transform hover:scale-105"
      src={src}
      alt={alt}
    />
  );
};
