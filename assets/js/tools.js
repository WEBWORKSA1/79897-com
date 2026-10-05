/* 79897.com — tools engine: landed cost, freight, profit, lucky price, number decoder, calendar, currency */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function num(form, n) { var el = form.elements[n]; if (!el) return 0; var v = parseFloat(String(el.value).replace(/,/g, "")); return isFinite(v) ? v : 0; }
  function val(form, n) { var el = form.elements[n]; return el ? el.value : ""; }
  function money(v, cur) {
    cur = cur || "USD";
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: cur, maximumFractionDigits: v < 10 ? 2 : 0 }).format(v); }
    catch (e) { return cur + " " + v.toFixed(2); }
  }
  function money2(v, cur) {
    try { return new Intl.NumberFormat(undefined, { style: "currency", currency: cur || "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v); }
    catch (e) { return (cur || "USD") + " " + v.toFixed(2); }
  }
  function kv(k, v) { return '<div class="kv"><span>' + k + "</span><b>" + v + "</b></div>"; }
  function bars(items, total) {
    return '<div class="bars">' + items.filter(function (i) { return i[1] > 0; }).map(function (i) {
      var p = total ? Math.max(2, i[1] / total * 100) : 0;
      return '<div class="bar"><span>' + i[0] + '</span><i style="width:' + p.toFixed(1) + '%"></i><span>' + (i[1] / total * 100).toFixed(1) + "%</span></div>";
    }).join("") + "</div>";
  }
  function bind(form, fn) {
    if (!form) return;
    form.addEventListener("input", fn); form.addEventListener("change", fn);
    form.addEventListener("submit", function (e) { e.preventDefault(); fn(); });
    fn();
  }
  function quoteLink(params, label) {
    var q = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return '<div class="cta-inline"><p style="margin:0 0 10px;color:#c1cfdb;font-size:.9rem">Want real factory prices for this? Vetted sourcing partners reply within 24–48h.</p><a class="btn btn-gold btn-block" href="get-quotes.html?' + q + '#source">' + (label || "Get free supplier quotes →") + "</a></div>";
  }

  /* ---------- 1. Landed cost ---------- */
  var lc = $("#landedForm");
  bind(lc, function () {
    var cur = val(lc, "currency") || "USD";
    var unit = num(lc, "unit"), qty = Math.max(1, num(lc, "qty"));
    var goods = unit * qty, freight = num(lc, "freight");
    var ins = (goods + freight) * num(lc, "insurance") / 100;
    var basis = val(lc, "basis") === "CIF" ? goods + freight + ins : goods;
    var duty = basis * num(lc, "duty") / 100;
    var tariff = basis * num(lc, "tariff") / 100;
    var vat = (basis + duty + tariff) * num(lc, "vat") / 100;
    var pay = goods * num(lc, "payfee") / 100;
    var fees = num(lc, "broker") + num(lc, "qc") + num(lc, "other") + pay;
    var total = goods + freight + ins + duty + tariff + vat + fees;
    var per = total / qty, m = Math.min(95, num(lc, "margin")) / 100;
    var retail = per / (1 - m);
    $("#landedOut").innerHTML =
      '<p class="eyebrow" style="color:#f2c96b">Landed cost per unit</p><div class="big">' + money2(per, cur) + "</div>" +
      '<p style="color:#c1cfdb;margin:.3em 0 1em">' + (per / (unit || 1)).toFixed(2) + "× the factory price · total " + money(total, cur) + "</p>" +
      bars([["Goods", goods], ["Freight", freight], ["Insurance", ins], ["Duty", duty], ["Extra tariffs", tariff], ["VAT / GST", vat], ["Fees & QC", fees]], total) +
      kv("Goods (" + qty.toLocaleString() + " × " + money2(unit, cur) + ")", money(goods, cur)) +
      kv("Freight + insurance", money(freight + ins, cur)) + kv("Duty + tariffs", money(duty + tariff, cur)) +
      kv("VAT / GST" + (vat ? " (often reclaimable)" : ""), money(vat, cur)) + kv("Broker, QC, payment & other", money(fees, cur)) +
      kv("Retail price at " + Math.round(m * 100) + "% margin", money2(retail, cur)) +
      quoteLink({ product: val(lc, "product") || "", qty: qty, target_price: unit });
  });

  /* ---------- 2. Freight & CBM ---------- */
  var fr = $("#freightForm");
  bind(fr, function () {
    var L = num(fr, "l"), W = num(fr, "w"), H = num(fr, "h"), n = Math.max(1, num(fr, "cartons")), kg = num(fr, "kg"), upc = Math.max(1, num(fr, "units"));
    var cbm = L * W * H / 1e6 * n, gross = kg * n;
    var volAir = L * W * H / 6000 * n, volExp = L * W * H / 5000 * n;
    var chAir = Math.max(gross, volAir), chExp = Math.max(gross, volExp);
    var units = n * upc;
    var lcl = Math.max(1, cbm) * num(fr, "rLcl") + num(fr, "rLclMin");
    var opts = [
      ["Sea LCL (shared container)", lcl, "25–45 days door to door"],
      ["Sea FCL 20ft (≈28 CBM usable)", cbm <= 28 ? num(fr, "r20") : null, "25–40 days"],
      ["Sea FCL 40ft (≈58 CBM usable)", cbm <= 58 ? num(fr, "r40") : null, "25–40 days"],
      ["Air freight", chAir * num(fr, "rAir"), "5–10 days"],
      ["Express courier", chExp * num(fr, "rExp"), "3–7 days"]
    ];
    var rows = opts.map(function (o) {
      return o[1] == null ? kv(o[0], "too large") : '<div class="kv"><span>' + o[0] + "<br><small>" + o[2] + "</small></span><b>" + money(o[1]) + "<br><small>" + money2(o[1] / units) + "/unit</small></b></div>";
    }).join("");
    var best = opts.filter(function (o) { return o[1] != null; }).sort(function (a, b) { return a[1] - b[1]; })[0];
    $("#freightOut").innerHTML =
      '<p class="eyebrow" style="color:#f2c96b">Shipment size</p><div class="big">' + cbm.toFixed(2) + " CBM</div>" +
      '<p style="color:#c1cfdb">' + gross.toFixed(0) + " kg gross · air chargeable " + chAir.toFixed(0) + " kg · express chargeable " + chExp.toFixed(0) + " kg · " + units.toLocaleString() + " units</p>" +
      rows + '<p style="color:#c1cfdb;font-size:.85rem;margin-top:10px">Cheapest: <b style="color:#fff">' + best[0] + "</b>. Rates are editable estimates and move weekly. Confirm with a forwarder.</p>" +
      '<div class="cta-inline"><a class="btn btn-gold btn-block" href="get-quotes.html?shipping=' + encodeURIComponent(best[0]) + '#source">Get forwarder &amp; supplier quotes →</a></div>';
  });

  /* ---------- 3. Profit & MOQ ---------- */
  var pf = $("#profitForm");
  bind(pf, function () {
    var cost = num(pf, "landed"), price = num(pf, "price"), fee = num(pf, "fee") / 100, ful = num(pf, "fulfil"), ads = num(pf, "ads"), ret = num(pf, "returns") / 100, moq = Math.max(1, num(pf, "moq")), fixed = num(pf, "fixed");
    var net = price * (1 - fee) - ful - ads - price * ret - cost;
    var margin = price ? net / price * 100 : 0;
    var cash = moq * cost + fixed;
    var roi = cash ? (net * moq - fixed) / cash * 100 : 0;
    var be = net > 0 ? Math.ceil((moq * cost + fixed) / (net + cost)) : null;
    var col = net > 0 ? "#7ee2c4" : "#ff9b8a";
    $("#profitOut").innerHTML =
      '<p class="eyebrow" style="color:#f2c96b">Net profit per unit</p><div class="big" style="color:' + col + '">' + money2(net) + "</div>" +
      '<p style="color:#c1cfdb">' + margin.toFixed(1) + "% net margin</p>" +
      kv("Cash needed for first order (MOQ " + moq.toLocaleString() + ")", money(cash)) +
      kv("Profit if the full MOQ sells", money(net * moq - fixed)) +
      kv("ROI on first order", roi.toFixed(0) + "%") +
      kv("Units to sell to recover cash", be ? be.toLocaleString() + " of " + moq.toLocaleString() : "never at this price") +
      '<p style="color:#c1cfdb;font-size:.85rem;margin-top:10px">' + (margin < 20 ? "Under a 20% net margin, one bad batch or ad spike wipes out profit. Negotiate the unit price or raise retail." : margin < 35 ? "Healthy but tight. Test a lucky-number price point (e.g. ending in 8) and negotiate a lower MOQ." : "Strong unit economics. The risk now is quality, so book a pre-shipment inspection.") + "</p>" +
      quoteLink({ target_price: (cost * 0.6).toFixed(2), qty: moq }, "Get lower factory quotes →");
  });

  /* ---------- number meaning engine ---------- */
  var DIG = {
    "0": ["零", "líng", "灵 spirit · wholeness", 1], "1": ["一", "yī", "要 'will' · unity, first", 1],
    "2": ["二", "èr", "双 pairs · 易 easy", 2], "3": ["三", "sān", "生 life (Cantonese) · 散 scatter", 1],
    "4": ["四", "sì", "死 death. Widely avoided", -5], "5": ["五", "wǔ", "我 me · 无 nothing", 0],
    "6": ["六", "liù", "流 smooth flow · 禄 fortune", 3], "7": ["七", "qī", "起 rise · 齐 together", 1],
    "8": ["八", "bā", "发 prosper, get rich", 4], "9": ["九", "jiǔ", "久 long-lasting", 3]
  };
  var COMBOS = [
    ["1688", "一路发发 prosper all the way, doubly", 10], ["5918", "我就要发 I'm about to prosper", 8], ["1314", "一生一世 a whole lifetime", 7],
    ["168", "一路发 prosper all the way", 9], ["518", "我要发 I will prosper", 8], ["520", "我爱你 I love you", 5], ["888", "发发发 triple prosperity", 10],
    ["666", "六六六 everything smooth (also 'awesome')", 7], ["999", "久久久 forever", 7], ["989", "久发久 lasting prosperity", 6],
    ["798", "Beijing's 798 Art Zone", 2], ["748", "去死吧 'go die'", -10], ["514", "我要死 'I'll die'", -10], ["250", "二百五 'fool'", -6],
    ["88", "发发 double prosperity (also 'bye-bye')", 6], ["99", "久久 forever", 5], ["98", "久发 lasting prosperity", 4], ["89", "发久 prosperity that lasts", 4],
    ["68", "路发 road to wealth", 4], ["28", "易发 easy prosperity", 4], ["58", "我发 I prosper", 3], ["66", "顺顺 smooth, smooth", 4],
    ["14", "要死 'want to die'", -8], ["74", "气死 'furious to death'", -6], ["38", "三八 an insult", -4], ["44", "死死 double death", -8]
  ];
  function analyze(raw) {
    var d = String(raw).replace(/\D/g, "");
    if (!d) return null;
    var sum = 0, rows = [], found = [];
    d.split("").forEach(function (c) { sum += DIG[c][3]; });
    var avg = sum / d.length;
    var score = 50 + avg * 10;
    var used = {};
    COMBOS.forEach(function (c) {
      var idx = d.indexOf(c[0]);
      if (idx > -1 && !used[c[0]]) { used[c[0]] = 1; found.push(c); score += c[2]; }
    });
    var pal = d.length > 2 && d === d.split("").reverse().join("");
    if (pal) score += 5;
    if (/(\d)\1\1/.test(d) && !/444/.test(d)) score += 4;
    var fours = (d.match(/4/g) || []).length;
    score = Math.max(0, Math.min(100, Math.round(score)));
    var verdict = score >= 85 ? "Excellent: premium-grade number" : score >= 70 ? "Very good: auspicious" : score >= 55 ? "Good: positive overall" : score >= 40 ? "Neutral" : "Weak: likely avoided by Chinese buyers";
    return { d: d, score: score, verdict: verdict, pal: pal, fours: fours, combos: found, sum: d.split("").reduce(function (a, c) { return a + +c; }, 0) };
  }
  window.N79897 = { analyze: analyze, DIG: DIG };

  var nd = $("#decoderForm");
  bind(nd, function () {
    var r = analyze(val(nd, "number"));
    var out = $("#decoderOut");
    if (!r) { out.innerHTML = "<p>Type a number to decode it.</p>"; return; }
    var digits = r.d.split("").map(function (c) { var x = DIG[c]; return '<div class="decode-row"><b>' + c + '</b><div><span class="cn" style="color:#f2c96b">' + x[0] + "</span> " + x[1] + ' · <span style="color:#c1cfdb">' + x[2] + "</span></div></div>"; }).join("");
    var combos = r.combos.length ? r.combos.map(function (c) { return '<div class="kv"><span>' + c[0] + " · " + c[1] + "</span><b>" + (c[2] > 0 ? "+" : "") + c[2] + "</b></div>"; }).join("") : '<p style="color:#c1cfdb">No famous combinations found.</p>';
    out.innerHTML = '<p class="eyebrow" style="color:#f2c96b">Prosperity score</p><div class="score">' + r.score + '<small style="font-size:1rem;color:#c1cfdb">/100</small></div><p>' + r.verdict + "</p>" +
      kv("Palindrome (回文)", r.pal ? "Yes, symmetrical" : "No") + kv("Unlucky 4s", r.fours ? r.fours + " found" : "None") + kv("Digit sum", r.sum) +
      "<h3 style='margin-top:16px;font-size:1rem'>Combinations</h3>" + combos + "<h3 style='margin-top:16px;font-size:1rem'>Digit by digit</h3>" + digits +
      '<div class="cta-inline"><a class="btn btn-gold btn-block" href="get-quotes.html#brand">Get a lucky-number branding &amp; pricing audit →</a></div>';
  });

  /* ---------- lucky price generator ---------- */
  var lp = $("#luckyForm");
  bind(lp, function () {
    var p = num(lp, "price"), cur = val(lp, "currency") || "CNY", out = $("#luckyOut");
    if (!(p > 0)) { out.innerHTML = "<p>Enter a price.</p>"; return; }
    var lo = p * (1 - num(lp, "range") / 100), hi = p * (1 + num(lp, "range") / 100), cand = {};
    function add(x) { x = Math.round(x * 100) / 100; if (x >= lo && x <= hi && x > 0) cand[x.toFixed(2)] = x; }
    var mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(p)) - 1));
    for (var b = Math.floor(lo / 10) * 10; b <= hi + 10; b += 10) { add(b + 8); add(b + 8.88); add(b + 8.8); add(b + 6); add(b + 9); }
    for (var c = Math.floor(lo / 100) * 100; c <= hi + 100; c += 100) { add(c + 88); add(c + 68); add(c + 98); add(c + 99); add(c + 66); add(c + 18); add(c + 28); }
    [168, 188, 268, 288, 368, 388, 518, 568, 588, 668, 688, 868, 888, 998, 1088, 1188, 1288, 1688, 1888, 2888, 3888, 5888, 6888, 8888, 9888, 16888, 18888, 28888, 68888, 88888, 99999].forEach(function (s) {
      for (var m = 0.01; m <= 1000; m *= 10) add(s * m);
    });
    if (mag >= 100) for (var d = Math.floor(lo / mag) * mag; d <= hi + mag; d += mag) { add(d + mag * 0.88); add(d + mag * 0.68); add(d + mag * 0.98); }
    var list = Object.keys(cand).map(function (k) {
      var x = cand[k], a = analyze(k.replace(/\.00$/, ""));
      var dist = Math.abs(x - p) / p * 100;
      return { x: x, s: a.score - dist * 1.2, a: a, delta: (x - p) / p * 100 };
    }).filter(function (o) { return o.a.fours === 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 10);
    var orig = analyze(String(p));
    out.innerHTML = '<p class="eyebrow" style="color:#f2c96b">Your price ' + money2(p, cur) + "</p>" +
      '<p style="color:#c1cfdb">Score ' + orig.score + "/100 · " + orig.verdict + (orig.fours ? ' · <b style="color:#ff9b8a">contains ' + orig.fours + " × 4, avoid</b>" : "") + "</p>" +
      '<h3 style="font-size:1rem">Best lucky price points</h3><div class="pill-list">' + list.map(function (o) {
        return '<button type="button" class="pill" data-copy="' + o.x + '">' + money2(o.x, cur) + "<small>" + (o.delta >= 0 ? "+" : "") + o.delta.toFixed(1) + "% · score " + o.a.score + "</small></button>";
      }).join("") + "</div>" +
      '<p style="color:#c1cfdb;font-size:.85rem;margin-top:12px">Tap a price to copy it. Prices ending in 8 signal 发 (prosperity). 9 signals 久 (lasting). Any 4 is filtered out.</p>' +
      '<div class="cta-inline"><a class="btn btn-gold btn-block" href="get-quotes.html#brand">Audit my full price list →</a></div>';
  });
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    if (navigator.clipboard) navigator.clipboard.writeText(b.getAttribute("data-copy")).then(function () { window.toast && window.toast("Copied " + b.getAttribute("data-copy")); });
  });

  /* ---------- China business calendar ---------- */
  var EVENTS = [
    ["2026-10-01", "2026-10-07", "National Day Golden Week", "holiday", "Factories and offices close. Expect slow replies and port backlogs either side."],
    ["2026-10-15", "2026-10-19", "Canton Fair (140th), Phase 1", "fair", "Guangzhou. Electronics, appliances, machinery, vehicles, hardware, new energy."],
    ["2026-10-18", "2026-10-18", "Double Ninth Festival (重阳节)", "holiday", "Honouring elders. 9/9 = 久久, longevity. A good theme for senior-care and wellness brands."],
    ["2026-10-23", "2026-10-27", "Canton Fair (140th), Phase 2", "fair", "Houseware, gifts, decorations, building materials, furniture."],
    ["2026-10-31", "2026-11-04", "Canton Fair (140th), Phase 3", "fair", "Textiles, apparel, shoes, bags, office supplies, food, health and medical."],
    ["2026-11-11", "2026-11-11", "Double 11 / Singles' Day (双十一)", "shopping", "The world's largest shopping event. 2025 GMV was ¥1.695T (Syntun). Presales start in late October."],
    ["2026-11-30", "2026-11-30", "Recommended last sea-freight PO before CNY", "shutdown", "Place orders by about now to ship by sea before the Spring Festival slowdown."],
    ["2026-12-12", "2026-12-12", "Double 12 (双十二)", "shopping", "Year-end sale on Taobao, Tmall and JD."],
    ["2027-01-01", "2027-01-01", "New Year's Day", "holiday", "Public holiday (1–3 Jan)."],
    ["2027-01-15", "2027-01-15", "Pre-CNY factory slowdown begins (approx.)", "shutdown", "Workers start travelling home. Lock in QC and loading dates now."],
    ["2027-02-05", "2027-02-12", "Spring Festival / Chinese New Year (春节)", "holiday", "Year of the Goat begins 6 Feb 2027. Official holiday 5–12 Feb. Factories are often closed 2–4 weeks."],
    ["2027-02-20", "2027-02-20", "Lantern Festival (元宵节)", "holiday", "Unofficial end of CNY. Many factories restart around now."],
    ["2027-03-08", "2027-03-08", "Factories near full production (approx.) · 3.8 'Queen's Day' sales", "shutdown", "10–30% of workers may not return after CNY. Inspect the first batches closely."],
    ["2027-04-03", "2027-04-05", "Qingming Festival (清明节)", "holiday", "Tomb-sweeping holiday."],
    ["2027-04-15", "2027-05-05", "Canton Fair (141st), spring session (expected)", "fair", "Three phases in Guangzhou. Confirm exact dates on the official site."],
    ["2027-05-01", "2027-05-05", "Labour Day holiday", "holiday", "Five-day break. Domestic travel peak."],
    ["2027-05-20", "2027-05-20", "520 'I love you' Day", "shopping", "5-2-0 sounds like 我爱你. Gifting and jewellery campaigns."],
    ["2027-06-09", "2027-06-09", "Dragon Boat Festival (端午节)", "holiday", "Public holiday. Zongzi gifting season."],
    ["2027-06-18", "2027-06-18", "618 Shopping Festival", "shopping", "JD's anniversary sale and now a platform-wide mid-year event. Presales from late May."],
    ["2027-08-08", "2027-08-08", "Qixi, Chinese Valentine's Day (七夕)", "shopping", "Luxury, beauty and gifting peak."],
    ["2027-09-15", "2027-09-15", "Mid-Autumn Festival (中秋节)", "holiday", "Mooncake and corporate-gift season. Gift orders are placed 6–10 weeks ahead."],
    ["2027-10-01", "2027-10-07", "National Day Golden Week", "holiday", "Week-long national holiday."],
    ["2027-10-08", "2027-10-08", "Double Ninth Festival (重阳节)", "holiday", "Longevity festival (9/9)."],
    ["2027-10-15", "2027-11-04", "Canton Fair (142nd), autumn session (expected)", "fair", "Three phases. Confirm on the official site."],
    ["2027-11-11", "2027-11-11", "Double 11 / Singles' Day", "shopping", "Global shopping peak."],
    ["2027-12-12", "2027-12-12", "Double 12", "shopping", "Year-end sale."]
  ];
  window.EVENTS79897 = EVENTS;
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function ics(list) {
    var z = function (s) { return s.replace(/-/g, ""); };
    var nextDay = function (s) { var d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10).replace(/-/g, ""); };
    var body = list.map(function (e, i) {
      return ["BEGIN:VEVENT", "UID:79897-" + z(e[0]) + "-" + i + "@79897.com", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
        "DTSTART;VALUE=DATE:" + z(e[0]), "DTEND;VALUE=DATE:" + nextDay(e[1]), "SUMMARY:" + e[2].replace(/,/g, "\\,"), "DESCRIPTION:" + e[4].replace(/,/g, "\\,") + " (79897.com China Business Calendar)", "END:VEVENT"].join("\r\n");
    }).join("\r\n");
    var txt = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//79897.com//China Business Calendar//EN\r\nCALSCALE:GREGORIAN\r\n" + body + "\r\nEND:VCALENDAR";
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar" }));
    a.download = list.length > 1 ? "79897-china-business-calendar.ics" : "79897-" + z(list[0][0]) + ".ics";
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 100);
  }
  var cal = $("#calendar");
  if (cal) {
    var filter = "all";
    var render = function () {
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var limit = +cal.getAttribute("data-limit") || 999;
      var list = EVENTS.filter(function (e) { return filter === "all" || e[3] === filter; });
      if (cal.hasAttribute("data-upcoming")) list = list.filter(function (e) { return new Date(e[1] + "T23:59:59") >= now; });
      cal.innerHTML = list.slice(0, limit).map(function (e) {
        var s = new Date(e[0] + "T00:00:00"), en = new Date(e[1] + "T23:59:59");
        var days = Math.ceil((s - now) / 864e5);
        var past = en < now, live = s <= now && en >= now;
        var cd = past ? "Passed" : live ? "Happening now" : days === 1 ? "Tomorrow" : "In " + days + " days";
        var range = e[0] === e[1] ? "" : " – " + MON[en.getMonth()] + " " + en.getDate();
        return '<article class="event t-' + e[3] + (past ? " past" : "") + '"><div class="date"><span>' + MON[s.getMonth()] + " " + s.getFullYear() + "</span><b>" + s.getDate() + "</b></div>" +
          "<div><h3>" + e[2] + "</h3><p>" + e[4] + (range ? " <b>Until " + range.replace(" – ", "") + ".</b>" : "") + '</p></div><div class="actions"><div class="cd">' + cd +
          '</div><button class="btn btn-ghost btn-sm" type="button" data-ics="' + EVENTS.indexOf(e) + '">+ Calendar</button></div></article>';
      }).join("") || "<p>No events in this category.</p>";
    };
    $$("[data-cal]").forEach(function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-cal");
        $$("[data-cal]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); render();
      });
    });
    cal.addEventListener("click", function (e) { var b = e.target.closest("[data-ics]"); if (b) ics([EVENTS[+b.getAttribute("data-ics")]]); });
    var all = $("#icsAll"); if (all) all.addEventListener("click", function () { ics(EVENTS); });
    render();
  }

  /* ---------- currency ---------- */
  var cv = $("#fxForm");
  if (cv) {
    var FALLBACK = { CNY: 1, USD: 0.1405, EUR: 0.1205, GBP: 0.1045, CAD: 0.1955, AUD: 0.2135, INR: 12.35, JPY: 21.1, HKD: 1.094, SGD: 0.1815, AED: 0.516, MYR: 0.595, KRW: 196, CHF: 0.112, NZD: 0.237, THB: 4.6, VND: 3650, BRL: 0.77, MXN: 2.62, ZAR: 2.5 };
    var rates = FALLBACK, live = false, stamp = "";
    var calc = function () {
      var amt = num(cv, "amount"), from = val(cv, "from"), to = val(cv, "to");
      var r = (rates[to] || 1) / (rates[from] || 1), res = amt * r;
      var a = analyze(res.toFixed(2).replace(".", ""));
      $("#fxOut").innerHTML = '<p class="eyebrow" style="color:#f2c96b">' + amt.toLocaleString() + " " + from + " =</p><div class=\"big\">" + money2(res, to) + "</div>" +
        kv("1 " + from, (r).toFixed(4) + " " + to) + kv("1 " + to, (1 / r).toFixed(4) + " " + from) +
        kv("Rate source", live ? "Live, ExchangeRate-API (" + stamp + ")" : "Offline estimate. Check your bank") +
        kv("Lucky score of result", a ? a.score + "/100" : "-") +
        '<div class="cta-inline"><a class="btn btn-gold btn-block" href="landed-cost-calculator.html">Calculate full landed cost →</a></div>';
    };
    bind(cv, calc);
    var sw = $("#fxSwap"); if (sw) sw.addEventListener("click", function () { var f = cv.elements.from.value; cv.elements.from.value = cv.elements.to.value; cv.elements.to.value = f; calc(); });
    fetch("https://open.er-api.com/v6/latest/CNY").then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.rates) { rates = j.rates; live = true; stamp = (j.time_last_update_utc || "").slice(5, 16); calc(); }
    }).catch(function () {});
  }

  /* ---------- home quick tools ---------- */
  var hq = $("#heroDecoder");
  if (hq) {
    var hqRun = function () {
      var r = analyze(hq.elements.n.value), o = $("#heroDecoderOut");
      if (!r) { o.textContent = ""; return; }
      o.innerHTML = "<b>" + r.score + "/100</b> · " + r.verdict + (r.combos.length ? " · " + r.combos.slice(0, 2).map(function (c) { return c[0] + " = " + c[1]; }).join("; ") : "");
    };
    hq.addEventListener("input", hqRun); hq.addEventListener("submit", function (e) { e.preventDefault(); location.href = "number-decoder.html?number=" + encodeURIComponent(hq.elements.n.value); });
    hqRun();
  }
})();
