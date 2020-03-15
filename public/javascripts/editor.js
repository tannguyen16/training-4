var htmlIframe = document.getElementById("html-Iframe");
var cssIframe = document.getElementById("css-Iframe");
var jsIframe = document.getElementById("js-Iframe");

setTimeout(function() {
  [htmlIframe, cssIframe, jsIframe].forEach(reveal);
}, 1);

function reveal(iframe) {
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.display = "block";
  iframe.style.visibility = "visible";
}
