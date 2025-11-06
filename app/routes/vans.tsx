import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getCachedArenaChannel } from "~/features/arena";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

const channelSlug = "log-pictures-of-vans-aka-vanacular-design";

export const loader = async () => {
  const blocks = await getCachedArenaChannel(channelSlug);

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
        <h1>Vans I’ve seen</h1>
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
