import { json } from "@remix-run/cloudflare";

export const loader = () => {
  return json(null, { status: 404 });
};

export default function FourOhFour() {
  return (
    <div className="p-4 leading-tight max-w-2xl mx-auto">
      <h1>Page not found!</h1>
      <p>Sorry, this page doesn't exist!</p>
      <img className="mx-0" src="//images.ctfassets.net/wc253zohgsra/5t6dEZoDknmJwRDDus0FHU/f9dd7336c786e7ab354300b1f9d31062/404.jpeg" alt="404" />
      <a href="/">Go back home</a>
    </div>
  );
}
