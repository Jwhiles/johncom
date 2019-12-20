const fs = require('fs');
const path = require('path');

const toLines = file => file.split('\n');
const fromLines = lines => lines.join('\n');
const isUndefined = val => {
  return val === null || typeof val === 'undefined';
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
    { permalink: postPath.slice(0, -3), body: lines.slice(endOfData + 1).join('\n') }
  );
};

module.exports = {
  getDataFromPost,
  toLines,
  fromLines,
  isUndefined,
};
