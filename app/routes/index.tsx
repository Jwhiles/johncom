import { Link } from "@remix-run/react";

export default function Index() {

  return (
    <div className="text-slate-800">
      I'm John! This is my website I hope you like it See my{" "}
      <div>
        <ul>
        <li><Link to="/sport_quotes">favourite sport quotes here</Link></li>
        <li><Link to="/posts">blog posts</Link></li>
</ul>
      </div>
    </div>
  );
}
