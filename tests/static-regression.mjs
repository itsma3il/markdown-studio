import { readFile } from "node:fs/promises";
import { strict as assert } from "node:assert";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

const [script, editor, index, manifest, cmEntry, pkg] = await Promise.all([
  read("scripts/script.js"),
  read("scripts/editor.js"),
  read("index.html"),
  read("scripts/site.webmanifest"),
  read("scripts/vendor/cm-bundle-entry.js"),
  read("package.json"),
]);

assert.match(script, /renderer\.code = function \(tokenOrCode/, "Marked code renderer supports token and positional APIs");
assert.match(script, /renderer\.heading = function \(tokenOrText/, "Marked heading renderer supports token and positional APIs");
assert.match(script, /renderer\.link = function \(tokenOrHref/, "Marked link renderer supports token and positional APIs");
assert.match(script, /function jumpToCorrespondingBlock/, "Sync scroll jump helper exists");
assert.match(script, /latexCat\.value = "greek"/, "LaTeX builder starts on a valid category");
assert.doesNotMatch(script, /ADD_TAGS:\s*\["iframe"\]/, "DOMPurify does not allow raw iframes");
assert.doesNotMatch(script, /\bconfirm\(/, "Native confirm dialogs are not used");
assert.doesNotMatch(script, /\bprompt\(/, "Native prompt dialogs are not used");
assert.match(script, /normalizeFileForStorage/, "Files are normalized before persistence");
assert.match(script, /imageLibrary/, "Image library persistence is wired");
assert.match(script, /userTemplates/, "User template persistence is wired");
assert.match(editor, /setValue\(text, options = \{\}\)/, "Editor adapter supports silent setValue options");
assert.match(index, /v-for="f in filteredFiles"/, "Sidebar uses filtered file list");
assert.match(index, /appDialog\.open/, "App-native dialog markup exists");
assert.match(cmEntry, /from '@codemirror\/search'/, "CodeMirror search exports are bundled");
assert.match(pkg, /"@codemirror\/search"/, "CodeMirror search dependency is declared");
assert.match(manifest, /\.\.\/assets\/images\/android-chrome-192x192\.png/, "Manifest icon path is relative to manifest file");

console.log("Static regression checks passed.");
