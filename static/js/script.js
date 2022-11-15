var $results, pagesIndex;

// Retrieve index file
async function initLunr() {
  // First retrieve the index file
  return $.getJSON("./js/lunr/PagesIndex.json")
    .done(function(index) {
      pagesIndex = index;
      console.log("index:", pagesIndex);
    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.error("Error getting Hugo index file:", err);
    });
}

// Hook up listener to the input field
function initUI() {
  $results = $("#results");

  $("#search").keyup(function() {
    $results.empty();

    var query = $(this).val();
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
  results.forEach(function(result) {
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
      .register("/cis-youth-hymnal-v2/sw.js", {
        scope: "/cis-youth-hymnal-v2/",
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
  initLunr().then(() => {
    //pre-load full list
    renderResults(pagesIndex);
  });
});

// Add service worker
registerSW();
