/* 79897.com — UI, forms, ads, consent, media */
(function () {
  "use strict";
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toast ---------- */
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 4200);
  }
  window.toast = toast;

  /* ---------- year ---------- */
  $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- theme ---------- */
  var tt = $("#themeToggle");
  if (tt) tt.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", cur); store.set("theme", cur);
  });

  /* ---------- nav ---------- */
  var nav = $(".main-nav"), menuBtn = $("#menuBtn"), backdrop;
  function closeNav() {
    if (!nav) return; nav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (backdrop) { backdrop.remove(); backdrop = null; }
  }
  if (menuBtn) menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("open");
    if (!open) return closeNav();
    nav.classList.add("open"); menuBtn.setAttribute("aria-expanded", "true");
    backdrop = document.createElement("div"); backdrop.className = "nav-backdrop";
    backdrop.addEventListener("click", closeNav); document.body.appendChild(backdrop);
  });
  $$(".has-menu > button").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = b.parentElement, was = li.classList.contains("open");
      $$(".has-menu.open").forEach(function (x) { x.classList.remove("open"); x.firstElementChild.setAttribute("aria-expanded", "false"); });
      if (!was) { li.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-menu")) $$(".has-menu.open").forEach(function (x) { x.classList.remove("open"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeNav(); $$(".modal").forEach(function (m) { m.hidden = true; }); }
  });
  var here = location.pathname.split("/").pop() || "index.html";
  $$(".main-nav a").forEach(function (a) { if (a.getAttribute("href") === here) a.classList.add("active"); });

  /* ---------- scroll UI ---------- */
  var toTop = $("#toTop"), mcta = $(".mobile-cta");
  var onQuotes = /get-quotes/.test(here);
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (toTop) toTop.classList.toggle("show", y > 700);
    if (mcta && !onQuotes) mcta.classList.toggle("show", y > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  /* ---------- reveal ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- consent, analytics, ads ---------- */
  var consent = store.get("consent");
  var cookie = $("#cookie");
  if (!consent && cookie) cookie.hidden = false;
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () {
      consent = b.getAttribute("data-consent"); store.set("consent", consent);
      if (cookie) cookie.hidden = true;
      if (consent === "all") { loadGA(); renderAds(); }
    });
  });
  function adsReady() { return S.adsenseClient && S.adsenseClient.indexOf("XXXX") === -1; }
  function loadGA() {
    if (!S.ga4 || window.gtag) return;
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + S.ga4; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", S.ga4, { anonymize_ip: true });
  }
  var adsLoaded = false;
  function renderAds() {
    $$(".ad-slot").forEach(function (slot) {
      if (slot.dataset.done) return;
      var key = slot.getAttribute("data-slot") || "top";
      if (adsReady() && consent === "all") {
        if (!adsLoaded) {
          var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
          s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + S.adsenseClient;
          document.head.appendChild(s); adsLoaded = true;
        }
        slot.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block;width:100%" data-ad-client="' +
          S.adsenseClient + '" data-ad-slot="' + ((S.adSlots || {})[key] || "") + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      } else {
        slot.innerHTML = '<div class="ad-house"><span><b>Advertise here.</b> Reach importers, Amazon sellers and brands entering China.</span><a class="btn btn-sm btn-ghost" href="advertise.html">See placements</a></div>';
      }
      slot.dataset.done = "1";
    });
  }
  if (consent === "all") loadGA();
  renderAds();

  /* ---------- tabs ---------- */
  $$("[role=tablist]").forEach(function (list) {
    var tabs = $$("[role=tab]", list);
    function select(tab, push) {
      tabs.forEach(function (t) {
        var on = t === tab; t.setAttribute("aria-selected", on ? "true" : "false");
        var p = document.getElementById(t.getAttribute("aria-controls")); if (p) p.hidden = !on;
      });
      if (push && tab.dataset.hash) history.replaceState(null, "", "#" + tab.dataset.hash);
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { select(t, true); }); });
    var h = location.hash.replace("#", "");
    var match = tabs.filter(function (t) { return t.dataset.hash === h; })[0];
    if (match) { select(match, false); setTimeout(function () { list.scrollIntoView({ block: "start" }); }, 50); }
  });

  /* ---------- forms ---------- */
  function inbox() {
    var k = S._k || [], out = "";
    for (var i = 0; i < k.length; i++) out += String.fromCharCode(k[i] ^ ((29 + i * 7) % 256));
    return out;
  }
  function validate(scope) {
    var ok = true, first = null;
    $$("input,select,textarea", scope).forEach(function (el) {
      if (el.classList.contains("hp") || el.disabled) return;
      el.classList.remove("err");
      if (!el.checkValidity()) { ok = false; el.classList.add("err"); if (!first) first = el; }
    });
    if (first) { first.focus(); toast("Please complete the highlighted field."); }
    return ok;
  }
  function payload(form) {
    var fd = new FormData(form), data = {};
    fd.forEach(function (v, k) {
      if (k === "_honey") return;
      if (data[k]) data[k] += ", " + v; else data[k] = v;
    });
    return data;
  }
  function setStep(form, n) {
    var steps = $$(".step", form); if (!steps.length) return;
    n = Math.max(0, Math.min(n, steps.length - 1));
    steps.forEach(function (s, i) { s.hidden = i !== n; });
    form.dataset.step = n;
    var bar = $(".progress > i", form); if (bar) bar.style.width = ((n + 1) / steps.length * 100) + "%";
    var lab = $(".js-stepnum", form); if (lab) lab.textContent = (n + 1) + " of " + steps.length;
    var leg = $("legend", steps[n]); var ln = $(".js-steptitle", form); if (ln && leg) ln.textContent = leg.textContent;
  }
  $$(".js-form").forEach(function (form) {
    form.setAttribute("novalidate", "");
    if ($$(".step", form).length) setStep(form, 0);
    form.addEventListener("click", function (e) {
      var nx = e.target.closest("[data-next]"), pv = e.target.closest("[data-prev]");
      var cur = +form.dataset.step || 0;
      if (nx) { e.preventDefault(); if (validate($$(".step", form)[cur])) { setStep(form, cur + 1); form.scrollIntoView({ block: "start", behavior: "smooth" }); } }
      if (pv) { e.preventDefault(); setStep(form, cur - 1); }
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var steps = $$(".step", form);
      var scope = steps.length ? steps[+form.dataset.step || 0] : form;
      if (steps.length && (+form.dataset.step || 0) < steps.length - 1) {
        if (validate(scope)) setStep(form, (+form.dataset.step || 0) + 1);
        return;
      }
      if (!validate(scope)) return;
      var hp = $(".hp", form); if (hp && hp.value) return;
      var btn = $("button[type=submit]", form) || {};
      var label = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
      var data = payload(form);
      data._subject = "[79897] " + (form.dataset.form || "Website form");
      data._template = "table"; data._captcha = "false";
      data.page = location.href; data.submitted = new Date().toISOString();
      fetch((S.formEndpoint || "https://formsubmit.co/ajax/") + inbox(), {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j.success) === "false") throw new Error(res.j.message || "failed");
          var msg = form.dataset.success || "Thank you. We received your message.";
          var box = document.createElement("div"); box.className = "form-success";
          box.innerHTML = '<div class="big" aria-hidden="true">✅</div><h3>Received</h3><p></p><a class="btn btn-ghost btn-sm" href="tools.html">Explore free tools</a>';
          box.querySelector("p").textContent = msg;
          form.replaceWith(box);
          if (window.gtag) window.gtag("event", "generate_lead", { form: form.dataset.form });
          var m = box.closest(".modal"); if (m) setTimeout(function () { m.hidden = true; }, 2600);
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = label;
          toast("Sorry, that didn't go through. Please try again in a moment.");
        });
    });
  });

  /* ---------- prefill quote form from tools (?product=…&qty=…) ---------- */
  try {
    var qs = new URLSearchParams(location.search);
    qs.forEach(function (v, k) { $$('[name="' + k + '"]').forEach(function (el) { if (el.type !== "checkbox" && el.type !== "radio") el.value = v; }); });
  } catch (e) {}

  /* ---------- modal (exit intent) ---------- */
  var modal = $("#nlModal");
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", function () { b.closest(".modal").hidden = true; }); });
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) modal.hidden = true; });
  function maybeModal() {
    if (!modal || onQuotes) return;
    var last = +store.get("nlShown") || 0;
    if (Date.now() - last < 7 * 864e5) return;
    store.set("nlShown", Date.now()); modal.hidden = false;
  }
  document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) maybeModal(); });
  setTimeout(function () { if (window.innerWidth < 760 && window.scrollY > 1200) maybeModal(); }, 45000);
  $$("[data-open-modal]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); if (modal) modal.hidden = false; }); });

  /* ---------- videos ---------- */
  function videoCard(v) {
    return '<div class="vcard js-item" data-cat="' + v.tag + '"><div class="video" data-id="' + v.id + '" role="button" tabindex="0" aria-label="Play: ' +
      v.title.replace(/"/g, "&quot;") + '"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg"><span class="play" aria-hidden="true">▶</span></div><p class="video-title">' +
      v.title + "</p></div>";
  }
  $$(".js-videos").forEach(function (box) {
    var tag = box.getAttribute("data-tag"), lim = +box.getAttribute("data-limit") || 99;
    var vids = (S.videos || []).filter(function (v) { return !tag || v.tag === tag; }).slice(0, lim);
    box.innerHTML = vids.map(videoCard).join("");
  });
  document.addEventListener("click", function (e) {
    var v = e.target.closest(".video[data-id]"); if (!v || v.dataset.on) return;
    v.dataset.on = 1;
    v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + v.dataset.id + '?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.matches && e.target.matches(".video[data-id]")) e.target.click(); });
  $$(".js-channel").forEach(function (a) { if (S.youtubeChannel) a.href = S.youtubeChannel; else a.href = "videos.html"; });

  /* ---------- filter (guides/videos) ---------- */
  $$(".js-filter-wrap").forEach(function (wrap) {
    var input = $(".js-filter", wrap), cat = "all";
    var btns = $$("[data-cat-btn]", wrap);
    function apply() {
      var q = (input && input.value || "").toLowerCase();
      $$(".js-item", wrap).forEach(function (it) {
        var okc = cat === "all" || (it.getAttribute("data-cat") || "").indexOf(cat) > -1;
        var okq = !q || it.textContent.toLowerCase().indexOf(q) > -1;
        it.style.display = okc && okq ? "" : "none";
      });
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        cat = b.getAttribute("data-cat-btn");
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); apply();
      });
    });
    if (input) {
      input.addEventListener("input", apply);
      try { var q = new URLSearchParams(location.search).get("q"); if (q) { input.value = q; } } catch (e) {}
    }
    apply();
  });

  /* ---------- donations ---------- */
  var D = S.donate || {};
  $$("[data-donate]").forEach(function (a) {
    var k = a.getAttribute("data-donate");
    if (D[k]) { a.href = D[k]; a.target = "_blank"; a.rel = "noopener"; }
    else { a.href = "#pledge"; a.addEventListener("click", function () { var s = $('#pledge select[name="method"]'); if (s) s.value = a.textContent.trim(); }); }
  });
  $$(".js-tier").forEach(function (b) {
    b.addEventListener("click", function () {
      var amt = $('#pledge [name="amount"]'); if (amt) amt.value = b.getAttribute("data-amt");
      var t = $('#pledge [name="tier"]'); if (t) t.value = b.getAttribute("data-tier");
    });
  });
  var F = S.fundraising;
  $$(".js-fund").forEach(function (el) {
    if (!F) return;
    var pct = Math.min(100, Math.round((F.raised / F.goal) * 100));
    $(".fund-bar i", el).style.width = Math.max(pct, 2) + "%";
    $(".js-fund-text", el).textContent = F.currency + " " + F.raised.toLocaleString() + " raised of " + F.currency + " " + F.goal.toLocaleString() + " goal (" + pct + "%)";
  });

  /* ---------- countdown ---------- */
  function tick() {
    $$(".js-countdown").forEach(function (el) {
      var t = new Date(el.getAttribute("data-date")).getTime() - Date.now();
      if (t < 0) t = 0;
      var d = Math.floor(t / 864e5), h = Math.floor(t % 864e5 / 36e5), m = Math.floor(t % 36e5 / 6e4), s = Math.floor(t % 6e4 / 1e3);
      el.innerHTML = "<div><b>" + d + "</b><span>days</span></div><div><b>" + h + "</b><span>hrs</span></div><div><b>" + m + "</b><span>min</span></div><div><b>" + s + "</b><span>sec</span></div>";
    });
  }
  if ($(".js-countdown")) { tick(); setInterval(tick, 1000); }

  /* ---------- share / copy ---------- */
  $$(".js-share").forEach(function (b) {
    b.addEventListener("click", function () {
      var data = { title: document.title, url: location.href };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast("Link copied"); });
    });
  });
})();
