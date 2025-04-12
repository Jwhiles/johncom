import { cssBundleHref } from "@remix-run/css-bundle";
import { Link } from "@remix-run/react";
import libStyle from "~/styles/library.css?url";

export function links() {
  return [
    { rel: "stylesheet", href: libStyle },

    ...(cssBundleHref ? [{ rel: "stylesheet", href: libStyle }] : []),
  ];
}

interface LibraryEntry {
  title: string;
  author: string;

  /*
   * Open Library ID
   * - I'm using this to get covers from their cover API
   *   But maybe at some point I want to like, take a photo of my copy of a book? 
   *   I guess I'll think about that when I get there.
   */
  olid: string;

  // TODO: granularity?
  started: string;
  stopped?: string;
  finished: boolean;
  links: Array<{
    title: string;
    url: string;
  }>
}

type Library = Array<LibraryEntry>;

const library: Library = [
  {
    title: '2666',
    author: 'Roberto Bolaño',
    olid: 'OL16820215M',
    started: '2025-04-01',
    // image: 'https://covers.openlibrary.org/b/id/7020480-L.jpg',
    finished: false,
    links: []
  },
  {
    title: 'The Buried Giant',
    author: 'Kazuo Ishiguro',
    olid: 'OL27098892M',
    started: '2024-09',
    stopped: '2024-09',
    // image: 'https://covers.openlibrary.org/b/olid/OL27098892M-L.jpg',
    finished: true,
    links: []
  },
  {
    title: 'Either/Or',
    author: 'Elif Batuman',
    olid: 'OL46844720M',
    started: '2024-08',
    stopped: '2024-08',
    // image: 'https://covers.openlibrary.org/b/id/7020480-L.jpg',
    finished: true,
    links: []
  },
  {
    title: 'The Fifth Head of Cerberus',
    author: 'Gene Wolfe',
    olid: 'OL26367950M',
    started: '2024-07',
    stopped: '2024-07',
    // image: 'https://covers.openlibrary.org/b/id/7020480-L.jpg',
    finished: true,
    links: []
  },
  {
    title: 'From Bauhaus to Our House',
    author: 'Tom Wolfe',
    olid: 'OL7826486M',
    started: '2024-05',
    stopped: '2024-05',
    // image: 'https://covers.openlibrary.org/b/id/7020480-L.jpg',
    finished: true,
    links: []
  }

]

const createImageLink = (olid: string) => `https://covers.openlibrary.org/b/olid/${olid}-L.jpg`;

// If stopped date but not finished, then show it as unfinished.
// If finished, show it as finished.

export default function Library() {
  return <div className="h-full library_background">
    <div className="body bg-white dark:bg-stone-800">

      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1 className="text-8xl tracking-tighter">The library</h1>

      <details>
        <summary>What is this?</summary>
        <p className='mt-2 italic'>A list of the books I am reading, or have read. Unfortunately very incomplete due to forgetfulness and lack of record keeping. A more extensive history can be found on <a href="https://www.goodreads.com/user/show/8718173-john">my goodreads page</a>, I hope to move that data over here gradually.</p>
      </details>
      <ol>
        {library.map((entry, i) => (
          <li key={i} className="my-4">
            <div className="grid grid-cols-3 gap-4">
              <img src={createImageLink(entry.olid)} alt={entry.title} className="h-48" />
              <div className="col-span-2">
                <h2 className="text-2xl">{entry.title}</h2>
                <p>{entry.author}</p>
                <p>{entry.started}</p>
                {entry.stopped && <p>{entry.stopped}</p>}
                {entry.finished && <p>Finished</p>}
                {entry.links.length > 0 && (
                  <ul>
                    {entry.links.map((link, j) => (
                      <li key={j}>
                        <a href={link.url}>{link.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div></div >
}
