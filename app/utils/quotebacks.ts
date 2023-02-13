const regex = /\>(.*?)Source: \[(.*?)]\((.*?)\)(.*?)(\r\n|\n|,|$)/s;

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
