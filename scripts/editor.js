/**
 * Markdown Studio — editor.js
 * CodeMirror 6 adapter.
 *
 * Expects CodeMirror 6 UMD bundle at window.CM (the all-in-one bundle).
 * Drop the bundle in: scripts/vendor/codemirror-bundle.js
 *
 * Minimal bundle should export (under window.CM):
 *   EditorView, EditorState, Compartment, keymap, lineNumbers,
 *   history, historyKeymap, defaultKeymap, indentOnInput,
 *   bracketMatching, closeBrackets, closeBracketsKeymap,
 *   syntaxHighlighting, defaultHighlightStyle,
 *   markdown (language), oneDark (optional theme)
 *
 * Build recipe (if you want to roll your own):
 *   npx rollup -p @rollup/plugin-node-resolve -p @rollup/plugin-commonjs \
 *     --input cm-bundle-entry.js --file scripts/vendor/codemirror-bundle.js \
 *     --format umd --name CM
 *
 * cm-bundle-entry.js:
 *   export * from '@codemirror/view'
 *   export * from '@codemirror/state'
 *   export * from '@codemirror/commands'
 *   export * from '@codemirror/language'
 *   export * from '@codemirror/lang-markdown'
 *   export * from '@codemirror/highlight'
 *   export * from 'codemirror'         (re-exports basicSetup)
 */

/* ──────────────────────────────────────────────────────────────────────────
   If CM is not yet loaded (bundle not placed yet), we fall back to a shim
   that wraps a plain textarea. This keeps the app fully functional while
   you're in the process of adding the bundle.
─────────────────────────────────────────────────────────────────────────── */

export function createEditor({ parent, initialValue = '', onChange, onKeydown, darkMode = false, wordWrap = true, fontSize = 15, lineHeight = 1.7 }) {

  if (window.CM) {
    return createCM6Editor({ parent, initialValue, onChange, onKeydown, darkMode, wordWrap, fontSize, lineHeight });
  }

  // ── FALLBACK: plain textarea ──────────────────────────────────────────────
  console.warn('[editor] CodeMirror bundle not found at window.CM — using textarea fallback.');
  return createTextareaFallback({ parent, initialValue, onChange, onKeydown, wordWrap, fontSize, lineHeight });
}

// ─── CodeMirror 6 ──────────────────────────────────────────────────────────

