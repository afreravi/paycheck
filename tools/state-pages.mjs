/**
 * Phase 2 state calculator pages.
 *
 * Each state is a real WordPress Page (server-rendered HTML) at
 * /finance/paycheck-calculator/<state>, NOT a JS route. This is deliberate:
 * Google dropped the FAQ rich result for pages whose visible FAQ changes after
 * load, and "one template cloned across 51 URLs" is scaled content abuse. Every
 * page here therefore carries content only true of that state, and the numbers
 * in the worked example come straight from the engine so copy cannot drift.
 *
 * Adding a state: append to STATE_PAGES with its own copy. Never reuse another
 * state's copy verbatim.
 */

export const STATE_PAGES = [
  {
    code: "US-TX",
    abbr: "tx",
    slug: "texas",
    name: "Texas",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: false,
    title: "Texas Paycheck Calculator - Take-Home Pay After Taxes",
    description:
      "Free Texas paycheck calculator. Texas has no state income tax, so estimate take-home pay after federal income tax, Social Security, and Medicare. 2026.",
    intro:
      "Estimate your take-home pay in Texas. Texas does not tax wage income, so the only " +
      "taxes withheld from a Texas paycheck are federal income tax, Social Security, and " +
      "Medicare. Enter your salary and pay frequency to see your net pay per period.",
    keyHeading: "Does Texas have a state income tax?",
    keyParagraphs: [
      "No. Texas is one of nine states that do not tax wage income, so nothing is withheld " +
        "for the state from a regular paycheck. The Texas Constitution (Article 8, Section " +
        "24-a) prohibits the Legislature from taxing individuals' net income, which is why " +
        "Texas has never had a state income tax.",
      "For a Texas employee the only paycheck taxes are the federal ones: federal income tax, " +
        "Social Security, and Medicare. The calculator on this page applies exactly those.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they lower the income that federal tax is charged on.",
      "<strong>Federal income tax.</strong> The standard deduction is applied, then the remaining income runs through the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the annual wage base) and Medicare at 1.45%, plus the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>State income tax: $0.</strong> Texas does not tax wage income, so this line is always zero.",
    ],
    compareParagraphs: [
      "Because Texas has no state income tax, a Texas paycheck keeps more than the same " +
        "salary earned in California or New York, where state income tax is withheld. Texas " +
        "belongs to the same group as Alaska, Florida, Nevada, New Hampshire, South Dakota, " +
        "Tennessee, Washington, and Wyoming.",
      "Texas also runs no state disability insurance (SDI) and no paid family leave payroll " +
        "tax, so there is no extra state deduction on top of the federal taxes.",
    ],
    faqs: [
      {
        q: "Does Texas have a state income tax?",
        a: "No. Texas does not tax wage income, so no state income tax is withheld from a Texas paycheck. Article 8, Section 24-a of the Texas Constitution prohibits the Legislature from imposing a tax on individuals' net income.",
      },
      {
        q: "Why is my Texas paycheck still taxed if there is no state income tax?",
        a: "Because federal taxes still apply. Federal income tax, Social Security (6.2%), and Medicare (1.45%) are withheld from every Texas paycheck. The absence of a state income tax removes only the state line, not the federal ones.",
      },
      {
        q: "Does Texas have a state disability or paid family leave payroll tax?",
        a: "No. Texas does not operate a state disability insurance (SDI) program or a state paid family leave program, so there is no state payroll deduction for either.",
      },
      {
        q: "Do Texas cities or counties charge a local income tax?",
        a: "No. Texas cities and counties do not levy a local income tax on wages. Local taxes in Texas are sales, property, and hotel taxes, none of which are withheld from a paycheck.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Texas?",
        a: "For 2026, a single filer paid biweekly takes home about $1,938.08 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $0.00 Texas state income tax.",
      },
      {
        q: "What taxes does Texas have instead of an income tax?",
        a: "Texas raises revenue mainly from sales and use tax, property taxes, and a franchise (margin) tax on businesses. None of these are withheld from an employee's paycheck.",
      },
      {
        q: "Do you have to file a Texas state tax return?",
        a: "No. Because Texas has no personal income tax, there is no Texas personal income tax return to file. Most Texas residents still file a federal return with the IRS.",
      },
    ],
    sources: [
      { label: "Texas Comptroller of Public Accounts — Taxes", url: "https://comptroller.texas.gov/taxes" },
      { label: "Texas Constitution, Article 8 (Section 24-a)", url: "https://statutes.capitol.texas.gov/Docs/CN/htm/CN.8.htm" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
];

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const money0 = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FILING_LABEL = {
  single: "single filer",
  mfj: "married couple filing jointly",
  mfs: "married person filing separately",
  hoh: "head of household",
};
const filingLabel = (f) => FILING_LABEL[f] ?? f;

/**
 * Renders one state page's paste-ready fragment and its schema nodes.
 * `ctx` supplies the shared css, the form template, and the engine functions.
 */
export function renderStatePage(cfg, ctx) {
  const { css, states, template, calculate, getFederal, getState, baseUrl } = ctx;

  const stateRec = states.find((s) => s.code === cfg.code);
  if (!stateRec) throw new Error(`state page ${cfg.slug}: ${cfg.code} missing from index.json`);

  const data = getState(cfg.code, cfg.example.tax_year);
  if (!data) throw new Error(`state page ${cfg.slug}: no tax data for ${cfg.code} ${cfg.example.tax_year}`);
  if (Boolean(data.no_income_tax) === Boolean(cfg.hasIncomeTax)) {
    throw new Error(
      `state page ${cfg.slug}: hasIncomeTax=${cfg.hasIncomeTax} disagrees with tax data ` +
        `(no_income_tax=${data.no_income_tax})`
    );
  }

  const r = calculate(
    {
      pay_type: "salary",
      annual_salary: cfg.example.salary,
      pay_frequency: cfg.example.pay_frequency,
      filing_status: cfg.example.filing_status,
      state: cfg.code,
    },
    { federal: getFederal(cfg.example.tax_year), state: data }
  );

  const url = `${baseUrl}/finance/paycheck-calculator/${cfg.slug}`;
  const formHtml = template(states, { selectedState: cfg.code });
  const freqLabel = { weekly: "Weekly", biweekly: "Bi-weekly", semimonthly: "Semi-monthly", monthly: "Monthly" }[
    cfg.example.pay_frequency
  ];

  const faqHtml = `<h2 class="wp-block-heading" id="faq">FAQ</h2>

<div id="rank-math-faq" class="rank-math-block">
<div class="rank-math-list ">
${cfg.faqs
  .map(
    (f, i) => `<div id="faq-question-${i + 1}" class="rank-math-list-item">
<h4 class="rank-math-question ">${esc(f.q)}</h4>
<div class="rank-math-answer ">

<p>${esc(f.a)}</p>

</div>
</div>`
  )
  .join("\n")}
</div>
</div>`;

  const exampleTable = `<table class="table table-sm table-striped">
<thead><tr><th>Line</th><th class="text-right">Per paycheck</th></tr></thead>
<tbody>
<tr><th>Gross pay</th><td class="text-right">${money(r.gross_per_period)}</td></tr>
<tr><th>Federal income tax</th><td class="text-right">${money(r.federal_income_tax)}</td></tr>
<tr><th>Social Security</th><td class="text-right">${money(r.social_security)}</td></tr>
<tr><th>Medicare</th><td class="text-right">${money(r.medicare)}</td></tr>
<tr><th>${cfg.name} state income tax</th><td class="text-right">${money(r.state_income_tax)}</td></tr>
<tr class="pc-total"><th>Net take-home pay</th><td class="text-right">${money(r.net_per_period)}</td></tr>
</tbody>
</table>`;

  const fragment = `<!-- Paste into the "${cfg.name}" Page body. Use the Code Editor, not the Visual editor.
     Parent Page: Paycheck Calculator  ->  this page's slug: ${cfg.slug}
     Resulting URL: ${url}

  Rank Math SEO fields to set on this Page:
    Focus keyword : ${cfg.name.toLowerCase()} paycheck calculator
    SEO title     : ${cfg.title}
    Meta description (${cfg.description.length} characters):
      ${cfg.description}

  Do not delete the opening paragraph. Search engines read it, and without it the
  meta description falls back to the first form labels.
-->
<style>
${css}
</style>

<p class="pc-intro">${cfg.intro}</p>

<div class="card shadow-sm border-0 mb-5" id="toolCard">
<div class="card-body p-4">

<h2 class="h6 font-weight-bold text-uppercase section-kicker mb-3">Your pay details</h2>

<div id="paycheck-calculator" class="pc-app" aria-label="${cfg.name} paycheck calculator">
${formHtml}
</div>

</div>
</div>

<h2 class="wp-block-heading" id="state-income-tax">${cfg.keyHeading}</h2>

${cfg.keyParagraphs.map((p) => `<p>${p}</p>`).join("\n\n")}

<h2 class="wp-block-heading" id="how-take-home-pay-is-calculated">How ${cfg.name} take-home pay is calculated</h2>

${cfg.hasIncomeTax ? "" : `<p>Because ${cfg.name} does not tax wage income, the calculation is shorter than in most states:</p>\n`}
<ol class="wp-block-list">
${cfg.calcSteps.map((s) => `<li>${s}</li>`).join("\n")}
</ol>

<p>The result is your net pay for the period you selected. Pay frequency matters: a biweekly schedule pays 26 times a year and a semi-monthly schedule 24, so the same salary produces different per-paycheck amounts.</p>

<h2 class="wp-block-heading" id="worked-example">Worked example: ${money0(cfg.example.salary)} in ${cfg.name}</h2>

<p>A ${filingLabel(cfg.example.filing_status)} earning ${money0(cfg.example.salary)} a year, paid ${freqLabel.toLowerCase()} in ${cfg.example.tax_year}:</p>

${exampleTable}

<p>That is ${money(r.net_annual)} a year, an effective tax rate of about ${(r.effective_rate * 100).toFixed(1)}%. Change the inputs in the calculator above to see your own numbers.</p>

<h2 class="wp-block-heading" id="how-it-compares">How ${cfg.name} compares</h2>

${cfg.compareParagraphs.map((p) => `<p>${p}</p>`).join("\n\n")}

${faqHtml}

<h2 class="wp-block-heading" id="sources">Sources and last updated</h2>

<p>This page covers tax years 2025 and 2026. State tax status is checked against the sources below; federal brackets, the standard deduction, and FICA rates come from the IRS. Tax data last verified ${data.last_verified}.</p>

<ul class="wp-block-list">
${cfg.sources.map((s) => `<li><a href="${s.url}">${s.label}</a></li>`).join("\n")}
</ul>

<h2 class="wp-block-heading" id="related-tools">Related tools</h2>

<ul class="wp-block-list">
<li><a href="/finance/paycheck-calculator">Paycheck Calculator</a> &mdash; the national calculator, pre-set to any state.</li>
<li><a href="/finance/">Money &amp; Pay Calculators</a> &mdash; the rest of the finance hub.</li>
</ul>

<script type="module">
  import { mountCalculator } from "/wp-content/uploads/tools/paycheck-engine.js";
  mountCalculator(document.getElementById("paycheck-calculator"));
</script>
`;

  const webapp = {
    "@type": "WebApplication",
    name: `${cfg.name} Paycheck Calculator`,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: cfg.description,
  };

  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: cfg.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return { fragment, webapp, faqSchema, url, example: r };
}

/**
 * Renders the enqueue + structured-data snippet for one state page.
 * The national snippet guards on is_page('paycheck-calculator') and so does not
 * run here; each state page needs its own guard and its own WebApplication.
 */
export function renderStateSnippet(cfg, webapp) {
  // Single-quoted PHP strings: escape backslash then single quote.
  const phpStr = (s) => `'${String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

  return `<?php
/**
 * ${cfg.name} paycheck calculator: load the engine and add structured data.
 *
 * Same two jobs as the national snippet, but guarded to the ${cfg.name} Page.
 * Paste from the "/**" line below, NOT the "<?php" line (Code Snippets plugin
 * adds the opening tag itself). Deleting block 1 keeps the page making no
 * structured-data claim; deleting block 2 keeps the calculator unloaded.
 */

/**
 * 1. Load the engine on the ${cfg.name} Page only.
 */
add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( '${cfg.slug}' ) ) {
        return;
    }

    // Same handle as the national snippet, so WordPress prints it once if both
    // are active. Bump the version after re-uploading the engine.
    wp_enqueue_script_module(
        'paycheck-engine',
        content_url( '/uploads/tools/paycheck-engine.js' ),
        array(),
        '1.0.0'
    );
} );

/**
 * 2. Add WebApplication structured data for the ${cfg.name} Page.
 *
 * Rank Math free emits the FAQPage from the visible FAQ block; we only add the
 * one type it cannot, and only on this Page.
 */
add_action( 'wp_head', function () {
    if ( ! is_page( '${cfg.slug}' ) ) {
        return;
    }

    $webapp = array(
        '@context'             => 'https://schema.org',
        '@type'                => 'WebApplication',
        'name'                 => ${phpStr(webapp.name)},
        'url'                  => ${phpStr(webapp.url)},
        'applicationCategory'  => 'FinanceApplication',
        'operatingSystem'      => 'All',
        'browserRequirements'  => 'Requires JavaScript',
        'offers'               => array(
            '@type'         => 'Offer',
            'price'         => '0',
            'priceCurrency' => 'USD',
        ),
        'description'          => ${phpStr(webapp.description)},
    );

    printf(
        '<script type="application/ld+json">%s</script>' . "\\n",
        wp_json_encode( $webapp, JSON_UNESCAPED_SLASHES )
    );
} );
`;
}

export { money };
