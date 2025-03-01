import { Link } from "@remix-run/react";
export { headers } from "~/utils/headers";

export default function Contact() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>Contact Me</h1>
      <ul>
        <li>
          <a href="mailto:hi@johnwhiles.com">Email me</a>
        </li>
        <li>
          <a href="https://bsky.app/profile/johnwhiles.com">on bluesky</a>
        </li>
        <li>
          <a href="https://www.are.na/john-whiles/channels">are.na</a>
        </li>
      </ul>
      <div className="mt-2"></div>
    </div>
  );
}