function createCM6Editor({ parent, initialValue, onChange, onKeydown, darkMode, wordWrap, fontSize, lineHeight }) {
  let suppressChange = false;
  const {
    EditorView, EditorState, Compartment,
    keymap, lineNumbers,
    history, historyKeymap, defaultKeymap,
    indentOnInput, bracketMatching, closeBrackets, closeBracketsKeymap,
    syntaxHighlighting, defaultHighlightStyle,
    markdown: markdownLang,
    oneDark,
  } = window.CM;
  const {
    searchKeymap,
    highlightSelectionMatches,
    SearchQuery,
    openSearchPanel: cmOpenSearchPanel,
    findNext: cmFindNext,
    findPrevious: cmFindPrevious,
    gotoLine: cmGotoLine,
    setSearchQuery: cmSetSearchQuery,
  } = window.CM;

  const wrapCompartment   = new Compartment();
  const themeCompartment  = new Compartment();
  const fontCompartment   = new Compartment();

  function baseTheme(fs, lh) {
    return EditorView.theme({
      '&': {
        fontSize: fs + 'px',
        height: '100%',
        fontFamily: '"JetBrains Mono", "DM Mono", monospace',
      },
      '.cm-content': { lineHeight: String(lh), padding: '12px 0' },
      '.cm-line':    { padding: '0 18px' },
      '.cm-scroller':{ overflow: 'auto', height: '100%' },
      '.cm-focused': { outline: 'none' },
    });
  }

  const extensions = [
    lineNumbers(),
    history(),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...(searchKeymap || []),
    ]),
    highlightSelectionMatches ? highlightSelectionMatches() : [],
    EditorView.lineWrapping,   // wrapping is always on by default; compartment below controls it
    wrapCompartment.of(wordWrap ? EditorView.lineWrapping : []),
    themeCompartment.of(darkMode && oneDark ? oneDark : []),
    fontCompartment.of(baseTheme(fontSize, lineHeight)),
    markdownLang ? markdownLang() : [],
    EditorView.updateListener.of((update) => {
      if (update.docChanged && !suppressChange && typeof onChange === 'function') {
        onChange(update.state.doc.toString());
      }
    }),
    // Forward raw keydown events for app-level shortcuts (Ctrl+S, Ctrl+M …)
    EditorView.domEventHandlers({
      keydown(event) {
        if (typeof onKeydown === 'function') onKeydown(event);
      }
    }),
  ];

  const state = EditorState.create({ doc: initialValue, extensions });
  const view  = new EditorView({ state, parent });

  // ── public API ──────────────────────────────────────────────────────────

  return {
    _type: 'cm6',
    _view: view,

    getValue() {
      return view.state.doc.toString();
    },

    setValue(text, options = {}) {
      suppressChange = Boolean(options.silent);
      try {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: text },
        });
      } finally {
        suppressChange = false;
      }
    },

    /** Insert text at cursor, or replace selection */
    insert(text) {
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length },
      });
      view.focus();
    },

    /** Wrap selection with prefix/suffix — used by fmt() toolbar buttons */
    wrapSelection(prefix, suffix) {
      const { from, to } = view.state.selection.main;
      const selected = view.state.sliceDoc(from, to);
      const newText  = prefix + selected + suffix;
      view.dispatch({
        changes: { from, to, insert: newText },
        selection: { anchor: from + prefix.length, head: from + prefix.length + selected.length },
      });
      view.focus();
    },

    /** Prepend prefix to the line(s) containing the cursor / selection */
    prefixLine(prefix) {
      const { from, to } = view.state.selection.main;
      const doc = view.state.doc;
      const startLine = doc.lineAt(from);
      const endLine   = doc.lineAt(to);
      const changes   = [];
      for (let ln = startLine.number; ln <= endLine.number; ln++) {
        const line = doc.line(ln);
        changes.push({ from: line.from, insert: prefix });
      }
      view.dispatch({ changes });
      view.focus();
    },

    /** Insert a fenced block around selection */
    fenceBlock(open, close) {
      const { from, to } = view.state.selection.main;
      const selected = view.state.sliceDoc(from, to);
      const newText  = open + selected + close;
      view.dispatch({
        changes: { from, to, insert: newText },
        selection: { anchor: from + open.length, head: from + open.length + selected.length },
      });
      view.focus();
    },

    /** Cursor info for status bar */
    getCursorInfo() {
      const { from } = view.state.selection.main;
      const line = view.state.doc.lineAt(from);
      return { line: line.number, col: from - line.from + 1 };
    },

    focus() { view.focus(); },

    setWordWrap(enabled) {
      view.dispatch({
        effects: wrapCompartment.reconfigure(enabled ? EditorView.lineWrapping : []),
      });
    },

    setDarkMode(enabled) {
      if (!oneDark) return;
      view.dispatch({
        effects: themeCompartment.reconfigure(enabled ? oneDark : []),
      });
    },

    setFontSize(fs) {
      view.dispatch({
        effects: fontCompartment.reconfigure(baseTheme(fs, lineHeight)),
      });
    },

    undo() {
      const { undo } = window.CM;
      if (undo) { undo(view); view.focus(); }
    },

    openSearchPanel() {
      if (typeof cmOpenSearchPanel === 'function') cmOpenSearchPanel(view);
      view.focus();
    },

    findNext() {
      if (typeof cmFindNext === 'function') cmFindNext(view);
      view.focus();
    },

    findPrevious() {
      if (typeof cmFindPrevious === 'function') cmFindPrevious(view);
      view.focus();
    },

    gotoLine() {
      if (typeof cmGotoLine === 'function') cmGotoLine(view);
      view.focus();
    },

    setSearchQuery(queryConfig) {
      if (!SearchQuery || !cmSetSearchQuery) return false;
      const query = new SearchQuery(queryConfig);
      view.dispatch({ effects: cmSetSearchQuery.of(query) });
      return query.valid;
    },

    redo() {
      const { redo } = window.CM;
      if (redo) { redo(view); view.focus(); }
    },

    destroy() { view.destroy(); },
  };
}

