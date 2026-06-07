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

## Publishing (recommended professional options)

1) GitHub Pages (simple, free)
	- Create a GitHub repository and push this project.
	- In repository Settings → Pages, set branch to `main` (or `gh-pages`) and folder to `/ (root)` or `/docs` depending on your layout.
	- Optionally add a `CNAME` file for a custom domain and enable HTTPS.

2) Vercel (fast CDN, automatic builds)
	- Connect your GitHub repo to Vercel, and deploy. Vercel auto-detects static sites.
	- Add a custom domain and enable HTTPS (automatic).

3) Netlify (CI + deploy previews)
	- Connect repo to Netlify, set build command `none` (static), and publish directory `/`.
	- Configure redirects, headers, and a custom domain.

Professional polish checklist:
- Add a `CNAME` (or configure domain) and set up HTTPS.  
- Add social preview metadata (`og:title`, `og:description`, `twitter:card`) in `index.html`.  
- Add a `README.md`, `LICENSE` (done), and release notes.  
- Add a small CI job for link checking or accessibility (optional).  

## Example GitHub Pages deploy commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
# then enable Pages in repo settings or push to gh-pages branch
```

