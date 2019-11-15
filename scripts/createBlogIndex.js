const postsFolder = './posts/';
const path = require('path');
const fs = require('fs');

const toLines = file => file.split('\n');
const fromLines = lines => lines.join('\n');

const createIndexFile = posts => {
  fs.readFile(path.join(__dirname, '../src/BlogPosts.template'), 'utf8', (err, data) => {
    if (err) {
      throw new Error(err);
    }
    const split = toLines(data.toString());

    const startIndex = split.findIndex(l => l == '--@here');
    const result = fromLines(split
      .slice(0, startIndex)
      .concat(posts)
      .concat(split.slice(startIndex + 1)))

    fs.writeFile(path.join(__dirname, '../src/BlogPosts.elm'), result, err => {
      if (err) {
        throw new Error(err);
      }
      console.log(`Created blog posts index`);
    });
  });
};

const getDataFromPost = postPath => {
  const file = fs.readFileSync(path.join(__dirname, '../posts', postPath), 'utf8');
  const lines = toLines(file);
  const [startOfData, endOfData] = [lines.indexOf('+++'), lines.lastIndexOf('+++')];

  if (startOfData === -1 || endOfData === -1) {
    throw new Error('found a post without metadata');
  }

  return lines.slice(startOfData + 1, endOfData).reduce(
    (acc, x) => {
      const [key, value] = x.split('=');
      return { ...acc, [key]: value };
    },
    { permalink: postPath.slice(0, -3) }
  );
};

fs.readdir(postsFolder, (err, files) => {
  const withoutExtension = files.map(f => f.slice(0, -3));
  const data = files.map(getDataFromPost);

  createIndexFile(format(data));
});

const format = posts => {
  const [head, ...tail] = posts.map(({ permalink, date, title }) => {
    return `  , { permalink = "${permalink}", date = ${date}, title = "${title}" }`;
  });

  return [head.replace(',', '['), ...tail];
};
