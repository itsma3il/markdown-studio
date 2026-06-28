# Markdown Studio — Upgrade Guide

This folder contains the improved scripts. Apply in this order.

---

## What changed

| Area | Before | After |
|------|--------|-------|
| Editor core | `<textarea>` with `v-model` | CodeMirror 6 adapter (`editor.js`) |
| Storage | `localStorage` | IndexedDB (`storage.js`) — autosave + snapshots |
| Rendering safety | raw `v-html` from marked | `DOMPurify.sanitize()` applied before render |
| Markdown parser | bare `marked.setOptions` | custom renderer (copy-code buttons, safe links, heading slugs) |
| Settings | none | Settings modal (autosave delay, snapshot freq, editor prefs) |
| Version history | none | Snapshot panel with restore (Ctrl+Shift+H) |

---

## File map

```
scripts/
  script.js          ← replace the original entirely
  editor.js          ← new: CodeMirror 6 adapter (+ textarea fallback)
  storage.js         ← new: IndexedDB layer (files, snapshots, settings)
  vendor/
    cm-bundle-entry.js  ← rollup entry — build this to get the CM bundle
    codemirror-bundle.js ← YOU build this (see below); not included
PATCH.html           ← annotated diff showing all index.html changes
```

---

## Step-by-step setup

### 1. Copy scripts

```bash
cp scripts/editor.js   /your-repo/scripts/editor.js
cp scripts/storage.js  /your-repo/scripts/storage.js
cp scripts/script.js   /your-repo/scripts/script.js
```

### 2. Build the CodeMirror 6 bundle

```bash
cd /your-repo
npm install --save-dev \
  @codemirror/view @codemirror/state @codemirror/commands \
  @codemirror/language @codemirror/lang-markdown \
  @codemirror/highlight @codemirror/autocomplete \
  @codemirror/theme-one-dark \
  rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs

# copy the entry file
cp scripts/vendor/cm-bundle-entry.js /your-repo/scripts/vendor/cm-bundle-entry.js

# build
npx rollup \
  --input scripts/vendor/cm-bundle-entry.js \
  --file  scripts/vendor/codemirror-bundle.js \
  --format umd --name CM \
  -p @rollup/plugin-node-resolve \
  -p @rollup/plugin-commonjs
```

The bundle will be at `scripts/vendor/codemirror-bundle.js` (~400 KB, ~150 KB gzipped).

> **Without the bundle:** `editor.js` detects `window.CM === undefined` and falls back to a plain
> `<textarea>`. Every other feature (autosave, snapshots, settings) still works.

### 3. Patch index.html

Open `PATCH.html` — it's an annotated HTML file with clearly labelled sections:

- **CHANGE 1** — add DOMPurify + CM bundle `<script>` tags to `<head>`
- **CHANGE 2** — switch `<script src="scripts/script.js">` → `<script type="module" …>`
- **CHANGE 3** — remove `<textarea>` inside `#editor-wrap` (leave the div empty)
- **CHANGE 4** — add Settings toolbar button
- **CHANGE 5** — add History toolbar button
- **CHANGE 6** — update the statusbar saved indicator
- **CHANGE 7** — add "Save snapshot" icon to editor pane toolbar
- **NEW MODALS** — paste the two modal blocks (Settings + Version History)
- **CSS ADDITIONS** — paste the CSS block into `assets/style.css`

---

## Architecture notes

### `editor.js` — adapter pattern

The rest of the codebase calls this unified API:

```js
editorInstance.getValue()            // get full content string
editorInstance.setValue(text)        // replace all content
editorInstance.insert(text)          // insert at cursor
editorInstance.wrapSelection(p, s)   // wrap selection (bold, italic …)
editorInstance.prefixLine(prefix)    // prepend to current line(s)
editorInstance.fenceBlock(open, close)
editorInstance.undo() / .redo()
editorInstance.setWordWrap(bool)
editorInstance.setDarkMode(bool)
editorInstance.setFontSize(px)
editorInstance.focus()
editorInstance.destroy()
```

If the CM6 bundle is loaded, a real CM6 `EditorView` backs these.
If not, a plain `<textarea>` backs them identically.

### `storage.js` — IndexedDB stores

| Store | Key | Contents |
|-------|-----|----------|
| `files` | `id` (string) | `{ id, name, content, createdAt, updatedAt }` |
| `snapshots` | auto-increment | `{ fileId, content, savedAt, label }` |
| `settings` | `key` string | `{ key, value }` |

On first run, existing `localStorage` data is migrated automatically.

### Autosave flow

```
user types → onChange() → markUnsaved() → scheduleAutosave(2s debounce)
                                              ↓ (after idle 2s)
                                          saveFile(IndexedDB)
                                              ↓
                                          maybeCreateSnapshot()
                                          (if snapshotFreq minutes have passed)
```

---

## Known limitations / future work

- CodeMirror syntax theme for light mode could be improved (custom `defaultHighlightStyle` overrides)
- Snapshot diffing (show what changed between versions) — not yet implemented
- Collaborative editing — out of scope for static site
- The DOCX export is a simple HTML→Word trick; for real .docx use docx.js
