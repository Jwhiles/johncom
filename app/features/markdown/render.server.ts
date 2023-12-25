import { marked } from "marked";
import sanitise from "sanitize-html";

import type { HTML } from "./types";

/*
 * This a server file, and we should only use this function in loaders. This is because we don't want to ship marked and sanitize-html to the client.
 */
export const renderToHtml = (input: string): HTML => {
  // TODO: is this sanitise legit?
  return sanitise(marked(input)) as HTML;
};

export const sanitiseHtml = (input: string): HTML => {
  // TODO: is this sanitise legit?
  return sanitise(input) as HTML;
};
