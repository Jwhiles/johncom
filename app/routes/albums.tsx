import { HeadersFunction } from "@remix-run/cloudflare";
import { Link } from "react-router-dom";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

const albums: Array<{ title: string; image: string; url: string }> = [
  {
    title: "A Maggot",
    image: "https://f4.bcbits.com/img/a2832880625_10.jpg",
    // can I render this page as an iframe?
    url: "https://whiles.mmm.page/maggot",
  },
];

// add album art work and links to the pages
export default function Albums() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1 className="tracking-tight">John's Albums</h1>
      <ol className="flex flex-wrap gap-12">
        {albums.map((album) => (
          <li key={album.title} className="group w-1/4">
            <a
              className="flex flex-col group-odd:flex-col-reverse"
              href={album.url}
            >
              <h3 className="my-1">{album.title}</h3>
              <img className="my-1" src={album.image} />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}