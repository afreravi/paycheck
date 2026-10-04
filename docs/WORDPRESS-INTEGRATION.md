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
| 4 | `dist/wp/3a-schema-webapplication.jsonld` | Rank Math schema field (PRO only) | Optional |
| 5 | `dist/wp/3b-schema-faq.jsonld` | Rank Math schema field (PRO only) | Optional |
| 6 | `dist/wp/4-enqueue-snippet.php` | Child theme / snippet plugin | **Recommended** |
| 7 | `dist/paycheck-calculator.html` | — | **Not for WordPress** |

> On **Rank Math free**, skip items 4 and 5 — the Custom Schema field is a PRO feature.
> The PHP snippet in item 6 prints the same schema without PRO.

### The two HTML files are not interchangeable

You will see two files with similar names. They serve different purposes:

**`dist/paycheck-calculator.html`** is a **complete standalone web page** — a full
`<html>` document with the CSS inlined and the engine embedded. It is 129 KB and 570 lines.
It exists so you can:

- open it locally to check the calculator without touching WordPress
- host the calculator somewhere that isn't WordPress (Netlify, S3, a plain subfolder)
- give the tool to someone who just wants an HTML file

It is **not** used in the WordPress install. Do not paste it into a Page — you would be
pasting a whole document into a page body, including a duplicate `<head>`, and it would
break the layout.

**`dist/wp/1-paycheck-calculator-page.html`** is a **page-body fragment** — just the intro
paragraph, the form `<div>`, and the module script. No `<html>`, no `<head>`, no inlined
CSS. This is the one you paste into the Page.

Rule of thumb: `wp/` folder = paste into WordPress. `dist/` root = standalone, ignore.

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
_"Tax year 2026 2025 Pay type Salary (annual) Hourly..."_. Set the fields manually.

### Where the fields actually are

All three live in the **Rank Math sidebar panel** of the Page editor, in the
**General** tab. They are not in the WordPress Document sidebar and not in Rank Math's
global settings.

1. Open the Page editor for the calculator Page
2. Make sure you are in the **General** tab (first tab) of the Rank Math panel
3. Click **Edit Snippet**

`Edit Snippet` is the part people miss. It is a button inside the Rank Math panel that
opens a small pop-up dialog. The SEO **title** and **description** boxes are *inside*
that pop-up, not on the panel itself. If you only see a preview box and no text fields,
you have not clicked Edit Snippet yet.

**SEO title:** inside the Edit Snippet pop-up, edit the **Title** field.

**Meta description:** inside the same pop-up, edit the **Description** field.

**Focus keyword:** close the pop-up. It is its own field on the General tab, directly
below the search preview, labeled **Focus Keyword**.

### The values to enter

| Field | Where | Value |
|---|---|---|
| Focus keyword | General tab, below the preview | `paycheck calculator` |
| SEO title | Edit Snippet pop-up → Title | `Paycheck Calculator - Estimate Your Take-Home Pay` |
| Meta description | Edit Snippet pop-up → Description | `Free US paycheck calculator. Estimate your take-home pay after federal income tax, FICA, and state income tax. Covers all 50 states and DC. No signup needed.` (157 characters) |

Paste each value exactly. Then click **Update** on the Page to save.

### The SEO title and the H1 are different things

Do not confuse them. The **SEO title** is the clickable blue link in Google results. The
**H1** is the visible heading on the page. The snippet already contains the H1
(`<h1>Paycheck Calculator</h1>`), so you do not create it here. Setting the SEO title
does not change the H1, and changing the H1 does not change the SEO title.

### If the Rank Math panel is missing

Check **Rank Math SEO → Dashboard** and confirm the page is not set to "No Index", and
that you are editing a Page (not a Post). Also check **Screen Options** at the top of
the editor — if Rank Math is unchecked there, the panel is hidden.

### Verify

After updating, open the live URL and view source. Search for `name="description"`. You
should see your sentence, not the form labels. Both the SEO title and description are
emitted into `<head>` by Rank Math, so viewing source is the ground truth.

---

## Step 4 — Load the engine

The engine is the JavaScript that makes the form calculate. Something has to load it on
the calculator page. There are two ways, and you only need one.

You do not have to choose now. The engine is **idempotent** — it refuses to mount twice —
so leaving both in place is harmless. Use the enqueue method (Option B) and ignore the
inline script if you like; nothing breaks.

### Option A — inline script (already done if you pasted the snippet)

`dist/wp/1-paycheck-calculator-page.html` ends with a small `<script type="module">`
block that imports the engine and mounts it. If you pasted that file in Step 3, this
already works. **Nothing more to do.**

**Risk:** WordPress's `wpautop` can inject `<p>` and `<br>` tags into an inline `<script>`,
breaking it. This is the single most likely failure point.

**Verify:** load the page, open the browser console (F12), and look for errors. Then click
"Calculate take-home pay" — you should see a dollar figure. If the form renders but
clicking does nothing, `wpautop` mangled the script. Use Option B instead, and delete the
`<script>` block from the Page body.

### Option B — enqueue via the PHP snippet (more robust)

The engine **auto-mounts itself** when it finds a `#paycheck-calculator` element, so no
inline script is needed. There is nothing for `wpautop` to mangle.

The same PHP file, `dist/wp/4-enqueue-snippet.php`, does two jobs:

| Block | What it does |
|---|---|
| 1. `wp_enqueue_scripts` | Loads the engine as a proper `<script type="module" src=...>` |
| 2. `wp_head` | Prints the `WebApplication` and `FAQPage` schema |

They are independent. You can use one, the other, or both.

