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
  {
    code: "US-CA",
    abbr: "ca",
    slug: "california",
    name: "California",
    example: { salary: 75000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: true,
    title: "California Paycheck Calculator - Take-Home Pay After CA Tax",
    description:
      "Free California paycheck calculator. Estimate take-home pay after California income tax, SDI, federal income tax, Social Security, and Medicare for 2026.",
    intro:
      "Estimate your take-home pay in California. California taxes wage income on a " +
      "graduated scale and withholds State Disability Insurance on top of that income " +
      "tax, so a California paycheck carries a state deduction that the no-tax states " +
      "never see. Enter your salary and pay frequency to see your net pay per period.",
    keyHeading: "Does California have a state income tax?",
    keyParagraphs: [
      "Yes. California taxes wage income through nine graduated brackets set in Revenue " +
        "and Taxation Code section 17041. For a single filer the schedule starts at 1% on " +
        "the first $11,079 of taxable income and climbs to a 12.3% top rate; taxable income " +
        "above $1 million also pays the 1% Mental Health Services Tax, bringing the top " +
        "combined marginal rate to 13.3%. There is no zero-tax option the way there is in " +
        "Texas or Florida.",
      "The calculator on this page applies a simplified three-band version of that " +
        "schedule: 1%, 7.15%, and 13.3%. It uses the California standard deduction " +
        "($5,540 for a single filer in the 2026 data) and adds no local income tax, because " +
        "California cities and counties do not levy a tax on wages. Your employer withholds " +
        "using the FTB's own schedules, so treat the figure here as a close estimate.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they shrink the income that California and federal tax are charged on.",
      "<strong>California income tax.</strong> The state standard deduction is subtracted, then the remaining income runs through California's graduated rates, which reach 12.3% (13.3% with the mental health tax above $1 million).",
      "<strong>Federal income tax.</strong> The federal standard deduction is applied, then the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the wage base) and Medicare at 1.45%, plus the 0.9% additional Medicare tax above the high-earner threshold.",
      "<strong>California SDI.</strong> A separate state payroll tax of 1.3% in 2026, withheld from every dollar of wages with no cap. It funds Disability Insurance and Paid Family Leave and is not yet subtracted by this calculator.",
    ],
    compareParagraphs: [
      "Because California levies one of the highest state income taxes in the country, the " +
        "same salary nets noticeably less in California than in a state with no wage tax " +
        "such as Texas, Florida, Washington, or Nevada. California's graduated rates are " +
        "also steeper at the top than flat-tax states like Pennsylvania (3.07%) or " +
        "Illinois (4.95%).",
      "Unusually for a high-tax state, California adds no city or county income tax on top " +
        "of its state rate, so San Francisco and Los Angeles employees do not face a local " +
        "wage tax the way New York City or Philadelphia workers do. The state does, " +
        "however, withhold SDI at 1.3% on all wages, a payroll tax that has no wage cap " +
        "since 2024.",
    ],
    faqs: [
      {
        q: "Does California have a state income tax?",
        a: "Yes. California taxes wage income on nine graduated brackets under Revenue and Taxation Code section 17041, starting at 1% and topping out at 12.3%, with an extra 1% Mental Health Services Tax on taxable income above $1 million.",
      },
      {
        q: "How much is taken out of a $75,000 salary in California?",
        a: "For 2026, a single filer paid biweekly takes home about $2,213.41 per paycheck from a $75,000 salary: $2,884.62 gross, $155.53 California income tax, $295.00 federal income tax, $178.85 Social Security, and $41.83 Medicare. California SDI of 1.3% (about $37.50) comes out on top of that.",
      },
      {
        q: "What is the California SDI tax rate for 2026?",
        a: "California withholds State Disability Insurance at 1.3% for 2026. Since January 1, 2024, there is no wage cap, so SDI applies to all of an employee's wages. SDI funds both Disability Insurance and Paid Family Leave.",
      },
      {
        q: "Do California cities or counties charge a local income tax on wages?",
        a: "No. California cities and counties do not levy a local income tax on wages, so there is no city wage tax like those in New York City or Philadelphia. Local revenue in California comes from sales and property taxes instead.",
      },
      {
        q: "What is the top California income tax rate?",
        a: "California's top marginal income tax rate is 12.3%, reached on taxable income above $742,953 for a single filer. Taxable income above $1 million also pays the 1% Mental Health Services Tax, making the effective top marginal rate 13.3%.",
      },
      {
        q: "Does California have a standard deduction on its income tax?",
        a: "Yes. California allows a standard deduction instead of itemized deductions. The 2026 data used here shows $5,540 for a single filer. There are no personal exemptions for most filers; a dependent exemption credit applies instead.",
      },
      {
        q: "What form does a California employee file for state withholding?",
        a: "A California employee files Form DE 4 with their employer to set state income tax withholding. Since 2020 the form uses dollar amounts rather than withholding allowances, and it is separate from the federal Form W-4.",
      },
      {
        q: "Is paid family leave a separate deduction on a California paycheck?",
        a: "No. California Paid Family Leave (PFL) is funded by the SDI tax, so there is no separate PFL deduction. The single 1.3% SDI line on the paycheck covers both Disability Insurance and Paid Family Leave.",
      },
    ],
    sources: [
      { label: "California Franchise Tax Board — 2025 California Tax Rate Schedules", url: "https://www.ftb.ca.gov/forms/2025/2025-540-tax-rate-schedules.pdf" },
      { label: "California EDD — Contribution Rates, Withholding Schedules, and Meals and Lodging Values", url: "https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-NY",
    abbr: "ny",
    slug: "new-york",
    name: "New York",
    example: { salary: 85000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: true,
    title: "New York Paycheck Calculator - Take-Home Pay After NY Tax",
    description:
      "Free New York paycheck calculator. Estimate take-home pay after New York State income tax, NYC or Yonkers local tax, Paid Family Leave, and federal taxes for 2026.",
    intro:
      "Estimate your take-home pay in New York. New York State taxes wage income on a " +
      "graduated schedule, and New York City and Yonkers then add a local income tax on " +
      "top of the state figure, so where you live changes a New York paycheck as much as " +
      "what you earn. Enter your salary and pay frequency to see your net pay per period.",
    keyHeading: "Does New York have a state income tax?",
    keyParagraphs: [
      "Yes. New York State taxes wage income on a graduated scale that climbs with " +
        "earnings. For a single filer the marginal rate steps up through the schedule and " +
        "reaches a 10.9% top rate, well above the flat rates charged by Pennsylvania " +
        "(3.07%) or Illinois (4.95%). The 2026 data behind this calculator approximates " +
        "that scale with three bands&mdash;4%, 7.45%, and 10.9%&mdash;and applies the " +
        "$8,000 New York standard deduction for a single filer, so read the New York State " +
        "line here as a close estimate rather than a payroll-system figure.",
      "New York is also unusual in stacking a local income tax on the state one. A New " +
        "York City resident pays the NYC resident income tax on a separate schedule, and a " +
        "Yonkers resident pays a surcharge calculated from the state tax itself. The " +
        "calculator on this page computes the New York State line only, so treat its net " +
        "figure as the state-and-federal estimate before any city or Yonkers tax.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they reduce the income that New York State and federal tax are charged on.",
      "<strong>New York State income tax.</strong> The $8,000 New York standard deduction is subtracted (single filer), then the remaining income runs through the state's graduated rates, which reach 10.9% at the top.",
      "<strong>Federal income tax.</strong> The federal standard deduction is applied, then the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the wage base) and Medicare at 1.45%, plus the 0.9% additional Medicare tax above the high-earner threshold.",
      "<strong>New York City or Yonkers local tax.</strong> A NYC resident pays the NYC resident income tax on a schedule running from 3.078% to 3.876%; a Yonkers resident pays a 16.75% surcharge on the state tax. This calculator does not subtract either one, so your actual net is lower if you live in those places.",
      "<strong>New York Paid Family Leave.</strong> An employee-funded payroll deduction of 0.432% of gross wages for 2026, capped at $411.91 for the year. It funds up to 12 weeks of leave at 67% of your average weekly wage and is not subtracted by this calculator.",
    ],
    compareParagraphs: [
      "Local income tax is what sets New York apart from nearly every other state page " +
        "here. A New York City resident pays the NYC resident income tax on a schedule " +
        "that runs from 3.078% on the first dollars to 3.876% on income above $90,000 " +
        "(single filer), in addition to the state tax. A Yonkers resident instead pays a " +
        "16.75% surcharge on the New York State tax, and someone who works in Yonkers but " +
        "lives elsewhere may owe the Yonkers nonresident earnings tax. None of Alaska, " +
        "Florida, Texas, or Washington has anything comparable.",
      "New York also withholds for paid leave, which the no-income-tax states do not. The " +
        "2026 Paid Family Leave deduction is 0.432% of gross wages up to $411.91 a year, " +
        "and New York's statutory short-term disability program adds an employee " +
        "contribution capped at $0.60 per week. Against flat-tax Pennsylvania (3.07%) or " +
        "Illinois (4.95%), New York's graduated state rate plus a city or Yonkers tax is " +
        "the difference between a modest and a heavy state deduction at the same salary.",
    ],
    faqs: [
      {
        q: "Does New York have a state income tax?",
        a: "Yes. New York State taxes wage income on a graduated schedule whose marginal rate rises with income and tops out at 10.9%. The 2026 data used here approximates the scale with 4%, 7.45%, and 10.9% bands and applies the $8,000 New York standard deduction for a single filer.",
      },
      {
        q: "How much is taken out of an $85,000 salary in New York?",
        a: "For 2026, a single filer paid biweekly takes home about $2,438.79 per paycheck from an $85,000 salary: $3,269.23 gross, $200.73 New York State income tax, $379.62 federal income tax, $202.69 Social Security, and $47.40 Medicare. A New York City or Yonkers resident owes additional local tax on top of that, and the Paid Family Leave deduction comes out as well.",
      },
      {
        q: "Does New York City charge its own income tax?",
        a: "Yes. New York City residents pay the NYC resident income tax in addition to the state tax. For a single filer the 2025 schedule starts at 3.078% on the first $12,000 of taxable income and rises to 3.876% above $50,000. Part-year NYC residents and NYC nonresidents who work in the city can also owe tax on city wages.",
      },
      {
        q: "What is the Yonkers income tax?",
        a: "A Yonkers resident pays an income tax surcharge equal to 16.75% of the New York State tax after credits. A person who works in Yonkers but lives outside the city may instead owe the Yonkers nonresident earnings tax on wages earned there. Both are separate from the New York State income tax.",
      },
      {
        q: "What is the New York Paid Family Leave deduction for 2026?",
        a: "For 2026 the employee Paid Family Leave contribution is 0.432% of gross wages, capped at a maximum annual contribution of $411.91. New York Paid Family Leave is fully funded by employees and provides up to 12 weeks of job-protected leave at 67% of your average weekly wage, capped at $1,228.53 per week.",
      },
      {
        q: "Does New York deduct disability insurance from a paycheck?",
        a: "Yes. New York's statutory short-term disability benefits (DBL) program allows an employee contribution of up to $0.60 per week, separate from the Paid Family Leave deduction. It is a small, fixed weekly amount rather than a percentage of wages.",
      },
      {
        q: "What is the top New York income tax rate?",
        a: "The top New York State marginal income tax rate is 10.9%, reached on the highest taxable incomes for a single filer. Because the state uses graduated brackets, most of a typical New York salary is taxed at lower rates, not at 10.9%.",
      },
      {
        q: "How much is the New York standard deduction?",
        a: "For 2026 the New York standard deduction is $8,000 for a single filer. It is subtracted from wages before the graduated state rates are applied. New York also allows a dependent exemption credit but no personal exemption for most filers.",
      },
    ],
    sources: [
      { label: "New York State Department of Taxation and Finance — Income tax rates and tables", url: "https://www.tax.ny.gov/pit/file/tax-tables/" },
      { label: "New York State Tax — Instructions for Form IT-201 (NYC and Yonkers tax schedules)", url: "https://www.tax.ny.gov/pdf/2025/inc/it201i_2025.pdf" },
      { label: "New York Paid Family Leave — What's new for 2026", url: "https://paidfamilyleave.ny.gov/2026" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-FL",
    abbr: "fl",
    slug: "florida",
    name: "Florida",
    example: { salary: 55000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: false,
    title: "Florida Paycheck Calculator - Take-Home Pay After Taxes",
    description:
      "Free Florida paycheck calculator. Florida has no state income tax, so estimate take-home pay after federal income tax, Social Security, and Medicare. 2026.",
    intro:
      "Work out your take-home pay in Florida. The Sunshine State levies no income tax on " +
      "wages, so a Florida paycheck is reduced only by the federal withholdings: federal " +
      "income tax, Social Security, and Medicare. Put in your salary and pay frequency to " +
      "see what lands in your account each period.",
    keyHeading: "Does Florida have a state income tax?",
    keyParagraphs: [
      "No. Florida collects no income tax from wage earners. The state constitution is the " +
        "reason: Article VII, Section 5(a) forbids the state from levying a tax on the income " +
        "of natural persons, a prohibition that has stood since it was adopted in 1971. Among " +
        "the states that skip a wage tax, Florida is one of the most populous.",
      "What does come out of a Florida paycheck is entirely federal: income tax under the " +
        "IRS brackets, Social Security at 6.2%, and Medicare at 1.45%. There is no state " +
        "line to add. The calculator above models precisely those three.",
    ],
    calcSteps: [
      "<strong>Start from gross wages.</strong> Turn your annual salary, or an hourly rate times hours, into the amount for one pay period.",
      "<strong>Subtract pre-tax benefits.</strong> A 401(k), HSA, or health premium is taken out before tax, which lowers the wages that federal income tax is figured on.",
      "<strong>Work out federal income tax.</strong> The standard deduction comes off first, then the rest is taxed through the federal marginal brackets.",
      "<strong>Add FICA.</strong> Social Security at 6.2% up to the annual wage base and Medicare at 1.45%, with the extra 0.9% Medicare surtax above the high-earner threshold.",
      "<strong>State income tax stays at zero.</strong> Florida takes nothing from the paycheck for income tax, so this line never moves.",
    ],
    compareParagraphs: [
      "A Florida salary stretches further than the same salary in a state that taxes wages. " +
        "Set beside California, New York, or New Jersey, a Florida paycheck keeps the state " +
        "share those workers surrender. Florida shares this trait with Alaska, Nevada, New " +
        "Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.",
      "Florida also withholds nothing for a state disability or paid family leave program. " +
        "The state runs unemployment compensation (Reemployment Assistance), but that is an " +
        "employer tax, not an employee deduction, so it never appears on a worker's stub.",
    ],
    faqs: [
      {
        q: "Does Florida have a state income tax?",
        a: "No. Florida does not tax personal income, so no state income tax is withheld from a paycheck. Article VII, Section 5(a) of the Florida Constitution bars the state from taxing the income of natural persons.",
      },
      {
        q: "If Florida has no income tax, why is my paycheck still taxed?",
        a: "Federal taxes still apply everywhere. A Florida paycheck has federal income tax, Social Security at 6.2%, and Medicare at 1.45% withheld. Dropping the state income tax removes only the state line.",
      },
      {
        q: "Does Florida take money out for disability or paid family leave?",
        a: "No. Florida has no state disability insurance program and no state paid family leave payroll tax, so neither is deducted from a Florida paycheck. There is no employee-funded state leave program to contribute to.",
      },
      {
        q: "Do Florida counties or cities add a local income tax?",
        a: "No. No Florida county or city levies an income tax on wages. Local revenue comes from property taxes and discretionary sales surtaxes, which are collected at the register or on property, not withheld from pay.",
      },
      {
        q: "How much is taken out of a $55,000 salary in Florida?",
        a: "For 2026, a single filer paid biweekly takes home about $1,783.56 per paycheck from a $55,000 salary: $2,115.38 gross, $170.00 federal income tax, $131.15 Social Security, $30.67 Medicare, and $0.00 Florida state income tax.",
      },
      {
        q: "How does Florida raise revenue without an income tax?",
        a: "Florida leans on a 6% state sales tax plus county surtaxes, property taxes, a corporate income tax on businesses, and documentary stamp taxes. None of those is withheld from an employee's wages.",
      },
      {
        q: "Does a Florida resident file a state income tax return?",
        a: "No. Since Florida has no personal income tax, there is no state income tax return to file. Florida residents normally still file a federal return with the IRS each year.",
      },
      {
        q: "Where can I check Florida's tax rates?",
        a: "The Florida Department of Revenue publishes the state's sales, corporate income, and other tax rates. Florida's individual income tax status is set by the state constitution rather than by an annual rate schedule.",
      },
    ],
    sources: [
      { label: "Florida Department of Revenue — Taxes and Fees", url: "https://floridarevenue.com/taxes/taxesfees/Pages/default.aspx" },
      { label: "Florida Constitution, Article VII (Section 5)", url: "https://www.flsenate.gov/Laws/Constitution" },
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-10-02" -> "October 02, 2026" (matches the national page's date style). */
const formatDate = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${d}, ${y}`;
};

// Maps the tax-data `verified_by` field to the byline shown on the page.
const REVIEWED_BY_LABEL = {
  "data-owner": "aFreeTools Editorial Team",
};
const DEFAULT_REVIEWED_BY = "aFreeTools Editorial Team";

// One wording for every state page, matching the national calculator's disclaimer.
const DISCLAIMER =
  "This paycheck calculator is for informational and planning purposes only. It provides " +
  "an estimate of take-home pay based on the information you enter and standard " +
  "federal/state tax assumptions, but actual pay can vary due to local taxes, benefits, " +
  "deductions, withholding elections, payroll rules, and employer-specific factors. " +
  "Results are not a guarantee of wages, tax liability, or net pay and should not be " +
  "considered tax, legal, accounting, or financial advice. Please verify final amounts " +
  "with your employer&rsquo;s payroll system or a qualified tax professional.";

/**
 * Review/date/disclaimer footer every state page carries. The dates come from the
 * state's tax-data file (`last_verified`, `verified_by`), so they cannot drift from
 * the sources cited above.
 */
function renderReviewFooter(data) {
  const reviewedBy = REVIEWED_BY_LABEL[data.verified_by] ?? DEFAULT_REVIEWED_BY;
  const lastUpdated = formatDate(data.last_verified);
  return `<div class="gb-container gb-container-b53f53f1">

<p><strong>Reviewed by:</strong> ${reviewedBy}</p>

<p><strong>Last updated:</strong> ${lastUpdated}</p>

<p class="mb-0"><strong>Freshness:</strong> The page&rsquo;s content and sources were last reviewed ${lastUpdated}. Check related guidance and pay stub for situations that will require an exact withholding amount.</p>

</div>

<hr class="wp-block-separator has-text-color has-global-color-17-color has-alpha-channel-opacity has-global-color-17-background-color has-background is-style-default p-0"/>

<section class="wp-block-group has-global-color-17-background-color has-background"><div class="wp-block-group__inner-container is-layout-constrained wp-block-group-is-layout-constrained">
<p class="mb-0"><strong>Disclaimer:</strong> ${DISCLAIMER}</p>
</div></section>`;
}


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

${renderReviewFooter(data)}
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
 * Renders the enqueue + structured-data snippet for all state pages at once.
 *
 * One snippet, guarded by a slug registry, so adding a state is a one-file
 * change (STATE_PAGES in this module) rather than a new snippet per state. The
 * national snippet guards on is_page('paycheck-calculator') and does not run
 * here; each state page gets its own guard entry and its own WebApplication.
 */
export function renderCombinedStateSnippet(entries) {
  // Single-quoted PHP strings: escape backslash then single quote.
  const phpStr = (s) => `'${String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

  const mapRows = entries
    .map(
      (e) => `        ${phpStr(e.slug)} => array(
            'name'        => ${phpStr(e.name)},
            'url'         => ${phpStr(e.url)},
            'description' => ${phpStr(e.description)},
        ),`
    )
    .join("\n");

  const slugs = entries.map((e) => phpStr(e.slug)).join(", ");
  const stateWord = entries.length === 1 ? "state" : "states";

  return `<?php
/**
 * Paycheck calculator ${stateWord}: load the engine and add structured data.
 *
 * Same two jobs as the national snippet, but guarded to the registered state
 * Pages. One snippet covers every state page; add a state by adding one entry to
 * state_paycheck_pages() below (generated from tools/state-pages.mjs).
 *
 * Paste from the "/**" line below, NOT the "<?php" line (Code Snippets plugin
 * adds the opening tag itself). Deleting block 1 keeps the pages making no
 * structured-data claim; deleting block 2 keeps the calculators unloaded.
 */

/**
 * State page registry. Slug => name / canonical url / schema description.
 * Generated by tools/build.mjs; edit STATE_PAGES in tools/state-pages.mjs and
 * rebuild rather than editing this by hand.
 */
function state_paycheck_pages() {
    return array(
${mapRows}
    );
}

/**
 * Slug of the current Page when it is a registered state page, else ''.
 * The is_page() guard keeps this off every non-state URL, including the
 * national calculator page and unrelated pages.
 */
function state_paycheck_current_page() {
    if ( ! is_page( array( ${slugs} ) ) ) {
        return '';
    }
    return (string) get_post_field( 'post_name', get_queried_object_id() );
}

/**
 * 1. Load the engine on the registered state Pages only.
 */
add_action( 'wp_enqueue_scripts', function () {
    if ( '' === state_paycheck_current_page() ) {
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
 * 2. Add WebApplication structured data for the current state Page.
 *
 * Rank Math free emits the FAQPage from the visible FAQ block; we only add the
 * one type it cannot, and only on a registered state Page.
 */
add_action( 'wp_head', function () {
    $slug = state_paycheck_current_page();
    if ( '' === $slug ) {
        return;
    }

    $pages = state_paycheck_pages();
    if ( ! isset( $pages[ $slug ] ) ) {
        return;
    }
    $page = $pages[ $slug ];

    $webapp = array(
        '@context'             => 'https://schema.org',
        '@type'                => 'WebApplication',
        'name'                 => $page['name'],
        'url'                  => $page['url'],
        'applicationCategory'  => 'FinanceApplication',
        'operatingSystem'      => 'All',
        'browserRequirements'  => 'Requires JavaScript',
        'offers'               => array(
            '@type'         => 'Offer',
            'price'         => '0',
            'priceCurrency' => 'USD',
        ),
        'description'          => $page['description'],
    );

    printf(
        '<script type="application/ld+json">%s</script>' . "\\n",
        wp_json_encode( $webapp, JSON_UNESCAPED_SLASHES )
    );
} );
`;
}

export { money };
