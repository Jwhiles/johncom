const postsFolder = './posts/';
const JsDom = require('jsdom').JSDOM;
const { Script } = require('vm');
const path = require('path');
const fs = require('fs');
const { Feed } = require('feed');
const { traverseFiles, getDataFromPost, toLines, fromLines, isUndefined } = require('./lib');

const workDir = path.join(__dirname, '..');
const output = path.join(workDir, 'dist', 'blog');

const elmJs = fs.readFileSync(path.join(workDir, 'elm.js')).toString();
const indexHtml = fs.readFileSync(path.join(workDir, 'dist/index.html'), 'utf8');

const buildHtmlTemplate = content => {
  const [head, tail] = indexHtml.split('<main></main>');
  return fromLines([head, ...toLines(content), tail]);
};

function generateHtml({ body, title, permalink, date }) {
  const flags = JSON.stringify({ blogPost: body, title, date: parseInt(date) });

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
    return content;
  } catch (err) {
    console.log(err);
  }
}

function writeFile(permalink, content) {
  fs.writeFile(path.join(output, `${permalink}.html`), content, function(err) {
    if (err) throw err;
    console.log(`Saved ${permalink}!`);
  });
}

function writeRss(feed) {
  fs.writeFileSync(path.join(workDir, 'dist', 'feed'), feed.rss2());
}

function addPostToFeed(feed, post, content) {
  return feed.addItem({
    title: post.title,
    description: '',
    id: `https://www.johnwhiles.com/blog/${post.permalink}`,
    link: `https://www.johnwhiles.com/blog/${post.permalink}`,
    content,
    author: {
      name: 'John Whiles',
      email: 'nothing@johnwhiles.com',
      link: 'https://www.johnwhiles.com/',
    },
    data: new Date(post.date),
  });
}

// Main flow

// Set up RSS feed
let feed = new Feed({
  title: "John Whiles' blog",
  description: "John's blog",
  link: 'https://www.johnwhiles.com/blog',
  id: 'https://www.johnwhiles.com/blog',
  language: 'en',
  image: '',
  favicon: '',
  copyright: 'All rights reserved 2020, John Whiles',
  updated: new Date(), // optional, default = today
  generator: 'Feed for Node.js', // optional, default = 'Feed for Node.js'
  feedLinks: {
    json: 'https://www.johnwhiles.com/json',
    atom: 'https://www.johnwhiles.com/atom',
  },
  author: {
    name: 'John Whiles',
    email: 'nothing@johnwhiles.com',
    link: 'https://www.johnwhiles.com/',
  },
});

// For each post, generate the html,
// then save a static file, and update the rss feed
traverseFiles(postsFolder)(data => {
  data
    .sort((p1, p2) => p2.date - p1.date)
    .forEach(post => {
      let content = generateHtml(post);
      addPostToFeed(feed, post, content);
      writeFile(post.permalink, content);
    });

  writeRss(feed);
});
