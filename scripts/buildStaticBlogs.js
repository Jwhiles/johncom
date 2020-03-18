const JsDom = require("jsdom").JSDOM;
const fetch = require("node-fetch");
const { Script } = require("vm");
const path = require("path");
const fs = require("fs");
const { traverseFiles, getDataFromPost, toLines, fromLines, isUndefined } = require("./lib");
const env = require("env2")(".env");

const workDir = path.join(__dirname, "..");
const output = path.join(workDir, "dist", "blog");
const postsFolder = "./posts/";

const elmJs = fs.readFileSync(path.join(workDir, "elm.js")).toString();
const indexHtml = fs.readFileSync(path.join(workDir, "dist/index.html"), "utf8");

const buildHtmlTemplate = content => {
  const [head, tail] = indexHtml.split("<main></main>");
  return fromLines([head, ...toLines(content), tail]);
};

function generateHtml({ body, title, permalink }) {
  const flags = JSON.stringify({ blogPost: body, title });

  const script = new Script(`
    ${elmJs}; let app = Elm.Main.init({flags: ${flags} })
    `);

  const dom = new JsDom(`<!DOCTYPE html><html><body></body></html>`, {
    runScripts: "outside-only",
    url: `https://www.johnwhiles.com/${permalink}`,
  });

  try {
    dom.runVMScript(script);
    const content = buildHtmlTemplate(dom.window.document.body.innerHTML);

    fs.writeFile(path.join(output, `${permalink}.html`), content, function(err) {
      if (err) throw err;
      console.log(`Saved ${title}!`);
    });
  } catch (err) {
    console.log(err);
  }
}

function savePostFile(title, body) {
  fs.writeFile(path.join(workDir, "dist", "posts", `${title}.md`), body, function(err) {});
}

fetch(
  `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?content_type=blog_post&access_token=${process.env.CONTENTFUL_TOKEN}`
)
  .then(res => res.json())
  .then(({ items }) => {
    items.forEach(({ fields: { body, title, permalink } }) => {
      generateHtml({ body, title, permalink });
      savePostFile(title, body);
    });
  });
