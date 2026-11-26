/**
 * Import the Tax Foundation's annual "State Individual Income Tax Rates and
 * Brackets" table into a machine-readable file.
 *
 * Run: node tools/import-tax-foundation.mjs
 *
 * The output is committed so the state data build is reproducible and the
 * transcription can be diffed against the source year over year. This is a
 * secondary source: it is wider than reading 50 statutes, so records derived
 * from it are tagged `secondary`, not `verified`.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const YEAR = 2026;
const URL = `https://taxfoundation.org/data/all/state/state-income-tax-rates-${YEAR}/`;
const OUT = join(__dirname, "..", "src", "data", `tax-foundation-${YEAR}.json`);

// Tax Foundation spells the district out; the calculator keys it US-DC.
const NAME_TO_CODE = { "Washington DC": "DC" };

const NAME_BY_CODE = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
  FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
  IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
  MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
  NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia",
  WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Washington's schedule is an excise tax on long-term capital gains above a
// threshold, not a tax on wages. Recording it as a wage rate would invent a
// state income tax Washington does not levy.
const WAGES_NOT_TAXED = new Set(["WA", "NH"]);

const CODE_BY_NAME = {
  ...Object.fromEntries(Object.entries(NAME_BY_CODE).map(([c, n]) => [n, c])),
  ...NAME_TO_CODE,
};

function cells(row) {
  return [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, ""))
    .map((c) => c.replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim());
}

function money(s) {
  if (!s) return null;
  const cleaned = s.replace(/[$,\s]/g, "");
  return /^-?\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
}

const res = await fetch(URL, {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; afreetools data import)" },
});
if (!res.ok) throw new Error(`${URL} -> HTTP ${res.status}`);
const html = await res.text();

const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)].map((m) => m[0]);
const table = tables.find((t) => t.includes("Standard Deduction"));
if (!table) throw new Error("rate table not found on page");

const rows = [...table.matchAll(/<tr[\s\S]*?<\/tr>/g)].map((m) => m[0]);
const states = {};
let current = null;

for (const row of rows.slice(1)) {
  const c = cells(row);
  if (c.length < 9) continue;

  const rawName = c[0];
  if (rawName && !rawName.startsWith("- ")) {
    const name = rawName.replace(/\s*\(.*?\)\s*/g, "").trim();
    const code = CODE_BY_NAME[name];
    if (!code) {
      // not a jurisdiction we model; skip rather than invent one
      current = null;
      continue;
    }
    current = code;
    states[code] = {
      name,
      single: [],
      mfj: [],
      deduction: { single: money(c[7]), couple: money(c[8]) },
      personal_exemption: {
        single: money(c[9]) ?? null,
        couple: money(c[10]) ?? null,
      },
    };
  }
  if (!current) continue;

  const sRate = money(String(c[1]).replace("%", ""));
  const sMin = money(c[3]);
  const jRate = money(String(c[4]).replace("%", ""));
  const jMin = money(c[6]);

  if (sRate !== null && sMin !== null) states[current].single.push([sMin, Number((sRate / 100).toFixed(6))]);
  if (jRate !== null && jMin !== null) states[current].mfj.push([jMin, Number((jRate / 100).toFixed(6))]);
}

for (const code of WAGES_NOT_TAXED) {
  if (states[code]) {
    states[code].single = [];
    states[code].mfj = [];
  }
}

const payload = {
  source: `Tax Foundation, ${YEAR} State Individual Income Tax Rates and Brackets`,
  source_url: URL,
  retrieved: new Date().toISOString().slice(0, 10),
  as_of: "January 1, 2026",
  licence_note: "Figures transcribed from the published table; Tax Foundation cites state statutes, forms and instructions.",
  fields: {
    single: "[threshold, rate] pairs for a single filer",
    mfj: "[threshold, rate] pairs for married filing jointly",
    deduction: "standard deduction; null where the state uses an exemption or credit instead",
    personal_exemption: "null where the state has no personal exemption",
  },
  states,
};

writeFileSync(OUT, JSON.stringify(payload, null, 1) + "\n");
console.log(`Wrote ${Object.keys(states).length} jurisdictions to ${OUT}`);
for (const [code, s] of Object.entries(states)) {
  if (s.single.length === 0) console.log(`  ${code}: no wage income tax`);
}
