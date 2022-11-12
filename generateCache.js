// This script generates the list of filenames to cache in sw.js

const fs = require("fs");

const hymnFileNames = fs.readdirSync("./content/hymns/");

const hymnNos = hymnFileNames.map((fileName) => {
  return fileName.slice(0, -3); // remove .md
});

hymnNos.forEach((hymnNo) => {
  console.log(`"/cis-youth-hymnal-v2/hymns/${hymnNo}/",`);
});
