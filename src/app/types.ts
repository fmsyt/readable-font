/** 母音 */
export const Vowel = ["あ", "い", "う", "え", "お"];
export type 母音 = typeof Vowel[number];
export type Vowel = 母音;

/** 拗音 */
export const ContractedSound = [
  "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
  "ゃ", "ゅ", "ょ",
  "ゎ",
  "っ"
];
export type 拗音 = typeof ContractedSound[number];
export type ContractedSound = 拗音;

/** 撥音 */
export const SyllabicNasal = ["ん"];
export type 撥音 = typeof SyllabicNasal[number];
export type SyllabicNasal = 撥音;

export const SyllabicNasalIgnores = ["n"] as const;

export const KeyMap: { [key in string]?: string | null } = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",

  la: "ぁ", li: "ぃ", lu: "ぅ", le: "ぇ", lo: "ぉ",
  lya: "ゃ", lyi: "ぃ", lyu: "ゅ", lye: "ぇ", lyo: "ょ",
  lsa: null, lsi: null, lsu: null, lse: null, lso: null,
  lwa: "ゎ", lwi: null, lwu: null, lwe: null, lwo: null,
  lha: null, lhi: null, lhu: null, lhe: null, lho: null,

  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
  xya: "ゃ", xyi: "ぃ", xyu: "ゅ", xye: "ぇ", xyo: "ょ",
  xsa: null, xsi: null, xsu: null, xse: null, xso: null,
  xwa: "ゎ", xwi: null, xwu: null, xwe: null, xwo: null,
  xha: null, xhi: null, xhu: null, xhe: null, xho: null,

  ca: "か", ci: "し", cu: "く", ce: "せ", co: "こ",
  cya: "ちゃ", cyi: "ちぃ", cyu: "ちゅ", cye: "ちぇ", cyo: "ちょ",
  csa: null, csi: null, csu: null, cse: null, cso: null,
  cwa: null, cwi: null, cwu: null, cwe: null, cwo: null,
  cha: "ちゃ", chi: "ち", chu: "ちゅ", che: "ちぇ", cho: "ちょ",

  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  kya: "きゃ", kyi: "きぃ", kyu: "きゅ", kye: "きぇ", kyo: "きょ",
  ksa: null, ksi: null, ksu: null, kse: null, kso: null,
  kwa: "くぁ", kwi: null, kwu: null, kwe: null, kwo: null,
  kha: null, khi: null, khu: null, khe: null, kho: null,

  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  gya: "ぎゃ", gyi: "ぎぃ", gyu: "ぎゅ", gye: "ぎぇ", gyo: "ぎょ",
  gsa: null, gsi: null, gsu: null, gse: null, gso: null,
  gwa: "ぐぁ", gwi: "ぐぃ", gwu: "ぐぅ", gwe: "ぐぇ", gwo: "ぐぉ",
  gha: null, ghi: null, ghu: null, ghe: null, gho: null,

  qa: "くぁ", qi: "くぃ", qu: "く", qe: "くぇ", qo: "くぉ",
  qya: "くゃ", qyi: "くぃ", qyu: "くゅ", qye: "くぇ", qyo: "くょ",
  qsa: null, qsi: null, qsu: null, qse: null, qso: null,
  qwa: "くぁ", qwi: "くぃ", qwu: "くぅ", qwe: "くぇ", qwo: "くぉ",
  qha: null, qhi: null, qhu: null, qhe: null, qho: null,

  sa: "さ", si: "し", su: "す", se: "せ", so: "そ",
  sya: "しゃ", syi: "しぃ", syu: "しゅ", sye: "しぇ", syo: "しょ",
  swa: "すぁ", swi: "すぃ", swu: "すぅ", swe: "すぇ", swo: "すぉ",
  sha: "しゃ", shi: "し", shu: "しゅ", she: "しぇ", sho: "しょ",

  za: "ざ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  zya: "じゃ", zyi: "じぃ", zyu: "じゅ", zye: "じぇ", zyo: "じょ",
  zsa: null, zsi: null, zsu: null, zse: null, zso: null,
  zwa: null, zwi: null, zwu: null, zwe: null, zwo: null,
  zha: null, zhi: null, zhu: null, zhe: null, zho: null,

  ja: "じゃ", ji: "じ", ju: "じゅ", je: "じぇ", jo: "じょ",
  jya: "じゃ", jyi: "じぃ", jyu: "じゅ", jye: "じぇ", jyo: "じょ",
  jsa: null, jsi: null, jsu: null, jse: null, jso: null,
  jwa: null, jwi: null, jwu: null, jwe: null, jwo: null,
  jha: null, jhi: null, jhu: null, jhe: null, jho: null,

  ta: "た", ti: "ち", tu: "つ", te: "て", to: "と",
  tya: "ちゃ", tyi: "ちぃ", tyu: "ちゅ", tye: "ちぇ", tyo: "ちょ",
  tsa: "つぁ", tsi: "つぃ", tsu: "つ", tse: "つぇ", tso: "つぉ",
  twa: "とぁ", twi: "とぃ", twu: "とぅ", twe: "とぇ", two: "とぉ",
  tha: "てゃ", thi: "てぃ", thu: "てゅ", the: "てぇ", tho: "てょ",

  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  dya: "ぢゃ", dyi: "ぢぃ", dyu: "ぢゅ", dye: "ぢぇ", dyo: "ぢょ",
  dsa: null, dsi: null, dsu: null, dse: null, dso: null,
  dwa: "どぁ", dwi: "どぃ", dwu: "どぅ", dwe: "どぇ", dwo: "どぉ",
  dha: "でゃ", dhi: "でぃ", dhu: "でゅ", dhe: "でぇ", dho: "でょ",

  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  nya: "にゃ", nyi: "にぃ", nyu: "にゅ", nye: "にぇ", nyo: "にょ",
  nsa: null, nsi: null, nsu: null, nse: null, nso: null,
  nwa: null, nwi: null, nwu: null, nwe: null, nwo: null,
  nha: null, nhi: null, nhu: null, nhe: null, nho: null,

  ha: "は", hi: "ひ", hu: "ふ", he: "へ", ho: "ほ",
  hya: "ひゃ", hyi: "ひぃ", hyu: "ひゅ", hye: "ひぇ", hyo: "ひょ",
  hsa: null, hsi: null, hsu: null, hse: null, hso: null,
  hwa: null, hwi: null, hwu: null, hwe: null, hwo: null,

  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  bya: "びゃ", byi: "びぃ", byu: "びゅ", bye: "びぇ", byo: "びょ",
  bsa: null, bsi: null, bsu: null, bse: null, bso: null,
  bwa: null, bwi: null, bwu: null, bwe: null, bwo: null,
  bha: null, bhi: null, bhu: null, bhe: null, bho: null,

  pya: "ぴゃ", pyi: "ぴぃ", pyu: "ぴゅ", pye: "ぴぇ", pyo: "ぴょ",
  psa: null, psi: null, psu: null, pse: null, pso: null,
  pwa: null, pwi: null, pwu: null, pwe: null, pwo: null,
  pha: null, phi: null, phu: null, phe: null, pho: null,

  fa: "ふぁ", fi: "ふぃ", fu: "ふ", fe: "ふぇ", fo: "ふぉ",
  fya: "ふゃ", fyi: "ふぃ", fyu: "ふゅ", fye: "ふぇ", fyo: "ふょ",
  fsa: null, fsi: null, fsu: null, fse: null, fso: null,
  fwa: "ふぁ", fwi: "ふぃ", fwu: "ふぅ", fwe: "ふぇ", fwo: "ふぉ",
  fha: null, fhi: null, fhu: null, fhe: null, fho: null,

  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  mya: "みゃ", myi: "みぃ", myu: "みゅ", mye: "みぇ", myo: "みょ",
  msa: null, msi: null, msu: null, mse: null, mso: null,
  mwa: null, mwi: null, mwu: null, mwe: null, mwo: null,
  mha: null, mhi: null, mhu: null, mhe: null, mho: null,

  ya: "や", yi: "い", yu: "ゆ", ye: "いぇ", yo: "よ",
  ysa: null, ysi: null, ysu: null, yse: null, yso: null,
  ywa: null, ywi: null, ywu: null, ywe: null, ywo: null,
  yha: null, yhi: null, yhu: null, yhe: null, yho: null,

  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  rya: "りゃ", ryi: "りぃ", ryu: "りゅ", rye: "りぇ", ryo: "りょ",
  rsa: null, rsi: null, rsu: null, rse: null, rso: null,
  rwa: null, rwi: null, rwu: null, rwe: null, rwo: null,
  rha: null, rhi: null, rhu: null, rhe: null, rho: null,

  wa: "わ", wi: "うぃ", wu: "う", we: "うぇ", wo: "を",
  wya: null, wyi: "ゐ", wyu: null, wye: "ゑ", wyo: null,
  wsa: null, wsi: null, wsu: null, wse: null, wso: null,
  wha: "うぁ", whi: "うぃ", whu: "う", whe: "うぇ", who: "うぉ",

  nn: "ん",
  xn: "ん",

  va: "ヴぁ", vi: "ヴぃ", vu: "ヴ", ve: "ヴぇ", vo: "ヴぉ",
  vya: "ヴゃ", vyi: "ヴぃ", vyu: "ヴゅ", vye: "ヴぇ", vyo: "ヴょ",
  vsa: null, vsi: null, vsu: null, vse: null, vso: null,
  vwa: null, vwi: null, vwu: null, vwe: null, vwo: null,
  vha: null, vhi: null, vhu: null, vhe: null, vho: null,

} as const;

export const SymbolMap: { [key: string]: string } = {
  "-": "ー",
  ".": "。",
  ",": "、",
  "?": "？",
  "!": "！",
  ":": "：",
  ";": "；",
  "(": "（",
  ")": "）",
  "[": "「",
  "]": "」",
  "@": "＠",
  "#": "＃",
  "$": "＄",
  "%": "％",
  "&": "＆",
  "*": "＊",
  "/": "／",
  "\\": "￥",
  "|": "｜",
  "^": "＾",
  "~": "～",
  "`": "｀",
  "+": "＋",
  "=": "＝",
  "<": "＜",
  ">": "＞",
  "{": "｛",
  "}": "｝",
  '"': "”",
  "'": "’",
  " ": "　",
  "0": "０",
  "1": "１",
  "2": "２",
  "3": "３",
  "4": "４",
  "5": "５",
  "6": "６",
  "7": "７",
  "8": "８",
  "9": "９",
} as const;
