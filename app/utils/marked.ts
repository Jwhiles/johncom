import { marked } from "marked";
// import { quoteBack } from "marked-quotebacks";

// I've vendored the quotebacks plugin until I update it to ESM
const regex = /^\>(.*?)Source: \[(.*?)]\((.*?)\)(.*?)(\r\n|\n|,|$)/s;

interface QuoteBackToken {
  type: "quoteBack"; // Should match "name" above
  raw: string;
  quote: string;
  title: string;
  source: string;
  author: string;
}

export const quoteBack = {
  name: "quoteBack",
  level: "block" as const,
  start(src: string) {
    return src.match(/\> /s)?.index;
  },
  tokenizer(src: string) {
    const match = regex.exec(src);
    if (match) {
      const token: QuoteBackToken = {
        type: "quoteBack", // Should match "name" above
        raw: match[0], // Text to consume from the source
        quote: match[1],
        title: match[2],
        source: match[3],
        author: match[4],
      };
      return token;
    }
    return;
  },
  renderer(token: QuoteBackToken) {
    const size = 64;
    const url = new URL(token.source);
    const favicon = `https://www.google.com/s2/favicons?domain=${url.host}&sz=${size}`;
    return `
    <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" tabindex="0">
      <div id="quoteback-parent" class="quoteback-parent">
        <div class="quoteback-content">${token.quote}</div>       
      </div>
      <div class="quoteback-head">       
        <div class="quoteback-avatar"><img class="mini-favicon" src=${favicon}/></div>     
          <div class="quoteback-metadata">
            <div class="metadata-inner">
              <div aria-label="" id="quoteback-author" class="quoteback-author">${token.author}</div>
              <div aria-label="" class="quoteback-title">${token.title}</div>
            </div>  
          </div>
          <div class="quoteback-backlink"><a target="_blank" aria-label="go to the full text of this quotation" rel="noopener" href="${token.source}" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
        </div>  
      </div>
    `;
  },
};

const footnoteMatch = /^\[\^([^\]]+)\]:([\s\S]*)$/;
const referenceMatch = /\[\^([^\]]+)\](?!\()/g;
const referencePrefix = "marked-fnref";
const footnotePrefix = "marked-fn";
const footnoteTemplate = (ref: string, text: string) => {
  return `<sup id="${footnotePrefix}:${ref}">${ref}</sup>${text}`;
};
const referenceTemplate = (ref: string) => {
  return `<sup id="${referencePrefix}:${ref}"><a href="#${footnotePrefix}:${ref}">${ref}</a></sup>`;
};
const interpolateReferences = (text: string) => {
  return text.replace(referenceMatch, (_, ref: string) => {
    return referenceTemplate(ref);
  });
};
const interpolateFootnotes = (text: string) => {
  return text.replace(footnoteMatch, (_, value: string, text: string) => {
    return footnoteTemplate(value, text);
  });
};
const renderer = {
  paragraph(text: string) {
    return marked.Renderer.prototype.paragraph.apply(null as unknown, [
      interpolateReferences(interpolateFootnotes(text)),
    ]);
  },
  text(text: string) {
    return marked.Renderer.prototype.text.apply(null as unknown, [
      interpolateReferences(interpolateFootnotes(text)),
    ]);
  },

  // all my images are in Contentful's CDN
  // this function just applies the same query params to all of them
  image(href: string, _title: string | null, text: string) {
    const url = new URL(`https:${href}`);
    url.searchParams.set("w", "800");
    url.searchParams.set("fm", "webp");
    return `<img loading='lazy' src=${url} alt=${text} />`;
  },
};

marked.use({ renderer, extensions: [quoteBack] });
// marked.use({ renderer, extensions: [] });

export { marked };
