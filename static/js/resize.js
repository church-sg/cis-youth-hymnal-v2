// https://dev.to/nirazanbasnet/dont-use-100vh-for-mobile-responsive-3o97

const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty("--vh", `${window.innerHeight}px`)
}
window.addEventListener("resize", documentHeight)
documentHeight()
