# Neighborhood Wine & Spirits — Static SPA

Production-ready HTML/CSS/JS single-page app for a neighborhood liquor store.

How to run locally

- Using Node (recommended):
  - `npx --yes http-server -c-1 -p 5173`
  - Open `http://localhost:5173/` in your browser

- Using Python 3 (fallback):
  - `python -m http.server 5173`
  - Open `http://localhost:5173/`

Key features

- Home with hero, category pills, filters, sort, and responsive grid
- Search in header (debounced); URL query params for shareable state
- Product detail with facts, tasting notes, pairings; JSON-LD Product schema
- Related products carousel; add-to-cart stub; low-stock badge
- Mobile sticky bar with Filters / Sort / Search; accessible focus states

Tech

- Semantic HTML, modular CSS, vanilla JS (ES modules)
- Hash routing; no build step needed