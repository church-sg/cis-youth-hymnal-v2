var yaml = require("yamljs");
var S = require("string");

var CONTENT_PATH_PREFIX = "content";

module.exports = function (grunt) {
  grunt.registerTask("lunr-index", function () {
    grunt.log.writeln("Build pages index");

    var indexPages = function () {
      var englishIndex = [];
      grunt.file.recurse(
        CONTENT_PATH_PREFIX + "/english",
        function (abspath, rootdir, subdir, filename) {
          grunt.verbose.writeln("Parse file:", abspath);
          englishIndex.push(processFile(abspath, filename));
        }
      );

      var chineseIndex = [];
      grunt.file.recurse(
        CONTENT_PATH_PREFIX + "/chinese",
        function (abspath, rootdir, subdir, filename) {
          grunt.verbose.writeln("Parse file:", abspath);
          chineseIndex.push(processFile(abspath, filename));
        }
      );

      //sort pages index by hymn number
      var sortedEnglishIndex = englishIndex.sort((a, b) => {
        var aHymnNo = a.href.replace("/english/", "");
        var bHymnNo = b.href.replace("/english/", "");
        return parseInt(aHymnNo) - parseInt(bHymnNo);
      });

      var sortedChineseIndex = chineseIndex.sort((a, b) => {
        var aHymnNo = a.href.replace("/chinese/", "");
        var bHymnNo = b.href.replace("/chinese/", "");
        return parseInt(aHymnNo) - parseInt(bHymnNo);
      });

      return { english: sortedEnglishIndex, chinese: sortedChineseIndex };
    };

    var processFile = function (abspath, filename) {
      var pageIndex;

      if (S(filename).endsWith(".html")) {
        pageIndex = processHTMLFile(abspath, filename);
      } else {
        pageIndex = processMDFile(abspath, filename);
      }

      return pageIndex;
    };

    var processHTMLFile = function (abspath, filename) {
      var content = grunt.file.read(abspath);
      var pageName = S(filename).chompRight(".html").s;
      var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).s;
      return {
        title: pageName,
        href: href,
        content: S(content).trim().stripTags().stripPunctuation().s,
      };
    };

    var processMDFile = function (abspath, filename) {
      var content = grunt.file.read(abspath);
      var pageIndex;
      // First separate the Front Matter from the content and parse it
      content = content.split("---");
      var frontMatter;
      try {
        frontMatter = yaml.parse(content[1].trim());
      } catch (e) {
        console.failed(e.message);
      }

      var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
      // href for index.md files stops at the folder name
      if (filename === "index.md") {
        href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
      }

      // Build Lunr index for this page
      pageIndex = {
        title: frontMatter.title,
        medlyFrom: frontMatter.medleyFrom,
        medlyTo: frontMatter.medleyTo,
        href: href,
        content: S(content[2]).trim().stripTags().replace(/\s+/g, " ").s,
      };

      return pageIndex;
    };

    grunt.file.write("static/js/PagesIndex.json", JSON.stringify(indexPages()));
    grunt.log.ok("Index built");
  });
};
