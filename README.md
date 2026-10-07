# YouTube Title Highlighter

Chrome extension (Manifest V3) that highlights video card titles on YouTube by view count, so popular videos stand out while scrolling.

## Install

1. Open `chrome://extensions` and enable **Developer mode**.
2. **Load unpacked** and select this folder.
3. Refresh YouTube.

No build step, no dependencies.

## Highlight logic

For each video card, the content script ([content.js](content.js)):

1. Reads the view count from the card's metadata spans. It uses the `aria-label` (e.g. `380 thousand views`) because the visible text is abbreviated (`380K`).
2. Parses it to a number (`thousand`/`K`, `million`/`M`, `billion`/`B`).
3. Picks the first matching tier and colors the title:

| Views | Color |
|-------|-------|
| ≥ 1,000,000 | green |
| ≥ 100,000 | yellow |
| ≥ 10,000 | blue |
| below | no highlight |

Cards are re-checked (debounced 300ms) whenever the page changes, so infinite scroll and navigation are covered.

To change thresholds or colors, edit the `TIERS` array at the top of `content.js`.

## Limits

- English UI only (parses "views").
- Upload date is not used; scoring is by raw views.
- Live/premiere cards without a view count are skipped.
- YouTube renames its CSS classes now and then. If nothing highlights, update the `CARD`, `META` and `TITLE` selectors in `content.js`.
