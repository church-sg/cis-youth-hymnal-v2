var $results, pagesIndex

// Retrieve index file
async function initLunr() {
  // First retrieve the index file
  $.getJSON("./js/lunr/PagesIndex.json")
    .done(function (index) {
      pagesIndex = index
      console.log("index:", pagesIndex)
    })
    .fail(function (jqxhr, textStatus, error) {
      var err = textStatus + ", " + error
      console.error("Error getting Hugo index file:", err)
    })
}

// Hook up listener to the input field
function initUI() {
  $results = $("#results")

  $("#search").keyup(function () {
    $results.empty()

    var query = $(this).val()
    var results
    if (isNaN(parseInt(query))) {
      //if query is words
      results = search(query)
    } else {
      //if query is number
      var results = numberSearch(query)
    }

    renderResults(results)
  })
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
    )
  })
}

function numberSearch(number) {
  // only search hymnNo to avoid searching the verse numbers
  return pagesIndex.filter((page) => {
    return page.href.replace("/hymns/", "").search(number) != -1
  })
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
  if (!results.length) {
    return
  }

  // Only show the ten first results
  results.slice(0, 10).forEach(function (result) {
    var $result = $("<li class='box'>")
    $result.append(
      $("<a>", {
        href: result.href,
        text: result.href.replace("/hymns/", "") + " " + result.title,
        class: "title is-4",
      })
    )

    $results.append($result)
  })
}

$(document).ready(function () {
  initUI()
})

// Let's get started
initLunr().then(() => {
  //pre-load full list
  $(window).on("load", () => {
    renderResults(pagesIndex)
  })
})
