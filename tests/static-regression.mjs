import { readFile } from "node:fs/promises";
import { strict as assert } from "node:assert";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [script, editor, index, manifest, cmEntry, pkg, mermaidRenderer, storage] = await Promise.all([
  read("scripts/script.js"),
  read("scripts/editor.js"),
  read("index.html"),
  read("scripts/site.webmanifest"),
  read("scripts/vendor/cm-bundle-entry.js"),
  read("package.json"),
  read("scripts/preview/mermaid-renderer.js"),
  read("scripts/storage.js"),
]);

assert.match(script, /renderer\.code = function \(tokenOrCode/, "Marked code renderer supports token and positional APIs");
assert.match(script, /renderer\.heading = function \(tokenOrText/, "Marked heading renderer supports token and positional APIs");
assert.match(script, /renderer\.link = function \(tokenOrHref/, "Marked link renderer supports token and positional APIs");
assert.match(script, /function jumpToCorrespondingBlock/, "Sync scroll jump helper exists");
assert.match(script, /createMermaidRenderer/, "Preview Mermaid rendering is extracted from main script");
assert.match(script, /const previewSegments = computed/, "Preview is split into stable keyed segments");
assert.match(script, /latexCat\.value = "greek"/, "LaTeX builder starts on a valid category");
assert.doesNotMatch(script, /ADD_TAGS:\s*\["iframe"\]/, "DOMPurify does not allow raw iframes");
assert.doesNotMatch(script, /\bconfirm\(/, "Native confirm dialogs are not used");
assert.doesNotMatch(script, /\bprompt\(/, "Native prompt dialogs are not used");
assert.match(script, /normalizeFileForStorage/, "Files are normalized before persistence");
assert.match(script, /imageLibrary/, "Image library persistence is wired");
assert.match(script, /userTemplates/, "User template persistence is wired");
assert.match(editor, /setValue\(text, options = \{\}\)/, "Editor adapter supports silent setValue options");
assert.match(index, /v-for="f in filteredFiles"/, "Sidebar uses filtered file list");
assert.match(index, /v-for="segment in previewSegments"/, "Preview renders keyed segments instead of one v-html blob");
assert.match(index, /appDialog\.open/, "App-native dialog markup exists");
assert.match(cmEntry, /from '@codemirror\/search'/, "CodeMirror search exports are bundled");
assert.match(pkg, /"@codemirror\/search"/, "CodeMirror search dependency is declared");
assert.match(manifest, /\.\.\/assets\/images\/android-chrome-192x192\.png/, "Manifest icon path is relative to manifest file");
assert.match(mermaidRenderer, /const cache = new Map/, "Mermaid renderer caches rendered diagrams");
assert.match(mermaidRenderer, /pending = new Map/, "Mermaid renderer de-duplicates pending renders");
assert.match(mermaidRenderer, /hasRenderedOutput/, "Mermaid renderer skips unchanged rendered blocks");
assert.match(storage, /_autosaveQueue/, "Autosave writes are serialized through a queue");
assert.match(storage, /_latestAutosaveByFile/, "Autosave skips stale queued saves by file");
assert.match(script, /autosaveStatus\.value = "saving"/, "Autosave exposes an active saving state");
assert.match(script, /checkStorageQuota/, "Storage quota warning helper exists");
assert.match(script, /navigator\.storage\?\.estimate/, "Storage quota warning uses browser storage estimates");

console.log("Static regression checks passed.");
