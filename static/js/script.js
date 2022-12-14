var $results, pagesIndex;

// Retrieve index file
async function getPagesIndex() {
  // First retrieve the index file
  return $.getJSON("./js/PagesIndex.json")
    .done(function (index) {
      pagesIndex = index;
      console.log("index:", pagesIndex);
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting index file:", err);
    });
}

// Hook up listener to the input field
function initUI() {
  $results = $("#results");

  $("#search").keyup(function () {
    $results.empty();

    var query = $(this)
      .val()
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " "); //https://stackoverflow.com/a/4328546
    var results;
    if (isNaN(parseInt(query))) {
      //if query is words
      results = search(query);
    } else {
      //if query is number
      var results = numberSearch(query);
    }

    renderResults(results);
  });
}

/**
 * Trigger a search and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
  return pagesIndex.filter((page) => {
    return (
      page.title.toLowerCase().search(query.toLowerCase()) != -1 ||
      page.content.toLowerCase().search(query.toLowerCase()) != -1
    );
  });
}

function numberSearch(number) {
  // only search hymnNo to avoid searching the verse numbers
  return pagesIndex.filter((page) => {
    return page.href.replace("/hymns/", "").search(number) != -1;
  });
}

/**
 * Display search results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
  if (!results.length) return;

  // Show results
  results.forEach(function (result) {
    var $result = $("<li>");
    $result.append(
      $("<a>", {
        href: "." + result.href + "/", //"." to transform href to relative href "./"
        html:
          "<span class='hymn-number'>" +
          result.href.replace("/hymns/", "") +
          "</span> " +
          result.title,
      })
    );

    $results.append($result);
  });
}

async function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then(function (registration) {
        console.log("Service Worker Registered");
      });

    navigator.serviceWorker.ready.then(function (registration) {
      console.log("Service Worker Ready");
    });
  }
}

$(document).ready(function () {
  initUI();
});

$(window).on("load", () => {
  getPagesIndex().then(() => {
    //pre-load full list
    renderResults(pagesIndex);
  });
});

// Add service worker
registerSW();
