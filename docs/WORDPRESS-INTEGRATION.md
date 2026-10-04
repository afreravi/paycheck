# WordPress Integration Guide

Step-by-step deployment of the paycheck calculator to `afreetools.com/finance/paycheck-calculator`.

Verified against the live site on 2026-10-04: WordPress, GeneratePress + GP Premium theme, GTranslate and Rank Math active, tools are **Pages** (not Posts).

---

## Read this first: you do not need to change permalinks

You said you'd switch permalinks to "Post name." **You are already on it.** Tested live:

```
GET https://afreetools.com/?page_id=30303  ->  301  ->  https://afreetools.com/delivery-tip-calculator
```

WordPress only issues that redirect when pretty permalinks are enabled. The canonical tag on tool pages is also the pretty URL. **Change nothing.** Your 116 tool URLs are safe.

---

## Files: what goes where

| # | Build artifact | Destination | Action |
|---|---|---|---|
| 1 | `dist/paycheck-engine.js` | `/wp-content/uploads/tools/paycheck-engine.js` | Upload |
| 2 | `dist/wp/1-paycheck-calculator-page.html` | Page body | Paste |
| 3 | `dist/wp/2-finance-hub-page.html` | Parent Page body | Paste |
| 4 | `dist/wp/3-schema.jsonld` | Rank Math schema field | Paste |
| 5 | `dist/wp/4-enqueue-snippet.php` | Child theme / snippet plugin | Optional |
| 6 | `dist/paycheck-calculator.html` | — | Ignore (standalone build, not for WP) |

---

## Step 1 — Upload the engine

1. In cPanel / FTP / File Manager, open `/wp-content/uploads/`
2. Create a folder named `tools` (if it doesn't exist)
3. Upload `dist/paycheck-engine.js` into it

**Do not upload to `/wp-content/themes/`** — a theme update will delete it.

Final path: `https://afreetools.com/wp-content/uploads/tools/paycheck-engine.js`

**Verify before continuing:** open that URL in your browser. You should see JavaScript, not a 404. If you see a 404, the file is in the wrong folder — fix it now, because every later step depends on it.

---

## Step 2 — Create the `/finance` hub Page

1. **Pages → Add New**
2. Title: `Finance`
3. **Permalink:** click "Edit" next to the permalink and set it to `finance` — you want `afreetools.com/finance/`, not a dated or suffixed URL
4. **Parent:** leave as "(no parent)" — this is the top-level hub
5. In the editor, switch from **Visual** to **Code Editor** (⋮ menu → Code editor)
6. Paste the contents of `dist/wp/2-finance-hub-page.html`
7. Publish

---

## Step 3 — Create the calculator Page

1. **Pages → Add New**
2. Title: `Paycheck Calculator`
3. **Permalink:** set to `paycheck-calculator`
4. **Parent:** select **Finance** ← this is what makes Option C work
5. **Code Editor** mode, then paste `dist/wp/1-paycheck-calculator-page.html`
6. Publish

Your URL is now `afreetools.com/finance/paycheck-calculator`.

### Verify the parent actually saved

This is the step most likely to silently fail. After publishing, **open the page on the
front end and look at the URL**. If it is `afreetools.com/paycheck-calculator` with no
`/finance/` segment, the parent did not save.

Check it directly:

```
https://afreetools.com/wp-json/wp/v2/pages?slug=paycheck-calculator&_fields=id,slug,link,parent
```

`"parent":0` means the parent did not save. Fix it by:

1. **Pages → All Pages**, confirm **Finance** is published (not draft)
2. Re-open the calculator Page, re-select **Parent: Finance**, click **Update**
3. If the URL still won't nest, the theme has a custom permalink filter — tell me and
   I'll adapt the bundle to a flat URL instead

> Do not skip this. The internal links, the breadcrumb, and the canonical tag all
> depend on the nested URL.

---

## Step 3b — Fill in the SEO fields

The calculator's opening text is a form, not prose, so Rank Math's automatic meta
description falls back to the first form labels and produces nonsense like
_"Tax year 2026 2025 Pay type Salary (annual) Hourly..."_. Set the fields manually in
the **Rank Math** panel on the Page:

| Field | Value |
|---|---|
| Focus keyword | `paycheck calculator` |
| SEO title | `Paycheck Calculator - Estimate Your Take-Home Pay` |
| Meta description | `Free paycheck calculator. Estimate your take-home pay after federal income tax, FICA, and state income tax for all 50 states. No signup.` |

The bundle now includes an intro paragraph above the form. That paragraph is what gives
the page real opening text — keep it.

---

## Step 4 — Load the engine

Pick **one** of these. Option A is simpler; Option B is more robust.

### Option A — inline script (simplest)

Already included at the bottom of `dist/wp/1-paycheck-calculator-page.html`. If you pasted that file in Step 3, this is done.

**Risk:** WordPress's `wpautop` can inject `<p>` and `<br>` tags into an inline `<script>`, breaking it. This is the single most likely failure point.

**After publishing, verify:** load the page, open the browser console (F12), and check for errors. Then click "Calculate take-home pay" — you should see a dollar figure. If the form renders but clicking does nothing, `wpautop` mangled the script. Switch to Option B.

### Option B — enqueue (recommended, no inline JS at all)

The engine **auto-mounts itself** when it finds a `#paycheck-calculator` element, so you
don't need any inline script. This is the safest option: there is nothing for `wpautop`
to mangle.

1. Open `dist/wp/4-enqueue-snippet.php`
2. Paste it into **one** of:
   - a **child theme's** `functions.php` (survives GeneratePress updates)
   - a small site-specific plugin in `/wp-content/plugins/`
   - the **Code Snippets** plugin
3. **Never** paste into the parent GeneratePress theme — an update erases it
4. Then remove the `<script>` block from the Page body (keep the `<div>` and the form)

Both options are verified to produce identical results. If Option A works on your site,
you can keep it — Option B is simply the more durable choice.

---

## Step 5 — Add structured data

1. Edit the calculator Page
2. Scroll to the **Rank Math SEO** panel
3. Open **Schema** → set Schema Type to **None / Custom**
4. Paste the contents of `dist/wp/3-schema.jsonld` into the custom schema field

This gives Google the `WebApplication`, `BreadcrumbList`, and `FAQPage` markup.

---

## Step 6 — Add ads

Display-first monetization, per the PRD. Maximum two units:

- **Slot 1:** immediately after the `<h1>`, above the form
- **Slot 2:** immediately after the results `<section class="pc-result">`, below the breakdown table

Do not put an ad inside the form or between the inputs — it depresses completion and risks a policy flag on a page whose value is the tool itself.

---

## Step 7 — Internal linking

1. Edit the `/calculators` hub Page, add a link to `/finance/paycheck-calculator`
2. Add the same link to the footer menu or the main nav
3. Add links from related existing tool pages (e.g. the HELOC and Customer Lifetime Value
   calculators) back to the paycheck calculator

The intro paragraph in the bundle already covers step 3 of the old checklist — that is
what gives the page prose context for ranking.

### Known gap on the live site

As of this writing the calculator is reachable from `/finance/` and from the sitemap, but:

- it is **not** linked from `/calculators`
- it is **not** in the main nav menu
- the homepage's own links to it currently 301-redirect (because the page is not yet
  nested under `/finance/`)