#### Where to paste it — Code Snippets plugin

This is the easiest route and needs no file access.

1. In the WordPress admin, go to **Snippets → Add New**
2. Give it a name, e.g. `Paycheck calculator`
3. Set **"Run snippet everywhere"**. Do **not** use "Only run once" or an admin-only mode
4. In the code box, paste the contents of `dist/wp/4-enqueue-snippet.php`

**Do not include the `<?php` opening tag.** The Code Snippets plugin adds it for you. If
you paste `<?php` yourself, the snippet fails to save or throws an error. Copy from the
first `/**` comment onward.

5. Click **Save Changes and Activate**

The snippet contains its own `is_page( 'paycheck-calculator' )` guards, so the engine and
the schema load only on the calculator page. You do not need to configure any conditions
in the plugin.

**If your plugin is WPCode instead:** choose snippet type **PHP Snippet**, set the
location to **Run Everywhere**, and paste the code without the `<?php` tag. The plugin
adds it.

#### Where to paste it — child theme `functions.php`

Only if you prefer files over a plugin.

1. Create a child theme of GeneratePress if you do not already have one
2. Open `wp-content/themes/<child>/functions.php`
3. Paste the snippet contents **inside** the file, after any existing code
4. Do **not** add a `<?php` tag in the middle of the file — `functions.php` already has one
   at the top. Adding a second one is a fatal error

Never paste into the **parent** GeneratePress theme. A theme update deletes the file and
your calculator stops working.

#### Verify

1. Open the calculator page and click "Calculate take-home pay" — you should get a figure
2. View source (Ctrl+U) and search for `application/ld+json` — you should find **two**
   blocks, one `WebApplication` and one `FAQPage`
3. Open any other page and view source — you should find **neither**. If they appear
   everywhere, the `is_page` guard is not matching, which usually means the Page slug is
   not exactly `paycheck-calculator`

---

## Step 4b — Add structured data (schema)

If you used **Option B** above, this is already done — block 2 of the PHP snippet prints
the schema. Skip to Step 5.

If you are on Option A (inline script only) and do **not** want to add PHP, the fallback
is Rank Math. Note the limitation first: **Rank Math free cannot add custom schema.** Its
Custom Schema tab exists but prompts you to upgrade, and free allows only one schema type
per page. So on free, the PHP snippet is the only way to get `WebApplication` and
`FAQPage`. Rank Math already emits `BreadcrumbList` and `Article` by itself, which is why
neither appears in our schema files.

### If you have Rank Math PRO

1. Edit the calculator Page → **Rank Math SEO** panel → **Schema** tab
2. Set Schema Type to **None / Custom**
3. Paste `dist/wp/3a-schema-webapplication.jsonld` — save
4. Add a second custom schema, paste `dist/wp/3b-schema-faq.jsonld`

The two files are separate because free takes one type per page; PRO accepts both.

### Do not paste JSON-LD into the page body

The obvious-looking move is to add a `<script type="application/ld+json">` block to the
Page content. Don't. WordPress runs page content through `wpautop` and `wptexturize`,
which rewrite the quotes and insert `<br>` tags inside your JSON. The result is invalid
JSON-LD, and Google silently ignores it — no error, just no rich result. It must go
through a `wp_head` hook (the PHP snippet) or Rank Math's schema field.

### The FAQ must stay visible

The `FAQPage` markup requires that every question and answer also appears as visible text
on the page — markup describing content that isn't there is a structured-data violation
and can cost you rich results.

That's why `dist/wp/1-paycheck-calculator-page.html` ends with a visible
**Frequently asked questions** section. Both the section and the schema are generated from
one list in `tools/build.mjs`, so they cannot drift apart. If you edit the questions, edit
them there and rebuild rather than hand-editing either output — the PHP snippet's copy
must match the page word for word.

### Verify the schema landed

After publishing, run the URL through Google's
[Rich Results Test](https://search.google.com/test/rich-results). You should see
**WebApplication** and **FAQPage** detected. If it reports nothing, the JSON was almost
certainly mangled — re-check the placement.

---

## Step 5 — Add ads

Display-first monetization, per the PRD. Maximum two units:

- **Slot 1:** immediately after the `<h1>`, above the form
- **Slot 2:** immediately after the results `<section class="pc-result">`, below the breakdown table

Do not put an ad inside the form or between the inputs — it depresses completion and risks a policy flag on a page whose value is the tool itself.

---

## Step 6 — Internal linking

1. Edit the `/calculators` hub Page, add a link to `/finance/paycheck-calculator`
2. Add the same link to the footer menu or the main nav
3. Add links from related existing tool pages (e.g. the HELOC and Customer Lifetime Value
   calculators) back to the paycheck calculator

The intro paragraph in the bundle already covers step 3 of the old checklist — that is
what gives the page prose context for ranking.

### Known gap on the live site

As of this writing the calculator is reachable from `/finance/` and from the sitemap, but
it is **not** linked from the `/calculators` Page (id 2752), and it is not in the main nav.

Add a link on the `/calculators` Page. Link with an **absolute path**, not the full URL:

```html
<a href="/finance/paycheck-calculator">Paycheck Calculator</a>
```

**Do not** link to `https://afreetools.com/calculators/finance/paycheck-calculator`. That
URL does not exist — it would 404. `/calculators` is a Page, not a parent, so it does not
prefix child pages. Only the **Finance** Page (id 34721) is a parent, which is why the real
URL is `/finance/paycheck-calculator`.

Links 1 and 2 are the highest-value items left. An orphaned page ranks poorly no matter
how good the tool is.

---

## Step 7 — Verify

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
