const postsFolder = "./posts/";
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");
const { traverseFiles, getDataFromPost, toLines, fromLines, isUndefined } = require("./lib");
const env = require('env2')('.env');


const createIndexFile = posts => {
  fs.readFile(path.join(__dirname, "../src/BlogPosts.template"), "utf8", (err, data) => {
    if (err) {
      throw new Error(err);
    }
    const split = toLines(data.toString());

    const startIndex = split.findIndex(l => l == "--@here");
    const result = fromLines(
      split
        .slice(0, startIndex)
        .concat(posts)
        .concat(split.slice(startIndex + 1))
    );

    fs.writeFile(path.join(__dirname, "../src/BlogPosts.elm"), result, err => {
      if (err) {
        throw new Error(err);
      }
      console.log(`Created blog posts index`);
    });
  });
};

fetch(
  `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?content_type=blog_post&access_token=${process.env.CONTENTFUL_TOKEN}`
)
  .then(res => res.json())
  .then(res => {
    createIndexFile(format(res.items, res.includes));
  });

const lookupLink = links => thing => {
  return links.Entry.find(l => l.sys.id === thing.sys.id);
};

const format = (posts, links) => {
  const [head, ...tail] = posts.map(({ fields: { permalink, date, title, tags } }) => {
    let newTags = tags.map(lookupLink(links)).map(t => t.fields.tagName);
    if ([permalink, date, title].some(isUndefined)) {
      throw new Error(`found a blog post with a missing field, permalink was ${permalink}`);
    }
    return `  , { permalink = "${permalink}"
                , date = ${new Date(date).getTime()}
                , title = "${title}"
                , tags = ${isUndefined(newTags) ? "[]" : JSON.stringify(newTags)}
                }`;
  });

  return [head.replace(",", "["), ...tail];
};
