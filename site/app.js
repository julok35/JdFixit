/* JdFixit Mobile — flux horizontal */
(function () {
  "use strict";

  var PANELS = 6;
  var FORFAITS = [
    "Niveau 1 — Pièce simple (10 €)",
    "Niveau 2 — Pièce technique (20 €)",
    "Niveau 3 — Sur étude (dès 30 €)",
  ];

  // Coordonnées privées : contact.config.js (gitignoré) définit window.JDFIXIT_CONTACT.
  var contact = window.JDFIXIT_CONTACT || {};
  var hasWhatsApp = typeof contact.whatsapp === "string" && contact.whatsapp.replace(/\D/g, "").length >= 8;
  var hasEmail = typeof contact.email === "string" && contact.email.indexOf("@") > 0;

  var track = document.getElementById("track");
  var counter = document.getElementById("counter");
  var progressFill = document.getElementById("progressFill");
  var navPrev = document.getElementById("navPrev");
  var navNext = document.getElementById("navNext");
  var selLine = document.getElementById("selLine");
  var sheetBackdrop = document.getElementById("sheetBackdrop");
  var sheet = sheetBackdrop.querySelector(".sheet");
  var requestForm = document.getElementById("requestForm");
  var sentView = document.getElementById("sentView");
  var configWarning = document.getElementById("configWarning");
  var sendWhatsApp = document.getElementById("sendWhatsApp");
  var sendEmail = document.getElementById("sendEmail");

  var panel = 0;
  var selected = null;

  // ---- navigation horizontale ----

  function goTo(i) {
    var n = Math.max(0, Math.min(PANELS - 1, i));
    track.scrollTo({ left: n * track.clientWidth, behavior: "smooth" });
  }

  function syncNav() {
    counter.textContent = ("0" + (panel + 1)).slice(-2) + " / 0" + PANELS;
    progressFill.style.width = ((panel + 1) / PANELS) * 100 + "%";
    navPrev.hidden = panel === 0;
    navNext.hidden = panel === PANELS - 1;
  }

  track.addEventListener("scroll", function () {
    var i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== panel) {
      panel = i;
      syncNav();
    }
  }, { passive: true });

  navPrev.addEventListener("click", function () { goTo(panel - 1); });
  navNext.addEventListener("click", function () { goTo(panel + 1); });
  navNext.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(panel + 1); }
  });

  // ---- sélection de forfait ----

  var forfaitEls = document.querySelectorAll(".forfait");
  forfaitEls.forEach(function (el) {
    el.addEventListener("click", function () {
      var i = parseInt(el.dataset.forfait, 10);
      selected = selected === i ? null : i;
      forfaitEls.forEach(function (f) {
        var idx = parseInt(f.dataset.forfait, 10);
        f.classList.toggle("selected", idx === selected);
        f.querySelector(".forfait-cta").textContent = idx === selected ? "✓ Sélectionné" : "Choisir →";
      });
      selLine.textContent = selected === null ? "à définir ensemble" : FORFAITS[selected];
    });
  });

  // ---- bottom sheet ----

  document.getElementById("openSheet").addEventListener("click", function () {
    requestForm.hidden = false;
    sentView.hidden = true;
    sheetBackdrop.hidden = false;
  });

  sheetBackdrop.addEventListener("click", function () { sheetBackdrop.hidden = true; });
  sheet.addEventListener("click", function (e) { e.stopPropagation(); });
  document.getElementById("closeSent").addEventListener("click", function () { sheetBackdrop.hidden = true; });

  // ---- envoi WhatsApp / e-mail ----

  function buildMessage() {
    var data = new FormData(requestForm);
    var lines = [
      "Bonjour JdF, je vous contacte via le site JdFixit.",
      "",
      "Nom : " + (data.get("nom") || "—"),
      "Contact : " + (data.get("contact") || "—"),
      "Forfait pressenti : " + (selected === null ? "à définir ensemble" : FORFAITS[selected]),
      "",
      "Pièce & contexte :",
      (data.get("contexte") || "—"),
    ];
    return lines.join("\n");
  }

  function showSent() {
    requestForm.hidden = true;
    sentView.hidden = false;
  }

  if (!hasWhatsApp && !hasEmail) {
    configWarning.hidden = false;
    sendWhatsApp.disabled = true;
    sendEmail.disabled = true;
  } else {
    sendWhatsApp.disabled = !hasWhatsApp;
    sendEmail.disabled = !hasEmail;
  }

  sendWhatsApp.addEventListener("click", function () {
    if (!hasWhatsApp) return;
    var number = contact.whatsapp.replace(/\D/g, "");
    window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(buildMessage()), "_blank", "noopener");
    showSent();
  });

  sendEmail.addEventListener("click", function () {
    if (!hasEmail) return;
    var subject = "Demande JdFixit — " + (selected === null ? "forfait à définir" : FORFAITS[selected]);
    window.location.href = "mailto:" + contact.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(buildMessage());
    showSent();
  });

  requestForm.addEventListener("submit", function (e) { e.preventDefault(); });

  syncNav();
})();