// ─── Textarea fallback ──────────────────────────────────────────────────────

function createTextareaFallback({ parent, initialValue, onChange, onKeydown, wordWrap, fontSize, lineHeight }) {
  const ta = document.createElement('textarea');
  ta.id          = 'editor-textarea';
  ta.spellcheck  = false;
  ta.placeholder = '# Start writing…\n\nUse Ctrl+M for LaTeX, Ctrl+G for Mermaid, Ctrl+O to organize blocks';
  ta.value       = initialValue;
  applyTextareaStyle(ta, wordWrap, fontSize, lineHeight);
  parent.appendChild(ta);

  ta.addEventListener('input', () => {
    if (typeof onChange === 'function') onChange(ta.value);
  });
  ta.addEventListener('keydown', (e) => {
    if (typeof onKeydown === 'function') onKeydown(e);
  });

  function applyTextareaStyle(el, ww, fs, lh) {
    el.style.cssText = `
      width:100%; height:100%; resize:none; border:none; outline:none;
      background:transparent; color:inherit;
      font-family:"JetBrains Mono","DM Mono",monospace;
      font-size:${fs}px; line-height:${lh};
      white-space:${ww ? 'pre-wrap' : 'pre'};
      padding:12px 18px; box-sizing:border-box;
    `;
  }

  function getSelectionInfo() {
    return { start: ta.selectionStart, end: ta.selectionEnd };
  }

  return {
    _type: 'textarea',
    _el: ta,

    getValue() { return ta.value; },

    setValue(text, options = {}) {
      ta.value = text;
      if (!options.silent) ta.dispatchEvent(new Event('input'));
    },

    insert(text) {
      const { start, end } = getSelectionInfo();
      const before = ta.value.slice(0, start);
      const after  = ta.value.slice(end);
      ta.value     = before + text + after;
      ta.selectionStart = ta.selectionEnd = start + text.length;
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    },

    wrapSelection(prefix, suffix) {
      const { start, end } = getSelectionInfo();
      const selected = ta.value.slice(start, end);
      const newText  = prefix + selected + suffix;
      const before   = ta.value.slice(0, start);
      const after    = ta.value.slice(end);
      ta.value       = before + newText + after;
      ta.selectionStart = start + prefix.length;
      ta.selectionEnd   = start + prefix.length + selected.length;
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    },

    prefixLine(prefix) {
      const { start, end } = getSelectionInfo();
      const lines  = ta.value.split('\n');
      let pos = 0, sLine = 0, eLine = 0;
      for (let i = 0; i < lines.length; i++) {
        const len = lines[i].length + 1;
        if (pos <= start && start < pos + len) sLine = i;
        if (pos <= end   && end   < pos + len) eLine = i;
        pos += len;
      }
      for (let i = sLine; i <= eLine; i++) {
        lines[i] = prefix + lines[i];
      }
      ta.value = lines.join('\n');
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    },

    fenceBlock(open, close) {
      this.wrapSelection(open, close);
    },

    getCursorInfo() {
      const pos   = ta.selectionStart;
      const before = ta.value.slice(0, pos);
      const line   = before.split('\n').length;
      const col    = before.split('\n').pop().length + 1;
      return { line, col };
    },

    focus() { ta.focus(); },

    setWordWrap(enabled) {
      ta.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    },

    setDarkMode() { /* textarea inherits CSS vars */ },

    setFontSize(fs) { ta.style.fontSize = fs + 'px'; },

    undo() { document.execCommand('undo'); },
    redo() { document.execCommand('redo'); },

    destroy() { ta.remove(); },
  };
}
