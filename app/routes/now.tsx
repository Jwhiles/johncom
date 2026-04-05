import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const res = await fetch("https://letterboxd.com/jwhiles/rss/");
  const text = await res.text();

  return json({ text }, apiDefaultHeaders);
};

export default function Now() {
  return (
    <>
      <div className="body">
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1>Films I’ve watched recently</h1>
      </div>

      <Films />
    </>
  );
}

const Films = () => {
  const { text } = useLoaderData<typeof loader>();
  const [films, setFilms] = useState<
    Array<{
      review: string;
      title: string;
      link: string;
      image: string;
    }>
  >([]);
  useEffect(() => {
    const rssDoc = new window.DOMParser().parseFromString(text, "text/xml");
    const items = rssDoc.querySelectorAll("item");
    const parsed: Array<{
      review: string;
      title: string;
      link: string;
      image: string;
    }> = [];

    items.forEach((el) => {
      // Warning, outrageously ugly code ahead

      const desc = new window.DOMParser().parseFromString(
        el
          .querySelector("description")
          ?.innerHTML.replace("<![CDATA[", "")
          .replace("]]>", "") ?? "",
        "text/html",
      );

      const image = desc.querySelector("img");
      const imgSrc = image?.src;
      image?.remove();

      // TODO: figure out how to parse data from XML
      // console.log(el.querySelector('letterboxd\\:watchedDate'))

      parsed.push({
        review: desc.body.innerHTML,
        title: el.querySelector("title")?.innerHTML ?? "Unknown",
        link: el.querySelector("link")?.innerHTML ?? "/",
        image: imgSrc ?? "",
      });
    });
    setFilms(parsed);
  }, [text]);

  return (
    <div>
      <ul className="list-none grid grid-cols-4 gap-8 p-4 md:grid-cols-8">
        {films.map((film) => (
          <li className="col-span-4" key={film.title}>
            <a
              className="text-xl"
              href={film.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {film.title}
            </a>
            <div className="grid grid-cols-3 gap-2 ">
              <img src={film.image} alt={film.title} />
              <div
                className="col-span-2 p-4 *:text-sm"
                dangerouslySetInnerHTML={{ __html: film.review }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
