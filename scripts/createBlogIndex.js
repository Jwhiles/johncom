const testFolder = './posts/';
const path = require('path');
const fs = require('fs');

const createIndexFile = posts => {
  fs.readFile(path.join(__dirname, '../src/BlogPosts.template'), 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const split = data.toString().split('\n');

    const startIndex = split.findIndex(l => l == '--@here');
    const result = split
      .slice(0, startIndex)
      .concat(posts)
      .concat(split.slice(startIndex + 1))
      .join('\n');

    fs.writeFile(path.join(__dirname, '../src/BlogPosts.elm'), result, err => {
      if (err) {
        return console.log(err);
      }
      console.log(`Created blog posts index`);
    });
  });
};

fs.readdir(testFolder, (err, files) => {
  const withoutExtension = files.map(f => f.slice(0, -3));
  const head = withoutExtension.slice(0, 1);
  const tail = withoutExtension.slice(1);
  const result = head.map(f => `  [ "${f}"`).concat(tail.map(f => `  , "${f}"`));

  createIndexFile(result);
});
