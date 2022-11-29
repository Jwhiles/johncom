var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 41,
        columnNumber: 7
      }, this),
      {
        onAllReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let didError = !1, { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react.RemixServer, {
        context: remixContext,
        url: request.url
      }, void 0, !1, {
        fileName: "app/entry.server.tsx",
        lineNumber: 82,
        columnNumber: 7
      }, this),
      {
        onShellReady() {
          let body = new import_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(err) {
          reject(err);
        },
        onError(error) {
          didError = !0, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  meta: () => meta
});
var import_react2 = require("@remix-run/react");

// app/styles/app.css
var app_default = "/build/_assets/app-WHBHINBU.css";

// app/root.tsx
var import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function links() {
  return [{ rel: "stylesheet", href: app_default }];
}
var meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});
function App() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("head", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Meta, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 26,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Links, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 27,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 25,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("body", {
        children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Outlet, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 30,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.ScrollRestoration, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 31,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.Scripts, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 32,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react2.LiveReload, {}, void 0, !1, {
            fileName: "app/root.tsx",
            lineNumber: 33,
            columnNumber: 9
          }, this)
        ]
      }, void 0, !0, {
        fileName: "app/root.tsx",
        lineNumber: 29,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 24,
    columnNumber: 5
  }, this);
}

// mdx:routes/sport_quotes.mdx
var sport_quotes_exports = {};
__export(sport_quotes_exports, {
  attributes: () => attributes,
  default: () => sport_quotes_default,
  filename: () => filename,
  headers: () => headers,
  meta: () => meta2
});
var import_react3 = __toESM(require("react")), attributes = {
  meta: {
    title: "Greatest sport commentary"
  }
};
function MDXContent(props = {}) {
  let _components = Object.assign({
    h1: "h1",
    h2: "h2",
    blockquote: "blockquote",
    p: "p"
  }, props.components), { wrapper: MDXLayout } = _components, _content = /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement(_components.h1, null, "The greatest sport commentary"), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.h2, null, "Tokyo 2020 BMX (2021)"), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.blockquote, null, `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "He\u2019s not just hungry. He\u2019s ravishing"), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "-- ", /* @__PURE__ */ import_react3.default.createElement("cite", null, "Unknown presenter for the 'cool' sports")), `
`), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.h2, null, "The Tour de France (2021)"), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.blockquote, null, `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, `This man plays with a Rubiks cube and can solve it in seven seconds. There was
nano seconds involved there.`), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "-- ", /* @__PURE__ */ import_react3.default.createElement("cite", null, "Carlton Kirby, talking about Mark Cavendish winning a sprint")), `
`), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.blockquote, null, `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "The kitchen tables been kicked over and we\u2019re not quite sure what dish will be served up by the end of the day."), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "-- ", /* @__PURE__ */ import_react3.default.createElement("cite", null, "Probably Carlton Kirby")), `
`), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.blockquote, null, `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "Pedaling along the right hand side of the road up at the front, Tony Martin shoves a protein bar into his mouth."), `
`, /* @__PURE__ */ import_react3.default.createElement(_components.p, null, "-- ", /* @__PURE__ */ import_react3.default.createElement("cite", null, "The Guardian Liveblog")), `
`));
  return MDXLayout ? /* @__PURE__ */ import_react3.default.createElement(MDXLayout, {
    ...props
  }, _content) : _content;
}
var sport_quotes_default = MDXContent, filename = "sport_quotes.mdx", headers = typeof attributes < "u" && attributes.headers, meta2 = typeof attributes < "u" && attributes.meta;

