import { LoaderFunctionArgs, redirect } from "@remix-run/node";
export { headers } from "~/utils/headers";

// I noticed that I was getting traffic to post/post_slug.html - and that this was 404ing.
// So this route exists just to redirect..
export async function loader({ params }: LoaderFunctionArgs) {
  return redirect("/posts/" + params.post_slug);
}
