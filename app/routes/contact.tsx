import { Link } from "@remix-run/react";
export { headers } from "~/utils/headers";

export default function Conctact() {
  return (
    <div className="body">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>Contact Me</h1>
      <p>You can email me at hi@johnwhiles.com</p>

      <div className="mt-2"></div>
    </div>
  );
}
