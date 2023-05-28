var $results, $chineseResults, englishIndex, chineseIndex;

// Retrieve index file
async function getPagesIndex() {
  // First retrieve the index file
  return $.getJSON("./js/PagesIndex.json")
    .done(function(index) {
      englishIndex = index.english;
      chineseIndex = index.chinese;
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting index file:", err);
    });
}

// Hook up listener to the input field
function initUI() {
  $results = $("#results");
  $chineseResults = $("#chinese");

  $("#search").keyup(function() {
    $results.empty();
    $chineseResults.empty();

    var query = $(this).val().replace(/\s+/g, " "); //https://stackoverflow.com/a/4328546
    var results;
    if (isNaN(parseInt(query))) {
      //if query is words
      results = search(query);
    } else {
      //if query is number
      var results = numberSearch(query);
    }

    renderResults(results.english, results.chinese);
  });
}

/**
 * Trigger a search and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
  const english = englishIndex.filter((page) => {
    return (
      page.title.toLowerCase().search(query.toLowerCase()) != -1 ||
      page.content.toLowerCase().search(query.toLowerCase()) != -1
    );
  });

  const chinese = chineseIndex.filter((page) => {
    return (
      page.title.toLowerCase().search(query.toLowerCase()) != -1 ||
      page.content.toLowerCase().search(query.toLowerCase()) != -1
    );
  });

  return { english, chinese };
}

function numberSearch(number) {
  // only search hymnNo to avoid searching the verse numbers
  const english = englishIndex.filter((page) => {
    return page.href.replace("/english/", "").search(number) != -1;
  });

  const chinese = chineseIndex.filter((page) => {
    return page.href.replace("/chinese/", "").search(number) != -1;
  });

  return { english, chinese };
}

/**
 * Display search results
 *
 * @param  {Array} results to display
 */
function renderResults(englishResults, chineseResults) {
  var $noHymnMsg = $("<p>", {
    class: "no-hymn-msg",
  }).append("~ No hymns found ~");

  if (englishResults.length) {
    englishResults.forEach(function(result) {
      var $result = $("<li>");
      $result.append(
        $("<a>", {
          href: "." + result.href + "/", //"." to transform href to relative href "./"
          html:
            "<span class='hymn-number'>" +
            result.href.replace("/english/", "") +
            "</span> " +
            result.title,
        })
      );

      $results.append($result);
    });
  } else {
    $results.append($noHymnMsg);
  }

  if (chineseResults.length) {
    chineseResults.forEach(function(result) {
      var $chineseResult = $("<li>");
      $chineseResult.append(
        $("<a>", {
          href: "." + result.href + "/", //"." to transform href to relative href "./"
          html:
            "<span class='hymn-number'>" +
            result.href.replace("/chinese/", "") +
            "</span> " +
            result.title,
        })
      );

      $chineseResults.append($chineseResult);
    });
  } else {
    $chineseResults.append($noHymnMsg);
  }
}

async function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then(function(registration) {
        console.log("Service Worker Registered");
      });

    navigator.serviceWorker.ready.then(function(registration) {
      console.log("Service Worker Ready");
    });
  }
}

$(document).ready(function() {
  initUI();
});

$(window).on("load", () => {
  getPagesIndex().then(() => {
    //pre-load full list
    renderResults(englishIndex, chineseIndex);
  });
});

// Add service worker
registerSW();
