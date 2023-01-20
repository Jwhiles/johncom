import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <h1>John's website</h1>
      <br />
      <p>Hi! I'm John! This is my website I hope you like it.</p>
      <br />
      <ul>
        <li>
          <Link to="/posts">My blog</Link>
        </li>
        <li>
          <Link to="/contact">Talk to me?</Link>
        </li>
        <li>
          <Link to="/sport_quotes">My favourite sports quotes</Link>
        </li>
      </ul>
      <div>
        <h2>Most Popular Posts</h2>
        <ul>
          <li>
            <Link to="/posts/work">Maybe you should do less 'work'</Link>
          </li>
          <li>
            <Link to="/posts/shaving">Shaving, or 'the world is out to get you'</Link>
          </li>
          <li>
            <Link to="/posts/music-production-lessons">Six things I believe about making music</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
