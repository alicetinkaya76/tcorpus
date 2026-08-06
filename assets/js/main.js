/* T-Corpus — küçük etkileşim katmanı (bağımlılıksız) */
(function () {
  // Mobil menü
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  // Proje filtreleri
  var buttons = document.querySelectorAll(".filters button");
  var cards = document.querySelectorAll("[data-cat]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) !== -1;
        c.style.display = show ? "" : "none";
      });
    });
  });
})();
