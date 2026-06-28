/**
 * cm-bundle-entry.js
 *
 * Bundle this with rollup to produce scripts/vendor/codemirror-bundle.js
 * which exposes everything as window.CM.
 *
 * Install:
 *   npm install @codemirror/view @codemirror/state @codemirror/commands \
 *               @codemirror/language @codemirror/lang-markdown \
 *               @codemirror/highlight @codemirror/history @codemirror/search \
 *               @codemirror/matchbrackets @codemirror/autocomplete \
 *               @codemirror/closebrackets @codemirror/basic-setup \
 *               @codemirror/theme-one-dark \
 *               @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup
 *
 * Build:
 *   npx rollup --input scripts/vendor/cm-bundle-entry.js \
 *     --file scripts/vendor/codemirror-bundle.js \
 *     --format umd --name CM \
 *     -p @rollup/plugin-node-resolve \
 *     -p @rollup/plugin-commonjs
 */

// Core
export { EditorView, keymap, lineNumbers } from '@codemirror/view';
export { EditorState, Compartment }         from '@codemirror/state';

// Commands / history
export { history, historyKeymap, defaultKeymap, undo, redo } from '@codemirror/commands';

// Language support
export {
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from '@codemirror/language';

// Markdown
export { markdown } from '@codemirror/lang-markdown';

// Autocomplete + closebrackets
export { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';

// Search / goto
export {
  search,
  searchKeymap,
  SearchQuery,
  openSearchPanel,
  closeSearchPanel,
  findNext,
  findPrevious,
  replaceNext,
  replaceAll,
  gotoLine,
  highlightSelectionMatches,
  selectMatches,
  selectNextOccurrence,
  selectSelectionMatches,
  setSearchQuery,
  getSearchQuery,
} from '@codemirror/search';

// One Dark theme (optional but great)
export { oneDark } from '@codemirror/theme-one-dark';
