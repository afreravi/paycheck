/**
 * Loads and validates tax data records.
 * Node-only (uses fs). For browser use, bundle the JSON or import directly.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "data");

const cache = new Map();

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function getFederal(taxYear) {
  const key = `fed-${taxYear}`;
  if (!cache.has(key)) {
    cache.set(key, readJson(join(DATA, "federal", `us-fed-${taxYear}.json`)));
  }
  return cache.get(key);
}

export function getState(stateCode, taxYear) {
  const code = stateCode.replace(/^US-/i, "").toLowerCase();
  const key = `st-${code}-${taxYear}`;
  if (!cache.has(key)) {
    cache.set(key, readJson(join(DATA, "states", `us-${code}-${taxYear}.json`)));
  }
  return cache.get(key);
}

export function getStateList() {
  const idx = readJson(join(DATA, "states", "index.json"));
  return idx.states;
}
