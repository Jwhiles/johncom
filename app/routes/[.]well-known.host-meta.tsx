import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const newUrl = new URL("https://fed.brid.gy");

  newUrl.search = url.search;
  newUrl.pathname = url.pathname;

  return redirect(newUrl.toString());
}
