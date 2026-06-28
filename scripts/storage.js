/**
 * Markdown Studio — storage.js
 * IndexedDB persistence layer: files, autosave, version snapshots, settings.
 *
 * DB name  : markdown-studio
 * Version  : 2
 * Stores:
 *   files      { id, name, content, createdAt, updatedAt }
 *   snapshots  { id (auto), fileId, content, savedAt, label }
 *   settings   { key, value }
 */

const DB_NAME    = 'markdown-studio';
const DB_VERSION = 2;
const MAX_SNAPSHOTS_PER_FILE = 50;

// ─── open ──────────────────────────────────────────────────────────────────

let _db = null;

export function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      const oldV = e.oldVersion;

      // files store
      if (!db.objectStoreNames.contains('files')) {
        const fs = db.createObjectStore('files', { keyPath: 'id' });
        fs.createIndex('updatedAt', 'updatedAt');
      }

      // snapshots store (v2)
      if (!db.objectStoreNames.contains('snapshots')) {
        const ss = db.createObjectStore('snapshots', {
          keyPath: 'id', autoIncrement: true
        });
        ss.createIndex('fileId', 'fileId');
        ss.createIndex('savedAt', 'savedAt');
      }

      // settings store (v2)
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    req.onsuccess = (e) => {
      _db = e.target.result;
      resolve(_db);
    };
    req.onerror  = () => reject(req.error);
  });
}

// ─── low-level helpers ─────────────────────────────────────────────────────

function tx(store, mode = 'readonly') {
  return _db.transaction(store, mode).objectStore(store);
}

function promisify(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

function getAll(store) {
  return new Promise((res, rej) => {
    const req = tx(store).getAll();
    req.onsuccess = () => res(req.result);
    req.onerror   = () => rej(req.error);
  });
}

function toPlainData(value) {
  if (value == null) return value;
  return JSON.parse(JSON.stringify(value));
}

// ─── FILES ─────────────────────────────────────────────────────────────────

export async function getAllFiles() {
  await openDB();
  return getAll('files');
}

export async function getFile(id) {
  await openDB();
  return promisify(tx('files').get(id));
}

export async function saveFile(file) {
  await openDB();
  const stored = toPlainData(file);
  stored.updatedAt = Date.now();
  if (!stored.createdAt) stored.createdAt = stored.updatedAt;
  return promisify(tx('files', 'readwrite').put(stored));
}

export async function deleteFile(id) {
  await openDB();
  // delete the file itself
  await promisify(tx('files', 'readwrite').delete(id));
  // delete all its snapshots
  await deleteSnapshotsForFile(id);
}

// ─── AUTOSAVE ──────────────────────────────────────────────────────────────

let _autosaveTimer  = null;
let _autosaveDelay  = 2000; // ms

/**
 * Schedule an autosave. Resets the timer on every call (debounce).
 * @param {object}   file      – the current file object (id, name, content …)
 * @param {function} onSaved   – optional callback after save completes
 */
export function scheduleAutosave(file, onSaved) {
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(async () => {
    await saveFile({ ...file });
    if (typeof onSaved === 'function') onSaved();
  }, _autosaveDelay);
}

export function setAutosaveDelay(ms) {
  _autosaveDelay = ms;
}

export function cancelAutosave() {
  clearTimeout(_autosaveTimer);
}

// ─── SNAPSHOTS ─────────────────────────────────────────────────────────────

export async function createSnapshot(fileId, content, label = '') {
  await openDB();
  const snap = {
    fileId,
    content,
    savedAt: Date.now(),
    label: label || new Date().toLocaleString(),
  };
  const id = await promisify(tx('snapshots', 'readwrite').add(snap));

  // Prune old snapshots — keep only the most recent MAX_SNAPSHOTS_PER_FILE
  await pruneSnapshots(fileId);
  return id;
}

export async function getSnapshots(fileId) {
  await openDB();
  return new Promise((res, rej) => {
    const idx   = tx('snapshots').index('fileId');
    const range = IDBKeyRange.only(fileId);
    const req   = idx.getAll(range);
    req.onsuccess = () => {
      // Sort newest first
      const sorted = (req.result || []).sort((a, b) => b.savedAt - a.savedAt);
      res(sorted);
    };
    req.onerror = () => rej(req.error);
  });
}

export async function getSnapshot(id) {
  await openDB();
  return promisify(tx('snapshots').get(id));
}

export async function deleteSnapshot(id) {
  await openDB();
  return promisify(tx('snapshots', 'readwrite').delete(id));
}

async function deleteSnapshotsForFile(fileId) {
  const snaps = await getSnapshots(fileId);
  const store = tx('snapshots', 'readwrite');
  for (const s of snaps) {
    store.delete(s.id);
  }
}

async function pruneSnapshots(fileId) {
  const snaps = await getSnapshots(fileId); // already sorted newest-first
  if (snaps.length <= MAX_SNAPSHOTS_PER_FILE) return;
  const toDelete = snaps.slice(MAX_SNAPSHOTS_PER_FILE);
  const store = tx('snapshots', 'readwrite');
  for (const s of toDelete) {
    store.delete(s.id);
  }
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────

export async function getSetting(key, defaultValue = null) {
  await openDB();
  try {
    const row = await promisify(tx('settings').get(key));
    return row ? row.value : defaultValue;
  } catch (_) {
    return defaultValue;
  }
}

export async function setSetting(key, value) {
  await openDB();
  return promisify(tx('settings', 'readwrite').put({ key, value: toPlainData(value) }));
}

export async function getAllSettings() {
  await openDB();
  const rows = await getAll('settings');
  const out  = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

// ─── MIGRATION: localStorage → IndexedDB ──────────────────────────────────
// Run once on startup. If old data exists in localStorage, import it.

export async function migrateFromLocalStorage() {
  const migrated = await getSetting('ls_migrated', false);
  if (migrated) return;

  try {
    const raw = localStorage.getItem('md_studio_files');
    if (raw) {
      const files = JSON.parse(raw);
      if (Array.isArray(files)) {
        for (const f of files) {
          // Only import if not already in IDB
          const existing = await getFile(f.id).catch(() => null);
          if (!existing) await saveFile(f);
        }
      }
    }
  } catch (e) {
    console.warn('[storage] migration from localStorage failed:', e);
  }

  await setSetting('ls_migrated', true);
}