// mdx:routes/about.mdx
var about_exports = {};
__export(about_exports, {
  attributes: () => attributes2,
  default: () => about_default,
  filename: () => filename2,
  headers: () => headers2,
  meta: () => meta3
});
var import_react4 = __toESM(require("react")), attributes2 = {
  meta: {
    title: "About"
  }
};
function MDXContent2(props = {}) {
  let _components = Object.assign({
    h1: "h1",
    p: "p",
    a: "a",
    code: "code"
  }, props.components), { wrapper: MDXLayout } = _components, _content = /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(_components.h1, null, "Hi!"), `
`, /* @__PURE__ */ import_react4.default.createElement(_components.p, null, "I'm John"), `
`, /* @__PURE__ */ import_react4.default.createElement(_components.p, null, `I studied Political Science and Philosophy, but don't ask me about it because
I don't remember anything.`), `
`, /* @__PURE__ */ import_react4.default.createElement(_components.p, null, "I used to be a ", /* @__PURE__ */ import_react4.default.createElement(_components.a, {
    href: "https://models.com/work/maison-martin-margiela-artisanale/401300"
  }, "fashion model"), `,
but now I work as a `, /* @__PURE__ */ import_react4.default.createElement(_components.a, {
    href: "https://github.com/jwhiles"
  }, "software entwickler"), " at Contentful in Berlin."), `
`, /* @__PURE__ */ import_react4.default.createElement(_components.p, null, "If you want to get in contact, send me an email to ", /* @__PURE__ */ import_react4.default.createElement(_components.code, null, "j w whiles at gmail dot com")), `
`, /* @__PURE__ */ import_react4.default.createElement(_components.p, null, `Want to talk to me? You can schedule a meeting here.
https://calendly.com/jwhiles/speak-to-john?month=2022-11&date=2022-11-11`));
  return MDXLayout ? /* @__PURE__ */ import_react4.default.createElement(MDXLayout, {
    ...props
  }, _content) : _content;
}
var about_default = MDXContent2, filename2 = "about.mdx", headers2 = typeof attributes2 < "u" && attributes2.headers, meta3 = typeof attributes2 < "u" && attributes2.meta;

// app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react5 = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Index() {
  let words = [
    "every girl I ever kissed, I was thinking of a pro footballer"
  ], word = words[Math.floor(Math.random() * words.length)];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    className: "text-slate-800",
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: word
      }, void 0, !1, {
        fileName: "app/routes/index.tsx",
        lineNumber: 11,
        columnNumber: 7
      }, this),
      "I'm John! This is my website I hope you like it See my",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react5.Link, {
          to: "/sport_quotes",
          children: "favourite sport quotes here"
        }, void 0, !1, {
          fileName: "app/routes/index.tsx",
          lineNumber: 14,
          columnNumber: 9
        }, this)
      }, void 0, !1, {
        fileName: "app/routes/index.tsx",
        lineNumber: 13,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/index.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, this);
}

// app/routes/posts.tsx
var posts_exports = {};
__export(posts_exports, {
  default: () => Index2
});
var import_react6 = require("@remix-run/react"), import_jsx_dev_runtime = require("react/jsx-dev-runtime");
function Index2() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    style: { fontFamily: "system-ui, sans-serif", lineHeight: "1.4" },
    children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react6.Outlet, {}, void 0, !1, {
      fileName: "app/routes/posts.tsx",
      lineNumber: 6,
      columnNumber: 7
    }, this)
  }, void 0, !1, {
    fileName: "app/routes/posts.tsx",
    lineNumber: 5,
    columnNumber: 5
  }, this);
}

// app/routes/posts/$post_id.tsx
var post_id_exports = {};
__export(post_id_exports, {
  default: () => Post,
  loader: () => loader
});

// app/contentful.server.ts
var contentful = __toESM(require("contentful")), client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.CDA_TOKEN
}), getEntry = async (slug) => client.getEntries({
  content_type: "blogPost",
  "fields.slug[match]": slug
}).then(function(res) {
  if (res.total !== 1)
    throw console.log(res.total), new Error("TODO");
  return res.items[0];
}), getListOfEntries = async () => client.getEntries({
  content_type: "blogPost",
  order: "-fields.date"
}).then(function(res) {
  return res;
});

