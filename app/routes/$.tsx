import { HeadersFunction, json, MetaFunction } from "@remix-run/node";
import { metaV1 } from "@remix-run/v1-meta";

import { FourOhFour } from "~/components/FourOhFour";

export const meta: MetaFunction = (args) =>
  metaV1(args, {
    title: "Page not found",
  });

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export const loader = () => {
  return json(null, { status: 404 });
};

export default function FourOhFourRoute() {
  return <FourOhFour />;
}
