// Highlight title by view count. Tune thresholds here.
const TIERS = [
  { min: 1000000, bg: "#2ecc71", fg: "#000" }, // hot
  { min: 100000, bg: "#f1c40f", fg: "#000" },  // warm
  { min: 10000, bg: "#85c1e9", fg: "#000" },   // ok
];
const CARD = "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model";
const META = "#metadata-line span, .ytContentMetadataViewModelMetadataText";
const TITLE = "#video-title, .ytLockupMetadataViewModelTitle";

// Text is "380K"; the aria-label has the full "380 thousand views".
function parseViews(t) {
  const m = t.match(/([\d.,]+)\s*(thousand|million|billion|[KMB])?\s+views?/i);
  if (!m) return null;
  const mult = { K: 1e3, THOUSAND: 1e3, M: 1e6, MILLION: 1e6, B: 1e9, BILLION: 1e9 };
  return parseFloat(m[1].replace(/,/g, "")) * (mult[(m[2] || "").toUpperCase()] || 1);
}

function paint(card) {
  const meta = [...card.querySelectorAll(META)].map((e) => e.getAttribute("aria-label") || e.textContent).join(" | ");
  const views = parseViews(meta);
  const title = card.querySelector(TITLE);
  if (!title || views == null) return;
  const i = TIERS.findIndex((t) => views >= t.min);
  if (i < 0) delete title.dataset.hl;
  else title.dataset.hl = i;
}

// !important + descendant color: YouTube's inner spans set their own color.
const style = document.createElement("style");
style.textContent = TIERS.map((t, i) =>
  `[data-hl="${i}"]{background:${t.bg}!important;border-radius:4px;padding:0 4px}` +
  `[data-hl="${i}"],[data-hl="${i}"] *{color:${t.fg}!important}`).join("");
document.head.append(style);

let timer;
new MutationObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(() => document.querySelectorAll(CARD).forEach(paint), 300);
}).observe(document.body, { childList: true, subtree: true });
