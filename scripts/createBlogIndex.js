const postsFolder = './posts/';
const path = require('path');
const fs = require('fs');
const { getDataFromPost, toLines, fromLines, isUndefined } = require('./lib');


const createIndexFile = posts => {
  fs.readFile(path.join(__dirname, '../src/BlogPosts.template'), 'utf8', (err, data) => {
    if (err) {
      throw new Error(err);
    }
    const split = toLines(data.toString());

    const startIndex = split.findIndex(l => l == '--@here');
    const result = fromLines(
      split
        .slice(0, startIndex)
        .concat(posts)
        .concat(split.slice(startIndex + 1))
    );

    fs.writeFile(path.join(__dirname, '../src/BlogPosts.elm'), result, err => {
      if (err) {
        throw new Error(err);
      }
      console.log(`Created blog posts index`);
    });
  });
};


fs.readdir(postsFolder, (err, files) => {
  const withoutExtension = files.map(f => f.slice(0, -3));
  const data = files.map(getDataFromPost);

  createIndexFile(format(data));
});

const format = posts => {
  const [head, ...tail] = posts.map(({ permalink, date, title, tags }) => {
    if ([permalink, date, title].some(isUndefined)) {
      throw new Error(`found a blog post with a missing field, permalink was ${permalink}`);
    }
    return `  , { permalink = "${permalink}"
                , date = ${date}
                , title = "${title}"
                , tags = ${isUndefined(tags) ? '[]' : tags}
                }`;
  });

  return [head.replace(',', '['), ...tail];
};

