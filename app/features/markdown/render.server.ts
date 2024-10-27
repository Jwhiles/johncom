import sanitise from "sanitize-html";

import type { RendererHTML } from "./types";

/*
 * This a server file, and we should only use this function in loaders. This is because we don't want to ship marked and sanitize-html to the client.
 */

export const sanitiseHtml = (input: string): RendererHTML => {
  return sanitise(input, {
    allowedTags: ["p", "b", "i", "em", "strong", "a"],
    allowedAttributes: {
      a: ["href"],
    },
    transformTags: {
      h1: "p",
      h2: "p",
      h3: "p",
      h4: "p",
      h5: "p",
    },
  }) as RendererHTML;
};

export const stripAllHtml = (input: string): string => {
  return sanitise(input, {
    allowedTags: [],
  });
};
