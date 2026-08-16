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

  /* ---------------- proje kataloğu ----------------
     Filtre + "ilk N kart" sınırı tek bir uygula() içinde birleşti.
     Sınır yalnızca "Tümü" görünümünde geçerli: bir filtre seçilince
     eşleşen kartların hepsi gösterilir (alt kümeler zaten küçük).
     Buton JS ile üretilir → üç dil dosyasına dokunmaya gerek yok;
     etiket <html lang> değerinden seçilir. JS kapalıysa 12 kart da görünür. */
  var GORUNUR = 6;
  var SOZLUK = {
    tr: { ac: "Tüm projeleri göster", kapat: "Daha az göster",
          canli: "canlı platform", depo: "kaynak deposu" },
    en: { ac: "Show all projects", kapat: "Show fewer",
          canli: "live platform", depo: "source repository" },
    ar: { ac: "عرض جميع المشاريع", kapat: "عرض أقل",
          canli: "منصة تفاعلية", depo: "مستودع المصدر" }
  };
  var dil = (document.documentElement.getAttribute("lang") || "tr").slice(0, 2);
  var m = SOZLUK[dil] || SOZLUK.tr;

  var grid = document.querySelector("#projeler .grid, #projects .grid");
  var cards = grid
    ? Array.prototype.slice.call(grid.querySelectorAll("[data-cat]"))
    : [];
  var buttons = document.querySelectorAll(".filters button");
  var aktifFiltre = "all";
  var hepsiAcik = false;
  var acButon = null;

  function uygula() {
    var eslesen = 0;
    cards.forEach(function (c) {
      var uyar = aktifFiltre === "all" ||
        c.getAttribute("data-cat").split(" ").indexOf(aktifFiltre) !== -1;
      var sinirli = aktifFiltre === "all" && !hepsiAcik && eslesen >= GORUNUR;
      if (uyar) eslesen++;
      c.style.display = uyar && !sinirli ? "" : "none";
    });
    if (acButon) {
      var gerekli = aktifFiltre === "all" && cards.length > GORUNUR;
      acButon.hidden = !gerekli;
      acButon.textContent = hepsiAcik
        ? m.kapat
        : m.ac + " (" + cards.length + ")";
      acButon.setAttribute("aria-expanded", hepsiAcik ? "true" : "false");
    }
  }

  /* Bağlantı türü etiketi: kart nereye götürüyor?
     Kod deposuna giden kartla canlı uygulamaya giden kart aynı görünüyordu;
     ziyaretçi "veritabanı"na tıklayıp GitHub deposu buluyordu. Tür adresten
     türetilir — elle etiket girilmez, yanlış etiketlenme ihtimali yok. */
  cards.forEach(function (c) {
    var a = c.querySelector("h3 a[href^='http']");
    if (!a || c.querySelector(".link-type")) return;
    var depoMu = /^https?:\/\/github\.com\//.test(a.getAttribute("href"));
    var et = document.createElement("span");
    et.className = "link-type" + (depoMu ? " repo" : "");
    et.textContent = (depoMu ? m.depo : m.canli) + " ↗";
    c.appendChild(et);
  });

  if (grid && cards.length > GORUNUR) {
    acButon = document.createElement("button");
    acButon.type = "button";
    acButon.className = "more-btn";
    acButon.addEventListener("click", function () {
      hepsiAcik = !hepsiAcik;
      uygula();
      if (!hepsiAcik) {
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    grid.parentNode.insertBefore(acButon, grid.nextSibling);
    uygula();
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      aktifFiltre = btn.getAttribute("data-filter");
      hepsiAcik = false;      // filtre değişince sınır sıfırlanır
      uygula();
    });
  });
})();
