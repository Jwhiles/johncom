import { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=300, s-maxage=3600",
});

export const apiDefaultHeaders = {
  headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
};
