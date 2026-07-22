---
name: Site Builder IDE
description: Replit-like Monaco editor with live iframe preview for building client websites
---

`artifacts/diamond-digital/src/pages/admin/SiteBuilder.tsx` — 3-panel IDE:
- Left: Explorer sidebar (200px) + tab bar — uses `sitePagesTable` rows as files
- Center: Monaco Editor (@monaco-editor/react), theme vs-dark, Ctrl+S keybinding to save
- Right: Live preview iframe (42% width), uses `srcdoc` with inlined CSS/JS

**Auto-seed:** On mount, if site has 0 pages, creates 3 starter files (index.html, style.css, script.js) via `createSitePage` API sequentially.

**Preview build:** Finds the .html file, injects all .css files as `<style>` tags before `</head>`, injects all .js files as `<script>` before `</body>`, sets as iframe `srcdoc`. Auto-refreshes with 600ms debounce on content change.

**Why:** User wanted admin to work like Replit for building client websites.