// app/routes/posts/$post_id.tsx
var import_react7 = require("@remix-run/react"), import_node2 = require("@remix-run/node"), import_marked = require("marked"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), loader = async ({ params }) => {
  if (!params.post_id)
    throw new Error("no post id");
  let entry2 = await getEntry(params.post_id), html = (0, import_marked.marked)(entry2.fields.body);
  return (0, import_node2.json)({ html, date: entry2.fields.date, title: entry2.fields.title });
};
function Post() {
  let { html, title } = (0, import_react7.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
        children: title
      }, void 0, !1, {
        fileName: "app/routes/posts/$post_id.tsx",
        lineNumber: 21,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
        dangerouslySetInnerHTML: { __html: html }
      }, void 0, !1, {
        fileName: "app/routes/posts/$post_id.tsx",
        lineNumber: 22,
        columnNumber: 7
      }, this)
    ]
  }, void 0, !0, {
    fileName: "app/routes/posts/$post_id.tsx",
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

// app/routes/posts/index.tsx
var posts_exports2 = {};
__export(posts_exports2, {
  default: () => Post2,
  loader: () => loader2
});
var import_react8 = require("@remix-run/react"), import_node3 = require("@remix-run/node"), import_jsx_dev_runtime = require("react/jsx-dev-runtime"), loader2 = async () => {
  let e = (await getListOfEntries()).items.map((entry2) => ({
    title: entry2.fields.title,
    slug: entry2.fields.slug,
    date: entry2.fields.date
  }));
  return (0, import_node3.json)({ entries: e });
};
function Post2() {
  let { entries } = (0, import_react8.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
    children: entries.map(({ title, slug, date }) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
      children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_react8.Link, {
        prefetch: "intent",
        to: slug,
        children: [
          title,
          " - ",
          date
        ]
      }, void 0, !0, {
        fileName: "app/routes/posts/index.tsx",
        lineNumber: 25,
        columnNumber: 13
      }, this)
    }, `${title}${slug}`, !1, {
      fileName: "app/routes/posts/index.tsx",
      lineNumber: 24,
      columnNumber: 11
    }, this))
  }, void 0, !1, {
    fileName: "app/routes/posts/index.tsx",
    lineNumber: 21,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "21b44244", entry: { module: "/build/entry.client-XICWN7OY.js", imports: ["/build/_shared/chunk-VVF2UJ4X.js", "/build/_shared/chunk-WJFSLLXO.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-6RR2QNGY.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/about": { id: "routes/about", parentId: "root", path: "about", index: void 0, caseSensitive: void 0, module: "/build/routes/about-K7IH5MTW.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/index": { id: "routes/index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/index-TRAC45BE.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/posts": { id: "routes/posts", parentId: "root", path: "posts", index: void 0, caseSensitive: void 0, module: "/build/routes/posts-JZR4GGOE.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/posts/$post_id": { id: "routes/posts/$post_id", parentId: "routes/posts", path: ":post_id", index: void 0, caseSensitive: void 0, module: "/build/routes/posts/$post_id-MHUIDQMY.js", imports: ["/build/_shared/chunk-V3RDYHTD.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/posts/index": { id: "routes/posts/index", parentId: "routes/posts", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/posts/index-2657D6QL.js", imports: ["/build/_shared/chunk-V3RDYHTD.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/sport_quotes": { id: "routes/sport_quotes", parentId: "root", path: "sport_quotes", index: void 0, caseSensitive: void 0, module: "/build/routes/sport_quotes-NOJY2MPS.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, url: "/build/manifest-21B44244.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/sport_quotes": {
    id: "routes/sport_quotes",
    parentId: "root",
    path: "sport_quotes",
    index: void 0,
    caseSensitive: void 0,
    module: sport_quotes_exports
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: about_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/posts": {
    id: "routes/posts",
    parentId: "root",
    path: "posts",
    index: void 0,
    caseSensitive: void 0,
    module: posts_exports
  },
  "routes/posts/$post_id": {
    id: "routes/posts/$post_id",
    parentId: "routes/posts",
    path: ":post_id",
    index: void 0,
    caseSensitive: void 0,
    module: post_id_exports
  },
  "routes/posts/index": {
    id: "routes/posts/index",
    parentId: "routes/posts",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: posts_exports2
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  publicPath,
  routes
});
//# sourceMappingURL=index.js.map
