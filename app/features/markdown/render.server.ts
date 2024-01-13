import { marked } from "marked";
import sanitise from "sanitize-html";

import type { HTML } from "./types";

/*
 * This a server file, and we should only use this function in loaders. This is because we don't want to ship marked and sanitize-html to the client.
 */
// I don't actually need this. Because we never save any markdown!!
export const renderToHtml = (input: string): HTML => {
  // TODO: is this sanitise legit?
  return sanitise(marked(input)) as HTML;
};

export const sanitiseHtml = (input: string): HTML => {
  // TODO: is this sanitise legit?
  return sanitise(input) as HTML;
};

export const sanitiseHtmlHard = (input: string): HTML => {
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
  }) as HTML;
};
