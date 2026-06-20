/* حاسبة كينغ شوت — كود أصلي */
(function () {
  "use strict";
  var D = window.KS_DATA;

  /* ---- صور اللعبة ---- */
  var HERO_IMG_BASE = "https://ks.h5joy-games.com/games/icon_hero_avatar_";
  function heroImgUrl(id) { return HERO_IMG_BASE + id + ".webp"; }
  var WIKI = "https://got-global-wiki.s3.us-west-1.amazonaws.com/wp-content/uploads/2025/10/";
  var TOOL_IMG = {
    events:      "https://ks.h5joy-games.com/games/icon_troop_infantry.webp",
    truegold:    WIKI + "builddes_icon_336.png",
    rally:       heroImgUrl("jabel"),
    research:    WIKI + "builddes_icon_329.png",
    academy:     WIKI + "builddes_icon_329.png",
    castle:      WIKI + "builddes_icon_301_21.png",
    specialists: heroImgUrl("jabel"),
    building:    WIKI + "builddes_icon_301_21.png",
    training:    "https://ks.h5joy-games.com/games/icon_troop_cavalry.webp",
    gear:        WIKI + "builddes_icon_330.png",
    hero:        heroImgUrl("amadeus"),
    shards:      heroImgUrl("helga"),
    compare:     heroImgUrl("thrud")
  };
  var BLDG_IMG = {
    tc:       WIKI + "builddes_icon_301_21.png",
    embassy:  WIKI + "builddes_icon_325.png",
    academy:  WIKI + "builddes_icon_329.png",
    cc:       WIKI + "builddes_icon_331.png"
  };
  var TG_BLDG_IMG = {
    town_center:    WIKI + "builddes_icon_301_21.png",
    embassy:        WIKI + "builddes_icon_325.png",
    barracks:       WIKI + "builddes_icon_321.png",
    range:          WIKI + "builddes_icon_323.png",
    stable:         WIKI + "builddes_icon_322.png",
    command_center: WIKI + "builddes_icon_331.png",
    war_academy:    WIKI + "builddes_icon_329.png",
    infirmary:      WIKI + "builddes_icon_324.png"
  };
  var TROOP_IMG = {
    Infantry: "https://ks.h5joy-games.com/games/icon_troop_infantry.webp",
    Cavalry:  "https://ks.h5joy-games.com/games/icon_troop_cavalry.webp",
    Archers:  "https://ks.h5joy-games.com/games/icon_troop_archer.webp"
  };
  function imgTag(url, alt, cls) {
    return '<img src="' + url + '" alt="' + (alt||"") + '" loading="lazy" class="' + (cls||"") + '" onerror="this.style.display=\'none\'">';
  }
  function heroPortrait(selectId) {
    return '<div class="portrait-wrap" id="' + selectId + '_pw"><img id="' + selectId + '_pi" src="" alt="" loading="lazy" onerror="this.style.opacity=0" style="opacity:0"></div>';
  }
  function setPortrait(selectId) {
    var sel = document.getElementById(selectId), img = document.getElementById(selectId + "_pi");
    if (!sel || !img) return;
    img.style.opacity = 0;
    img.src = heroImgUrl(sel.value);
    img.onload = function () { img.style.opacity = 1; };
  }

  /* ---- اللغة ---- */
  var LANGS = ["ar", "en", "zh", "ko", "es"];
  var lang = localStorage.getItem("ks_lang") || "ar";

  var T = {
    ar: {
      dir:"rtl", html:"ar", code:"ع",
      brand:"حاسبة كينغ شوت", sub:"أدوات اللاعب الكاملة",
      install:"ثبّت التطبيق على جهازك", installBtn:"تثبيت",
      paid:"صرف عالي / حوت", free:"لعب مجاني / متوسط",
      soon:"قريباً", new:"جديد",
      from:"من", to:"إلى", level:"المستوى", building:"المبنى",
      pieces:"عدد القطع", tier:"الرتبة", count:"عدد الجنود",
      results:"النتيجة", totalCost:"إجمالي الموارد", time:"الوقت", power:"القوة المكتسبة",
      wood:"خشب", bread:"خبز", stone:"حجر", iron:"حديد", coins:"عملات",
      satin:"ساتان", gildedThreads:"خيوط مذهّبة", artisansVision:"رؤية الحرفي",
      statGain:"الزيادة في الإحصائية", troops:"عدد الجنود",
      kvk:"نقاط حرب الممالك (KvK)", sg:"نقاط SG", hog:"نقاط HoG",
      selectBuilding:"اختر المبنى", curStage:"المرحلة الحالية", tgtStage:"المرحلة المستهدفة",
      noChange:"اختر مستوى أعلى من الحالي.", piecesNote:"النتيجة لعدد القطع المختار.",
      d:"ي", h:"س", m:"د", s:"ث",
      footer:"تطبيق حاسبة مجاني للاعبي كينغ شوت", disclaimer:"غير تابع رسمياً للعبة. الأرقام للتخطيط.",
      buildings:{ tc:"مركز المدينة (TC)", embassy:"السفارة", academy:"الأكاديمية", cc:"مركز القيادة (CC)" },
      tools:{
        rally:       ["رالي ليدر","حسّن قوتك الهجومية: المعدات + أبطال + معززات."],
        truegold:    ["الذهب الخالص","تكاليف وموارد ترقيات مباني الذهب الخالص."],
        research:    ["الأبحاث","شجرة الأبحاث العسكرية: التكاليف والوقت والإحصائيات."],
        academy:     ["أكاديمية الحرب","تكاليف وإحصائيات أشجار قوات الذهب الخالص."],
        castle:      ["معركة القلعة","نسّق أوقات الهجوم + احسب توقيت حشود الدفاع."],
        specialists: ["المتخصصون","خطّط هدايا التطوير والشعارات والمهارات."],
        events:      ["نقاط الفعاليات","احسب نقاط KvK وSG وHoG من تدريب الجنود."],
        building:    ["ترقية المباني","تكاليف ووقت وقوة ترقية المباني الرئيسية."],
        training:    ["تدريب القوات","وقت وتسريعات وموارد إنتاج الجيش."],
        gear:        ["معدّات الحاكم","تكاليف وإحصائيات ترقية المعدّات."],
        hero:        ["معدّات وأسلحة الأبطال","تكاليف أسلحة الأبطال والمطارق."],
        shards:      ["شظايا الأبطال","الشظايا المطلوبة لترقية النجوم."],
        compare:     ["مقارنة الأبطال","قارن الأبطال حسب النجوم والأسلحة والإحصائيات."],
        pets:        ["الحيوانات الأليفة","احسب تكلفة ترقية حيوانك الأليف: الطعام والكتيبات والجرعات."],
        battle:      ["حاسبة القتال","توصية تشكيل القوات حسب نمط المعركة + الأبطال المقترحون."],
        equip:       ["حاسبة المعدات","مثريل + تطوير + إتقان معدّات الأبطال الأسطورية."],
        lineups:     ["أفضل التشكيلات","أقوى تشكيلات أبطال الجيل الأول (Gen1)."]
      }
    },
    en: {
      dir:"ltr", html:"en", code:"EN",
      brand:"Kingshot Calculator", sub:"Complete player tools",
      install:"Install this app on your device", installBtn:"Install",
      paid:"High spender / Whale", free:"Free / Mid spender",
      soon:"Soon", new:"New",
      from:"From", to:"To", level:"Level", building:"Building",
      pieces:"Pieces", tier:"Tier", count:"Troops",
      results:"Result", totalCost:"Total resources", time:"Time", power:"Power gained",
      wood:"Wood", bread:"Bread", stone:"Stone", iron:"Iron", coins:"Coins",
      satin:"Satin", gildedThreads:"Gilded Threads", artisansVision:"Artisan's Vision",
      statGain:"Stat increase", troops:"Troops",
      kvk:"KvK points", sg:"SG points", hog:"HoG points",
      selectBuilding:"Select building", curStage:"Current stage", tgtStage:"Target stage",
      noChange:"Pick a target higher than current.", piecesNote:"Result for the chosen number of pieces.",
      d:"d", h:"h", m:"m", s:"s",
      footer:"Free calculator for Kingshot players", disclaimer:"Not officially affiliated. Numbers for planning.",
      buildings:{ tc:"Town Center (TC)", embassy:"Embassy", academy:"Academy", cc:"Command Center (CC)" },
      tools:{
        rally:       ["Rally Leader","Optimize attack power: gear + hero stats + buffs."],
        truegold:    ["Truegold","Costs & resources for Truegold building upgrades."],
        research:    ["Research","Military research tree: costs, time & stats."],
        academy:     ["War Academy","Costs & stats for Truegold troop research trees."],
        castle:      ["Castle Battle","Coordinate rally launch times + defense garrison timing."],
        specialists: ["Specialists","Plan dev gifts, crests, skills and stats."],
        events:      ["Event Points","Calculate KvK, SG & HoG points from troop training."],
        building:    ["Building Upgrade","Costs, time & power for main building upgrades."],
        training:    ["Troop Training","Time, speedups & resources for army production."],
        gear:        ["Governor Gear","Costs & stats for governor gear upgrades."],
        hero:        ["Hero Gear & Weapons","Hero gear, weapon & hammer costs."],
        shards:      ["Hero Shards","Shards needed for star upgrades."],
        compare:     ["Hero Comparison","Compare heroes by stars, weapons & stats."],
        pets:        ["Pets","Calculate pet upgrade cost: food, manuals & potions."],
        battle:      ["Battle Calculator","Troop formation recommendation by combat mode + suggested heroes."],
        equip:       ["Equipment Calculator","Mithril + Enhancement + Mastery for mythic hero gear."],
        lineups:     ["Best Lineups","Strongest Gen1 hero lineups."]
      }
    },
    zh: {
      dir:"ltr", html:"zh", code:"中",
      brand:"劲枪计算器", sub:"玩家完整工具集",
      install:"将此应用安装到您的设备", installBtn:"安装",
      paid:"高消费 / 鲸鱼", free:"免费 / 中等消费",
      soon:"即将推出", new:"新",
      from:"从", to:"到", level:"等级", building:"建筑",
      pieces:"部件数", tier:"部队层级", count:"兵力数",
      results:"计算结果", totalCost:"总资源", time:"时间", power:"获得战力",
      wood:"木材", bread:"粮食", stone:"石料", iron:"铁矿", coins:"金币",
      satin:"绸缎", gildedThreads:"镀金线", artisansVision:"工匠视野",
      statGain:"属性提升", troops:"兵力",
      kvk:"王国大战 (KvK) 积分", sg:"SG 积分", hog:"HoG 积分",
      selectBuilding:"选择建筑", curStage:"当前阶段", tgtStage:"目标阶段",
      noChange:"请选择高于当前的目标等级。", piecesNote:"结果按所选部件数量计算。",
      d:"天", h:"时", m:"分", s:"秒",
      footer:"劲枪玩家免费计算器", disclaimer:"非官方应用。数据仅供参考。",
      buildings:{ tc:"城镇中心 (TC)", embassy:"大使馆", academy:"学院", cc:"指挥中心 (CC)" },
      tools:{
        rally:       ["集结队长","优化攻击力：装备 + 英雄属性 + 加成。"],
        truegold:    ["精金建筑","精金建筑升级的费用与资源。"],
        research:    ["研究","军事研究树：费用、时间和属性。"],
        academy:     ["战争学院","精金部队研究树的费用和属性。"],
        castle:      ["城堡之战","协调集结发动时间 + 计算防守驻军时机。"],
        specialists: ["专家","规划开发礼物、徽章和技能。"],
        events:      ["活动积分","从训练士兵计算KvK、SG和HoG积分。"],
        building:    ["建筑升级","主要建筑升级的费用、时间和战力。"],
        training:    ["部队训练","军队生产的时间、加速和资源。"],
        gear:        ["君主装备","君主装备升级的费用和属性。"],
        hero:        ["英雄装备与武器","英雄装备、武器和强化锤费用。"],
        shards:      ["英雄碎片","升星所需碎片费用和奖励。"],
        compare:     ["英雄对比","按星级、武器和属性对比英雄。"],
        pets:        ["宠物","计算宠物升级所需食物、手册和药水。"],
        battle:      ["战斗计算器","根据战斗模式推荐部队编成 + 推荐英雄。"],
        equip:       ["装备计算器","秘银 + 强化 + 精通 神话英雄装备。"],
        lineups:     ["最佳阵容","最强的第一代 (Gen1) 英雄阵容。"]
      }
    },
    ko: {
      dir:"ltr", html:"ko", code:"한",
      brand:"킹샷 계산기", sub:"완전한 플레이어 도구",
      install:"이 앱을 기기에 설치하세요", installBtn:"설치",
      paid:"고과금 / 고래", free:"무과금 / 중과금",
      soon:"곧 출시", new:"신규",
      from:"에서", to:"까지", level:"레벨", building:"건물",
      pieces:"부품 수", tier:"부대 단계", count:"병사 수",
      results:"계산 결과", totalCost:"총 자원", time:"시간", power:"전투력 증가",
      wood:"목재", bread:"식량", stone:"석재", iron:"철", coins:"금화",
      satin:"새틴", gildedThreads:"금실", artisansVision:"장인의 눈",
      statGain:"능력치 증가", troops:"병사",
      kvk:"왕국 전쟁 (KvK) 점수", sg:"SG 점수", hog:"HoG 점수",
      selectBuilding:"건물 선택", curStage:"현재 단계", tgtStage:"목표 단계",
      noChange:"더 높은 목표 단계를 선택하세요.", piecesNote:"선택한 부품 수 기준으로 계산됩니다.",
      d:"일", h:"시", m:"분", s:"초",
      footer:"킹샷 플레이어를 위한 무료 계산기", disclaimer:"공식 게임과 무관합니다. 계획용 참고 데이터.",
      buildings:{ tc:"타운 센터 (TC)", embassy:"대사관", academy:"아카데미", cc:"지휘 센터 (CC)" },
      tools:{
        rally:       ["집결 리더","공격력 최적화: 장비 + 영웅 능력치 + 버프."],
        truegold:    ["정금 건물","정금 건물 업그레이드 비용 및 자원."],
        research:    ["연구","군사 연구 트리: 비용, 시간 및 능력치."],
        academy:     ["전쟁 아카데미","정금 부대 연구 트리의 비용 및 능력치."],
        castle:      ["성 전투","집결 발진 시간 조율 + 수비 파견 타이밍 계산."],
        specialists: ["전문가","개발 선물, 휘장, 스킬 계획."],
        events:      ["이벤트 포인트","병사 훈련으로 KvK, SG, HoG 점수 계산."],
        building:    ["건물 업그레이드","주요 건물 업그레이드 비용, 시간 및 전투력."],
        training:    ["부대 훈련","군대 생산을 위한 시간, 가속 및 자원."],
        gear:        ["총독 장비","총독 장비 업그레이드 비용 및 능력치."],
        hero:        ["영웅 장비 & 무기","영웅 장비, 무기 및 강화 망치 비용."],
        shards:      ["영웅 파편","별 업그레이드에 필요한 파편 비용 및 보상."],
        compare:     ["영웅 비교","별, 무기 및 능력치로 영웅 비교."],
        pets:        ["펫","펫 업그레이드 비용: 음식·매뉴얼·물약 계산."],
        battle:      ["전투 계산기","전투 모드별 부대 편성 추천 + 추천 영웅."],
        equip:       ["장비 계산기","미스릴 + 강화 + 숙련 신화 영웅 장비."],
        lineups:     ["최고의 조합","가장 강력한 1세대 (Gen1) 영웅 조합."]
      }
    },
    es: {
      dir:"ltr", html:"es", code:"ES",
      brand:"Calculadora KingShot", sub:"Herramientas completas del jugador",
      install:"Instala la app en tu dispositivo", installBtn:"Instalar",
      paid:"Alto gasto / Ballena", free:"Free / Gasto medio",
      soon:"Próximamente", new:"Nuevo",
      from:"Desde", to:"Hasta", level:"Nivel", building:"Edificio",
      pieces:"N° de piezas", tier:"Nivel de tropa", count:"Cantidad de tropas",
      results:"Resultado", totalCost:"Recursos totales", time:"Tiempo", power:"Poder ganado",
      wood:"Madera", bread:"Pan", stone:"Piedra", iron:"Hierro", coins:"Monedas",
      satin:"Satén", gildedThreads:"Hilos Dorados", artisansVision:"Visión del Artesano",
      statGain:"Aumento de stat", troops:"Tropas",
      kvk:"Puntos KvK", sg:"Puntos SG", hog:"Puntos HoG",
      selectBuilding:"Seleccionar edificio", curStage:"Etapa actual", tgtStage:"Etapa objetivo",
      noChange:"Selecciona un objetivo mayor al actual.", piecesNote:"Resultado para el número de piezas elegido.",
      d:"d", h:"h", m:"m", s:"s",
      footer:"Calculadora gratuita para jugadores de KingShot", disclaimer:"No afiliado oficialmente. Cifras de planificación.",
      buildings:{ tc:"Centro de Ciudad (TC)", embassy:"Embajada", academy:"Academia", cc:"Centro de Mando (CC)" },
      tools:{
        rally:       ["Líder de Marcha","Optimiza tu poder de ataque: equipo + stats de héroe + buffs."],
        truegold:    ["Edificios Truegold","Costos y recursos de mejoras de edificios Truegold."],
        research:    ["Investigación","Árbol de investigación militar: costos, tiempo y stats."],
        academy:     ["Academia de Guerra","Costos y stats de los árboles de investigación Truegold."],
        castle:      ["Batalla de Castillo","Coordina marchas de ataque + calcula timing de guarnición defensiva."],
        specialists: ["Especialistas","Planifica regalos de desarrollo, emblemas y habilidades."],
        events:      ["Puntos de Evento","Calcula puntos KvK, SG y HoG del entrenamiento de tropas."],
        building:    ["Mejora de Edificios","Costos, tiempo y poder de las mejoras de edificios."],
        training:    ["Entrenamiento de Tropas","Tiempo, aceleradores y recursos para producción del ejército."],
        gear:        ["Equipo del Gobernador","Costos y stats de mejoras del equipo del gobernador."],
        hero:        ["Equipo y Armas de Héroes","Costos de equipo, armas y martillos de héroes."],
        shards:      ["Fragmentos de Héroes","Fragmentos necesarios para mejoras de estrellas."],
        compare:     ["Comparar Héroes","Compara héroes por estrellas, armas y stats."],
        pets:        ["Mascotas","Calcula el costo de mejora de mascota: comida, manuales y pociones."],
        battle:      ["Calculadora de Batalla","Recomendación de formación de tropas por modo de combate + héroes sugeridos."],
        equip:       ["Calculadora de Equipo","Mithril + Mejora + Maestría del equipo mítico de héroes."],
        lineups:     ["Mejores Alineaciones","Las alineaciones de héroes Gen1 más fuertes."]
      }
    }
  };
  function t() { return T[lang]; }

  /* ---- الأدوات ---- */
  var TOOLS = [
    { id:"events",       group:"paid", icon:"🏆", active:true,  new:true  },
    { id:"truegold",     group:"paid", icon:"🪙", active:true,  new:true  },
    { id:"rally",        group:"paid", icon:"⚔️", active:true              },
    { id:"research",     group:"paid", icon:"🧪", active:true,  new:true  },
    { id:"academy",      group:"paid", icon:"🎓", active:true,  new:true  },
    { id:"castle",       group:"paid", icon:"🏰", active:true,  new:true  },
    { id:"specialists",  group:"paid", icon:"🧠", active:true,  new:true  },
    { id:"building",     group:"free", icon:"🏗️", active:true              },
    { id:"training",     group:"free", icon:"🛡️", active:true              },
    { id:"gear",         group:"free", icon:"🥋", active:true              },
    { id:"hero",         group:"free", icon:"🦸", active:true              },
    { id:"shards",       group:"free", icon:"💠", active:true              },
    { id:"compare",      group:"free", icon:"📊", active:true              },
    { id:"pets",         group:"free", icon:"🐾", active:true, new:true   },
    { id:"battle",       group:"free", icon:"🎯", active:true, new:true   },
    { id:"equip",        group:"free", icon:"⚒️", active:true, new:true   },
    { id:"lineups",      group:"free", icon:"🏅", active:true, new:true   }
  ];

  /* ---- DOM / تنسيق ---- */
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

  /* ---- التنقّل ---- */
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

  /* ---- الشريط العلوي ---- */
  var LANG_NAMES = {ar:"عربي", en:"English", zh:"中文", ko:"한국어", es:"Español"};
  function applyChrome() {
    var L = t();
    document.documentElement.lang = L.html;
    document.documentElement.dir = L.dir;
    $("brandName").textContent = L.brand;
    $("brandSub").textContent = L.sub;
    $("langBtn").textContent = L.code;
    $("installTxt").textContent = L.install;
    $("installBtn").textContent = L.installBtn;
    $("backBtn").textContent = L.dir === "rtl" ? "→" : "←";
    // mark active language in dropdown
    Array.prototype.forEach.call($("langDrop").querySelectorAll("button"), function(btn) {
      btn.classList.toggle("cur", btn.dataset.lang === lang);
    });
  }

  // Dropdown toggle
  $("langBtn").addEventListener("click", function(e) {
    e.stopPropagation();
    $("langDrop").classList.toggle("open");
  });
  document.addEventListener("click", function() { $("langDrop").classList.remove("open"); });
  Array.prototype.forEach.call($("langDrop").querySelectorAll("button"), function(btn) {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      lang = btn.dataset.lang;
      localStorage.setItem("ks_lang", lang);
      $("langDrop").classList.remove("open");
      applyChrome();
      renderHome();
      if (currentTool) renderCalc(currentTool);
    });
  });

  /* ---- الصفحة الرئيسية ---- */
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
        var imgUrl = TOOL_IMG[x.id];
        var icHtml = imgUrl
          ? '<img src="' + imgUrl + '" alt="" loading="lazy" data-fb="' + x.icon + '" onerror="this.outerHTML=this.dataset.fb">'
          : x.icon;
        html += '<div class="tool ' + (x.active ? "live" : "soon") + '" data-id="' + x.id + '">' +
          badge + '<div class="ic">' + icHtml + "</div>" +
          "<h3>" + info[0] + "</h3><p>" + info[1] + "</p></div>";
      });
      html += "</div>";
    });
    $("homeContent").innerHTML = html;
    $("footer").innerHTML = L.footer + "<br><small>" + L.disclaimer + "</small>";
    Array.prototype.forEach.call(document.querySelectorAll(".tool"), function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-id");
        var tool = TOOLS.find(function (x) { return x.id === id; });
        if (tool && tool.active) openTool(id);
      });
    });
  }

  /* ---- توجيه الحاسبات ---- */
  function renderCalc(id) {
    var L = t(), info = L.tools[id];
    var tool = TOOLS.find(function (x) { return x.id === id; });
    var imgUrl = TOOL_IMG[id];
    $("calcChip").innerHTML = imgUrl
      ? '<img src="' + imgUrl + '" alt="" style="width:36px;height:36px;object-fit:contain;border-radius:8px" onerror="this.outerHTML=\'' + (tool ? tool.icon : "") + '\'">'
      : (tool ? tool.icon : "");
    $("calcTitle").textContent = info[0];
    $("calcDesc").textContent = info[1];
    $("calcInputs").innerHTML = "";
    $("calcResults").innerHTML = "";
    $("calcResults").style.display = "";
    if (id === "building")    return calcBuilding();
    if (id === "gear")        return calcGear();
    if (id === "events")      return calcEvents();
    if (id === "academy")     return calcAcademy();
    if (id === "training")    return calcTraining();
    if (id === "castle")      return calcCastle();
    if (id === "shards")      return calcShards();
    if (id === "compare")     return calcCompare();
    if (id === "specialists") return calcSpecialists();
    if (id === "hero")        return calcHero();
    if (id === "rally")       return calcRally();
    if (id === "research")    return calcResearch();
    if (id === "truegold")    return calcTruegold();
    if (id === "pets")        return calcPets();
    if (id === "battle")      return calcBattle();
    if (id === "equip")       return calcEquip();
    if (id === "lineups")     return calcLineups();
  }

  function statRow(icon, label, value, big) {
    return '<div class="stat"><div class="si">' + icon + '</div><div class="sl">' + label +
      '</div><div class="sv ' + (big ? "big" : "") + '">' + value + "</div></div>";
  }

  /* === ترقية المباني === */
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
      var bImg = BLDG_IMG[sel] ? imgTag(BLDG_IMG[sel], sel, "bldg-img") : "";
      inp.innerHTML =
        '<div class="field">' + bImg + '<label>' + L.building + '</label><select id="bSel">' +
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
      if (c.wood)  rows += statRow("🪵", L.wood,  fmtNum(c.wood)  + " <small>(" + fmtFull(c.wood)  + ")</small>");
      if (c.bread) rows += statRow("🍞", L.bread, fmtNum(c.bread) + " <small>(" + fmtFull(c.bread) + ")</small>");
      if (c.stone) rows += statRow("🪨", L.stone, fmtNum(c.stone) + " <small>(" + fmtFull(c.stone) + ")</small>");
      if (c.iron)  rows += statRow("⛓️", L.iron,  fmtNum(c.iron)  + " <small>(" + fmtFull(c.iron)  + ")</small>");
      rows += statRow("⏱️", L.time, fmtTime(time));
      rows += statRow("⚡", L.power, "+" + fmtNum(pTo - pFrom), true);
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows;
    }
    build(); compute();
  }

  /* === معدّات الحاكم === */
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
      rows += statRow("📈", L.statGain, "+" + pctGain.toFixed(2).replace(/\.?0+$/, "") + "% / " + (lang === "ar" ? "قطعة" : lang === "zh" ? "件" : lang === "ko" ? "부품" : lang === "es" ? "pieza" : "piece"));
      rows += statRow("⚡", L.power, "+" + fmtNum(powGain), true);
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows + '<p class="hint">' + L.piecesNote + "</p>";
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

  /* === نقاط الفعاليات === */
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
      var rows = statRow("🏆", L.kvk, fmtFull(r.kvkPoints * n), true) +
        statRow("🛡️", L.sg, fmtFull(r.sgPoints * n)) +
        statRow("🐗", L.hog, fmtFull(r.hogPoints * n)) +
        statRow("⚡", L.power, "+" + fmtNum(r.power * n)) +
        statRow("⏱️", L.time, fmtTime(r.time * n));
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + r.tier + "</h4>" + rows;
    }
    $("eTier").addEventListener("change", compute);
    $("eCount").addEventListener("input", compute);
    compute();
  }

  /* ===================== الحاسبات المتقدمة ===================== */
  var K2 = window.KS2;

  var CL = {
    ar: {
      troop:"نوع القوة", infantry:"مشاة", cavalry:"فرسان", archers:"رماة",
      node:"البحث", gold:"ذهب خالص", truegoldDust:"غبار الذهب الخالص", manuscripts:"مخطوطات",
      speedBonus:"مكافأة السرعة (٪)", days:"أيام", hours:"ساعات", minutes:"دقائق",
      trainable:"عدد القوات الممكن تدريبها",
      star:"النجمة", subStar:"المرتبة", weaponLvl:"مستوى السلاح",
      hero:"البطل", heroA:"البطل الأول", heroB:"البطل الثاني",
      attack:"هجوم", defense:"دفاع", lethality:"فتك", health:"صحة",
      shards:"الشظايا المطلوبة", statAt:"الإحصائية عند الهدف", statGainV:"الزيادة",
      specialist:"المتخصص", giftLevel:"المستوى", gifts:"الهدايا", crests:"الشعارات", statBonus:"نسبة الإحصائية",
      assembly:"وقت تجميع الرالي (دقائق)", firstDelay:"تأخير أول إطلاق", march:"وقت المسير (د:ث)",
      players:"عدد اللاعبين", launchAt:"وقت الإطلاق (UTC)", hitAt:"وقت الوصول الموحّد (UTC)",
      utcNow:"الوقت الحالي UTC", player:"لاعب", noMarch:"أدخل أوقات مسير صحيحة للاعبين.",
      timeBudgetT:"ميزانية الوقت (تسريعات)", maxLevelHint:"أقصى مستوى",
      offMode:"⚔️ هجوم", defMode:"🛡️ دفاع",
      defHitTime:"وقت ضربة العدو (UTC — HH:MM:SS)",
      defMarch:"وقت مسيرك للقلعة (دقائق : ثواني)",
      defLaunch:"أطلق حشودك في موعد أقصاه",
      defRemaining:"الوقت المتبقي",
      defTooLate:"⚠️ فات الأوان — أرسل الآن فوراً"
    },
    en: {
      troop:"Troop type", infantry:"Infantry", cavalry:"Cavalry", archers:"Archers",
      node:"Research", gold:"Truegold", truegoldDust:"Truegold Dust", manuscripts:"Manuscripts",
      speedBonus:"Speed bonus (%)", days:"Days", hours:"Hours", minutes:"Minutes",
      trainable:"Trainable troops",
      star:"Star", subStar:"Tier", weaponLvl:"Weapon level",
      hero:"Hero", heroA:"Hero A", heroB:"Hero B",
      attack:"Attack", defense:"Defense", lethality:"Lethality", health:"Health",
      shards:"Shards needed", statAt:"Stat at target", statGainV:"Increase",
      specialist:"Specialist", giftLevel:"Level", gifts:"Gifts", crests:"Crests", statBonus:"Stat %",
      assembly:"Rally assembly (min)", firstDelay:"First-launch delay", march:"March time (m:s)",
      players:"Players", launchAt:"Launch time (UTC)", hitAt:"Universal hit time (UTC)",
      utcNow:"Current UTC", player:"Player", noMarch:"Enter valid march times for players.",
      timeBudgetT:"Time budget (speed-ups)", maxLevelHint:"max level",
      offMode:"⚔️ Offense", defMode:"🛡️ Defense",
      defHitTime:"Enemy hit time (UTC — HH:MM:SS)",
      defMarch:"Your march to castle (min : sec)",
      defLaunch:"Launch garrison by",
      defRemaining:"Time remaining",
      defTooLate:"⚠️ Too late — Send now immediately"
    },
    zh: {
      troop:"部队类型", infantry:"步兵", cavalry:"骑兵", archers:"弓箭手",
      node:"研究节点", gold:"精金", truegoldDust:"精金尘", manuscripts:"手稿",
      speedBonus:"速度加成 (%)", days:"天", hours:"小时", minutes:"分钟",
      trainable:"可训练士兵数",
      star:"星级", subStar:"阶段", weaponLvl:"武器等级",
      hero:"英雄", heroA:"英雄A", heroB:"英雄B",
      attack:"攻击", defense:"防御", lethality:"致命", health:"生命",
      shards:"所需碎片", statAt:"目标属性值", statGainV:"增量",
      specialist:"专家", giftLevel:"等级", gifts:"礼物", crests:"徽章", statBonus:"属性%",
      assembly:"集结时间 (分钟)", firstDelay:"首次发动延迟", march:"行军时间 (分:秒)",
      players:"玩家数", launchAt:"发动时间 (UTC)", hitAt:"统一到达时间 (UTC)",
      utcNow:"当前UTC时间", player:"玩家", noMarch:"请为玩家输入有效的行军时间。",
      timeBudgetT:"时间预算 (加速)", maxLevelHint:"最大等级",
      offMode:"⚔️ 进攻", defMode:"🛡️ 防御",
      defHitTime:"敌方到达时间 (UTC — HH:MM:SS)",
      defMarch:"己方行军时间 (分 : 秒)",
      defLaunch:"最晚发兵时间",
      defRemaining:"剩余时间",
      defTooLate:"⚠️ 时间已过 — 立即发送"
    },
    ko: {
      troop:"부대 유형", infantry:"보병", cavalry:"기병", archers:"궁수",
      node:"연구 노드", gold:"정금", truegoldDust:"정금 먼지", manuscripts:"필사본",
      speedBonus:"속도 보너스 (%)", days:"일", hours:"시간", minutes:"분",
      trainable:"훈련 가능한 병사 수",
      star:"별", subStar:"단계", weaponLvl:"무기 레벨",
      hero:"영웅", heroA:"영웅 A", heroB:"영웅 B",
      attack:"공격", defense:"방어", lethality:"치명", health:"체력",
      shards:"필요한 파편", statAt:"목표 능력치", statGainV:"증가량",
      specialist:"전문가", giftLevel:"레벨", gifts:"선물", crests:"휘장", statBonus:"능력치%",
      assembly:"집결 대기 (분)", firstDelay:"첫 발진 지연", march:"행군 시간 (분:초)",
      players:"플레이어 수", launchAt:"발진 시간 (UTC)", hitAt:"통합 도착 시간 (UTC)",
      utcNow:"현재 UTC", player:"플레이어", noMarch:"플레이어의 유효한 행군 시간을 입력하세요.",
      timeBudgetT:"시간 예산 (가속)", maxLevelHint:"최대 레벨",
      offMode:"⚔️ 공격", defMode:"🛡️ 방어",
      defHitTime:"적군 도착 시간 (UTC — HH:MM:SS)",
      defMarch:"내 행군 시간 (분 : 초)",
      defLaunch:"수비 파견 마감 시간",
      defRemaining:"남은 시간",
      defTooLate:"⚠️ 시간 초과 — 지금 즉시 파견하세요"
    },
    es: {
      troop:"Tipo de tropa", infantry:"Infantería", cavalry:"Caballería", archers:"Arqueros",
      node:"Investigación", gold:"Truegold", truegoldDust:"Polvo Truegold", manuscripts:"Manuscritos",
      speedBonus:"Bono de velocidad (%)", days:"días", hours:"horas", minutes:"minutos",
      trainable:"Tropas entrenables",
      star:"Estrella", subStar:"Tier", weaponLvl:"Nivel de arma",
      hero:"Héroe", heroA:"Héroe A", heroB:"Héroe B",
      attack:"Ataque", defense:"Defensa", lethality:"Letalidad", health:"Salud",
      shards:"Fragmentos necesarios", statAt:"Stat en objetivo", statGainV:"Incremento",
      specialist:"Especialista", giftLevel:"Nivel", gifts:"Regalos", crests:"Emblemas", statBonus:"Stat%",
      assembly:"Ensamblaje de marcha (min)", firstDelay:"Retraso primer lanzamiento", march:"Tiempo de marcha (m:s)",
      players:"Jugadores", launchAt:"Hora de lanzamiento (UTC)", hitAt:"Hora de llegada unificada (UTC)",
      utcNow:"UTC actual", player:"Jugador", noMarch:"Ingresa tiempos de marcha válidos para los jugadores.",
      timeBudgetT:"Presupuesto de tiempo (aceleradores)", maxLevelHint:"nivel máximo",
      offMode:"⚔️ Ataque", defMode:"🛡️ Defensa",
      defHitTime:"Hora de llegada enemiga (UTC — HH:MM:SS)",
      defMarch:"Tu marcha al castillo (min : seg)",
      defLaunch:"Enviar guarnición antes de",
      defRemaining:"Tiempo restante",
      defTooLate:"⚠️ ¡Tiempo agotado! — Envía ahora"
    }
  };
  function cl() { return CL[lang]; }

  var NODE_LABELS = {
    truegold_battalion:["كتيبة الذهب الخالص","Truegold Battalion"],
    truegold_shields:["دروع الذهب الخالص","Truegold Shields"],
    truegold_blades:["نصل الذهب الخالص","Truegold Blades"],
    truegold_plating:["تصفيح الذهب الخالص","Truegold Plating"],
    truegold_legionaries:["فيلق الذهب الخالص","Truegold Legionaries"],
    truegold_mauls:["مطارق الذهب الخالص","Truegold Mauls"],
    truegold_infantry_node:["مشاة الذهب الخالص (XI)","Truegold Infantry (XI)"],
    truegold_infantry_aid:["مساعدة المشاة","Infantry Aid"],
    truegold_infantry_training:["تدريب المشاة","Infantry Training"],
    truegold_infantry_healing:["شفاء المشاة","Infantry Healing"],
    truegold_bracers:["سواعد الذهب الخالص","Truegold Bracers"],
    truegold_bows:["أقواس الذهب الخالص","Truegold Bows"],
    truegold_vests:["سترات الذهب الخالص","Truegold Vests"],
    truegold_arrows:["سهام الذهب الخالص","Truegold Arrows"],
    truegold_charge:["اندفاع الذهب الخالص","Truegold Charge"],
    truegold_farriery:["حدادة الذهب الخالص","Truegold Farriery"],
    truegold_lances:["رماح الذهب الخالص","Truegold Lances"],
    truegold_platecraft:["صفائح الذهب الخالص","Truegold Platecraft"]
  };
  var ARC_REN = {truegold_shields:"truegold_bracers",truegold_blades:"truegold_bows",truegold_plating:"truegold_vests",truegold_mauls:"truegold_arrows",truegold_infantry_node:"truegold_infantry_node",truegold_infantry_aid:"truegold_infantry_aid",truegold_infantry_training:"truegold_infantry_training",truegold_infantry_healing:"truegold_infantry_healing"};
  var CAV_REN = {truegold_blades:"truegold_charge",truegold_shields:"truegold_farriery",truegold_mauls:"truegold_lances",truegold_plating:"truegold_platecraft",truegold_infantry_node:"truegold_infantry_node",truegold_infantry_aid:"truegold_infantry_aid",truegold_infantry_training:"truegold_infantry_training",truegold_infantry_healing:"truegold_infantry_healing"};
  var STAT_LABELS = {
    attack:["هجوم","Attack"],defense:["دفاع","Defense"],health:["صحة","Health"],
    lethality:["فتك","Lethality"],troop_deployment_capacity:["سعة نشر القوات","Deployment Capacity"],
    rally_capacity:["سعة الرالي","Rally Capacity"],healing_cost_reduction:["خفض تكلفة الشفاء","Healing Cost −"],
    healing_time_reduction:["خفض وقت الشفاء","Healing Time −"],training_cost_reduction:["خفض تكلفة التدريب","Training Cost −"]
  };
  function nodeName(nameKey, troop) {
    var k = nameKey;
    if (troop === "Archers" && ARC_REN[nameKey]) k = ARC_REN[nameKey];
    if (troop === "Cavalry" && CAV_REN[nameKey]) k = CAV_REN[nameKey];
    var e = NODE_LABELS[k];
    return e ? (lang === "ar" ? e[0] : e[1]) : k;
  }
  function statName(s) { var e = STAT_LABELS[s]; return e ? (lang === "ar" ? e[0] : e[1]) : s; }
  function heroName(id) { var h = K2.heroes.find(function (x) { return x.id === id; }); return h ? h.name : id; }
  function costRows(c, L) {
    var rows = "", defs = [
      ["wood","🪵",L.wood],["bread","🍞",L.bread],["stone","🪨",L.stone],["iron","⛓️",L.iron],
      ["coins","🪙",L.coins],["gold","👑",cl().gold],["truegoldDust","✨",cl().truegoldDust]
    ];
    defs.forEach(function (d) {
      if (c[d[0]]) rows += statRow(d[1], d[2], fmtNum(c[d[0]]) + " <small>(" + fmtFull(c[d[0]]) + ")</small>");
    });
    return rows;
  }

  /* === أكاديمية الحرب === */
  function calcAcademy() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var nodes = K2.sf;
    var troop = "Infantry";
    function maxLv(node) { return node.maxLevel || (node.levels ? node.levels.length : 0); }
    function build() {
      var tImg = TROOP_IMG[troop] ? imgTag(TROOP_IMG[troop], troop, "troop-ic") : "";
      var nodeOpts = nodes.map(function (nd, i) { return '<option value="' + i + '">' + nodeName(nd.nameKey, troop) + "</option>"; }).join("");
      inp.innerHTML =
        '<div class="field"><label>' + C.troop + '</label><div class="seg" id="aTroop">' +
        [["Infantry", C.infantry], ["Cavalry", C.cavalry], ["Archers", C.archers]].map(function (x) {
          return '<button data-v="' + x[0] + '"' + (x[0] === troop ? ' class="on"' : "") + ">" + x[1] + "</button>";
        }).join("") + "</div></div>" +
        '<div class="field">' + tImg + '<label>' + C.node + '</label><select id="aNode">' + nodeOpts + "</select></div>" +
        '<div class="row2"><div class="field"><label>' + L.from + '</label><select id="aFrom"></select></div>' +
        '<div class="field"><label>' + L.to + '</label><select id="aTo"></select></div></div>';
      Array.prototype.forEach.call($("aTroop").children, function (b) {
        b.addEventListener("click", function () {
          Array.prototype.forEach.call($("aTroop").children, function (x) { x.classList.remove("on"); });
          b.classList.add("on"); troop = b.getAttribute("data-v");
          var ni = $("aNode"), cur = ni.value;
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
      var c = { wood:0,bread:0,stone:0,iron:0,coins:0,gold:0,truegoldDust:0 }, time = 0, power = 0;
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
        var tr = troop === "Infantry" ? C.infantry : troop === "Cavalry" ? C.cavalry : C.archers;
        statTxt = statRow("📈", statName(st.stat) + " (" + (st.troop === "All" ? "All" : tr) + ")", "+" + (Math.round(sum * 100) / 100));
      }
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + costRows(c, L) +
        statRow("⏱️", L.time, fmtTime(time)) + statTxt + statRow("⚡", L.power, "+" + fmtNum(power), true);
    }
    build();
  }

  /* === تدريب القوات === */
  function calcTraining() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var pts = KS_DATA.eventTroops, ut = K2.troopTrainTime;
    var tiersWithTime = ut.filter(function (r) { return r.time > 0; });
    inp.innerHTML =
      '<div class="field"><label>' + L.tier + '</label><select id="tTier">' +
      tiersWithTime.map(function (r) { return '<option value="' + r.tier + '">' + r.tier + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label>' + C.speedBonus + '</label><input type="number" id="tBonus" min="0" value="0" inputmode="numeric"></div>' +
      '<div class="field"><label>' + C.timeBudgetT + '</label><div class="row3">' +
      '<input type="number" id="tD" min="0" value="1" placeholder="' + C.days + '">' +
      '<input type="number" id="tH" min="0" value="0" placeholder="' + C.hours + '">' +
      '<input type="number" id="tM" min="0" value="0" placeholder="' + C.minutes + '"></div></div>';
    function compute() {
      var tier = $("tTier").value;
      var bonus = parseFloat($("tBonus").value) || 0;
      var budget = (parseFloat($("tD").value)||0)*86400 + (parseFloat($("tH").value)||0)*3600 + (parseFloat($("tM").value)||0)*60;
      var urow = ut.find(function (r) { return r.tier === tier; });
      var prow = pts.find(function (r) { return r.tier === tier; }) || {};
      var per = (urow.time || 0) / (1 + bonus / 100);
      var troops = per > 0 ? Math.floor(budget / per) : 0;
      var tImg = TROOP_IMG.Infantry ? imgTag(TROOP_IMG.Infantry, "", "res-ic") : "🪖";
      $("calcResults").innerHTML = "<h4>" + L.results + " — " + tier + "</h4>" +
        statRow(tImg, C.trainable, fmtFull(troops), true) +
        statRow("⚡", L.power, "+" + fmtNum((prow.power||0) * troops)) +
        statRow("🏆", L.kvk, fmtFull((prow.kvkPoints||0) * troops)) +
        statRow("🛡️", L.sg, fmtFull((prow.sgPoints||0) * troops)) +
        statRow("🐗", L.hog, fmtFull((prow.hogPoints||0) * troops));
    }
    ["tTier","tBonus","tD","tH","tM"].forEach(function (id) {
      $(id).addEventListener("input", compute); $(id).addEventListener("change", compute);
    });
    compute();
  }

  /* === معركة القلعة (هجوم + دفاع) === */
  function calcCastle() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var castleMode = "offense";
    var offPlayers = [{name:"",march:5*60},{name:"",march:5*60},{name:"",march:5*60}];
    var asmSec = 5 * 60;
    var offTimer = null;

    function fmtUTC(sec) {
      sec = ((sec % 86400) + 86400) % 86400;
      var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      function p(n) { return n < 10 ? "0" + n : "" + n; }
      return p(h) + ":" + p(m) + ":" + p(s);
    }

    function modeToggleHtml() {
      return '<div class="field"><div class="seg" id="cModeToggle">' +
        '<button data-v="offense"' + (castleMode === "offense" ? ' class="on"' : "") + ">" + C.offMode + "</button>" +
        '<button data-v="defense"' + (castleMode === "defense" ? ' class="on"' : "") + ">" + C.defMode + "</button>" +
        "</div></div>";
    }

    function build() {
      if (offTimer) { clearInterval(offTimer); offTimer = null; }
      if (castleMode === "offense") buildOffense();
      else buildDefense();
    }

    function buildOffense() {
      var addLbl = lang==="ar"?"+ إضافة لاعب":lang==="zh"?"+ 添加玩家":lang==="ko"?"+ 플레이어 추가":"+ Add player";
      var hitLbl = lang==="ar"?"وقت الضربة (HH:MM:SS UTC)":lang==="zh"?"打击时间 (HH:MM:SS UTC)":lang==="ko"?"타격 시간 (HH:MM:SS UTC)":"Hit time (HH:MM:SS UTC)";
      inp.innerHTML = modeToggleHtml() +
        '<div class="field"><label>' + C.utcNow + ' <span style="color:var(--green);font-size:10px;margin-inline-start:4px">● LIVE</span></label>' +
        '<input type="text" id="cNow" readonly></div>' +
        '<div class="field"><label>' + hitLbl + '</label>' +
        '<input type="text" id="cHit" placeholder="HH:MM:SS" style="font-family:monospace;letter-spacing:1px"></div>' +
        '<div class="field"><label>' + C.assembly + '</label><div class="seg" id="cAsmSeg">' +
        [1,2,3,5].map(function(m){ return '<button data-v="'+(m*60)+'"'+(m===5?' class="on"':"")+">"+m+" "+(lang==="ar"?"د":"m")+"</button>"; }).join("") +
        '</div></div>' +
        '<div id="cPlayers"></div>' +
        '<button id="cAddPlayer" style="width:100%;padding:12px;border:1px dashed var(--line2);border-radius:13px;background:transparent;color:var(--muted);cursor:pointer;margin-top:8px;font-size:14px;font-family:inherit">' + addLbl + "</button>";
      bindModeToggle();
      renderOffensePlayers();
      Array.prototype.forEach.call($("cAsmSeg").children, function(b) {
        b.addEventListener("click", function() {
          Array.prototype.forEach.call($("cAsmSeg").children, function(x){ x.classList.remove("on"); });
          b.classList.add("on");
          asmSec = parseInt(b.getAttribute("data-v"),10) || 5*60;
          computeOffense();
        });
      });
      $("cHit").addEventListener("input", computeOffense);
      $("cAddPlayer").addEventListener("click", function() {
        offPlayers.push({name:"",march:5*60});
        renderOffensePlayers();
        computeOffense();
      });
      offTimer = setInterval(function() { if ($("cNow")) computeOffense(); else { clearInterval(offTimer); offTimer = null; } }, 1000);
      computeOffense();
    }

    function renderOffensePlayers() {
      var nameLbl = lang==="ar"?"الاسم":lang==="zh"?"名称":lang==="ko"?"이름":"Name";
      var html = "";
      offPlayers.forEach(function(p, i) {
        html += '<div class="panel" style="margin-bottom:10px"><div class="panel-title">' + C.player + ' ' + (i+1) + '</div>' +
          '<div class="field"><label>' + nameLbl + '</label>' +
          '<input type="text" id="cPN'+i+'" value="'+(p.name||'')+'" placeholder="'+nameLbl+'..."></div>' +
          '<div class="field"><label>' + C.march + '</label><div class="row2">' +
          '<input type="number" min="0" id="cMM'+i+'" value="'+Math.floor(p.march/60)+'" placeholder="'+C.minutes+'">' +
          '<input type="number" min="0" max="59" id="cMS'+i+'" value="'+(p.march%60)+'" placeholder="ث"></div></div></div>';
      });
      $("cPlayers").innerHTML = html;
      offPlayers.forEach(function(_, i) {
        function upd() {
          offPlayers[i].name = $("cPN"+i).value;
          offPlayers[i].march = (parseInt($("cMM"+i).value,10)||0)*60 + (parseInt($("cMS"+i).value,10)||0);
          computeOffense();
        }
        $("cPN"+i).addEventListener("input", upd);
        $("cMM"+i).addEventListener("input", upd);
        $("cMS"+i).addEventListener("input", upd);
      });
    }

    function computeOffense() {
      var d = new Date();
      var nowSec = d.getUTCHours()*3600 + d.getUTCMinutes()*60 + d.getUTCSeconds();
      if ($("cNow")) $("cNow").value = fmtUTC(nowSec) + " UTC";
      var hitStr = ($("cHit")||{}).value || "";
      var hp = hitStr.split(":").map(Number);
      if (hp.length < 2 || isNaN(hp[0]) || isNaN(hp[1])) {
        $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" +
          (lang==="ar"?"أدخل وقت الضربة بصيغة HH:MM:SS":lang==="zh"?"请输入 HH:MM:SS 格式的打击时间":lang==="ko"?"HH:MM:SS 형식으로 타격 시간 입력":"Enter hit time: HH:MM:SS") + "</p>";
        return;
      }
      var hitSec = (hp[0]||0)*3600 + (hp[1]||0)*60 + (hp[2]||0);
      var asm = asmSec;
      var rows = statRow("🎯", C.hitAt, fmtUTC(hitSec), true);
      var minSend = Infinity;
      offPlayers.forEach(function(p, i) {
        var sendSec = hitSec - p.march - asm;
        if (sendSec < minSend) minSend = sendSec;
        var lbl = p.name || (C.player + " " + (i+1));
        rows += statRow("🚀", lbl, fmtUTC(sendSec));
      });
      if (minSend !== Infinity) {
        var remSec = ((minSend - nowSec) + 86400*2) % 86400;
        if (remSec > 43200) { rows += '<div class="stat" style="color:var(--red)">' + C.defTooLate + "</div>"; }
        else { rows += statRow("⏳", lang==="ar"?"المتبقي لأول إطلاق":lang==="zh"?"首发倒计时":lang==="ko"?"첫 발사까지":"Time to first launch", fmtTime(remSec)); }
      }
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows;
    }

    function buildDefense() {
      inp.innerHTML = modeToggleHtml() +
        '<div class="field"><label>' + C.utcNow + '</label><input type="text" id="dNow" readonly></div>' +
        '<div class="field"><label>' + C.defHitTime + '</label><input type="text" id="dHit" placeholder="HH:MM:SS" value=""></div>' +
        '<div class="field"><label>' + C.defMarch + '</label><div class="row2">' +
        '<input type="number" min="0" id="dMm" placeholder="' + C.minutes + '" value="3">' +
        '<input type="number" min="0" max="59" id="dSs" placeholder="' + C.minutes.charAt(0) + 's" value="0"></div></div>' +
        '<div class="field"><label>' + C.players + ' (' + C.defMode + ')</label><select id="dNum">' +
        [1,2,3,4,5].map(function(n){return '<option'+(n===1?" selected":"")+">"+n+"</option>";}).join("") + "</select></div>";

      bindModeToggle();
      ["dHit","dMm","dSs","dNum"].forEach(function(id){ $(id).addEventListener("input", computeDefense); $(id).addEventListener("change", computeDefense); });
      computeDefense();
    }

    function computeDefense() {
      var d = new Date();
      var nowSec = d.getUTCHours()*3600 + d.getUTCMinutes()*60 + d.getUTCSeconds();
      if ($("dNow")) $("dNow").value = fmtUTC(nowSec) + " UTC";
      var hitStr = ($("dHit")||{}).value || "";
      var parts = hitStr.split(":").map(Number);
      if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
        $("calcResults").innerHTML = "<h4>" + L.results + "</h4><p class='empty'>" + C.defHitTime + "</p>"; return;
      }
      var hitSec = (parts[0]||0)*3600 + (parts[1]||0)*60 + (parts[2]||0);
      var marchSec = (parseInt(($("dMm")||{}).value,10)||0)*60 + (parseInt(($("dSs")||{}).value,10)||0);
      var nDef = parseInt(($("dNum")||{}).value,10)||1;
      var launchBySec = hitSec - marchSec;
      var remainSec = ((launchBySec - nowSec) + 86400*2) % 86400;
      var tooLate = remainSec > 43200;
      var rows = statRow("🎯", C.hitAt, fmtUTC(hitSec), true);
      rows += statRow("🛡️", C.defLaunch, fmtUTC(launchBySec), true);
      if (tooLate) {
        rows += '<div class="stat" style="color:var(--red)">' + C.defTooLate + "</div>";
      } else {
        rows += statRow("⏳", C.defRemaining, fmtTime(remainSec));
      }
      if (nDef > 1) {
        for (var i = 2; i <= nDef; i++) {
          var stagger = launchBySec - (i-1)*30;
          rows += statRow("🛡️", C.player+" "+i, fmtUTC(stagger) + " <small>(−" + ((i-1)*30) + "s)</small>");
        }
      }
      $("calcResults").innerHTML = "<h4>" + L.results + "</h4>" + rows;
    }

    function bindModeToggle() {
      Array.prototype.forEach.call($("cModeToggle").children, function(b) {
        b.addEventListener("click", function() {
          castleMode = b.getAttribute("data-v");
          $("calcResults").innerHTML = "";
          build();
        });
      });
    }

    build();
  }

  /* === شظايا الأبطال === */
  function calcShards() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var heroes = K2.heroes.filter(function(h){ return K2.heroStarTable[h.id]; });
    function starOpts() { return [0,1,2,3,4,5].map(function(s){ return "<option>"+s+"</option>"; }).join(""); }
    function tierOpts() { return [0,1,2,3,4,5].map(function(s){ return "<option>"+s+"</option>"; }).join(""); }
    inp.innerHTML = heroPortrait("sHero") +
      '<div class="field"><label>' + C.hero + '</label><select id="sHero">' +
      heroes.map(function(h){ return '<option value="'+h.id+'">'+h.name+" ("+h.season+")</option>"; }).join("") + "</select></div>" +
      '<div class="row2"><div class="field"><label>' + L.from + " — " + C.star + '</label><select id="sFromStar">' + starOpts() + "</select></div>" +
      '<div class="field"><label>' + C.subStar + '</label><select id="sFromTier">' + tierOpts() + "</select></div></div>" +
      '<div class="row2"><div class="field"><label>' + L.to + " — " + C.star + '</label><select id="sToStar">' + starOpts() + "</select></div>" +
      '<div class="field"><label>' + C.subStar + '</label><select id="sToTier">' + tierOpts() + "</select></div></div>";
    $("sToStar").value = 5;
    setPortrait("sHero");
    function stepOf(star, tier) { return star >= 5 ? 30 : star * 6 + tier; }
    function compute() {
      var id = $("sHero").value;
      var tbl = K2.heroStarTable[id];
      var fs = stepOf(parseInt($("sFromStar").value,10), parseInt($("sFromTier").value,10));
      var ts = stepOf(parseInt($("sToStar").value,10), parseInt($("sToTier").value,10));
      if (ts <= fs) { $("calcResults").innerHTML = "<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
      var sh = 0; for (var i = fs; i < ts; i++) sh += K2.shardCost[i] || 0;
      var statTo = (tbl[Math.min(ts, tbl.length-1)] || {}).stat || 0;
      var statFrom = (tbl[Math.min(fs, tbl.length-1)] || {}).stat || 0;
      $("calcResults").innerHTML = "<h4>"+L.results+" — "+heroName(id)+"</h4>" +
        statRow("💠", C.shards, fmtFull(sh), true) +
        statRow("📈", C.statAt+" (هجوم/دفاع)", (Math.round(statTo*100)/100)+"%") +
        statRow("➕", C.statGainV, "+"+(Math.round((statTo-statFrom)*100)/100)+"%");
    }
    $("sHero").addEventListener("change", function(){ setPortrait("sHero"); compute(); });
    ["sFromStar","sFromTier","sToStar","sToTier"].forEach(function(x){ $(x).addEventListener("change", compute); });
    compute();
  }

  /* === مقارنة الأبطال === */
  function calcCompare() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var heroes = K2.heroes.filter(function(h){ return K2.heroStarTable[h.id]; });
    function heroSel(idp, def) {
      return '<select id="'+idp+'">' + heroes.map(function(h,i){ return '<option value="'+h.id+'"'+(i===def?" selected":"")+">"+h.name+"</option>"; }).join("") + "</select>";
    }
    function block(p, label, def) {
      return '<div class="panel-title">'+label+'</div>' + heroPortrait(p+"H") +
        '<div class="field">'+heroSel(p+"H", def)+"</div>" +
        '<div class="row3"><div class="field"><label>'+C.star+'</label><select id="'+p+'St">' +
        [0,1,2,3,4,5].map(function(s){ return "<option>"+s+"</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>'+C.subStar+'</label><select id="'+p+'Ti">' +
        [0,1,2,3,4,5].map(function(s){ return "<option>"+s+"</option>"; }).join("") + "</select></div>" +
        '<div class="field"><label>'+C.weaponLvl+'</label><select id="'+p+'W">' +
        Array.apply(null,{length:11}).map(function(_,i){ return "<option>"+i+"</option>"; }).join("") + "</select></div></div>";
    }
    inp.innerHTML = block("a", C.heroA, 0) + '<div style="height:10px"></div>' + block("b", C.heroB, 1);
    setPortrait("aH"); setPortrait("bH");
    function statsOf(p) {
      var id = $(p+"H").value, h = K2.heroes.find(function(x){ return x.id===id; });
      var star = parseInt($(p+"St").value,10), tier = parseInt($(p+"Ti").value,10);
      var step = star >= 5 ? 30 : star*6+tier;
      var tbl = K2.heroStarTable[id]; var srow = tbl[Math.min(step,tbl.length-1)] || {};
      var wl = parseInt($(p+"W").value,10);
      var rate = K2.weaponOverride[id]!=null ? K2.weaponOverride[id] : (K2.weaponRate[h.season]||5);
      var w = Math.round(wl*rate*100)/100;
      return {name:h.name, atk:srow.stat||0, def:srow.stat||0, hp:w, let:w};
    }
    function compute() {
      var A = statsOf("a"), B = statsOf("b");
      function cmpRow(icon, label, av, bv, suf) {
        suf = suf||"";
        var aw = av>=bv?"color:var(--green);font-weight:800":"", bw = bv>=av?"color:var(--green);font-weight:800":"";
        return '<div class="stat"><div class="si">'+icon+'</div><div class="sl">'+label+
          '</div><div class="sv"><span style="'+aw+'">'+Math.round(av*100)/100+suf+'</span>' +
          ' <small> | </small> <span style="'+bw+'">'+Math.round(bv*100)/100+suf+"</span></div></div>";
      }
      $("calcResults").innerHTML = "<h4>"+A.name+"  ⚔  "+B.name+"</h4>" +
        cmpRow("🗡️",C.attack,A.atk,B.atk,"%")+cmpRow("🛡️",C.defense,A.def,B.def,"%") +
        cmpRow("💥",C.lethality,A.let,B.let,"%")+cmpRow("❤️",C.health,A.hp,B.hp,"%");
    }
    ["aH","aSt","aTi","aW"].forEach(function(x){ $(x).addEventListener("change", function(){ if(x==="aH") setPortrait("aH"); compute(); }); });
    ["bH","bSt","bTi","bW"].forEach(function(x){ $(x).addEventListener("change", function(){ if(x==="bH") setPortrait("bH"); compute(); }); });
    compute();
  }

  /* === المتخصصون === */
  function calcSpecialists() {
    var inp = $("calcInputs");
    var specs = K2.specialists;
    var specIdx = 0;

    function sp() { return specs[specIdx]; }

    function psLvOf(specLv) {
      var ps = sp().primarySkill;
      return Math.min(Math.floor(specLv / 10), (ps && ps.values ? ps.values.length - 1 : 0));
    }
    function psValOf(specLv) {
      var ps = sp().primarySkill;
      if (!ps || !ps.values) return 0;
      return ps.values[psLvOf(specLv)] || 0;
    }

    function levelOpts(selVal) {
      var s = sp(), opts = "";
      for (var i = 0; i <= 100; i++) {
        var row = s.levels[i] || {statPercent: 0};
        var pct = Math.round((row.statPercent || 0) * 100) / 100;
        var brk = row.isBreakthrough ? " ✦" : "";
        opts += '<option value="' + i + '"' + (i === selVal ? " selected" : "") + ">" +
          (lang === "ar" ? "مستوى " : "Level ") + i + " (" + pct + "%)" + brk + "</option>";
      }
      return opts;
    }

    function skillStatOf(sk, lv) {
      var step = sk.steps[lv] || {};
      if (step.statPercent != null) return {val: step.statPercent, unit: "%"};
      if (step.rallyCapacity != null) return {val: step.rallyCapacity, unit: ""};
      if (step.deployCapacity != null) return {val: step.deployCapacity, unit: ""};
      if (step.companionStat != null) return {val: step.companionStat, unit: "%"};
      if (step.arenaTokenBonus != null) return {val: step.arenaTokenBonus, unit: "%"};
      if (step.arenaStat != null) return {val: step.arenaStat, unit: "%"};
      if (step.discountPercent != null) return {val: step.discountPercent, unit: "%"};
      if (step.expComponents != null) return {val: step.expComponents, unit: ""};
      if (step.forgeHammers != null) return {val: step.forgeHammers, unit: ""};
      if (step.watchtowerMissions != null) return {val: step.watchtowerMissions, unit: ""};
      if (step.staminaRegen != null) return {val: step.staminaRegen, unit: ""};
      if (step.constructionTimeSaved != null) return {val: step.constructionTimeSaved, unit: "h"};
      if (step.dailyManuscripts != null) return {val: step.dailyManuscripts, unit: ""};
      return {val: 0, unit: ""};
    }

    function build() {
      var s = sp();
      var sName = lang === "ar" ? s.nameAr : s.nameEn;
      var ps = s.primarySkill;
      var psMxLv = ps && ps.values ? ps.values.length - 1 : 0;
      var psName = ps ? (lang === "ar" ? ps.nameAr : ps.nameEn) : "";
      var psDesc = ps ? (lang === "ar" ? ps.descriptionAr : ps.descriptionEn) : "";
      var isAr = lang === "ar";

      var skHtml = "";
      if (s.skills) {
        s.skills.forEach(function(sk, si) {
          var maxLv = sk.steps.length - 1;
          var skOpts = "";
          for (var j = 0; j <= maxLv; j++) skOpts += "<option value='" + j + "'>" + j + "</option>";
          var skName = isAr ? sk.nameAr : sk.nameEn;
          var skDesc2 = isAr ? sk.descriptionAr : sk.descriptionEn;
          skHtml +=
            '<div class="panel" style="margin-bottom:10px">' +
            '<div style="font-weight:800;font-size:14px;margin-bottom:6px">' + skName + "</div>" +
            '<p style="font-size:12px;color:var(--muted);margin:0 0 10px;line-height:1.5">' + skDesc2 + "</p>" +
            '<div class="row2">' +
            '<div class="field"><label>' + (isAr ? "الحالي" : "Current") + '</label><select id="sk' + si + 'F">' + skOpts + "</select></div>" +
            '<div class="field"><label>' + (isAr ? "المستهدف" : "Target") + '</label><select id="sk' + si + 'T">' + skOpts + "</select></div>" +
            "</div>" +
            '<div id="sk' + si + 'R" style="font-size:12.5px;color:var(--muted);margin-top:6px;min-height:18px"></div></div>';
        });
      }

      inp.innerHTML =
        '<div class="field"><label>' + (isAr ? "المتخصص" : "Specialist") + '</label><select id="spSel">' +
        specs.map(function(s2, i) {
          return '<option value="' + i + '"' + (i === specIdx ? " selected" : "") + ">" + (isAr ? s2.nameAr : s2.nameEn) + "</option>";
        }).join("") + "</select></div>" +

        // Section 1: Level Up
        '<div class="panel"><div class="panel-title">' + (isAr ? "ترقية المستوى والتطوير للمتخصص" : "Level Up and Development") + "</div>" +
        '<div class="row2">' +
        '<div class="field"><label>' + (isAr ? "المستوى الحالي للمتخصص" : "Current Specialist Level") + '</label><select id="spFrom">' + levelOpts(0) + "</select></div>" +
        '<div class="field"><label>' + (isAr ? "المستوى المستهدف" : "Target Level") + '</label><select id="spTo">' + levelOpts(100) + "</select></div>" +
        '</div><div id="spLvR" style="margin-top:10px"></div></div>' +

        // Section 2: Primary Skill
        '<div class="panel"><div class="panel-title">' + (isAr ? "مهارة المتخصص الأساسية" : "Primary Specialist Skill") +
        ' <span id="spPsBadge" style="background:var(--gold);color:#241402;border-radius:9px;padding:2px 8px;font-size:10px;font-weight:900;margin-inline-start:6px">' +
        (isAr ? "المستوى" : "Level") + " 0 / " + psMxLv + "</span></div>" +
        '<div style="font-weight:600;font-size:13px;margin-bottom:6px">' + psName + "</div>" +
        '<p style="font-size:12px;color:var(--muted);margin:0 0 12px;line-height:1.5">' + psDesc + "</p>" +
        '<div class="row2" id="spPsBoxes"></div></div>' +

        // Section 3: Skills
        '<div class="panel"><div class="panel-title">' + (isAr ? "مهارات المتخصص" : "Specialist Skills") + " — " + sName + "</div>" +
        '<p style="font-size:12px;color:var(--muted);margin:0 0 14px;line-height:1.5">*' +
        (isAr
          ? "ملاحظة: تستهلك هذه المهارات «مخطوطة المتخصص» (Master’s Manuscripts) لترقيتها. يمكنك تخطيط مستويات البدء والمستويات المستهدفة بدقة."
          : "Note: These skills consume Master’s Manuscripts to upgrade. You can plan start and target levels precisely.") +
        "</p>" + skHtml + "</div>" +

        // Section 4: Inventory
        '<div class="panel"><div class="panel-title">' + (isAr ? "ما تملك وما ينقصك" : "What You Have / What You Need") + "</div>" +
        '<div class="field"><label>' + (isAr ? "إجمالي هدايا التطوير المتاحة لديك" : "Total Development Gifts Available") + "</label>" +
        '<input type="number" id="invG" min="0" value="0"></div>' +
        '<p style="font-size:12px;color:var(--muted);margin:-8px 0 10px;line-height:1.5">' +
        (isAr ? "يمكنك إدخال المجموع مباشرة أو حسابه بدقة عبر القطع أدناه" : "You can enter the total directly or calculate it from the pieces below") + "</p>" +
        '<label style="font-size:12px;color:var(--muted);font-weight:700;display:block;margin-bottom:8px">' +
        (isAr ? "حساب هدايا التطوير الحقيقية بالقطع:" : "Calculate development gifts from pieces:") + "</label>" +
        '<div class="row3" style="margin-bottom:10px">' +
        '<div style="text-align:center"><div style="font-size:10px;font-weight:800;color:var(--gold);margin-bottom:4px">' +
        (isAr ? "توابل الذهب" : "Gold Spice") + " × 1,000</div><input type=\"number\" id=\"p1k\" min=\"0\" value=\"0\"></div>" +
        '<div style="text-align:center"><div style="font-size:10px;font-weight:800;color:var(--muted);margin-bottom:4px">' +
        (isAr ? "كأس فضي" : "Silver Cup") + " × 100</div><input type=\"number\" id=\"p100\" min=\"0\" value=\"0\"></div>" +
        '<div style="text-align:center"><div style="font-size:10px;font-weight:800;color:var(--muted2);margin-bottom:4px">' +
        (isAr ? "بوق تحاسي" : "Bronze Horn") + " × 10</div><input type=\"number\" id=\"p10\" min=\"0\" value=\"0\"></div>" +
        "</div>" +
        '<button id="clearPcs" style="font-size:12px;background:var(--surface2);border:1px solid var(--line2);color:var(--muted);border-radius:10px;padding:8px 14px;cursor:pointer;margin-bottom:14px">' +
        (isAr ? "تصفير القطع" : "Reset Pieces") + "</button>" +
        '<div class="field"><label>' + (isAr ? "شعارات عامة (لجميع المتخصصين) لديك" : "General Crests Available (all specialists)") + "</label>" +
        '<input type="number" id="invC" min="0" value="0"></div>' +
        '<div class="field" style="margin-bottom:0"><label>' + (isAr ? "المخطوطات العامة (لجميع المتخصصين) لديك" : "General Manuscripts Available (all specialists)") + "</label>" +
        '<input type="number" id="invM" min="0" value="0"></div></div>';

      // Event listeners
      $("spSel").addEventListener("change", function() { specIdx = parseInt(this.value, 10); build(); });
      $("spFrom").addEventListener("change", compute);
      $("spTo").addEventListener("change", compute);
      ["invG", "invC", "invM"].forEach(function(id) { $(id).addEventListener("input", compute); });
      ["p1k", "p100", "p10"].forEach(function(id) {
        $(id).addEventListener("input", function() {
          var tot = (parseInt($("p1k").value) || 0) * 1000 + (parseInt($("p100").value) || 0) * 100 + (parseInt($("p10").value) || 0) * 10;
          $("invG").value = tot;
          compute();
        });
      });
      $("clearPcs").addEventListener("click", function() {
        ["p1k", "p100", "p10"].forEach(function(id) { $(id).value = "0"; });
        $("invG").value = "0";
        compute();
      });
      if (s.skills) {
        s.skills.forEach(function(sk, si) {
          $("sk" + si + "T").value = sk.steps.length - 1;
          $("sk" + si + "F").addEventListener("change", compute);
          $("sk" + si + "T").addEventListener("change", compute);
        });
      }
      compute();
    }

    function compute() {
      var s = sp();
      var isAr = lang === "ar";
      var sName = isAr ? s.nameAr : s.nameEn;
      var from = Math.max(0, Math.min(100, parseInt($("spFrom").value, 10) || 0));
      var to   = Math.max(0, Math.min(100, parseInt($("spTo").value,   10) || 0));

      // Level costs
      var gifts = 0, crests = 0;
      for (var i = from + 1; i <= to; i++) {
        var row = s.levels[i]; if (!row) continue;
        gifts  += row.giftCost  || 0;
        crests += row.crestCost || 0;
      }
      var statFrom = (s.levels[from] || {}).statPercent || 0;
      var statTo   = (s.levels[to]   || {}).statPercent || 0;
      var statGain = Math.round((statTo - statFrom) * 100) / 100;
      var statFromR = Math.round(statFrom * 100) / 100;
      var statToR   = Math.round(statTo   * 100) / 100;

      // Primary skill
      var psLvF = psLvOf(from), psLvT = psLvOf(to);
      var psVF  = psValOf(from), psVT  = psValOf(to);
      var ps    = s.primarySkill;
      var psMxLv = ps && ps.values ? ps.values.length - 1 : 0;
      var psUnit = (ps && ps.unit) ? ps.unit : "";
      var lvLbl = isAr ? "المستوى" : "Level";

      if ($("spPsBadge")) $("spPsBadge").textContent = lvLbl + " " + psLvT + " / " + psMxLv;
      if ($("spPsBoxes")) {
        var hasChestData = ps && ps.dailyLimit;
        if (hasChestData) {
          var chestsF = (ps.chests || [])[psLvF] || 0;
          var chestsT = (ps.chests || [])[psLvT] || 0;
          var limitF  = ps.dailyLimit[psLvF] || 0;
          var limitT  = ps.dailyLimit[psLvT] || 0;
          var chestLbl   = isAr ? "صناديق / يوم" : "Chests / Day";
          var limitLbl   = isAr ? "حد يومي" : "Daily Limit";
          var chanceLbl  = isAr ? "احتمال الصندوق" : "Chest Chance";
          function psBox(lv, chests, limit, chance) {
            return '<div style="flex:1;text-align:center;padding:12px;background:var(--bg);border-radius:13px;border:1px solid var(--line)">' +
              '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + lvLbl + " " + lv + "</div>" +
              '<div style="font-size:18px;font-weight:900;color:var(--gold)">' + chests + ' 📦</div>' +
              '<div style="font-size:11px;color:var(--muted);margin-top:4px">' + limitLbl + ': ' + limit + '</div>' +
              '<div style="font-size:11px;color:var(--muted2)">' + chanceLbl + ': ' + chance + '%</div></div>';
          }
          $("spPsBoxes").innerHTML = psBox(psLvF, chestsF, limitF, psVF) + psBox(psLvT, chestsT, limitT, psVT);
        } else {
          var usePercent = ps && ps.unit === "%";
          var curLbl = isAr ? (usePercent ? "الحالية" : "سعة النشر الحالية") : "Current";
          var tgtLbl = isAr ? (usePercent ? "المستهدفة" : "سعة النشر المستهدفة") : "Target";
          $("spPsBoxes").innerHTML =
            '<div style="flex:1;text-align:center;padding:14px;background:var(--bg);border-radius:13px;border:1px solid var(--line)">' +
            '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + curLbl + "</div>" +
            '<div style="font-size:10px;color:var(--muted2);margin-bottom:6px">' + lvLbl + " " + psLvF + "</div>" +
            '<div style="font-size:20px;font-weight:900;color:var(--gold)">' + fmtNum(psVF) + (psUnit || "+") + "</div></div>" +
            '<div style="flex:1;text-align:center;padding:14px;background:var(--bg);border-radius:13px;border:1px solid var(--line)">' +
            '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + tgtLbl + "</div>" +
            '<div style="font-size:10px;color:var(--muted2);margin-bottom:6px">' + lvLbl + " " + psLvT + "</div>" +
            '<div style="font-size:20px;font-weight:900;color:var(--gold)">' + fmtNum(psVT) + (psUnit || "+") + "</div></div>";
        }
      }

      if ($("spLvR")) {
        var totalLbl = isAr ? "مجموع" : "total";
        $("spLvR").innerHTML =
          '<div class="row3">' +
          '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:12px;border:1px solid var(--line)">' +
          '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + (isAr ? "هدية التطوير المطلوبة" : "Dev Gift Needed") + "</div>" +
          '<div style="font-size:16px;font-weight:900;color:var(--gold)">' + fmtFull(gifts) + "</div></div>" +
          '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:12px;border:1px solid var(--line)">' +
          '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + (isAr ? "شعارات المتخصص المطلوبة" : "Crests Needed") + "</div>" +
          '<div style="font-size:16px;font-weight:900;color:var(--gold)">' + fmtFull(crests) + "</div></div>" +
          '<div style="text-align:center;padding:10px;background:var(--bg);border-radius:12px;border:1px solid var(--line)">' +
          '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + (isAr ? "مكاسب الفتك والصحة من المستويات" : "Stat Gain from Levels") + "</div>" +
          '<div style="font-size:16px;font-weight:900;color:var(--green)">+' + statGain + "%</div>" +
          '<div style="font-size:9px;color:var(--muted2)">(' + totalLbl + "): " + statToR + "%</div></div></div>";
      }

      // Skills
      var totalManu = 0;
      if (s.skills) {
        s.skills.forEach(function(sk, si) {
          var sfEl = $("sk" + si + "F"), stEl = $("sk" + si + "T");
          if (!sfEl || !stEl) return;
          var sf = parseInt(sfEl.value, 10) || 0;
          var st = Math.max(sf, parseInt(stEl.value, 10) || 0);
          var manu = 0;
          for (var j = sf + 1; j <= st; j++) { var step = sk.steps[j]; if (step) manu += step.manuscriptCost || 0; }
          totalManu += manu;
          var stF = skillStatOf(sk, sf), stT = skillStatOf(sk, st);
          var gain = Math.round((stT.val - stF.val) * 100) / 100;
          var gainStr = gain > 0 ? "+" + gain + stT.unit : "";
          var rEl = $("sk" + si + "R");
          if (rEl) {
            rEl.innerHTML =
              '<span style="color:var(--muted)">' + (isAr ? "المخطوطات المطلوبة" : "Manuscripts needed") + ":</span> " +
              '<strong style="color:var(--gold)">' + fmtFull(manu) + "</strong>" +
              (gainStr ? ' &nbsp; <span style="color:var(--muted)">' + (isAr ? "مكاسب" : "Gain") + ":</span> " + '<strong style="color:var(--green)">' + gainStr + "</strong>" : "");
          }
        });
      }

      // Inventory & deficit
      var invG = parseInt(($("invG") || {}).value, 10) || 0;
      var invC = parseInt(($("invC") || {}).value, 10) || 0;
      var invM = parseInt(($("invM") || {}).value, 10) || 0;
      var gDef = Math.max(0, gifts - invG);
      var cDef = Math.max(0, crests - invC);
      var mDef = Math.max(0, totalManu - invM);
      function defStr(def) {
        return def === 0
          ? '<span style="color:var(--green)">✓ ' + (isAr ? "كافي" : "Sufficient") + "</span>"
          : '<span style="color:var(--red)">−' + fmtFull(def) + "</span>";
      }

      $("calcResults").innerHTML =
        "<h4>" + (isAr ? "إجمالي التكاليف" : "Total Costs") + " — " + sName + "</h4>" +
        statRow("📊", isAr ? "مستوى المتخصص النهائي" : "Final Specialist Level", to.toString()) +
        (ps && ps.dailyLimit
          ? statRow("📦", isAr ? "صناديق / يوم (المستهدف)" : "Target Chests/Day", (ps.chests[psLvT]||0) + " — " + (isAr?"الحد اليومي":"Limit") + ": " + (ps.dailyLimit[psLvT]||0))
          : statRow("🚀", isAr ? "سعة النشر المستهدفة" : "Target Deploy Capacity", fmtNum(psVT) + (psUnit || "+"))) +
        statRow("📈", isAr ? "صحة وفتك المستويات (يشمل " + statFromR + "% كأساس)" : "Health+Lethality (incl. base)", "+" + statGain + "% → " + statToR + "%") +
        statRow("🎁", isAr ? "هدايا التطوير لمستويات البطل" : "Dev Gifts for Levels", fmtFull(gifts)) +
        statRow("🎖️", isAr ? "الشعارات لترقية المستويات" : "Crests for Levels", fmtFull(crests)) +
        statRow("📜", isAr ? "مخطوطات ترقية المهارات الخاصة" : "Manuscripts for Skills", fmtFull(totalManu)) +
        statRow("🎁", isAr ? "إجمالي الهدايا المطلوبة" : "Total Gifts Required", fmtFull(gifts), true) +
        statRow("🎖️", isAr ? "إجمالي الشعارات المطلوبة" : "Total Crests Required", fmtFull(crests)) +
        statRow("📜", isAr ? "إجمالي المخطوطات المطلوبة" : "Total Manuscripts Required", fmtFull(totalManu)) +
        '<h4 style="margin-top:16px;margin-bottom:10px">' + (isAr ? "إجمالي النقص لكل المتخصصين" : "Total Deficit") + "</h4>" +
        '<div class="stat"><div class="si">🎁</div><div class="sl">' + (isAr ? "النقص الكلي في الهدايا" : "Gift Deficit") + '</div><div class="sv">' + defStr(gDef) + "</div></div>" +
        '<div class="stat"><div class="si">🎖️</div><div class="sl">' + (isAr ? "النقص الكلي في الشعارات" : "Crest Deficit") + '</div><div class="sv">' + defStr(cDef) + "</div></div>" +
        '<div class="stat"><div class="si">📜</div><div class="sl">' + (isAr ? "النقص الكلي في المخطوطات" : "Manuscript Deficit") + '</div><div class="sv">' + defStr(mDef) + "</div></div>";
    }

    build();
  }

  /* === الذهب الخالص (مباني) === */
  var TG_BLD = {
    town_center:["مركز المدينة","Town Center"],embassy:["السفارة","Embassy"],
    barracks:["الثكنات","Barracks"],range:["الرماية","Range"],stable:["الإسطبل","Stable"],
    command_center:["مركز القيادة","Command Center"],war_academy:["أكاديمية الحرب","War Academy"],
    infirmary:["المشفى","Infirmary"]
  };
  function calcTruegold() {
    var L = t(), inp = $("calcInputs");
    var blds = (window.KS4 && window.KS4.truegoldBuildings) || {};
    var keys = Object.keys(blds);
    var sel = keys[0];
    function lvlOpts(arr) { return arr.map(function(r,i){ return '<option value="'+i+'">'+r.name+"</option>"; }).join(""); }
    function build() {
      var arr = blds[sel];
      var tgImg = TG_BLDG_IMG[sel] ? imgTag(TG_BLDG_IMG[sel], sel, "bldg-img") : "";
      inp.innerHTML =
        '<div class="field">'+tgImg+'<label>'+(lang==="ar"?"المبنى":"Building")+'</label><select id="tgB">' +
        keys.map(function(k){ return '<option value="'+k+'"'+(k===sel?" selected":"")+">"+(TG_BLD[k]?TG_BLD[k][lang==="ar"?0:1]:k)+"</option>"; }).join("") + "</select></div>" +
        '<div class="row2"><div class="field"><label>'+L.from+'</label><select id="tgF">'+lvlOpts(arr)+"</select></div>" +
        '<div class="field"><label>'+L.to+'</label><select id="tgT">'+lvlOpts(arr)+"</select></div></div>";
      $("tgB").value=sel; $("tgF").value=0; $("tgT").value=arr.length-1;
      $("tgB").addEventListener("change", function(){ sel=this.value; build(); });
      $("tgF").addEventListener("change", compute); $("tgT").addEventListener("change", compute);
      compute();
    }
    function compute() {
      var arr = blds[sel];
      var from = parseInt($("tgF").value,10), to = parseInt($("tgT").value,10);
      if (to<=from) { $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
      var charms=0, tempered=0, res={wood:0,bread:0,stone:0,iron:0};
      for (var i=from+1; i<=to; i++) {
        var row=arr[i]; if(!row) continue;
        charms+=row.cost||0;
        tempered+=row.temperedTruegold||0;
        if(row.resources) for (var k in res) res[k]+=row.resources[k]||0;
      }
      var pGain=(arr[to].power||0)-(arr[from].power||0);
      var crestLbl = lang==="ar"?"شارات الذهب الخالص":lang==="zh"?"精金徽章":lang==="ko"?"정금 휘장":lang==="es"?"Insignias de Truegold":"Truegold Crests";
      var tempLbl  = lang==="ar"?"شارات الذهب الخالص المعدّل":lang==="zh"?"改良精金徽章":lang==="ko"?"개조 정금 휘장":lang==="es"?"Insignias Truegold Modificado":"Tempered Truegold Crests";
      $("calcResults").innerHTML="<h4>"+L.results+"</h4>" +
        statRow("🪙",crestLbl,fmtFull(charms),true) +
        (tempered>0 ? statRow("⚗️",tempLbl,fmtFull(tempered)) : "") +
        costRows(res,L) + statRow("⚡",L.power,"+"+fmtNum(pGain),true);
    }
    build();
  }

  /* === الأبحاث === */
  var ROMAN = {"1":"I","2":"II","3":"III","4":"IV","5":"V","6":"VI"};
  var NODE_NAMES_AR = {
    weapons_prep:"تجهيز الأسلحة", reprisal_tactics:"تكتيكات انتقامية",
    precision_targeting:"استهداف دقيق", cavalry_charge:"اندفاع الفرسان",
    defensive_formations:"تشكيلات دفاعية", picket_lines:"خطوط الاعتصام",
    bulwark_formations:"تشكيلات الحصن", special_defensive_training:"تدريب الدفاع الخاص",
    survival_techniques:"تقنيات البقاء", assault_techniques:"تقنيات الاقتحام",
    regimental_expansion:"توسيع الفوج", close_combat:"القتال المباشر",
    targeted_sniping:"القنص الدقيق", lance_upgrade:"تطوير الرمح",
    shield_upgrade:"تطوير الدرع", leathercraft:"صناعة الجلود",
    fortified_mail:"البريد المحصن"
  };
  function fmtNodeName(key) {
    var parts=key.split("_"), suffix="";
    var last=parts[parts.length-1];
    if(ROMAN[last]){ suffix=" "+ROMAN[last]; parts.pop(); }
    var base=parts.join("_");
    if(lang==="ar" && NODE_NAMES_AR[base]) return NODE_NAMES_AR[base]+suffix;
    return parts.map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(" ")+suffix;
  }
  function calcResearch() {
    var L=t(), C=cl(), inp=$("calcInputs");
    var all=(window.KS3&&window.KS3.research)||[];
    var branch=1;
    function nodeBranch(nd){ var p=nd.nameKey.split("_"); return parseInt(p[p.length-1],10)||1; }
    function list(){ return all.filter(function(nd){ return nodeBranch(nd)===branch; }); }
    function build(){
      var nodes=list();
      var branchLbl = lang==="ar"?"فرع":lang==="zh"?"分支":lang==="ko"?"분기":"Branch";
      inp.innerHTML=
        '<div class="field"><label>'+branchLbl+'</label><div class="seg" id="rsBranch">' +
        [1,2,3,4,5,6].map(function(n){
          return '<button data-v="'+n+'"'+(n===branch?' class="on"':"")+">"+ROMAN[n]+"</button>";
        }).join("") + "</div></div>" +
        '<div class="field"><label>'+C.node+'</label><select id="rsNode">' +
        nodes.map(function(nd,i){ return '<option value="'+i+'">'+fmtNodeName(nd.nameKey)+"</option>"; }).join("") + "</select></div>" +
        '<div class="row2"><div class="field"><label>'+L.from+'</label><select id="rsFrom"></select></div>' +
        '<div class="field"><label>'+L.to+'</label><select id="rsTo"></select></div></div>';
      Array.prototype.forEach.call($("rsBranch").children, function(b){
        b.addEventListener("click", function(){ branch=parseInt(b.getAttribute("data-v"),10); build(); });
      });
      $("rsNode").addEventListener("change", fillLv);
      fillLv();
    }
    function fillLv(){
      var nd=list()[parseInt($("rsNode").value,10)];
      var mx=nd.maxLevel||(nd.levels?nd.levels.length:0);
      var o=""; for(var i=0;i<=mx;i++) o+="<option>"+i+"</option>";
      $("rsFrom").innerHTML=o; $("rsTo").innerHTML=o;
      $("rsFrom").value=0; $("rsTo").value=mx;
      $("rsFrom").addEventListener("change",compute); $("rsTo").addEventListener("change",compute);
      compute();
    }
    function compute(){
      var nd=list()[parseInt($("rsNode").value,10)];
      var from=parseInt($("rsFrom").value,10), to=parseInt($("rsTo").value,10);
      if(to<=from){ $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
      var c={wood:0,bread:0,stone:0,iron:0,coins:0}, time=0, power=0;
      for(var lv=from;lv<to;lv++){
        var row=nd.levels[lv]; if(!row) continue;
        for(var k in c) c[k]+=(row.cost&&row.cost[k])||0;
        time+=row.timeInSeconds||0; power+=row.power||0;
      }
      var statTxt="";
      if(nd.stats&&nd.stats[0]){
        var st=nd.stats[0], sum=0;
        if(st.valuesPerLevel) for(var q=from;q<to;q++) sum+=st.valuesPerLevel[q]||0;
        else if(st.valuePerLevel!=null) sum=st.valuePerLevel*(to-from);
        var trL=st.troop==="All"?(lang==="ar"?"الكل":"All"):st.troop==="Infantry"?C.infantry:st.troop==="Cavalry"?C.cavalry:C.archers;
        var flat=st.stat==="troop_deployment_capacity"||st.stat==="rally_capacity";
        statTxt=statRow("📈",statName(st.stat)+" ("+trL+")","+"+Math.round(sum*100)/100+(flat?"":"%"));
      }
      $("calcResults").innerHTML="<h4>"+L.results+"</h4>"+costRows(c,L)+
        statRow("⏱️",L.time,fmtTime(time))+statTxt+statRow("⚡",L.power,"+"+fmtNum(power),true);
    }
    build();
  }

  /* === معدّات وأسلحة الأبطال === */
  function heroWeaponStat(id,level){
    var h=K2.heroes.find(function(x){ return x.id===id; });
    var rate=K2.weaponOverride[id]!=null?K2.weaponOverride[id]:(K2.weaponRate[h?h.season:"S1"]||5);
    return Math.round(level*rate*100)/100;
  }
  function calcHero(){
    var L=t(), C=cl(), inp=$("calcInputs");
    var heroes=K2.heroes;
    var mode="weapon";
    function build(){
      var seg='<div class="field"><div class="seg" id="hMode">' +
        '<button data-v="weapon"'+(mode==="weapon"?' class="on"':"")+">"+
        (lang==="ar"?"السلاح":lang==="zh"?"武器":lang==="ko"?"무기":"Weapon")+"</button>" +
        '<button data-v="forge"'+(mode==="forge"?' class="on"':"")+">"+
        (lang==="ar"?"التطوير (مطارق)":lang==="zh"?"锻造":lang==="ko"?"강화":"Forge")+"</button></div></div>";
      var body;
      if(mode==="weapon"){
        body=heroPortrait("hHero")+'<div class="field"><label>'+C.hero+'</label><select id="hHero">'+
          heroes.map(function(h){ return '<option value="'+h.id+'">'+h.name+" ("+h.season+")</option>"; }).join("")+"</select></div>"+
          '<div class="row2"><div class="field"><label>'+L.from+" — "+C.weaponLvl+'</label><select id="hFrom">'+lvlOpts(10)+"</select></div>"+
          '<div class="field"><label>'+L.to+'</label><select id="hTo">'+lvlOpts(10)+"</select></div></div>";
      } else {
        body='<div class="field"><label>'+(lang==="ar"?"مستوى المعدّة (للإحصائية)":lang==="zh"?"装备等级 (用于属性)":lang==="ko"?"장비 레벨 (능력치용)":"Gear level (for stat)")+
          '</label><input type="number" id="hGL" min="0" max="200" value="100"></div>'+
          '<div class="row2"><div class="field"><label>'+L.from+" — "+(lang==="ar"?"مطرقة":lang==="zh"?"强化":lang==="ko"?"강화":"Forge")+
          '</label><input type="number" id="hFF" min="0" max="20" value="0"></div>'+
          '<div class="field"><label>'+L.to+'</label><input type="number" id="hFT" min="0" max="20" value="20"></div></div>';
      }
      inp.innerHTML=seg+body;
      Array.prototype.forEach.call($("hMode").children, function(b){
        b.addEventListener("click", function(){ mode=b.getAttribute("data-v"); build(); });
      });
      if(mode==="weapon"){
        $("hTo").value=10;
        $("hHero").addEventListener("change", function(){ setPortrait("hHero"); compute(); });
        setPortrait("hHero");
        ["hFrom","hTo"].forEach(function(x){ $(x).addEventListener("change",compute); });
      } else {
        ["hGL","hFF","hFT"].forEach(function(x){ $(x).addEventListener("input",compute); });
      }
      compute();
    }
    function compute(){
      if(mode==="weapon"){
        var id=$("hHero").value, from=parseInt($("hFrom").value,10), to=parseInt($("hTo").value,10);
        if(to<=from){ $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
        var hw=0; for(var l=from;l<to;l++) hw+=(l+1)*5;
        var gain=heroWeaponStat(id,to)-heroWeaponStat(id,from);
        $("calcResults").innerHTML="<h4>"+L.results+" — "+heroName(id)+"</h4>"+
          statRow("⚒️",lang==="ar"?"أسلحة الأبطال المطلوبة":lang==="zh"?"所需英雄武器":lang==="ko"?"필요한 영웅 무기":"Hero Weapons needed",fmtFull(hw),true)+
          statRow("❤️",C.health,"+"+gain+"%")+statRow("💥",C.lethality,"+"+gain+"%");
      } else {
        var gl=parseInt($("hGL").value,10)||0, ff=parseInt($("hFF").value,10)||0, ft=parseInt($("hFT").value,10)||0;
        if(ft<=ff){ $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
        var ham=0, myth=0; for(var s=ff;s<ft;s++){ var st=s+1; ham+=st*10; if(st>=11) myth+=st-10; }
        function fn(A,D){ if(A<=0) return 0; var cum=0; for(var n=1;n<=A;n++) cum+=(n>100?0.5:0.35); return (15+cum)*(1+D*0.1); }
        var statGain=Math.round((fn(gl,ft)-fn(gl,ff))*100)/100;
        $("calcResults").innerHTML="<h4>"+L.results+"</h4>"+
          statRow("🔨",lang==="ar"?"المطارق المطلوبة":lang==="zh"?"所需强化锤":lang==="ko"?"필요한 강화 망치":"Forgehammers",fmtFull(ham),true)+
          (myth?statRow("⚙️",lang==="ar"?"تروس أسطورية":lang==="zh"?"神话齿轮":lang==="ko"?"신화 기어":"Mythic Gears",fmtFull(myth)):"")+
          statRow("✖️",lang==="ar"?"المضاعف":lang==="zh"?"倍率":lang==="ko"?"배율":"Multiplier","×"+(1+ft*0.1).toFixed(1))+
          statRow("📈",lang==="ar"?"زيادة الإحصائية":lang==="zh"?"属性增加":lang==="ko"?"능력치 증가":"Stat increase","+"+statGain+"%",true);
      }
    }
    function lvlOpts(mx){ var o=""; for(var i=0;i<=mx;i++) o+="<option>"+i+"</option>"; return o; }
    build();
  }

  /* === رالي ليدر === */
  function calcRally(){
    var L=t(), C=cl(), inp=$("calcInputs");
    var troop="Infantry";
    var gear=K2.gear, charm=K2.charm;
    function heroesFor(tp){ return K2.heroes.filter(function(h){ return h.troopTypes.indexOf(tp)>=0&&K2.heroStarTable[h.id]; }); }
    function build(){
      var hs=heroesFor(troop);
      inp.innerHTML=
        '<div class="field"><label>'+C.troop+'</label><div class="seg" id="rTroop">'+
        [["Infantry",C.infantry],["Cavalry",C.cavalry],["Archers",C.archers]].map(function(x){
          return '<button data-v="'+x[0]+'"'+(x[0]===troop?' class="on"':"")+">"+x[1]+"</button>";
        }).join("")+"</div></div>"+
        '<div class="panel-title">'+(lang==="ar"?"إحصائياتك الحالية (٪)":lang==="zh"?"当前属性 (%)":lang==="ko"?"현재 능력치 (%)":"Your current stats (%)")+"</div>"+
        '<div class="row2"><div class="field"><label>'+C.attack+'</label><input type="number" id="rAtk" value="0" step="0.1"></div>'+
        '<div class="field"><label>'+C.defense+'</label><input type="number" id="rDef" value="0" step="0.1"></div></div>'+
        '<div class="row2"><div class="field"><label>'+C.lethality+'</label><input type="number" id="rLet" value="0" step="0.1"></div>'+
        '<div class="field"><label>'+C.health+'</label><input type="number" id="rHp" value="0" step="0.1"></div></div>'+
        '<div class="panel-title" style="margin-top:14px">'+(lang==="ar"?"المصادر":lang==="zh"?"加成来源":lang==="ko"?"보너스 출처":"Sources")+"</div>"+
        '<div class="field"><label>'+(lang==="ar"?"مرحلة معدّات الحاكم":lang==="zh"?"君主装备阶段":lang==="ko"?"총독 장비 단계":"Governor gear stage")+
        '</label><select id="rGear">'+gear.map(function(g,i){ return '<option value="'+i+'">'+g.name+"</option>"; }).join("")+"</select></div>"+
        '<div class="field"><label>'+(lang==="ar"?"مستوى التميمة":lang==="zh"?"护身符等级":lang==="ko"?"부적 레벨":"Charm level")+
        '</label><select id="rCharm">'+Object.keys(charm).map(function(k){ return "<option>"+k+"</option>"; }).join("")+"</select></div>"+
        heroPortrait("rHero")+
        '<div class="field"><label>'+C.hero+'</label><select id="rHero">'+
        hs.map(function(h){ return '<option value="'+h.id+'">'+h.name+"</option>"; }).join("")+"</select></div>"+
        '<div class="row2"><div class="field"><label>'+C.star+'</label><select id="rStar">'+
        [0,1,2,3,4,5].map(function(s){ return "<option>"+s+"</option>"; }).join("")+"</select></div>"+
        '<div class="field"><label>'+C.weaponLvl+'</label><select id="rW">'+
        (function(){ var o=""; for(var i=0;i<=10;i++) o+="<option>"+i+"</option>"; return o; }())+"</select></div></div>";
      Array.prototype.forEach.call($("rTroop").children, function(b){
        b.addEventListener("click", function(){ troop=b.getAttribute("data-v"); build(); });
      });
      $("rHero").addEventListener("change", function(){ setPortrait("rHero"); compute(); });
      setPortrait("rHero");
      ["rAtk","rDef","rLet","rHp","rGear","rCharm","rStar","rW"].forEach(function(x){
        $(x).addEventListener("input",compute); $(x).addEventListener("change",compute);
      });
      $("rGear").value=gear.length-1;
      compute();
    }
    function compute(){
      var gIdx=parseInt($("rGear").value,10), cLvl=$("rCharm").value;
      var gearPct=gear[gIdx]?gear[gIdx].percentage:0;
      var charmPct=charm[cLvl]?charm[cLvl].percentage:0;
      var id=$("rHero").value, star=parseInt($("rStar").value,10);
      var tbl=K2.heroStarTable[id]; var step=star>=5?30:star*6;
      var starStat=tbl?((tbl[Math.min(step,tbl.length-1)]||{}).stat||0):0;
      var w=heroWeaponStat(id,parseInt($("rW").value,10));
      var cur={atk:parseFloat($("rAtk").value)||0,def:parseFloat($("rDef").value)||0,let:parseFloat($("rLet").value)||0,hp:parseFloat($("rHp").value)||0};
      var bonus={atk:gearPct+starStat,def:gearPct+starStat,let:charmPct+w,hp:charmPct+w};
      function r(x){ return Math.round(x*100)/100; }
      function row(icon,label,c,b){
        return '<div class="stat"><div class="si">'+icon+'</div><div class="sl">'+label+
          ' <small style="color:var(--green)">+'+r(b)+'</small></div><div class="sv big">'+r(c+b)+"%</div></div>";
      }
      $("calcResults").innerHTML="<h4>"+(lang==="ar"?"إحصائياتك بعد الترقية":lang==="zh"?"升级后的属性":lang==="ko"?"업그레이드 후 능력치":"Your stats after upgrade")+"</h4>"+
        row("🗡️",C.attack,cur.atk,bonus.atk)+row("🛡️",C.defense,cur.def,bonus.def)+
        row("💥",C.lethality,cur.let,bonus.let)+row("❤️",C.health,cur.hp,bonus.hp)+
        '<p class="hint">'+(lang==="ar"?"البونص = معدّات الحاكم + نجوم البطل (هجوم/دفاع) + التميمة + سلاح البطل (فتك/صحة).":"Bonus = gear + hero star (atk/def) + charm + weapon (let/hp).")+"</p>";
    }
    build();
  }

  /* === الحيوانات الأليفة === */
  function calcPets() {
    var isAr = lang === "ar";
    var inp = $("calcInputs");
    var selectedPet = 0;
    var genFilter = 0;

    var PETS = [
      {ar:"الذئب الرمادي",      en:"Gray Wolf",          gen:1, maxLv:50,  day:55,  stat:"⚡", statAr:"سرعة البناء",          statEn:"Build Speed"},
      {ar:"الوشق",              en:"Lynx",               gen:2, maxLv:60,  day:55,  stat:"💪", statAr:"استعادة الطاقة",       statEn:"Stamina Regen"},
      {ar:"البيسون",            en:"Bison",              gen:2, maxLv:60,  day:55,  stat:"⏱️", statAr:"تقليل الكولداون",      statEn:"Cooldown Reduction"},
      {ar:"الفهد",              en:"Leopard",            gen:2, maxLv:70,  day:80,  stat:"🍖", statAr:"مكافأة الطعام",        statEn:"Food Bonus"},
      {ar:"موس",                en:"Moose",              gen:2, maxLv:70,  day:80,  stat:"💔", statAr:"تقليل صحة العدو",      statEn:"Enemy HP Reduce"},
      {ar:"الأسد",              en:"Lion",               gen:3, maxLv:80,  day:110, stat:"⏱️", statAr:"تقليل الكولداون",      statEn:"Cooldown Reduction"},
      {ar:"الدب الرمادي",       en:"Gray Bear",          gen:3, maxLv:80,  day:110, stat:"🏃", statAr:"سرعة المسيرة + فتك",  statEn:"March + Lethality"},
      {ar:"البيسون الجبار",     en:"Giant Bison",        gen:4, maxLv:100, day:190, stat:"⚔️", statAr:"سعة الفوج",            statEn:"Troop Capacity"},
      {ar:"وحيد القرن العملاق", en:"Giant Rhino",        gen:4, maxLv:100, day:190, stat:"💥", statAr:"زيادة الهجوم",         statEn:"Attack Boost"},
      {ar:"ألفا النمر الأسود",  en:"Alpha Black Tiger",  gen:5, maxLv:100, day:270, stat:"🗡️", statAr:"فتك القوات",           statEn:"Troop Lethality"},
      {ar:"موس العظيم",         en:"Great Moose",        gen:5, maxLv:100, day:270, stat:"🏰", statAr:"سعة الحشد",            statEn:"Rally Capacity"}
    ];

    function genLabel(g) {
      if (g === 0) return isAr ? "الكل" : "All";
      return isAr ? "الجيل " + g : "Gen " + g;
    }

    function petCards() {
      var html = "";
      PETS.forEach(function(p, i) {
        if (genFilter !== 0 && p.gen !== genFilter) return;
        var sel = (i === selectedPet)
          ? "border:2px solid var(--gold);background:var(--surface2);"
          : "border:1px solid var(--line2);background:var(--surface);";
        html += '<div onclick="window._petSel(' + i + ')" style="cursor:pointer;border-radius:16px;padding:12px 14px;' + sel +
          'margin-bottom:8px;display:flex;align-items:center;gap:12px">' +
          '<div style="width:40px;height:40px;border-radius:12px;background:var(--surface3);display:grid;place-items:center;font-size:20px;flex-shrink:0;border:1px solid var(--line2)">' + p.stat + '</div>' +
          '<div style="flex:1;min-width:0">' +
          '<div style="font-weight:800;font-size:14px">' + (isAr ? p.ar : p.en) + '</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:2px">Gen ' + p.gen + (p.gen === 5 ? " ★" : "") + " · Max Lv " + p.maxLv + " · " + (isAr ? "يوم " : "Day ") + p.day + "</div>" +
          '</div>' +
          '<div style="font-size:11px;color:var(--gold2);text-align:end;flex-shrink:0">' + (isAr ? p.statAr : p.statEn) + '</div>' +
          '</div>';
      });
      return html || '<p class="empty">' + (isAr ? "لا توجد حيوانات لهذا الجيل" : "No pets for this gen") + '</p>';
    }

    function genBtns() {
      return '<div class="seg" style="flex-wrap:wrap;gap:6px">' +
        [0,1,2,3,4,5].map(function(g) {
          return '<button onclick="window._petGen(' + g + ')"' + (genFilter === g ? ' class="on"' : '') + ' style="min-width:44px">' + genLabel(g) + '</button>';
        }).join("") + '</div>';
    }

    function quickBtns(maxLv) {
      return '<div class="seg">' +
        [10,20,30,50,60,80,100].filter(function(l){ return l <= maxLv; }).map(function(l) {
          return '<button onclick="window._petQT(' + l + ')">' + l + '</button>';
        }).join("") + '</div>';
    }

    function build() {
      var p = PETS[selectedPet];
      inp.innerHTML =
        '<div class="panel">' +
        '<div class="panel-title">' + (isAr ? "اختر الحيوان الأليف" : "Select Pet") + '</div>' +
        '<div class="field" id="ptGenWrap">' + genBtns() + '</div>' +
        '<div id="petGrid">' + petCards() + '</div>' +
        '</div>' +
        '<div class="panel">' +
        '<div class="panel-title" style="display:flex;align-items:center;gap:8px">' +
          '<span style="font-size:20px">' + p.stat + '</span>' +
          '<span>' + (isAr ? p.ar : p.en) + '</span>' +
          '<span style="margin-inline-start:auto;font-size:11px;color:var(--muted)">Max Lv ' + p.maxLv + '</span>' +
        '</div>' +
        '<div class="row2">' +
          '<div class="field"><label>' + (isAr ? "المستوى الحالي" : "Current Level") + '</label>' +
            '<input type="number" id="ptF" min="1" max="' + (p.maxLv - 1) + '" value="1"></div>' +
          '<div class="field"><label>' + (isAr ? "المستوى المستهدف" : "Target Level") + '</label>' +
            '<input type="number" id="ptT" min="2" max="' + p.maxLv + '" value="' + p.maxLv + '"></div>' +
        '</div>' +
        '<div class="field"><label>' + (isAr ? "الدخل اليومي من الطعام (اختياري)" : "Daily food income (optional)") + '</label>' +
          '<input type="number" id="ptD" min="0" placeholder="0"></div>' +
        '<div class="field"><label>' + (isAr ? "أهداف سريعة:" : "Quick targets:") + '</label>' + quickBtns(p.maxLv) + '</div>' +
        '</div>';

      $("ptF").addEventListener("input", compute);
      $("ptT").addEventListener("input", compute);
      $("ptD").addEventListener("input", compute);
      compute();
    }

    function compute() {
      var p = PETS[selectedPet];
      var from  = Math.max(1, parseInt(($("ptF")||{}).value, 10) || 1);
      var to    = Math.min(p.maxLv, parseInt(($("ptT")||{}).value, 10) || p.maxLv);
      var daily = Math.max(0, parseInt(($("ptD")||{}).value, 10) || 0);

      if (from >= to) {
        $("calcResults").innerHTML = '<p class="empty">' + (isAr ? "اختر مستوى هدف أعلى من الحالي." : "Target must be higher than current.") + '</p>';
        return;
      }

      var food = 0, manuals = 0, potions = 0;
      for (var lv = from; lv < to; lv++) {
        food += Math.floor(lv * 150 * 1.05);
        if (lv > 0 && lv % 10 === 0) {
          manuals += (lv / 10) * 5;
          potions  += (lv / 10) * 2;
        }
      }

      function row(ic, label, val, big) {
        return '<div class="stat' + (big ? " total" : "") + '">' +
          '<div class="si">' + ic + '</div>' +
          '<div class="sl">' + label + '</div>' +
          '<div class="sv' + (big ? " big" : "") + '">' + fmtFull(val) + '</div></div>';
      }

      var daysHtml = "";
      if (daily > 0) {
        daysHtml = row("📅", isAr ? "الأيام المطلوبة" : "Days Needed", Math.ceil(food / daily));
      }

      $("calcResults").innerHTML =
        "<h4>" + (isAr ? "تكلفة الترقية" : "Upgrade Cost") + " · " + (isAr ? p.ar : p.en) +
        " Lv " + from + " → " + to + "</h4>" +
        row("🍖", isAr ? "طعام الحيوانات الأليفة" : "Pet Food", food, true) +
        row("📘", isAr ? "كتيبات النمو" : "Growth Manuals", manuals) +
        row("🧪", isAr ? "جرعات التغذية" : "Feeding Potions", potions) +
        daysHtml +
        '<p class="hint">' + (isAr ? "التكاليف تقريبية. الكتيبات والجرعات عند كسر الحد كل 10 مستويات." : "Costs are approximate. Manuals & potions apply at every 10-level breakthrough.") + '</p>';
    }

    window._petSel = function(i) { selectedPet = i; build(); };
    window._petGen = function(g) { genFilter = g; build(); };
    window._petQT  = function(l) { var el = $("ptT"); if (el) { el.value = l; compute(); } };

    build();
  }

  /* === حاسبة القتال — توصية التشكيل === */
  function calcBattle() {
    var L = t(), C = cl(), inp = $("calcInputs");
    var isAr = lang === "ar";
    var F = KS5.formations, FH = KS5.formationHeroes;
    var modes = [
      { id:"bear_hunt",  ar:"صيد الدب (Bear Hunt)", en:"Bear Hunt",  zh:"猎熊",   ko:"곰 사냥",   es:"Caza del Oso" },
      { id:"pvp_rally",  ar:"رالي PvP",            en:"PvP Rally",  zh:"PvP 集结", ko:"PvP 집결", es:"Rally PvP" },
      { id:"garrison",   ar:"حامية (دفاع)",        en:"Garrison",   zh:"驻防",    ko:"수비대",   es:"Guarnición" },
      { id:"open_field", ar:"ميدان مفتوح",         en:"Open Field", zh:"野战",    ko:"야전",     es:"Campo Abierto" }
    ];
    function pick(o){ return isAr?o.ar:lang==="zh"?o.zh:lang==="ko"?o.ko:lang==="es"?o.es:o.en; }
    var mode = "bear_hunt";
    inp.innerHTML =
      '<div class="field"><label>'+(isAr?"إجمالي عدد القوات":lang==="zh"?"部队总数":lang==="ko"?"총 병력 수":lang==="es"?"Total de tropas":"Total troops")+
      '</label><input type="number" id="bTotal" min="0" step="1000" value="100000" inputmode="numeric"></div>'+
      '<div class="field"><label>'+(isAr?"نمط القتال":lang==="zh"?"战斗模式":lang==="ko"?"전투 모드":lang==="es"?"Modo de combate":"Combat mode")+
      '</label><select id="bMode">'+modes.map(function(m){ return '<option value="'+m.id+'">'+pick(m)+"</option>"; }).join("")+"</select></div>";
    function pct(x){ return (Math.round(x*1000)/10)+"%"; }
    function compute(){
      var total = parseFloat($("bTotal").value)||0;
      mode = $("bMode").value;
      var r = F[mode];
      var inf = Math.floor(total*r.infantry);
      var arch = Math.floor(total*r.archer);
      var cav = total - inf - arch; if (cav<0) cav = 0;
      var smP = function(p){ return ' <small style="color:var(--muted2)">'+pct(p)+'</small>'; };
      var rows =
        statRow("🛡️", C.infantry+smP(r.infantry), fmtFull(inf), true) +
        statRow("🏹", C.archers+smP(r.archer), fmtFull(arch), true) +
        statRow("🐎", C.cavalry+smP(r.cavalry), fmtFull(cav), true);
      var heroHtml = "";
      if (mode==="bear_hunt") {
        heroHtml = '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line2)">'+
          '<div style="font-size:12px;font-weight:800;color:var(--gold);margin-bottom:8px">'+
          (isAr?"الأبطال المقترحون":lang==="zh"?"推荐英雄":lang==="ko"?"추천 영웅":lang==="es"?"Héroes sugeridos":"Suggested heroes")+'</div>'+
          statRow("👑", isAr?"القادة":lang==="zh"?"队长":lang==="ko"?"리더":lang==="es"?"Líderes":"Leaders", FH.bear_hunt_leaders.join(" · "))+
          statRow("🤝", isAr?"المنضمّون":lang==="zh"?"加入者":lang==="ko"?"참가자":lang==="es"?"Unidos":"Joiners", FH.bear_hunt_joiners.join(" · "))+
          '<p class="hint" style="text-align:start">'+(isAr?FH.bear_hunt_joiner_noteAr:FH.bear_hunt_joiner_noteEn)+'</p></div>';
      }
      $("calcResults").innerHTML = "<h4>"+L.results+" — "+pick(modes.find(function(m){ return m.id===mode; }))+"</h4>"+
        rows + '<p class="hint" style="text-align:start">💡 '+(isAr?r.noteAr:r.noteEn)+'</p>' + heroHtml;
    }
    $("bTotal").addEventListener("input", compute);
    $("bMode").addEventListener("change", compute);
    compute();
  }

  /* === حاسبة المعدات — مثريل / تطوير / إتقان === */
  function calcEquip() {
    var L = t(), inp = $("calcInputs");
    var isAr = lang === "ar";
    var G = KS5;
    var mode = "enhancement";
    function ml(){
      return {
        enhancement: isAr?"تطوير":lang==="zh"?"强化":lang==="ko"?"강화":lang==="es"?"Mejora":"Enhancement",
        mastery:     isAr?"إتقان":lang==="zh"?"精通":lang==="ko"?"숙련":lang==="es"?"Maestría":"Mastery",
        mithril:     isAr?"مثريل":lang==="zh"?"秘银":lang==="ko"?"미스릴":lang==="es"?"Mithril":"Mithril"
      };
    }
    function tr(o){ return isAr?o.ar:lang==="zh"?o.zh:lang==="ko"?o.ko:lang==="es"?o.es:o.en; }
    function build(){
      var lab = ml();
      var seg = '<div class="field"><div class="seg" id="eqMode">'+
        ["enhancement","mastery","mithril"].map(function(m){ return '<button data-v="'+m+'"'+(m===mode?' class="on"':"")+">"+lab[m]+"</button>"; }).join("")+"</div></div>";
      var body = "";
      if (mode==="enhancement") {
        var rar = [
          {id:"grey",ar:"رمادي",en:"Grey",zh:"灰",ko:"회색",es:"Gris"},{id:"green",ar:"أخضر",en:"Green",zh:"绿",ko:"초록",es:"Verde"},
          {id:"blue",ar:"أزرق",en:"Blue",zh:"蓝",ko:"파랑",es:"Azul"},{id:"purple",ar:"بنفسجي",en:"Purple",zh:"紫",ko:"보라",es:"Púrpura"},
          {id:"mythic",ar:"أسطوري",en:"Mythic",zh:"神话",ko:"신화",es:"Mítico"},{id:"red",ar:"أحمر",en:"Red",zh:"红",ko:"빨강",es:"Rojo"}
        ];
        body = '<div class="field"><label>'+(isAr?"ندرة القطعة":lang==="zh"?"装备稀有度":lang==="ko"?"장비 등급":lang==="es"?"Rareza":"Rarity")+
          '</label><select id="eqRar">'+rar.map(function(r){ return '<option value="'+r.id+'"'+(r.id==="mythic"?" selected":"")+">"+tr(r)+"</option>"; }).join("")+"</select></div>"+
          '<div class="row2"><div class="field"><label>'+L.from+'</label><input type="number" id="eqF" min="0" value="0"></div>'+
          '<div class="field"><label>'+L.to+'</label><input type="number" id="eqT" min="0" value="100"></div></div>';
      } else if (mode==="mastery") {
        body = '<div class="row2"><div class="field"><label>'+L.from+'</label><input type="number" id="eqF" min="0" max="20" value="0"></div>'+
          '<div class="field"><label>'+L.to+'</label><input type="number" id="eqT" min="0" max="20" value="20"></div></div>';
      } else {
        var lv = [100,120,140,160,180,200];
        body = '<div class="row2"><div class="field"><label>'+L.from+'</label><select id="eqF">'+lv.map(function(n){ return "<option>"+n+"</option>"; }).join("")+"</select></div>"+
          '<div class="field"><label>'+L.to+'</label><select id="eqT">'+lv.map(function(n){ return "<option>"+n+"</option>"; }).join("")+"</select></div></div>";
      }
      inp.innerHTML = seg + body;
      Array.prototype.forEach.call($("eqMode").children, function(b){
        b.addEventListener("click", function(){ mode=b.getAttribute("data-v"); build(); });
      });
      if (mode==="mithril") { $("eqF").value=100; $("eqT").value=200; }
      ["eqF","eqT","eqRar"].forEach(function(id){ var el=$(id); if(el){ el.addEventListener("input",compute); el.addEventListener("change",compute); } });
      compute();
    }
    function compute(){
      var from = parseInt($("eqF").value,10)||0, to = parseInt($("eqT").value,10)||0;
      var gearN = isAr?"تروس أسطورية":lang==="zh"?"神话齿轮":lang==="ko"?"신화 기어":lang==="es"?"Engranajes míticos":"Mythic Gears";
      if (mode==="enhancement") {
        var cap = G.gearEnhancement.rarityCaps[$("eqRar").value];
        var eff = Math.min(to, cap), capped = to>cap, xp = G.gearEnhancement.xpPerLevel;
        if (eff<=from) { $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
        var total=0; for (var i=from+1; i<=eff; i++) { if (i<xp.length) total+=xp[i]; }
        $("calcResults").innerHTML="<h4>"+L.results+"</h4>"+
          statRow("✨", isAr?"إجمالي خبرة التطوير":lang==="zh"?"总强化经验":lang==="ko"?"총 강화 경험치":lang==="es"?"XP total":"Total Enhancement XP", fmtFull(total), true)+
          statRow("🎯", isAr?"المستوى الفعلي":lang==="zh"?"实际等级":lang==="ko"?"실제 레벨":lang==="es"?"Nivel efectivo":"Effective level", '<span dir="ltr">'+from+" → "+eff+'</span>')+
          (capped?'<p class="hint" style="text-align:start">⚠️ '+(isAr?("سقف هذه الندرة هو "+cap):("Cap for this rarity is "+cap))+'</p>':"");
      } else if (mode==="mastery") {
        if (to<=from) { $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
        var ham=0, myth=0;
        G.gearForge.levels.forEach(function(e){ if (e.level>from && e.level<=to) { ham+=e.hammers; myth+=e.mythic; } });
        var bonus = Math.round(to*G.gearForge.statBonusPerLevel*100*100)/100;
        $("calcResults").innerHTML="<h4>"+L.results+"</h4>"+
          statRow("🔨", isAr?"المطارق المطلوبة":lang==="zh"?"所需强化锤":lang==="ko"?"필요한 강화 망치":lang==="es"?"Martillos":"Forgehammers", fmtFull(ham), true)+
          (myth>0?statRow("⚙️", gearN, fmtFull(myth)):"")+
          statRow("📈", isAr?"زيادة الإحصائية":lang==="zh"?"属性增加":lang==="ko"?"능력치 증가":lang==="es"?"Aumento":"Stat bonus", "+"+bonus+"%", true);
      } else {
        if (to<=from) { $("calcResults").innerHTML="<h4>"+L.results+"</h4><p class='empty'>"+L.noChange+"</p>"; return; }
        var mith=0, myth2=0;
        G.gearMithril.blocks.forEach(function(b){ if (b.from>=from && b.to<=to) { mith+=b.mithril; myth2+=b.mythic; } });
        var reqs = isAr?G.gearMithril.reqAr:G.gearMithril.reqEn;
        $("calcResults").innerHTML="<h4>"+L.results+"</h4>"+
          statRow("🔺", "Mithril", fmtFull(mith), true)+
          statRow("⚙️", gearN, fmtFull(myth2))+
          '<p class="hint" style="text-align:start">📋 '+(isAr?"المتطلبات: ":lang==="es"?"Requisitos: ":"Requirements: ")+reqs.join(" • ")+'</p>';
      }
    }
    build();
  }

  /* === أفضل التشكيلات (Gen1) === */
  function calcLineups() {
    var isAr = lang === "ar";
    var inp = $("calcInputs");
    var ups = KS5.lineups;
    var html = '<div class="panel-title">'+(isAr?"أفضل تشكيلات الجيل الأول (Gen1)":lang==="zh"?"最佳第一代阵容":lang==="ko"?"최고의 1세대 조합":lang==="es"?"Mejores alineaciones Gen1":"Best Gen1 Lineups")+'</div>';
    ups.forEach(function(u, i){
      html += '<div class="panel" style="margin-bottom:12px">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
        '<span style="font-size:12px;font-weight:800;color:var(--muted)">#'+(i+1)+'</span>'+
        '<span style="font-size:11px;font-weight:900;letter-spacing:.5px;padding:3px 9px;border-radius:999px;background:linear-gradient(135deg,var(--gold2),var(--gold-deep));color:#241402">'+(isAr?u.tagAr:u.tagEn)+'</span></div>'+
        '<div style="font-weight:800;font-size:15px;margin-bottom:7px;line-height:1.5">'+u.heroes.join("  ·  ")+'</div>'+
        '<p style="margin:0;font-size:12.5px;color:var(--muted);line-height:1.6">'+(isAr?u.descAr:u.descEn)+'</p></div>';
    });
    inp.innerHTML = html;
    $("calcResults").style.display = "none";
  }

  /* ---- PWA تثبيت ---- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function(e){
    e.preventDefault(); deferredPrompt=e; $("installBar").style.display="flex";
  });
  $("installBtn").addEventListener("click", function(){
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(){ deferredPrompt=null; $("installBar").style.display="none"; });
  });
  window.addEventListener("appinstalled", function(){ $("installBar").style.display="none"; });

  /* ---- تشغيل ---- */
  $("backBtn").addEventListener("click", showHome);
  applyChrome();
  renderHome();
  if("serviceWorker" in navigator && location.protocol.indexOf("http")===0){
    navigator.serviceWorker.register("sw.js").catch(function(){});
  }
})();
