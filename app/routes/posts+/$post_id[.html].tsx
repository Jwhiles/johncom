import { HeadersFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";

// I noticed that I was getting traffic to post/post_id.html - and that this was 404ing.
// So this route exists just to redirect..
export async function loader({ params }: LoaderFunctionArgs) {
  return redirect("/posts/" + params.post_id);
}
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=3600, s-maxage=3600",
});
