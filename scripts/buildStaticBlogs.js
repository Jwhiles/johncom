const postsFolder = './posts/';
const JsDom = require('jsdom').JSDOM;
const { Script } = require('vm');
const path = require('path');
const fs = require('fs');
const { getDataFromPost, toLines, fromLines, isUndefined } = require('./lib');

const workDir = path.join(__dirname, '..');
const output = path.join(workDir, 'dist', 'blog');

const elmJs = fs.readFileSync(path.join(workDir, 'elm.js')).toString();
const indexHtml = fs.readFileSync(path.join(workDir, 'dist/index.html'), 'utf8');

const buildHtmlTemplate = content => {
  const [head, tail] = indexHtml.split('<main></main>');
  return fromLines([head, toLines(content), tail]);
};

function generateHtml({ body, title, permalink }) {
  const flags = JSON.stringify({ blogPost: body, title });

  const script = new Script(`
    ${elmJs}; let app = Elm.Main.init({flags: ${flags} })
    `);

  const dom = new JsDom(`<!DOCTYPE html><html><body></body></html>`, {
    runScripts: 'outside-only',
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

fs.readdir(postsFolder, (err, files) => {
  const withoutExtension = files.map(f => f.slice(0, -3));
  const data = files.map(getDataFromPost);

  data.forEach(generateHtml);
});
