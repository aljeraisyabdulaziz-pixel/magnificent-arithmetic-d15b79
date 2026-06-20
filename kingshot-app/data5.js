/* بيانات الحاسبات الجديدة (مطابقة لمرجع temtekplay.com):
   - formations: حاسبة القتال (توصية التشكيل)
   - gear: حاسبة المعدات (مثريل / تطوير / إتقان)
   - lineups: أفضل التشكيلات (Gen1)
   تعرّف window.KS5. */
window.KS5 = {
  /* === حاسبة القتال — نسب التشكيل حسب نمط القتال === */
  formations: {
    bear_hunt: { infantry: 0.10, archer: 0.80, cavalry: 0.10,
      noteAr: "أقصى عدد رماة لأعلى فتك. المشاة/الفرسان مجرد حشو للتشكيل.",
      noteEn: "Max archers for highest Lethality. Infantry/Cavalry are formation filler only." },
    pvp_rally: { infantry: 0.50, archer: 0.30, cavalry: 0.20,
      noteAr: "متوازن. المشاة درع يمتص الضرر، الرماة يسببون الضرر، الفرسان يلتفّون.",
      noteEn: "Balanced. Infantry meat shield absorbs damage, archers deal damage, cavalry flanks." },
    garrison: { infantry: 0.70, archer: 0.00, cavalry: 0.30,
      noteAr: "لا رماة على الأسوار (إحصائيات دفاعية ضعيفة). مشاة ثقيلة مع دعم فرسان.",
      noteEn: "No archers on walls (poor defensive stats). Heavy infantry with cavalry support." },
    open_field: { infantry: 0.50, archer: 0.30, cavalry: 0.20,
      noteAr: "مثل الرالي. الفرسان يتجاوزون المشاة لضرب الرماة مباشرة.",
      noteEn: "Same as rally. Cavalry can bypass infantry to hit archers directly." }
  },
  formationHeroes: {
    bear_hunt_leaders: ["Helga", "Jabel"],
    bear_hunt_joiners: ["Chenko", "Amadeus", "Yeonwoo", "Amane"],
    bear_hunt_joiner_noteAr: "تُحتسب مهارات 4 منضمّين فقط. أرسل Chenko أولاً إذا كان عدد Chenko أقل من 4 في الرالي.",
    bear_hunt_joiner_noteEn: "Only 4 joiner hero skills count. Send Chenko first if < 4 Chenkos in rally."
  },

  /* === حاسبة المعدات === */
  /* تطوير المعدات (Enhancement) — XP لكل مستوى + سقف حسب الندرة */
  gearEnhancement: {
    rarityCaps: { grey: 20, green: 40, blue: 60, purple: 80, mythic: 100, red: 200 },
    xpPerLevel: [0,
      10,12,15,18,20,23,26,30,34,38,
      42,47,52,57,63,69,75,82,90,105,
      110,115,120,125,130,140,150,155,160,170,
      180,190,200,215,230,245,260,275,290,310,
      330,350,370,390,410,430,450,470,490,520,
      550,580,610,640,670,700,740,780,820,860,
      900,940,980,1030,1080,1130,1180,1230,1280,1400,
      1450,1500,1550,1600,1650,1700,1760,1820,1880,1950,
      2020,2090,2100,2110,2120,2130,2150,2170,2200,2230,
      2250,2270,2290,2310,2330,2340,2350,2370,2390,2400]
  },
  /* إتقان المعدات (Mastery / Forge) — مطارق + تروس أسطورية لكل مستوى (1..20) */
  gearForge: {
    levels: [
      {level:1,hammers:10,mythic:0},{level:2,hammers:20,mythic:0},{level:3,hammers:30,mythic:0},
      {level:4,hammers:40,mythic:0},{level:5,hammers:50,mythic:0},{level:6,hammers:60,mythic:0},
      {level:7,hammers:70,mythic:0},{level:8,hammers:80,mythic:0},{level:9,hammers:90,mythic:0},
      {level:10,hammers:100,mythic:0},{level:11,hammers:110,mythic:1},{level:12,hammers:120,mythic:2},
      {level:13,hammers:130,mythic:3},{level:14,hammers:140,mythic:4},{level:15,hammers:150,mythic:5},
      {level:16,hammers:160,mythic:6},{level:17,hammers:170,mythic:7},{level:18,hammers:180,mythic:8},
      {level:19,hammers:190,mythic:9},{level:20,hammers:200,mythic:10}
    ],
    statBonusPerLevel: 0.10
  },
  /* ترقية المعدات الحمراء (Mithril) — كتل من 100 إلى 200 */
  gearMithril: {
    reqAr: ["مستوى مركز المدينة: 30", "مستوى الإتقان (Mastery): 10", "قطعتان أسطوريتان (Mythic Gears)"],
    reqEn: ["Town Center Lv: 30", "Mastery Lv: 10", "2 Mythic Gears"],
    blocks: [
      {from:100,to:120,mithril:10,mythic:3},
      {from:120,to:140,mithril:20,mythic:5},
      {from:140,to:160,mithril:30,mythic:5},
      {from:160,to:180,mithril:40,mythic:10},
      {from:180,to:200,mithril:50,mythic:10}
    ]
  },

  /* === أفضل التشكيلات (Gen1) — مطابقة لـ lineups.json + عناوين الموقع === */
  lineups: [
    { tagAr:"الأمثل", tagEn:"Optimal", heroes:["Jabel","Saul","Quinn","Helga","Amadeus"],
      descAr:"التشكيلة المثلى عند توفر Helga و Amadeus — قوة هجومية وتحكّم متوازنان.",
      descEn:"Best lineup when Helga & Amadeus are available — balanced offense and control." },
    { tagAr:"دفاعية", tagEn:"Defensive", heroes:["Jabel","Saul","Diana","Howard","Helga"],
      descAr:"تشكيلة دفاعية مع تقليل الضرر وسرعة مسيرة — مناسبة للحملات الطويلة.",
      descEn:"Defensive lineup with damage reduction and march speed — good for long campaigns." },
    { tagAr:"متوازنة", tagEn:"Balanced", heroes:["Jabel","Saul","Quinn","Howard","Helga"],
      descAr:"متوازنة بين الهجوم والدفاع — مناسبة للاستخدام العام.",
      descEn:"Balanced between offense and defense — good for general use." },
    { tagAr:"سريعة", tagEn:"Fast", heroes:["Chenko","Saul","Diana","Jabel","Helga"],
      descAr:"مناسبة للصيد والتنقل السريع بفضل سرعة المسيرة.",
      descEn:"Good for hunting and fast movement thanks to march speed." },
    { tagAr:"مجاني (F2P)", tagEn:"F2P", heroes:["Jabel","Saul","Quinn","Helga","Amadeus"],
      descAr:"تثبت أن اللاعبين المجانيين قادرون على استخدام أقوى تشكيلات Gen1.",
      descEn:"Proves F2P players can run the strongest Gen1 lineups." },
    { tagAr:"هجومية", tagEn:"Offensive", heroes:["Jabel","Quinn","Diana","Helga","Howard"],
      descAr:"مفيدة عندما تحتاج Diana و Howard في نفس الوقت.",
      descEn:"Useful when you need Diana & Howard at the same time." }
  ]
};
