import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <div className="my-0">&nbsp;</div>
      <h1>John's website</h1>
      <ul>
        <li>
          <Link to="/posts">My blog</Link>
        </li>
        <li>
          <Link to="/tags/technology">Just technology posts (for the nerds)</Link>
        </li>
        <li>
          <Link to="/contact">Talk to me?</Link>
        </li>
      </ul>
      <div>
        <h2>Most Popular Posts</h2>
        <ul>
          <li>
            <Link to="/posts/work">Maybe you should do less 'work'</Link>
          </li>
          <li>
            <Link to="/posts/shaving">
              Shaving, or 'the world is out to get you'
            </Link>
          </li>
          <li>
            <Link to="/posts/music-production-lessons">
              Six things I believe about making music
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
