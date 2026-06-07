# Markdown Studio

Markdown Studio is a single-page, client-side Markdown editor with live preview, LaTeX math support, Mermaid diagrams, a block organizer, image manager, and export options (PDF, HTML, DOCX, Markdown). It's designed as a lightweight authoring environment for technical writing, notes, and documentation.

**Status:** Prototype / static site


## Features
- Live Markdown editor with split / editor / preview views
- LaTeX math rendering via KaTeX
- Mermaid diagram support and builder
- Block organizer for moving paragraph blocks
- Image manager with inline insertion
- Multiple built-in templates and export formats

## Quick start (local)
1. Open `index.html` in a modern browser (no build required).  
2. Use the toolbar to create, edit, and export content.  

For development and edits, clone the repo and use a static server:

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Files of interest
- `index.html` — main app shell
- `assets/style.css` — UI and preview styles
- `scripts/script.js` — application logic
- `scripts/site.webmanifest` — PWA/manifest metadata

## Contributing
- Update code in `scripts/` or styles in `assets/`.
- Keep changes small and focused. Add tests/examples if adding features.

## License
This project is available under the MIT License. See `LICENSE`.

