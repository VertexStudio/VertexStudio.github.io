# Repository Guidelines

## Project Structure & Module Organization
- Root HTML: `index.html`, `about-us.html`, `games.html`, `extended-reality.html`, `simulations.html`, error page `401.html`.
- Styles: `css/` (site CSS), `style.css` (custom styles), `dist/css/` (Bootstrap builds), `css2/` (legacy styles).
- Scripts: `js/` (site JS), `dist/js/` (Bootstrap builds), `js3D/`, `jsParticles/`, `particles/` (vendor lib with its own `package.json`).
- Assets: `images/`, `img/` (legacy), `fonts/`, `Assets/Images/` and `Assets/fonts/` (legacy/brand assets), `video/`.
- Server helper: `include/sendemail.php` (PHPMailer contact form).

## Build, Test, and Development Commands
- Serve locally: `python3 -m http.server 8080` (from repo root). Visit `http://localhost:8080`.
- Quick link check: open DevTools Console and verify no 404/JS errors when navigating each page.
- Vendor updates: keep Bootstrap files in `dist/` and third‑party libs in their folders; do not edit minified vendor files directly.

## Coding Style & Naming Conventions
- HTML/CSS/JS indentation: 4 spaces; trim trailing whitespace.
- Filenames: lowercase, kebab‑case (e.g., `new-section.html`, `team-cards.css`).
- JS: camelCase for variables/functions; keep code in `js/` and avoid inline scripts where possible.
- CSS: prefer component‑scoped classes; avoid global overrides of vendor classes; place site styles in `css/` or `style.css` (keep Bootstrap overrides minimal and grouped).
- Assets: place images in `images/`; web fonts in `fonts/`. Keep legacy assets in their existing legacy folders.

## Testing Guidelines
- No automated test harness currently. Manually verify:
  - Console is free of errors/warnings.
  - Responsive behavior at 480/800/1100/1500px (matches grid breakpoints used in `js/main.js`).
  - Lighthouse basic checks (Performance/Accessibility/SEO) for changed pages.

## Commit & Pull Request Guidelines
- Commits: short, imperative, sentence‑case summaries (e.g., "Fix carousel styles", "Add Game RAG section"). Group related changes.
- PRs: clear description of changes, linked issues, before/after screenshots or screen recordings for UI updates, and a checklist confirming local testing across key pages.

## Security & Configuration Tips
- Do not commit secrets. For `include/sendemail.php`, configure PHPMailer via SMTP and reCAPTCHA server key via environment on the server; never store credentials in Git.
- Validate contact recipients before enabling email; sanitize inputs and keep dependencies updated in vendor folders without modifying upstream code.
