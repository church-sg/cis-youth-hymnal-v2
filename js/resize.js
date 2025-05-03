// https://dev.to/nirazanbasnet/dont-use-100vh-for-mobile-responsive-3o97

const setDocHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--vh", `${window.innerHeight}px`);

  // show content after size is set
  const content = document.getElementsByClassName("content")[0];
  if (content.style.visibility == "hidden") {
    content.style.visibility = "visible";
  }
};

window.addEventListener("resize", setDocHeight);

// hide content before size is set because otherwise there are ugly artifacts
document.getElementsByClassName("content")[0].style.visibility = "hidden";
// window.innerHeight bug: https://bugzilla.mozilla.org/show_bug.cgi?id=771575
setTimeout(setDocHeight, 50); // Minimum seems to be 20, but 50 just to be safe