Links 1 and 2 are the highest-value items left. An orphaned page ranks poorly no matter
how good the tool is.

---

## Step 8 — Verify

Run through this checklist on the live URL:

- [ ] `afreetools.com/finance/` loads and links to the calculator
- [ ] `afreetools.com/finance/paycheck-calculator` loads
- [ ] The form is visible with all fields and 51 states
- [ ] Clicking **Calculate** shows a net figure (test: $75,000 / Single / Bi-Weekly / California → **$2,213.41**)
- [ ] Browser console has no errors (F12 → Console)
- [ ] "Show the math" expands with the step-by-step trace
- [ ] Works on a phone — inputs don't trigger iOS zoom
- [ ] No `<p>` tags appear inside the script (View Source → search the script block)
- [ ] Schema validates: https://search.google.com/test/rich-results
- [ ] Mobile-friendly: https://search.google.com/test/mobile-friendly

The `$2,213.41` figure is a golden fixture — if you get that exact number, the engine, data, and UI are all wired correctly.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Form renders, Calculate does nothing | `wpautop` broke the inline module script | Switch to Option B (enqueue) |
| Form doesn't render at all | Script error before mount, or paste truncated | Check console; re-paste `1-paycheck-calculator-page.html` |
| 404 on `paycheck-engine.js` | Wrong upload path | Confirm `/wp-content/uploads/tools/` |
| Net figure is blank | Engine loaded but data missing | Re-run `node tools/build.mjs` and re-upload the engine |
| Permalink not nested | Parent not published | Publish `/finance` first, re-save child permalink |
| Styles clash with theme | CSS scope leak | All rules are `.pc-*` prefixed; report any specific clash |
| Stale numbers after update | Browser cache | Bump the version in `wp_enqueue_script_module` (Option B) |

---

## Updating in future

**Tax data changes (yearly):**

```bash
# edit src/data/... then
npm test
node tools/build.mjs
# re-upload dist/paycheck-engine.js only
```

No WordPress page edits needed — the page only references the engine file.

**UI changes:** re-run the build and re-paste `1-paycheck-calculator-page.html`, since the form markup lives in the page.

**Cache busting:** if using Option B, bump the version string in the `wp_enqueue_script_module` call so browsers pick up the new file.

---

## Known limitation

**State tax data is estimate-tier.** It approximates each state's rates with a simplified three-band structure and is not verified against state DOR tables. It will misstate liability for many states. Federal data uses real IRS figures. See the README. Do not market this as payroll-accurate until state data is verified.
