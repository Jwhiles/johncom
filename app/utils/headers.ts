import { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});

export const apiDefaultHeaders = {
  headers: { "cache-control": "max-age=300, s-maxage=3600" },
};
