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
          <Link to="/sport_quotes">My favourite sports quotes</Link>
        </li>
      </ul>
    </div>
  );
}
