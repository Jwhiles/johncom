import { Link } from "react-router-dom";
export { headers } from "~/utils/headers";

const albums: { title: string; image: string; url: string }[] = [
  {
    title: "A Maggot",
    image: "https://f4.bcbits.com/img/a2832880625_10.jpg",
    url: "https://whiles.mmm.page/maggot",
  },
  {
    title: "Exit",
    image: "https://f4.bcbits.com/img/a0621469758_10.jpg",
    url: "https://whiles.mmm.page/exit",
  },
  {
    title: "Turning to Ice",
    image: "https://f4.bcbits.com/img/a3864256372_10.jpg",
    url: "https://whiles.mmm.page/turning_to_ice",
  },
];

// add album art work and links to the pages
export default function Albums() {
  return (
    <div className="body">
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
              <img
                alt={album.title + " album cover"}
                className="my-1"
                src={album.image}
              />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
