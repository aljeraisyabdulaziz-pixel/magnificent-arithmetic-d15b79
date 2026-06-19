/* حاسبة كينغ شوت — منطق التطبيق (كود أصلي)
   البيانات الرقمية مأخوذة من حقائق اللعبة (window.KS_DATA). */
(function () {
  "use strict";
  var D = window.KS_DATA;

  /* ---------------- اللغة / النصوص ---------------- */
  var lang = localStorage.getItem("ks_lang") || "ar";

  var T = {
    ar: {
      dir: "rtl", html: "ar", other: "EN",
      brand: "حاسبة كينغ شوت", sub: "أدوات اللاعب الكاملة",
      install: "ثبّت التطبيق على جهازك", installBtn: "تثبيت",
      paid: "صرف عالي / حوت", free: "لعب مجاني / متوسط",
      soon: "قريباً", new: "جديد",
      from: "من", to: "إلى", level: "المستوى", building: "المبنى",
      pieces: "عدد القطع", tier: "الرتبة", count: "عدد الجنود",
      results: "النتيجة", totalCost: "إجمالي الموارد", time: "الوقت", power: "القوة المكتسبة",
      wood: "خشب", bread: "خبز", stone: "حجر", iron: "حديد", coins: "عملات",
      satin: "ساتان", gildedThreads: "خيوط مذهّبة", artisansVision: "رؤية الحرفي",
      statGain: "الزيادة في الإحصائية", troops: "عدد الجنود",
      kvk: "نقاط حرب الممالك (KvK)", sg: "نقاط SG", hog: "نقاط HoG",
      selectBuilding: "اختر المبنى", curStage: "المرحلة الحالية", tgtStage: "المرحلة المستهدفة",
      noChange: "اختر مستوى أعلى من الحالي لعرض النتيجة.",
      piecesNote: "النتيجة محسوبة لعدد القطع المختار (للقطعة الواحدة: ÷ العدد).",
      d: "ي", h: "س", m: "د", s: "ث",
      footer: "تطبيق حاسبة مجاني للاعبي كينغ شوت • بيانات اللعبة قابلة للتحديث",
      disclaimer: "غير تابع رسمياً للعبة. الأرقام تقريبية للتخطيط.",
      buildings: { tc: "مركز المدينة (TC)", embassy: "السفارة", academy: "الأكاديمية", cc: "مركز القيادة (CC)" },
      tools: {
        rally: ["رالي ليدر", "حسّن قوتك الهجومية: المعدات + إحصائيات الأبطال + المعززات."],
        truegold: ["الذهب الخالص", "تكاليف ووقت وموارد ترقيات مباني الذهب الخالص."],
        research: ["الأبحاث", "خطّط شجرة الأبحاث العسكرية: التكاليف والوقت والإحصائيات."],
        academy: ["أبحاث أكاديمية الحرب", "تكاليف وإحصائيات أشجار أبحاث قوات الذهب الخالص."],
        castle: ["معركة القلعة", "نسّق أوقات إطلاق الحشود للوصول للهدف في نفس اللحظة."],
        specialists: ["المتخصصون", "خطّط هدايا التطوير والشعارات والمهارات والإحصائيات."],
        events: ["نقاط الفعاليات", "احسب نقاط KvK وSG وHoG من تدريب الجنود."],
        building: ["ترقية المباني", "تكاليف ووقت وقوة ترقية المباني الرئيسية."],
        training: ["تدريب القوات", "وقت وتسريعات وموارد إنتاج الجيش."],
        gear: ["معدّات الحاكم", "تكاليف وإحصائيات ترقية معدّات الحاكم."],
        hero: ["معدّات وأسلحة الأبطال", "تكاليف معدّات الأبطال والأسلحة والمطارق."],
        shards: ["شظايا الأبطال", "تكاليف الشظايا ومكافآت ترقية النجوم."],
        compare: ["مقارنة الأبطال", "قارن الأبطال حسب النجوم والأسلحة والإحصائيات."]
      }
    },
    en: {
      dir: "ltr", html: "en", other: "ع",
      brand: "Kingshot Calculator", sub: "Complete player tools",
      install: "Install this app on your device", installBtn: "Install",
      paid: "High spender / Whale", free: "Free / Mid spender",
      soon: "Soon", new: "New",
      from: "From", to: "To", level: "Level", building: "Building",
      pieces: "Pieces", tier: "Tier", count: "Troops",
      results: "Result", totalCost: "Total resources", time: "Time", power: "Power gained",
      wood: "Wood", bread: "Bread", stone: "Stone", iron: "Iron", coins: "Coins",
      satin: "Satin", gildedThreads: "Gilded Threads", artisansVision: "Artisan's Vision",
      statGain: "Stat increase", troops: "Troops",
      kvk: "KvK points", sg: "SG points", hog: "HoG points",
      selectBuilding: "Select building", curStage: "Current stage", tgtStage: "Target stage",
      noChange: "Pick a target higher than current to see results.",
      piecesNote: "Result is for the chosen number of pieces (per piece: ÷ count).",
      d: "d", h: "h", m: "m", s: "s",
      footer: "Free calculator app for Kingshot players • game data is updatable",
      disclaimer: "Not officially affiliated with the game. Numbers are for planning.",
      buildings: { tc: "Town Center (TC)", embassy: "Embassy", academy: "Academy", cc: "Command Center (CC)" },
      tools: {
        rally: ["Rally Leader", "Optimize attack power: gear + hero stats + buffs."],
        truegold: ["Truegold", "Costs, time & resources for Truegold building upgrades."],
        research: ["Research", "Plan the military research tree: costs, time & stats."],
        academy: ["War Academy Research", "Costs & stats for Truegold troop research trees."],
        castle: ["Castle Battle", "Coordinate rally launch times to hit at the same moment."],
        specialists: ["Specialists", "Plan dev gifts, crests, skills and stats."],
        events: ["Event Points", "Calculate KvK, SG & HoG points from troop training."],
        building: ["Building Upgrade", "Costs, time & power for main building upgrades."],
        training: ["Troop Training", "Time, speedups & resources for army production."],
        gear: ["Governor Gear", "Costs & stats for governor gear upgrades."],
        hero: ["Hero Gear & Weapons", "Hero gear, weapon & hammer costs."],
        shards: ["Hero Shards", "Shard costs & star upgrade stat rewards."],
        compare: ["Hero Comparison", "Compare heroes by stars, weapons & stats."]
      }
    }
  };

  function t() { return T[lang]; }

  /* ترتيب الأدوات حسب فئتي الموقع. active=مفعّلة الآن */
  var TOOLS = [
    { id: "events", group: "paid", icon: "🏆", active: true, new: true },
    { id: "truegold", group: "paid", icon: "🪙", active: true, new: true },
    { id: "rally", group: "paid", icon: "⚔️", active: true },
    { id: "research", group: "paid", icon: "🧪", active: true, new: true },
    { id: "academy", group: "paid", icon: "🎓", active: true, new: true },
    { id: "castle", group: "paid", icon: "🏰", active: true, new: true },
    { id: "specialists", group: "paid", icon: "🧠", active: true, new: true },
    { id: "building", group: "free", icon: "🏗️", active: true },
    { id: "training", group: "free", icon: "🛡️", active: true },
    { id: "gear", group: "free", icon: "🥋", active: true },
    { id: "hero", group: "free", icon: "🦸", active: true },
    { id: "shards", group: "free", icon: "💠", active: true },
    { id: "compare", group: "free", icon: "📊", active: true }
  ];

  /* ---------------- أدوات مساعدة ---------------- */
  var $ = function (id) { return document.getElementById(id); };

  function fmtNum(n) {
    n = Math.round(n);
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.?0+$/, "") + "K";
    return String(n);
  }
  function fmtFull(n) { return Math.round(n).toLocaleString(lang === "ar" ? "ar-EG" : "en-US"); }
  function fmtTime(sec) {
    sec = Math.round(sec);
    if (sec <= 0) return "0" + t().s;
    var L = t(), d = Math.floor(sec / 86400); sec -= d * 86400;
    var h = Math.floor(sec / 3600); sec -= h * 3600;
    var m = Math.floor(sec / 60); var s = sec - m * 60;
    var parts = [];
    if (d) parts.push(d + L.d);
    if (h) parts.push(h + L.h);
    if (m) parts.push(m + L.m);
    if (s && !d && !h) parts.push(s + L.s);
    return parts.slice(0, 3).join(" ") || "0" + L.s;
  }

  /* ---------------- التنقّل ---------------- */
  var currentTool = null;

  function showHome() {
    currentTool = null;
    $("home").classList.add("active");
    $("calc").classList.remove("active");
    $("backBtn").style.display = "none";
    window.scrollTo(0, 0);
  }
  function openTool(id) {
    currentTool = id;
    $("home").classList.remove("active");
    $("calc").classList.add("active");
    $("backBtn").style.display = "grid";
    renderCalc(id);
    window.scrollTo(0, 0);
  }

  /* ---------------- الواجهة العامة ---------------- */
  function applyChrome() {
    var L = t();
    document.documentElement.lang = L.html;
    document.documentElement.dir = L.dir;
    $("brandName").textContent = L.brand;
    $("brandSub").textContent = L.sub;
    $("langBtn").textContent = L.other;
    $("installTxt").textContent = L.install;
    $("installBtn").textContent = L.installBtn;
    $("backBtn").textContent = L.dir === "rtl" ? "→" : "←";
  }

  function renderHome() {
    var L = t();
    var html = "";
    ["paid", "free"].forEach(function (g) {
      html += '<div class="sec-title ' + (g === "free" ? "free" : "") + '"><span class="dot"></span>' +
        (g === "paid" ? L.paid : L.free) + "</div>";
      html += '<div class="grid">';
      TOOLS.filter(function (x) { return x.group === g; }).forEach(function (x) {
        var info = L.tools[x.id];
        var badge = "";
        if (!x.active) badge = '<span class="badge soon">' + L.soon + "</span>";
        else if (x.new) badge = '<span class="badge">' + L.new + "</span>";
        html += '<div class="tool ' + (x.active ? "live" : "soon") + '" data-id="' + x.id + '">' +
          badge +
          '<div class="ic">' + x.icon + "</div>" +
          "<h3>" + info[0] + "</h3><p>" + info[1] + "</p></div>";
      });
      html += "</div>";
    });
    $("homeContent").innerHTML = html;
    $("footer").innerHTML = L.footer + "<br>" + L.disclaimer;
    Array.prototype.forEach.call(document.querySelectorAll(".tool"), function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-id");
        var tool = TOOLS.find(function (x) { return x.id === id; });
        if (tool && tool.active) openTool(id);
      });
    });
  }

  /* ---------------- الحاسبات ---------------- */
  function renderCalc(id) {
    var L = t(), info = L.tools[id];
    var tool = TOOLS.find(function (x) { return x.id === id; });
    $("calcChip").textContent = tool ? tool.icon : "";
    $("calcTitle").textContent = info[0];
    $("calcDesc").textContent = info[1];
    if (id === "building") return calcBuilding();
    if (id === "gear") return calcGear();
    if (id === "events") return calcEvents();
    if (id === "academy") return calcAcademy();
    if (id === "training") return calcTraining();
    if (id === "castle") return calcCastle();
    if (id === "shards") return calcShards();
    if (id === "compare") return calcCompare();
    if (id === "specialists") return calcSpecialists();
    if (id === "hero") return calcHero();
    if (id === "rally") return calcRally();
    if (id === "research") return calcResearch();
    if (id === "truegold") return calcTruegold();
  }

  function statRow(icon, label, value, big) {
    return '<div class="stat"><div class="si">' + icon + '</div><div class="sl">' + label +
      '</div><div class="sv ' + (big ? "big" : "") + '">' + value + "</div></div>";
  }

  /* --- ترقية المباني --- */
  function calcBuilding() {
    var L = t();
    var keys = Object.keys(D.buildings);
    var sel = keys[0];
    var inp = $("calcInputs");
    function opts(arr) {
      return arr.map(function (r) { return '<option value="' + r.level + '">' + L.level + " " + r.level + "</option>"; }).join("");
    }
    function build() {
      var arr = D.buildings[sel];
      inp.innerHTML =
        '<div class="field"><label>' + L.building + '</label><select id="bSel">' +
        keys.map(function (k) { return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + L.buildings[k] + "</option>"; }).join("") +
        '</select></div>' +
        '<div class="row2"><div class="field"><label>' + L.from + " (" + L.level + ')</label><select id="bFrom">' + opts(arr) + '</select></div>' +
        '<div class="field"><label>' + L.to + " (" + L.level + ')</label><select id="bTo">' + opts(arr) + "</select></div></div>";
      $("bSel").value = sel;
      $("bFrom").value = 0;
      $("bTo").value = arr[arr.length - 1].level;
      $("bSel").addEventListener("change", function () { sel = this.value; build(); compute(); });
      $("bFrom").addEventListener("change", compute);
      $("bTo").addEventListener("change", compute);
    }
    function compute() {
      var arr = D.buildings[sel];
      var from = parseInt($("bFrom").value, 10), to = parseInt($("bTo").value, 10);
      if (to <= from) { $("calcResults").innerHTML = '<h4>' + L.results + "</h4><p class='hint'>" + L.noChange + "</p>"; return; }
      var c = { wood: 0, bread: 0, stone: 0, iron: 0 }, time = 0;
      for (var lvl = from + 1; lvl <= to; lvl++) {
        var row = arr.find(function (r) { return r.level === lvl; });
        if (!row) continue;
        c.wood += row.cost.wood || 0; c.bread += row.cost.bread || 0;
        c.stone += row.cost.stone || 0; c.iron += row.cost.iron || 0;
        time += row.timeInSeconds || 0;
      }
      var pFrom = arr.find(function (r) { return r.level === from; }).power || 0;
      var pTo = arr.find(function (r) { return r.level === to; }).power || 0;
      var rows = "";
      if (c.wood) rows += statRow("🪵", L.wood, fmtNum(c.wood) + " <small style='color:var(--muted)'>(" + fmtFull(c.wood) + ")</small>");
      if (c.bread) rows += statRow("🍞", L.bread, fmtNum(c.bread) + " <small style='color:var(--muted)'>(" + fmtFull(c.bread) + ")</small>");
      if (c.stone) rows += statRow("🪨", L.stone, fmtNum(c.stone) + " <small style='color:var(--muted)'>(" + fmtFull(c.stone) + ")</small>");
      if (c.iron) rows += statRow("⛓️", L.iron, fmtNum(c.iron) + " <small style='color:var(--muted)'>(" + fmtFull(c.iron) + ")</small>");
      rows += statRow("⏱️", L.time, fmtTime(time));
      rows += statRow("⚡", L.power, "+" + fmtNum(pTo - pFrom), true);
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows;
    }
    build(); compute();
  }

  /* --- معدّات الحاكم --- */
  function calcGear() {
    var L = t();
    var g = D.governorGear, pieces = 6;
    var inp = $("calcInputs");
    function opts() {
      return g.map(function (r, i) { return '<option value="' + i + '">' + r.name + "</option>"; }).join("");
    }
    inp.innerHTML =
      '<div class="row2"><div class="field"><label>' + L.curStage + '</label><select id="gFrom">' + opts() + '</select></div>' +
      '<div class="field"><label>' + L.tgtStage + '</label><select id="gTo">' + opts() + "</select></div></div>" +
      '<div class="field"><label>' + L.pieces + '</label><div class="seg" id="gPieces">' +
      [1, 2, 3, 4, 5, 6].map(function (n) { return '<button data-n="' + n + '"' + (n === 6 ? ' class="on"' : "") + ">" + n + "</button>"; }).join("") +
      "</div></div>";
    $("gFrom").value = 0;
    $("gTo").value = g.length - 1;
    function compute() {
      var from = parseInt($("gFrom").value, 10), to = parseInt($("gTo").value, 10);
      if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='hint'>" + L.noChange + "</p>"; return; }
      var c = { satin: 0, gildedThreads: 0, artisansVision: 0 };
      for (var i = from + 1; i <= to; i++) {
        c.satin += g[i].cost.satin || 0; c.gildedThreads += g[i].cost.gildedThreads || 0; c.artisansVision += g[i].cost.artisansVision || 0;
      }
      var powGain = (g[to].power - g[from].power) * pieces;
      var pctGain = (g[to].percentage - g[from].percentage);
      var rows = "";
      rows += statRow("🧵", L.satin, fmtFull(c.satin * pieces));
      rows += statRow("✨", L.gildedThreads, fmtFull(c.gildedThreads * pieces));
      rows += statRow("🔮", L.artisansVision, fmtFull(c.artisansVision * pieces));
      rows += statRow("📈", L.statGain, "+" + pctGain.toFixed(2).replace(/\.?0+$/, "") + "% / " + (lang === "ar" ? "قطعة" : "piece"));
      rows += statRow("⚡", L.power, "+" + fmtNum(powGain), true);
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows +
        '<p class="hint">' + L.piecesNote + "</p>";
    }
    $("gFrom").addEventListener("change", compute);
    $("gTo").addEventListener("change", compute);
    Array.prototype.forEach.call($("gPieces").children, function (b) {
      b.addEventListener("click", function () {
        Array.prototype.forEach.call($("gPieces").children, function (x) { x.classList.remove("on"); });
        b.classList.add("on"); pieces = parseInt(b.getAttribute("data-n"), 10); compute();
      });
    });
    compute();
  }

  /* --- نقاط الفعاليات --- */
  function calcEvents() {
    var L = t();
    var troops = D.eventTroops;
    var inp = $("calcInputs");
    inp.innerHTML =
      '<div class="field"><label>' + L.tier + '</label><select id="eTier">' +
      troops.map(function (r, i) { return '<option value="' + i + '">' + r.tier + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="field"><label>' + L.count + '</label><input type="number" id="eCount" min="0" step="1000" value="100000" inputmode="numeric"></div>';
    function compute() {
      var i = parseInt($("eTier").value, 10);
      var n = parseFloat($("eCount").value) || 0;
      var r = troops[i];
      var rows = "";
      rows += statRow("🏆", L.kvk, fmtFull(r.kvkPoints * n), true);
      rows += statRow("🛡️", L.sg, fmtFull(r.sgPoints * n));
      rows += statRow("🐗", L.hog, fmtFull(r.hogPoints * n));
      rows += statRow("⚡", L.power, "+" + fmtNum(r.power * n));
      rows += statRow("⏱️", L.time, fmtTime(r.time * n));
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + r.tier + "</h4>" + rows;
    }
    $("eTier").addEventListener("change", compute);
    $("eCount").addEventListener("input", compute);
    compute();
  }

  /* ===================== الحاسبات الإضافية ===================== */
  var K2 = window.KS2;

  // نصوص خاصة بالحاسبات الجديدة
  var CL = {
    ar: {
      troop: "نوع القوة", infantry: "مشاة", cavalry: "فرسان", archers: "رماة",
      node: "البحث", gold: "ذهب خالص", truegoldDust: "غبار الذهب الخالص", manuscripts: "مخطوطات",
      speedBonus: "مكافأة السرعة (٪)", days: "أيام", hours: "ساعات", minutes: "دقائق",
      trainable: "عدد القوات الممكن تدريبها", tier: "الرتبة", count: "عدد الجنود",
      star: "النجمة", subStar: "المرتبة (تير)", weaponLvl: "مستوى السلاح",
      hero: "البطل", heroA: "البطل الأول", heroB: "البطل الثاني",
      attack: "هجوم", defense: "دفاع", lethality: "فتك", health: "صحة",
      shards: "الشظايا المطلوبة", statAt: "الإحصائية عند الهدف", statGainV: "الزيادة",
      specialist: "المتخصص", giftLevel: "المستوى", gifts: "الهدايا", crests: "الشعارات", statBonus: "نسبة الإحصائية",
      assembly: "وقت تجميع الرالي (دقائق)", firstDelay: "تأخير أول إطلاق", march: "وقت المسير (د:ث)",
      players: "عدد اللاعبين", launchAt: "وقت الإطلاق (UTC)", hitAt: "وقت الوصول الموحّد (UTC)",
      utcNow: "الوقت الحالي UTC", player: "لاعب", noMarch: "أدخل أوقات مسير صحيحة للاعبين.",
      timeBudgetT: "ميزانية الوقت (تسريعات)", maxLevelHint: "أقصى مستوى"
    },
    en: {
      troop: "Troop type", infantry: "Infantry", cavalry: "Cavalry", archers: "Archers",
      node: "Research", gold: "Truegold", truegoldDust: "Truegold Dust", manuscripts: "Manuscripts",
      speedBonus: "Speed bonus (%)", days: "Days", hours: "Hours", minutes: "Minutes",
      trainable: "Trainable troops", tier: "Tier", count: "Troops",
      star: "Star", subStar: "Tier", weaponLvl: "Weapon level",
      hero: "Hero", heroA: "Hero A", heroB: "Hero B",
      attack: "Attack", defense: "Defense", lethality: "Lethality", health: "Health",
      shards: "Shards needed", statAt: "Stat at target", statGainV: "Increase",
      specialist: "Specialist", giftLevel: "Level", gifts: "Gifts", crests: "Crests", statBonus: "Stat %",
      assembly: "Rally assembly (min)", firstDelay: "First-launch delay", march: "March time (m:s)",
      players: "Players", launchAt: "Launch time (UTC)", hitAt: "Universal hit time (UTC)",
      utcNow: "Current UTC", player: "Player", noMarch: "Enter valid march times for players.",
      timeBudgetT: "Time budget (speed-ups)", maxLevelHint: "max level"
    }
  };
  function cl() { return CL[lang]; }

  // أسماء عقد أكاديمية الحرب (nameKey -> ar/en) + إعادة تسمية حسب نوع القوة
  var NODE_LABELS = {
    truegold_battalion: ["كتيبة الذهب الخالص", "Truegold Battalion"],
    truegold_shields: ["دروع الذهب الخالص", "Truegold Shields"],
    truegold_blades: ["نصل الذهب الخالص", "Truegold Blades"],
    truegold_plating: ["تصفيح الذهب الخالص", "Truegold Plating"],
    truegold_legionaries: ["فيلق الذهب الخالص", "Truegold Legionaries"],
    truegold_mauls: ["مطارق الذهب الخالص", "Truegold Mauls"],
    truegold_infantry_node: ["مشاة الذهب الخالص (XI)", "Truegold Infantry (XI)"],
    truegold_infantry_aid: ["مساعدة المشاة", "Infantry Aid"],
    truegold_infantry_training: ["تدريب المشاة", "Infantry Training"],
    truegold_infantry_healing: ["شفاء المشاة", "Infantry Healing"],
    truegold_bracers: ["سواعد الذهب الخالص", "Truegold Bracers"],
    truegold_bows: ["أقواس الذهب الخالص", "Truegold Bows"],
    truegold_vests: ["سترات الذهب الخالص", "Truegold Vests"],
    truegold_arrows: ["سهام الذهب الخالص", "Truegold Arrows"],
    truegold_charge: ["اندفاع الذهب الخالص", "Truegold Charge"],
    truegold_farriery: ["حدادة الذهب الخالص", "Truegold Farriery"],
    truegold_lances: ["رماح الذهب الخالص", "Truegold Lances"],
    truegold_platecraft: ["صفائح الذهب الخالص", "Truegold Platecraft"]
  };
  var ARC_REN = { truegold_shields: "truegold_bracers", truegold_blades: "truegold_bows", truegold_plating: "truegold_vests", truegold_mauls: "truegold_arrows", truegold_infantry_node: "truegold_infantry_node", truegold_infantry_aid: "truegold_infantry_aid", truegold_infantry_training: "truegold_infantry_training", truegold_infantry_healing: "truegold_infantry_healing" };
  var CAV_REN = { truegold_blades: "truegold_charge", truegold_shields: "truegold_farriery", truegold_mauls: "truegold_lances", truegold_plating: "truegold_platecraft", truegold_infantry_node: "truegold_infantry_node", truegold_infantry_aid: "truegold_infantry_aid", truegold_infantry_training: "truegold_infantry_training", truegold_infantry_healing: "truegold_infantry_healing" };
  var STAT_LABELS = {
    attack: ["هجوم", "Attack"], defense: ["دفاع", "Defense"], health: ["صحة", "Health"],
    lethality: ["فتك", "Lethality"], troop_deployment_capacity: ["سعة نشر القوات", "Deployment Capacity"],
    rally_capacity: ["سعة الرالي", "Rally Capacity"], healing_cost_reduction: ["خفض تكلفة الشفاء", "Healing Cost −"],
    healing_time_reduction: ["خفض وقت الشفاء", "Healing Time −"], training_cost_reduction: ["خفض تكلفة التدريب", "Training Cost −"]
  };
  function nodeName(nameKey, troop) {
    var k = nameKey;
    if (troop === "Archers" && ARC_REN[nameKey]) k = ARC_REN[nameKey];
    if (troop === "Cavalry" && CAV_REN[nameKey]) k = CAV_REN[nameKey];
    var e = NODE_LABELS[k];
    return e ? e[lang === "ar" ? 0 : 1] : k;
  }
  function statName(s) { var e = STAT_LABELS[s]; return e ? e[lang === "ar" ? 0 : 1] : s; }
  function heroName(id) { var h = K2.heroes.find(function (x) { return x.id === id; }); return h ? h.name : id; }

  function costRows(c, L) {
    var rows = "", defs = [
      ["wood", "🪵", L.wood], ["bread", "🍞", L.bread], ["stone", "🪨", L.stone], ["iron", "⛓️", L.iron],
      ["coins", "🪙", L.coins], ["gold", "👑", cl().gold], ["truegoldDust", "✨", cl().truegoldDust]
    ];
    defs.forEach(function (d) {
      if (c[d[0]]) rows += statRow(d[1], d[2], fmtNum(c[d[0]]) + " <small>(" + fmtFull(c[d[0]]) + ")</small>");
    });
    return rows;
  }

  /* --- أكاديمية الحرب (شجرة أبحاث الذهب الخالص) --- */
  function calcAcademy() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var nodes = K2.sf;
    var troop = "Infantry";
    function maxLv(node) { return node.maxLevel || (node.levels ? node.levels.length : 0); }
    function build() {
      var nodeOpts = nodes.map(function (nd, i) { return '<option value="' + i + '">' + nodeName(nd.nameKey, troop) + "</option>"; }).join("");
      inp.innerHTML =
        '<div class="field"><label>' + C.troop + '</label><div class="seg" id="aTroop">' +
        [["Infantry", C.infantry], ["Cavalry", C.cavalry], ["Archers", C.archers]].map(function (x) {
          return '<button data-v="' + x[0] + '"' + (x[0] === troop ? ' class="on"' : "") + ">" + x[1] + "</button>";
        }).join("") + "</div></div>" +
        '<div class="field"><label>' + C.node + '</label><select id="aNode">' + nodeOpts + "</select></div>" +
        '<div class="row2"><div class="field"><label>' + L.from + '</label><select id="aFrom"></select></div>' +
        '<div class="field"><label>' + L.to + '</label><select id="aTo"></select></div></div>';
      Array.prototype.forEach.call($("aTroop").children, function (b) {
        b.addEventListener("click", function () {
          Array.prototype.forEach.call($("aTroop").children, function (x) { x.classList.remove("on"); });
          b.classList.add("on"); troop = b.getAttribute("data-v");
          var ni = $("aNode"); var cur = ni.value;
          ni.innerHTML = nodes.map(function (nd, i) { return '<option value="' + i + '">' + nodeName(nd.nameKey, troop) + "</option>"; }).join("");
          ni.value = cur; compute();
        });
      });
      $("aNode").addEventListener("change", fillLevels);
      fillLevels();
    }
    function fillLevels() {
      var nd = nodes[parseInt($("aNode").value, 10)];
      var mx = maxLv(nd);
      var fo = "", to = "";
      for (var i = 0; i <= mx; i++) fo += '<option value="' + i + '">' + i + "</option>";
      for (var j = 0; j <= mx; j++) to += '<option value="' + j + '">' + j + "</option>";
      $("aFrom").innerHTML = fo; $("aTo").innerHTML = to;
      $("aFrom").value = 0; $("aTo").value = mx;
      $("aFrom").addEventListener("change", compute); $("aTo").addEventListener("change", compute);
      compute();
    }
    function compute() {
      var nd = nodes[parseInt($("aNode").value, 10)];
      var from = parseInt($("aFrom").value, 10), to = parseInt($("aTo").value, 10);
      if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
      var c = { wood: 0, bread: 0, stone: 0, iron: 0, coins: 0, gold: 0, truegoldDust: 0 }, time = 0, power = 0;
      for (var lv = from; lv < to; lv++) {
        var row = nd.levels[lv]; if (!row) continue;
        for (var k in c) c[k] += (row.cost && row.cost[k]) || 0;
        time += row.timeInSeconds || 0; power += row.power || 0;
      }
      var statTxt = "";
      if (nd.stats && nd.stats[0]) {
        var st = nd.stats[0], sum = 0;
        if (st.valuesPerLevel) { for (var q = from; q < to; q++) sum += st.valuesPerLevel[q] || 0; }
        else if (st.valuePerLevel != null) sum = st.valuePerLevel * (to - from);
        var tr = troop === "Infantry" ? cl().infantry : troop === "Cavalry" ? cl().cavalry : cl().archers;
        statTxt = statRow("📈", statName(st.stat) + " (" + (st.troop === "All" ? "الكل/All" : tr) + ")", "+" + (Math.round(sum * 100) / 100));
      }
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + costRows(c, L) +
        statRow("⏱️", L.time, fmtTime(time)) + statTxt + statRow("⚡", L.power, "+" + fmtNum(power), true);
    }
    build();
  }

  /* --- تدريب القوات --- */
  function calcTraining() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var pts = KS_DATA.eventTroops, ut = K2.troopTrainTime;
    var tiersWithTime = ut.filter(function (r) { return r.time > 0; });
    inp.innerHTML =
      '<div class="field"><label>' + C.tier + '</label><select id="tTier">' +
      tiersWithTime.map(function (r) { return '<option value="' + r.tier + '">' + r.tier + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label>' + C.speedBonus + '</label><input type="number" id="tBonus" min="0" value="0" inputmode="numeric"></div>' +
      '<div class="field"><label>' + C.timeBudgetT + '</label><div class="row3">' +
      '<input type="number" id="tD" min="0" value="1" placeholder="' + C.days + '"><input type="number" id="tH" min="0" value="0" placeholder="' + C.hours + '"><input type="number" id="tM" min="0" value="0" placeholder="' + C.minutes + '"></div></div>';
    function compute() {
      var tier = $("tTier").value;
      var bonus = parseFloat($("tBonus").value) || 0;
      var budget = (parseFloat($("tD").value) || 0) * 86400 + (parseFloat($("tH").value) || 0) * 3600 + (parseFloat($("tM").value) || 0) * 60;
      var urow = ut.find(function (r) { return r.tier === tier; });
      var prow = pts.find(function (r) { return r.tier === tier; }) || {};
      var per = (urow.time || 0) / (1 + bonus / 100);
      var troops = per > 0 ? Math.floor(budget / per) : 0;
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + tier + "</h4>" +
        statRow("🪖", C.trainable, fmtFull(troops), true) +
        statRow("⚡", L.power, "+" + fmtNum((prow.power || 0) * troops)) +
        statRow("🏆", L.kvk, fmtFull((prow.kvkPoints || 0) * troops)) +
        statRow("🛡️", L.sg, fmtFull((prow.sgPoints || 0) * troops)) +
        statRow("🐗", L.hog, fmtFull((prow.hogPoints || 0) * troops));
    }
    ["tTier", "tBonus", "tD", "tH", "tM"].forEach(function (id) {
      $(id).addEventListener("input", compute); $(id).addEventListener("change", compute);
    });
    compute();
  }

  /* --- معركة القلعة (تنسيق الرالي) --- */
  function calcCastle() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var nP = 3;
    function build() {
      var rows = "";
      for (var i = 0; i < nP; i++) {
        rows += '<div class="field"><label>' + C.player + " " + (i + 1) + ' — ' + C.march + '</label><div class="row2">' +
          '<input type="number" min="0" id="cM' + i + '" placeholder="' + C.minutes + '" value="5"><input type="number" min="0" max="59" id="cS' + i + '" placeholder="ث" value="0"></div></div>';
      }
      inp.innerHTML =
        '<div class="field"><label>' + C.utcNow + '</label><input type="text" id="cNow" readonly></div>' +
        '<div class="row2"><div class="field"><label>' + C.assembly + '</label><select id="cAsm"><option>5</option><option>3</option><option>2</option><option>1</option></select></div>' +
        '<div class="field"><label>' + C.players + '</label><select id="cNum">' + [2, 3, 4, 5].map(function (n) { return '<option' + (n === nP ? " selected" : "") + ">" + n + "</option>"; }).join("") + "</select></div></div>" +
        '<div class="field"><label>' + C.firstDelay + ' (' + C.minutes + ':ث)</label><div class="row2"><input type="number" min="0" id="cDM" value="1"><input type="number" min="0" max="59" id="cDS" value="0"></div></div>' +
        rows;
      $("cNum").addEventListener("change", function () { nP = parseInt(this.value, 10); build(); });
      ["cAsm", "cDM", "cDS"].forEach(function (id) { $(id).addEventListener("input", compute); $(id).addEventListener("change", compute); });
      for (var i = 0; i < nP; i++) { $("cM" + i).addEventListener("input", compute); $("cS" + i).addEventListener("input", compute); }
      compute();
    }
    function fmtUTC(sec) {
      sec = ((sec % 86400) + 86400) % 86400;
      var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      function p(n) { return n < 10 ? "0" + n : "" + n; }
      return p(h) + ":" + p(m) + ":" + p(s);
    }
    function compute() {
      var d = new Date();
      var nowSec = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();
      if ($("cNow")) $("cNow").value = fmtUTC(nowSec) + " UTC";
      var asm = (parseInt($("cAsm").value, 10) || 5) * 60;
      var delay = (parseInt($("cDM").value, 10) || 0) * 60 + (parseInt($("cDS").value, 10) || 0);
      var ps = [];
      for (var i = 0; i < nP; i++) {
        var mm = parseInt($("cM" + i).value, 10) || 0, ss = parseInt($("cS" + i).value, 10) || 0;
        var march = mm * 60 + ss;
        if (march > 0) ps.push({ n: i + 1, total: march + asm });
      }
      if (!ps.length) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + C.noMarch + "</p>"; return; }
      var maxT = Math.max.apply(null, ps.map(function (p) { return p.total; }));
      var hit = nowSec + delay + maxT;
      var out = ps.map(function (p) { return { n: p.n, launch: hit - p.total }; }).sort(function (a, b) { return a.launch - b.launch; });
      var rows = statRow("🎯", C.hitAt, fmtUTC(hit), true);
      out.forEach(function (o) { rows += statRow("🚀", C.player + " " + o.n, fmtUTC(o.launch)); });
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows;
    }
    build();
  }

  /* --- شظايا الأبطال --- */
  function calcShards() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var heroes = K2.heroes.filter(function (h) { return K2.heroStarTable[h.id]; });
    function starOpts() { return [0, 1, 2, 3, 4, 5].map(function (s) { return "<option>" + s + "</option>"; }).join(""); }
    function tierOpts() { return [0, 1, 2, 3, 4, 5].map(function (s) { return "<option>" + s + "</option>"; }).join(""); }
    inp.innerHTML =
      '<div class="field"><label>' + C.hero + '</label><select id="sHero">' +
      heroes.map(function (h) { return '<option value="' + h.id + '">' + h.name + " (" + h.season + ")</option>"; }).join("") + "</select></div>" +
      '<div class="row2"><div class="field"><label>' + L.from + " — " + C.star + '</label><select id="sFromStar">' + starOpts() + "</select></div>" +
      '<div class="field"><label>' + C.subStar + '</label><select id="sFromTier">' + tierOpts() + "</select></div></div>" +
      '<div class="row2"><div class="field"><label>' + L.to + " — " + C.star + '</label><select id="sToStar">' + starOpts() + "</select></div>" +
      '<div class="field"><label>' + C.subStar + '</label><select id="sToTier">' + tierOpts() + "</select></div></div>";
    $("sToStar").value = 5;
    function stepOf(star, tier) { return star >= 5 ? 30 : star * 6 + tier; }
    function compute() {
      var id = $("sHero").value;
      var tbl = K2.heroStarTable[id];
      var fs = stepOf(parseInt($("sFromStar").value, 10), parseInt($("sFromTier").value, 10));
      var ts = stepOf(parseInt($("sToStar").value, 10), parseInt($("sToTier").value, 10));
      if (ts <= fs) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
      var sh = 0; for (var i = fs; i < ts; i++) sh += K2.shardCost[i] || 0;
      var statTo = (tbl[Math.min(ts, tbl.length - 1)] || {}).stat || 0;
      var statFrom = (tbl[Math.min(fs, tbl.length - 1)] || {}).stat || 0;
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + heroName(id) + "</h4>" +
        statRow("💠", C.shards, fmtFull(sh), true) +
        statRow("📈", C.statAt + " (هجوم/دفاع)", (Math.round(statTo * 100) / 100) + "%") +
        statRow("➕", C.statGainV, "+" + (Math.round((statTo - statFrom) * 100) / 100) + "%");
    }
    ["sHero", "sFromStar", "sFromTier", "sToStar", "sToTier"].forEach(function (x) { $(x).addEventListener("change", compute); });
    compute();
  }

  /* --- مقارنة الأبطال --- */
  function calcCompare() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var heroes = K2.heroes.filter(function (h) { return K2.heroStarTable[h.id]; });
    function heroSel(idp, def) {
      return '<select id="' + idp + '">' + heroes.map(function (h, i) { return '<option value="' + h.id + '"' + (i === def ? " selected" : "") + ">" + h.name + "</option>"; }).join("") + "</select>";
    }
    function block(p, label, def) {
      return '<div class="panel-title">' + label + '</div>' +
        '<div class="field">' + heroSel(p + "H", def) + "</div>" +
        '<div class="row3"><div class="field"><label>' + C.star + '</label><select id="' + p + 'St">' + [0, 1, 2, 3, 4, 5].map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + C.subStar + '</label><select id="' + p + 'Ti">' + [0, 1, 2, 3, 4, 5].map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + C.weaponLvl + '</label><select id="' + p + 'W">' + Array.apply(null, { length: 11 }).map(function (_, i) { return "<option>" + i + "</option>"; }).join("") + "</select></div></div>";
    }
    inp.innerHTML = block("a", C.heroA, 0) + '<div style="height:10px"></div>' + block("b", C.heroB, 1);
    function statsOf(p) {
      var id = $(p + "H").value, h = K2.heroes.find(function (x) { return x.id === id; });
      var star = parseInt($(p + "St").value, 10), tier = parseInt($(p + "Ti").value, 10);
      var step = star >= 5 ? 30 : star * 6 + tier;
      var tbl = K2.heroStarTable[id]; var srow = tbl[Math.min(step, tbl.length - 1)] || {};
      var wl = parseInt($(p + "W").value, 10);
      var rate = K2.weaponOverride[id] != null ? K2.weaponOverride[id] : (K2.weaponRate[h.season] || 5);
      var w = Math.round(wl * rate * 100) / 100;
      return { name: h.name, atk: srow.stat || 0, def: srow.stat || 0, hp: w, let: w };
    }
    function compute() {
      var A = statsOf("a"), B = statsOf("b");
      function cmpRow(icon, label, av, bv, suf) {
        suf = suf || "";
        var aw = av >= bv ? "color:var(--green);font-weight:800" : "", bw = bv >= av ? "color:var(--green);font-weight:800" : "";
        return '<div class="stat"><div class="si">' + icon + '</div><div class="sl">' + label +
          '</div><div class="sv"><span style="' + aw + '">' + (Math.round(av * 100) / 100) + suf + '</span> <small> | </small> <span style="' + bw + '">' + (Math.round(bv * 100) / 100) + suf + "</span></div></div>";
      }
      $("calcResults").innerHTML = "<h4>" + A.name + "  ⚔  " + B.name + "</h4>" +
        cmpRow("🗡️", C.attack, A.atk, B.atk, "%") + cmpRow("🛡️", C.defense, A.def, B.def, "%") +
        cmpRow("💥", C.lethality, A.let, B.let, "%") + cmpRow("❤️", C.health, A.hp, B.hp, "%");
    }
    ["aH", "aSt", "aTi", "aW", "bH", "bSt", "bTi", "bW"].forEach(function (x) { $(x).addEventListener("change", compute); });
    compute();
  }

  /* --- المتخصصون --- */
  function calcSpecialists() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var specs = K2.specialists;
    inp.innerHTML =
      '<div class="field"><label>' + C.specialist + '</label><select id="spSel">' +
      specs.map(function (s, i) { return '<option value="' + i + '">' + (lang === "ar" ? s.nameAr : s.nameEn) + "</option>"; }).join("") + "</select></div>" +
      '<div class="row2"><div class="field"><label>' + L.from + " — " + C.giftLevel + '</label><input type="number" id="spFrom" min="0" max="100" value="0"></div>' +
      '<div class="field"><label>' + L.to + '</label><input type="number" id="spTo" min="0" max="100" value="100"></div></div>';
    function compute() {
      var s = specs[parseInt($("spSel").value, 10)];
      var lv = s.levels;
      var from = Math.max(0, Math.min(100, parseInt($("spFrom").value, 10) || 0));
      var to = Math.max(0, Math.min(100, parseInt($("spTo").value, 10) || 0));
      if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
      var gifts = 0, crests = 0;
      for (var i = from + 1; i <= to; i++) { if (!lv[i]) continue; gifts += lv[i].giftCost || 0; crests += lv[i].crestCost || 0; }
      var statP = (lv[to] || {}).statPercent || 0;
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + (lang === "ar" ? s.nameAr : s.nameEn) + "</h4>" +
        statRow("🎁", C.gifts, fmtFull(gifts), true) +
        statRow("🎖️", C.crests, fmtFull(crests)) +
        statRow("📈", C.statBonus, (Math.round(statP * 100) / 100) + "%");
    }
    ["spSel", "spFrom", "spTo"].forEach(function (x) { $(x).addEventListener("input", compute); $(x).addEventListener("change", compute); });
    compute();
  }

  /* --- الذهب الخالص (مباني) --- */
  var TG_BLD = {
    town_center: ["مركز المدينة", "Town Center"], embassy: ["السفارة", "Embassy"],
    barracks: ["الثكنات", "Barracks"], range: ["الرماية", "Range"], stable: ["الإسطبل", "Stable"],
    command_center: ["مركز القيادة", "Command Center"], war_academy: ["أكاديمية الحرب", "War Academy"],
    infirmary: ["المشفى", "Infirmary"]
  };
  function calcTruegold() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var blds = (window.KS4 && window.KS4.truegoldBuildings) || {};
    var keys = Object.keys(blds);
    var sel = keys[0];
    function lvlOpts(arr) { return arr.map(function (r, i) { return '<option value="' + i + '">' + r.name + "</option>"; }).join(""); }
    function build() {
      var arr = blds[sel];
      inp.innerHTML =
        '<div class="field"><label>' + (lang === "ar" ? "المبنى" : "Building") + '</label><select id="tgB">' +
        keys.map(function (k) { return '<option value="' + k + '"' + (k === sel ? " selected" : "") + ">" + TG_BLD[k][lang === "ar" ? 0 : 1] + "</option>"; }).join("") + "</select></div>" +
        '<div class="row2"><div class="field"><label>' + L.from + '</label><select id="tgF">' + lvlOpts(arr) + "</select></div>" +
        '<div class="field"><label>' + L.to + '</label><select id="tgT">' + lvlOpts(arr) + "</select></div></div>";
      $("tgB").value = sel; $("tgF").value = 0; $("tgT").value = arr.length - 1;
      $("tgB").addEventListener("change", function () { sel = this.value; build(); });
      $("tgF").addEventListener("change", compute); $("tgT").addEventListener("change", compute);
      compute();
    }
    function compute() {
      var arr = blds[sel];
      var from = parseInt($("tgF").value, 10), to = parseInt($("tgT").value, 10);
      if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
      var charms = 0, res = { wood: 0, bread: 0, stone: 0, iron: 0 };
      for (var i = from + 1; i <= to; i++) {
        var row = arr[i]; if (!row) continue;
        charms += row.cost || 0;
        if (row.resources) for (var k in res) res[k] += row.resources[k] || 0;
      }
      var pGain = (arr[to].power || 0) - (arr[from].power || 0);
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" +
        statRow("🪙", lang === "ar" ? "شارات الذهب الخالص" : "Truegold Crests", fmtFull(charms), true) +
        costRows(res, L) +
        statRow("⚡", L.power, "+" + fmtNum(pGain), true);
    }
    build();
  }

  /* --- حاسبة الأبحاث (فرع الجيش) --- */
  var ROMAN = { "1": "I", "2": "II", "3": "III", "4": "IV", "5": "V" };
  function fmtNodeName(key) {
    var parts = key.split("_"), suffix = "";
    var last = parts[parts.length - 1];
    if (ROMAN[last]) { suffix = " " + ROMAN[last]; parts.pop(); }
    return parts.map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ") + suffix;
  }
  function calcResearch() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var all = (window.KS3 && window.KS3.research) || [];
    var filter = "All";
    function nodeTroop(nd) { return (nd.stats && nd.stats[0]) ? nd.stats[0].troop : "All"; }
    function list() { return all.filter(function (nd) { return filter === "All" ? true : nodeTroop(nd) === filter; }); }
    function build() {
      var nodes = list();
      inp.innerHTML =
        '<div class="field"><label>' + C.troop + '</label><div class="seg" id="rsTroop">' +
        [["All", lang === "ar" ? "الكل" : "All"], ["Infantry", C.infantry], ["Cavalry", C.cavalry], ["Archers", C.archers]].map(function (x) {
          return '<button data-v="' + x[0] + '"' + (x[0] === filter ? ' class="on"' : "") + ">" + x[1] + "</button>";
        }).join("") + "</div></div>" +
        '<div class="field"><label>' + C.node + '</label><select id="rsNode">' +
        nodes.map(function (nd, i) { return '<option value="' + i + '">' + fmtNodeName(nd.nameKey) + "</option>"; }).join("") + "</select></div>" +
        '<div class="row2"><div class="field"><label>' + L.from + '</label><select id="rsFrom"></select></div>' +
        '<div class="field"><label>' + L.to + '</label><select id="rsTo"></select></div></div>';
      Array.prototype.forEach.call($("rsTroop").children, function (b) {
        b.addEventListener("click", function () { filter = b.getAttribute("data-v"); build(); });
      });
      $("rsNode").addEventListener("change", fillLv);
      fillLv();
    }
    function fillLv() {
      var nd = list()[parseInt($("rsNode").value, 10)];
      var mx = nd.maxLevel || (nd.levels ? nd.levels.length : 0);
      var o = ""; for (var i = 0; i <= mx; i++) o += "<option>" + i + "</option>";
      $("rsFrom").innerHTML = o; $("rsTo").innerHTML = o;
      $("rsFrom").value = 0; $("rsTo").value = mx;
      $("rsFrom").addEventListener("change", compute); $("rsTo").addEventListener("change", compute);
      compute();
    }
    function compute() {
      var nd = list()[parseInt($("rsNode").value, 10)];
      var from = parseInt($("rsFrom").value, 10), to = parseInt($("rsTo").value, 10);
      if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
      var c = { wood: 0, bread: 0, stone: 0, iron: 0, coins: 0 }, time = 0, power = 0;
      for (var lv = from; lv < to; lv++) {
        var row = nd.levels[lv]; if (!row) continue;
        for (var k in c) c[k] += (row.cost && row.cost[k]) || 0;
        time += row.timeInSeconds || 0; power += row.power || 0;
      }
      var statTxt = "";
      if (nd.stats && nd.stats[0]) {
        var st = nd.stats[0], sum = 0;
        if (st.valuesPerLevel) for (var q = from; q < to; q++) sum += st.valuesPerLevel[q] || 0;
        else if (st.valuePerLevel != null) sum = st.valuePerLevel * (to - from);
        var trL = st.troop === "All" ? (lang === "ar" ? "الكل" : "All") : st.troop === "Infantry" ? C.infantry : st.troop === "Cavalry" ? C.cavalry : C.archers;
        var flat = st.stat === "troop_deployment_capacity" || st.stat === "rally_capacity";
        statTxt = statRow("📈", statName(st.stat) + " (" + trL + ")", "+" + (Math.round(sum * 100) / 100) + (flat ? "" : "%"));
      }
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + costRows(c, L) +
        statRow("⏱️", L.time, fmtTime(time)) + statTxt + statRow("⚡", L.power, "+" + fmtNum(power), true);
    }
    build();
  }

  /* --- معدّات وأسلحة الأبطال --- */
  function heroWeaponStat(id, level) {
    var h = K2.heroes.find(function (x) { return x.id === id; });
    var rate = K2.weaponOverride[id] != null ? K2.weaponOverride[id] : (K2.weaponRate[h ? h.season : "S1"] || 5);
    return Math.round(level * rate * 100) / 100;
  }
  function calcHero() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var heroes = K2.heroes;
    var mode = "weapon";
    function build() {
      var seg = '<div class="field"><div class="seg" id="hMode">' +
        '<button data-v="weapon"' + (mode === "weapon" ? ' class="on"' : "") + ">" + (lang === "ar" ? "السلاح" : "Weapon") + "</button>" +
        '<button data-v="forge"' + (mode === "forge" ? ' class="on"' : "") + ">" + (lang === "ar" ? "التطوير (مطارق)" : "Forge") + "</button></div></div>";
      var body;
      if (mode === "weapon") {
        body = '<div class="field"><label>' + C.hero + '</label><select id="hHero">' +
          heroes.map(function (h) { return '<option value="' + h.id + '">' + h.name + " (" + h.season + ")</option>"; }).join("") + "</select></div>" +
          '<div class="row2"><div class="field"><label>' + L.from + " — " + C.weaponLvl + '</label><select id="hFrom">' + lvlOpts(10) + "</select></div>" +
          '<div class="field"><label>' + L.to + '</label><select id="hTo">' + lvlOpts(10) + "</select></div></div>";
      } else {
        body = '<div class="field"><label>' + (lang === "ar" ? "مستوى المعدّة (للإحصائية)" : "Gear level (for stat)") + '</label><input type="number" id="hGL" min="0" max="200" value="100"></div>' +
          '<div class="row2"><div class="field"><label>' + L.from + " — " + (lang === "ar" ? "مطرقة" : "Forge") + '</label><input type="number" id="hFF" min="0" max="20" value="0"></div>' +
          '<div class="field"><label>' + L.to + '</label><input type="number" id="hFT" min="0" max="20" value="20"></div></div>';
      }
      inp.innerHTML = seg + body;
      Array.prototype.forEach.call($("hMode").children, function (b) {
        b.addEventListener("click", function () { mode = b.getAttribute("data-v"); build(); });
      });
      if (mode === "weapon") {
        $("hTo").value = 10;
        ["hHero", "hFrom", "hTo"].forEach(function (x) { $(x).addEventListener("change", compute); });
      } else {
        ["hGL", "hFF", "hFT"].forEach(function (x) { $(x).addEventListener("input", compute); });
      }
      compute();
    }
    function compute() {
      if (mode === "weapon") {
        var id = $("hHero").value, from = parseInt($("hFrom").value, 10), to = parseInt($("hTo").value, 10);
        if (to <= from) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
        var hw = 0; for (var l = from; l < to; l++) hw += (l + 1) * 5;
        var gain = heroWeaponStat(id, to) - heroWeaponStat(id, from);
        $("calcResults").innerHTML = "<h4>" + L.results + " — " + heroName(id) + "</h4>" +
          statRow("⚒️", lang === "ar" ? "أسلحة الأبطال المطلوبة" : "Hero Weapons needed", fmtFull(hw), true) +
          statRow("❤️", C.health, "+" + gain + "%") + statRow("💥", C.lethality, "+" + gain + "%");
      } else {
        var gl = parseInt($("hGL").value, 10) || 0, ff = parseInt($("hFF").value, 10) || 0, ft = parseInt($("hFT").value, 10) || 0;
        if (ft <= ff) { $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + L.noChange + "</p>"; return; }
        var ham = 0, myth = 0; for (var s = ff; s < ft; s++) { var st = s + 1; ham += st * 10; if (st >= 11) myth += st - 10; }
        function fn(A, D) { if (A <= 0) return 0; var cum = 0; for (var n = 1; n <= A; n++) cum += (n > 100 ? 0.5 : 0.35); return (15 + cum) * (1 + D * 0.1); }
        var statGain = Math.round((fn(gl, ft) - fn(gl, ff)) * 100) / 100;
        $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" +
          statRow("🔨", lang === "ar" ? "المطارق المطلوبة" : "Forgehammers", fmtFull(ham), true) +
          (myth ? statRow("⚙️", lang === "ar" ? "تروس أسطورية" : "Mythic Gears", fmtFull(myth)) : "") +
          statRow("✖️", lang === "ar" ? "المضاعف" : "Multiplier", "×" + (1 + ft * 0.1).toFixed(1)) +
          statRow("📈", lang === "ar" ? "زيادة الإحصائية" : "Stat increase", "+" + statGain + "%", true);
      }
    }
    function lvlOpts(mx) { var o = ""; for (var i = 0; i <= mx; i++) o += "<option>" + i + "</option>"; return o; }
    build();
  }

  /* --- رالي ليدر --- */
  function calcRally() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var troop = "Infantry";
    var gear = K2.gear, charm = K2.charm;
    function heroesFor(tp) { return K2.heroes.filter(function (h) { return h.troopTypes.indexOf(tp) >= 0 && K2.heroStarTable[h.id]; }); }
    function build() {
      var hs = heroesFor(troop);
      inp.innerHTML =
        '<div class="field"><label>' + C.troop + '</label><div class="seg" id="rTroop">' +
        [["Infantry", C.infantry], ["Cavalry", C.cavalry], ["Archers", C.archers]].map(function (x) {
          return '<button data-v="' + x[0] + '"' + (x[0] === troop ? ' class="on"' : "") + ">" + x[1] + "</button>";
        }).join("") + "</div></div>" +
        '<div class="panel-title">' + (lang === "ar" ? "إحصائياتك الحالية (٪)" : "Your current stats (%)") + '</div>' +
        '<div class="row2"><div class="field"><label>' + C.attack + '</label><input type="number" id="rAtk" value="0" step="0.1"></div>' +
        '<div class="field"><label>' + C.defense + '</label><input type="number" id="rDef" value="0" step="0.1"></div></div>' +
        '<div class="row2"><div class="field"><label>' + C.lethality + '</label><input type="number" id="rLet" value="0" step="0.1"></div>' +
        '<div class="field"><label>' + C.health + '</label><input type="number" id="rHp" value="0" step="0.1"></div></div>' +
        '<div class="panel-title" style="margin-top:14px">' + (lang === "ar" ? "المصادر" : "Sources") + '</div>' +
        '<div class="field"><label>' + (lang === "ar" ? "مرحلة معدّات الحاكم" : "Governor gear stage") + '</label><select id="rGear">' +
        gear.map(function (g, i) { return '<option value="' + i + '">' + g.name + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + (lang === "ar" ? "مستوى التميمة" : "Charm level") + '</label><select id="rCharm">' +
        Object.keys(charm).map(function (k) { return "<option>" + k + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + C.hero + '</label><select id="rHero">' +
        hs.map(function (h) { return '<option value="' + h.id + '">' + h.name + "</option>"; }).join("") + "</select></div>" +
        '<div class="row2"><div class="field"><label>' + C.star + '</label><select id="rStar">' + [0, 1, 2, 3, 4, 5].map(function (s) { return "<option>" + s + "</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>' + C.weaponLvl + '</label><select id="rW">' + (function () { var o = ""; for (var i = 0; i <= 10; i++) o += "<option>" + i + "</option>"; return o; })() + "</select></div></div>";
      Array.prototype.forEach.call($("rTroop").children, function (b) {
        b.addEventListener("click", function () { troop = b.getAttribute("data-v"); build(); });
      });
      ["rAtk", "rDef", "rLet", "rHp", "rGear", "rCharm", "rHero", "rStar", "rW"].forEach(function (x) {
        $(x).addEventListener("input", compute); $(x).addEventListener("change", compute);
      });
      $("rGear").value = gear.length - 1;
      compute();
    }
    function compute() {
      var gIdx = parseInt($("rGear").value, 10), cLvl = $("rCharm").value;
      var gearPct = gear[gIdx] ? gear[gIdx].percentage : 0;
      var charmPct = charm[cLvl] ? charm[cLvl].percentage : 0;
      var id = $("rHero").value, star = parseInt($("rStar").value, 10);
      var tbl = K2.heroStarTable[id]; var step = star >= 5 ? 30 : star * 6;
      var starStat = tbl ? ((tbl[Math.min(step, tbl.length - 1)] || {}).stat || 0) : 0;
      var w = heroWeaponStat(id, parseInt($("rW").value, 10));
      var cur = { atk: parseFloat($("rAtk").value) || 0, def: parseFloat($("rDef").value) || 0, let: parseFloat($("rLet").value) || 0, hp: parseFloat($("rHp").value) || 0 };
      var bonus = { atk: gearPct + starStat, def: gearPct + starStat, let: charmPct + w, hp: charmPct + w };
      function r(x) { return Math.round(x * 100) / 100; }
      function row(icon, label, c, b) {
        return '<div class="stat"><div class="si">' + icon + '</div><div class="sl">' + label +
          ' <small style="color:var(--green)">+' + r(b) + '</small></div><div class="sv big">' + r(c + b) + "%</div></div>";
      }
      $("calcResults").innerHTML = "<h4>" + (lang === "ar" ? "إحصائياتك بعد الترقية" : "Your stats after upgrade") + "</h4>" +
        row("🗡️", C.attack, cur.atk, bonus.atk) + row("🛡️", C.defense, cur.def, bonus.def) +
        row("💥", C.lethality, cur.let, bonus.let) + row("❤️", C.health, cur.hp, bonus.hp) +
        '<p class="hint">' + (lang === "ar" ? "البونص = معدّات الحاكم + نجوم البطل (هجوم/دفاع) + التميمة + سلاح البطل (فتك/صحة)." : "Bonus = gear + hero star (atk/def) + charm + weapon (let/hp).") + "</p>";
    }
    build();
  }

  /* ---------------- التثبيت (PWA) ---------------- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e; $("installBar").style.display = "flex";
  });
  $("installBtn").addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; $("installBar").style.display = "none"; });
  });
  window.addEventListener("appinstalled", function () { $("installBar").style.display = "none"; });

  /* ---------------- تشغيل ---------------- */
  $("langBtn").addEventListener("click", function () {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem("ks_lang", lang);
    applyChrome(); renderHome();
    if (currentTool) renderCalc(currentTool);
  });
  $("backBtn").addEventListener("click", showHome);

  applyChrome();
  renderHome();

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
