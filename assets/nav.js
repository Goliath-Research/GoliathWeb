(function () {
  var button = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (!button || !nav) return;
  button.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();
