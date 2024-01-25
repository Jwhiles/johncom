import { Link } from "@remix-run/react";
export { headers } from "~/utils/headers";

export default function Contact() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>Contact Me</h1>
      <p>There are numerous ways.</p>
      <ul>
        <li>
          <a href="https://calendly.com/jwhiles/speak-to-john">
            Book a video call on Calendly
          </a>
        </li>
        <li>
          <a href="mailto:hi@johnwhiles.com">Email me</a>
        </li>
        <li>
          <a href="https://mastodon.online/@jwhiles">@jwhiles on Mastodon</a>
        </li>
        <li>
          <a href="https://bsky.app/profile/johnwhiles.com">
            @johnwhiles.com on bluesky
          </a>
        </li>
      </ul>
      <div className="mt-2"></div>
    </div>
  );
}
