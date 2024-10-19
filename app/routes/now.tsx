import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { getTopTracks } from "~/lastfm.server";
import { apiDefaultHeaders } from "~/utils/headers";
export { headers } from "~/utils/headers";

export const loader = async () => {
  const res = await fetch("https://letterboxd.com/jwhiles/rss/");
  const text = await res.text();

  const topTracks = (await getTopTracks("7day")).map(
    (track: {
      name: string;
      url: string;
      artist: { name: string };
      playcount: number;
    }) => {
      return {
        name: track.name,
        url: track.url,
        artistName: track.artist.name,
        playcount: track.playcount,
      };
    },
  );

  return json({ topTracks, text }, apiDefaultHeaders);
};

export default function Now() {
  return (
    <>
      <div className="body">
        <Link className="my-2" to="..">
          Go back
        </Link>
        <h1>Right now</h1>
        <p>What’s happening in my life right now?</p>
      </div>

      <div className="grid grid-cols-4 gap-8 p-4 md:grid-cols-8">
        <div className="col-span-4">
          <Films />
        </div>
        <div className="col-span-4">
          <div className="perspective">
            <TopTracks />
          </div>
        </div>
        <div className="col-span-4"></div>
      </div>
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

      // TODO: figure out how to parse data from XML lol
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
      <h2>Films I’ve watched recently</h2>
      <ul className="m-0 list-none p-0">
        {films.map((film) => (
          <li key={film.title}>
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

const TopTracks = () => {
  const { topTracks } = useLoaderData<typeof loader>();
  return (
    <div className="threeD-div w-full max-w-2xl rounded-lg bg-slate-200 p-4 dark:bg-slate-800">
      <h2>On the e-Jukebox</h2>
      <table>
        <thead>
          <tr className="grid grid-cols-7 *:text-left">
            <th className="col-span-3 px-2 py-4">Song</th>
            <th className="col-span-2 px-2 py-4">Artist</th>
            <th className="col-span-2 px-2 py-4">Plays this week</th>
          </tr>
        </thead>
        <tbody>
          {topTracks.map((track) => (
            <tr className="grid grid-cols-7 last:pb-4" key={track.name}>
              <td className="col-span-3 px-2 py-1">
                <a href={track.url}>{track.name}</a>
              </td>
              <td className="col-span-2 px-2 py-1">{track.artistName}</td>
              <td className="col-span-2 px-2 py-1">{track.playcount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
