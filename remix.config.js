/** @type {import('@remix-run/dev').AppConfig} */
const { flatRoutes } = require("remix-flat-routes");
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",

  routes: async (defineRoutes) => flatRoutes("routes", defineRoutes),

  // update this package so I don't need to do this..
  serverDependenciesToBundle: [
    /^marked-quotebacks/,
  ],
};
