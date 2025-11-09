// This script generates the list of filenames to cache in sw.js

const fs = require("fs");

const chineseFileNames = fs.readdirSync("./content/chinese/");
const englishFileNames = fs.readdirSync("./content/english/");

const chineseHymnNos = chineseFileNames.map((fileName) => {
  return fileName.slice(0, -3); // remove .md
});

const englishHymnNos = englishFileNames.map((fileName) => {
  return fileName.slice(0, -3); // remove .md
});

chineseHymnNos.forEach((hymnNo) => {
  console.log(`"/chinese/${hymnNo}/",`);
});

englishHymnNos.forEach((hymnNo) => {
  console.log(`"/english/${hymnNo}/",`);
});
