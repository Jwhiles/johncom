import { HeadersFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
export default function Conctact() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <Link className="my-2" to="..">
        Go back
      </Link>
      <h1>Contact Me</h1>
      <p>You can email me at hi@johnwhiles.com</p>

      <div className="mt-2"></div>
    </div>
  );
}
