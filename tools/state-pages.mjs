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
  {
    code: "US-PA",
    abbr: "pa",
    slug: "pennsylvania",
    name: "Pennsylvania",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: true,
    title: "Pennsylvania Paycheck Calculator - Take-Home Pay After Taxes",
    description:
      "Free Pennsylvania paycheck calculator. Estimate take-home pay after the 3.07% flat state income tax, local earned income tax, and federal withholdings. 2026.",
    intro:
      "Figure out what a Pennsylvania paycheck is worth after tax. The Commonwealth charges " +
      "a single flat rate on wage income, and most workers also pay a local earned income " +
      "tax that their county, city, or school district sets. Enter your salary and pay " +
      "frequency to see the federal, state, and local pieces that come out of each period.",
    keyHeading: "How does Pennsylvania tax a paycheck?",
    keyParagraphs: [
      "Pennsylvania taxes wages at one flat rate: 3.07%. There are no brackets and no " +
        "high-income surcharge, so every dollar of taxable pay meets the same rate. The " +
        "state grants no standard deduction, though a personal exemption is available to " +
        "taxpayers 65 and older, widows and widowers, and the blind. The flat structure " +
        "follows the uniformity clause in Article VIII, Section 1 of the Pennsylvania " +
        "Constitution, and the rate is set by the Tax Reform Code of 1971.",
      "On top of the state rate, Pennsylvania is one of the states with a local income " +
        "tax. Act 32 of 2008 consolidated collection into county tax collection districts. " +
        "The local earned income tax is typically up to 1% shared between the municipality " +
        "and the school district, and the employer withholds it based on where you live and " +
        "where you work. The two biggest exceptions charge more, which is why the calculator " +
        "here models the state and federal lines and leaves your local rate to your own " +
        "district's notice.",
    ],
    calcSteps: [
      "<strong>Start from gross wages.</strong> Turn your annual salary, or an hourly rate times hours, into the amount for one pay period.",
      "<strong>Subtract pre-tax benefits.</strong> A traditional 401(k), HSA, or health premium lowers the wages that federal income tax is figured on.",
      "<strong>Work out federal income tax.</strong> The federal standard deduction comes off first, then the rest is taxed through the federal marginal brackets.",
      "<strong>Add FICA.</strong> Social Security at 6.2% up to the annual wage base and Medicare at 1.45%, plus the extra 0.9% Medicare surtax above the high-earner threshold.",
      "<strong>Charge the flat state rate.</strong> Pennsylvania takes 3.07% of taxable wages with no bracket table, so the state deduction scales evenly with pay.",
      "<strong>Account for local earned income tax.</strong> Your municipality or school district withholds its own rate through the Act 32 tax collection district, most often up to 1%.",
    ],
    compareParagraphs: [
      "Pennsylvania sits in the middle of the pack. Its 3.07% flat rate is lower than the " +
        "top brackets in California or New Jersey, but Pennsylvania adds a local earned " +
        "income tax that fills in the difference, and Philadelphia's wage tax is among the " +
        "highest city income taxes in the country. A worker there can face a combined local " +
        "rate near 3.74% on top of the state's 3.07%.",
      "Unlike California or New Jersey, Pennsylvania runs no state disability insurance and " +
        "no paid family leave payroll deduction. Nothing is withheld from a Pennsylvania " +
        "paycheck for a state leave program. The state's unemployment compensation is funded " +
        "by employer contributions, not employee withholding, so it never appears on a stub.",
    ],
    faqs: [
      {
        q: "What is the Pennsylvania state income tax rate?",
        a: "Pennsylvania taxes wage income at a flat 3.07%. There are no marginal brackets, so the same rate applies to every dollar of taxable pay regardless of how much you earn.",
      },
      {
        q: "Does Pennsylvania have a local income tax?",
        a: "Yes. Most Pennsylvania municipalities and school districts levy a local earned income tax, collected through county tax collection districts created by Act 32 of 2008. The rate is commonly up to 1% and depends on where you live and work.",
      },
      {
        q: "How much is the Philadelphia wage tax?",
        a: "For tax year 2026, Philadelphia withholds 3.735% from resident wages and 3.425% from non-residents who work in the city. Rates stepped down under a five-year reduction schedule. Taxpayers who qualify for PA tax forgiveness pay a reduced 1.5% rate.",
      },
      {
        q: "Does Pennsylvania have disability or paid family leave withholding?",
        a: "No. Pennsylvania has no state disability insurance program and no paid family leave payroll tax, so neither is deducted from a paycheck. The state's unemployment compensation is an employer-paid tax, not an employee deduction.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Pennsylvania?",
        a: "For 2026, a single filer paid biweekly takes home about $1,867.23 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $70.85 Pennsylvania state income tax. Local earned income tax is separate.",
      },
      {
        q: "Does Pennsylvania offer a standard deduction?",
        a: "No. Pennsylvania's personal income tax has no standard deduction. A personal exemption exists only for taxpayers who are 65 or older, widows and widowers, or blind, and a separate deduction can apply for dependent children under 18.",
      },
      {
        q: "Why is Pennsylvania's income tax called uniform?",
        a: "Article VIII, Section 1 of the Pennsylvania Constitution requires taxes on income to be uniform, which is the basis for the single flat 3.07% rate rather than graduated brackets. The rate itself is set by the Tax Reform Code of 1971.",
      },
      {
        q: "Where can I check Pennsylvania's tax rates?",
        a: "The Pennsylvania Department of Revenue publishes the personal income tax rate and guidance at revenue.pa.gov. For local earned income tax rates, the Department of Community and Economic Development maintains the register of Act 32 tax collection districts.",
      },
    ],
    sources: [
      { label: "Pennsylvania Department of Revenue — Personal Income Tax", url: "https://www.pa.gov/agencies/revenue/resources/tax-types-and-information/personal-income-tax.html" },
      { label: "Pennsylvania Constitution, Article VIII, Section 1", url: "https://www.pacourts.us/Storage/media/pdfs/20210116/155332-file-5092.pdf" },
      { label: "City of Philadelphia — Wage Tax for employers", url: "https://www.phila.gov/services/payments-assistance-taxes/taxes/business-taxes/business-taxes-by-type/wage-tax-employers/" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-OH",
    abbr: "oh",
    slug: "ohio",
    name: "Ohio",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the state's revenue authority.
    hasIncomeTax: true,
    title: "Ohio Paycheck Calculator - Take-Home Pay After Ohio Tax",
    description:
      "Free Ohio paycheck calculator. Estimate take-home pay after Ohio's flat 2.75% state tax, local municipal income tax, and federal withholdings for 2026.",
    intro:
      "Work out what an Ohio paycheck is worth after tax. Ohio taxes wages at a single " +
      "flat rate for 2026, and most Ohio workers also pay a municipal income tax that " +
      "their city sets and their employer withholds. Enter your salary and pay frequency " +
      "to see the federal and state pieces that come out of each period.",
    keyHeading: "How does Ohio tax a paycheck?",
    keyParagraphs: [
      "Ohio does tax wage income, and for 2026 it does so at one flat rate. House Bill 96 " +
        "collapsed Ohio's graduated schedule into a single 2.75% rate on Ohio taxable income " +
        "above $26,050, for tax years beginning in 2026 under Ohio Revised Code section " +
        "5747.02(c). The $26,050 figure acts like a zero-rate bracket, and a personal " +
        "exemption for the taxpayer, spouse, and each dependent comes off first under section " +
        "5747.025. The state's former top bracket of 3.5% no longer applies.",
      "The calculator on this page applies the simplified three-band schedule stored in this " +
        "site's shared state dataset: 2.75% up to $15,000, 3.125% to $100,000, and 3.5% " +
        "above that, with no threshold and no exemption. That model does not reproduce " +
        "Ohio's $26,050 zero-tax bracket, so it can overstate the state line for lower and " +
        "middle incomes. Treat the result as a conservative estimate and check Ohio's own " +
        "withholding tables for an exact figure.",
      "Ohio is also one of the few states where cities levy their own income tax on wages. " +
        "Ohio Revised Code Chapter 718 authorizes municipal income taxes, and most Ohio " +
        "cities charge between 1.5% and 2.5% — Columbus and Cleveland 2.5%, Cincinnati " +
        "1.8%. The tax is withheld for the city where you work; if you live in a different " +
        "city, your home city generally allows a credit for tax paid to the work city. The " +
        "Regional Income Tax Agency (RITA) administers the tax for many municipalities. This " +
        "calculator does not subtract a local amount, so remove your own city's rate for a " +
        "full picture.",
    ],
    calcSteps: [
      "<strong>Start from gross pay.</strong> Convert your salary, or an hourly rate times hours, into the amount for one pay period.",
      "<strong>Subtract pre-tax benefits.</strong> A traditional 401(k), HSA, or health premium lowers the wages that federal and Ohio income tax are charged on.",
      "<strong>Figure federal income tax.</strong> The federal standard deduction comes off first, then the remaining income runs through the federal marginal brackets.",
      "<strong>Add FICA.</strong> Social Security at 6.2% up to the annual wage base and Medicare at 1.45%, plus the 0.9% additional Medicare tax above the high-earner threshold.",
      "<strong>Apply Ohio income tax.</strong> Ohio's 2026 law is a flat 2.75% above a $26,050 threshold; this calculator instead uses the shared dataset's three-band approximation, which has no threshold.",
      "<strong>Leave out the local tax.</strong> Ohio municipal income tax is withheld for the city where you work and is not included here, so a city resident's real take-home will be lower.",
    ],
    compareParagraphs: [
      "Ohio's flat 2.75% rate for 2026 sits well below the top brackets in California " +
        "(13.3%), New Jersey (10.75%), or New York (10.9%), and a little under " +
        "Pennsylvania's 3.07% and Illinois's 4.95%. What separates Ohio is its local tax: " +
        "unlike California, Florida, or Texas, most Ohio workers also pay a municipal " +
        "income tax of 1.5% to 2.5% withheld at the workplace, so the state line alone " +
        "understates the total.",
      "Ohio runs no state disability insurance and no paid family leave payroll tax, so " +
        "there is no state leave deduction the way there is in California, New Jersey, or " +
        "Washington. Ohio unemployment compensation is funded by employer contributions, " +
        "not employee withholding. The only state-level item on a typical Ohio stub is the " +
        "income tax, plus the city tax if your employer withholds it.",
    ],
    faqs: [
      {
        q: "Does Ohio have a state income tax?",
        a: "Yes. Ohio taxes wage income. For 2026 the individual income tax is a single flat rate of 2.75% on Ohio taxable income above $26,050, after personal exemptions, under Ohio Revised Code section 5747.02 as amended by House Bill 96.",
      },
      {
        q: "What is the Ohio income tax rate for 2026?",
        a: "2.75%. House Bill 96 collapsed Ohio's graduated schedule into one rate for tax year 2026 and later. A single filer pays nothing on the first $26,050 of Ohio taxable income and 2.75% on the amount above it.",
      },
      {
        q: "Does Ohio have a local income tax?",
        a: "Yes. Ohio is one of the few states where most cities levy their own income tax on wages, authorized by Ohio Revised Code Chapter 718. Rates commonly run from about 1.5% to 2.5%: Columbus and Cleveland charge 2.5% and Cincinnati 1.8%. The tax is withheld for the city where you work.",
      },
      {
        q: "How does the Ohio city tax credit work if I live and work in different cities?",
        a: "You pay the work city's tax through withholding and may claim a credit from your home city for tax paid elsewhere, generally capped at your home city's own rate. The Regional Income Tax Agency (RITA) administers the tax for many Ohio municipalities.",
      },
      {
        q: "Does Ohio have state disability or paid family leave withholding?",
        a: "No. Ohio has no state disability insurance (SDI) program and no state paid family leave payroll tax, so neither appears on a paycheck. Ohio unemployment compensation is an employer-paid tax, not an employee deduction.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Ohio?",
        a: "For 2026, a single filer paid biweekly takes home about $1,868.13 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $69.95 Ohio state income tax. Local municipal income tax is separate.",
      },
      {
        q: "How does Ohio tax business income?",
        a: "Ohio taxes business income at a flat 3% under section 5747.02(A)(4), separate from the 2.75% rate that applies to wages and other nonbusiness income. Business income reported on a federal return is excluded from the nonbusiness rate and is taxed on its own line.",
      },
      {
        q: "Does Ohio have a standard deduction or a personal exemption?",
        a: "Ohio does not use a standard deduction like the federal system. Instead, no tax is imposed on the first $26,050 of Ohio taxable income, which works like a zero-rate bracket, and a personal exemption for the taxpayer, spouse, and dependents under section 5747.025 reduces taxable income further.",
      },
    ],
    sources: [
      { label: "Ohio Revised Code §5747.02 — Income tax rates", url: "https://codes.ohio.gov/ohio-revised-code/section-5747.02" },
      { label: "Ohio Revised Code §5747.025 — Personal exemptions", url: "https://codes.ohio.gov/ohio-revised-code/section-5747.025" },
      { label: "Ohio Revised Code Chapter 718 — Municipal income taxes", url: "https://codes.ohio.gov/ohio-revised-code/chapter-718" },
      { label: "Ohio Department of Taxation", url: "https://tax.ohio.gov/" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-IL",
    abbr: "il",
    slug: "illinois",
    name: "Illinois",
    example: { salary: 65000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Illinois Department of Revenue.
    hasIncomeTax: true,
    title: "Illinois Paycheck Calculator - Take-Home Pay After Taxes",
    description:
      "Free Illinois paycheck calculator. Estimate take-home pay after the flat 4.95% Illinois income tax, the personal exemption, and federal withholdings. 2026.",
    intro:
      "Work out what an Illinois paycheck keeps after tax. Illinois charges a single flat " +
      "rate on wage income and lets you subtract a fixed personal exemption before the rate " +
      "applies. Enter your salary and pay frequency to see the federal, state, and FICA " +
      "amounts that leave each period.",
    keyHeading: "How does Illinois tax a paycheck?",
    keyParagraphs: [
      "Illinois taxes wage income at one flat rate of 4.95%. The rate is set by the Illinois " +
        "Income Tax Act and has held at 4.95% since it was made permanent in 2017, after a " +
        "temporary increase to 5% lapsed. There are no marginal brackets, so every dollar of " +
        "Illinois net income meets the same rate regardless of how much you earn.",
      "Before the rate applies, Illinois subtracts a personal exemption allowance of $2,850 " +
        "for the taxpayer. You get the same $2,850 for a spouse on a joint return and for " +
        "each dependent you claim. That amount has been frozen in statute since tax year " +
        "2010. The exemption lowers Illinois net income, but it is not a standard deduction, " +
        "and Illinois allows no deduction for the federal income tax you paid.",
      "Illinois levies no local or municipal income tax, so the state rate is the entire " +
        "state-and-local picture on a paycheck. Chicago does not impose a city income tax on " +
        "individuals. Illinois also runs no state disability insurance and no paid family " +
        "leave payroll tax, so nothing is withheld for a state leave program.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> A traditional 401(k), HSA, or health premium comes out first, lowering the wages the income tax is figured on.",
      "<strong>Federal income tax.</strong> The federal standard deduction is applied, then the rest is taxed through the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the annual wage base and Medicare at 1.45%, plus the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>Illinois flat tax.</strong> Illinois subtracts the $2,850 personal exemption, then charges 4.95% of what remains with no bracket table.",
    ],
    compareParagraphs: [
      "Illinois sits in the middle of the Midwest on headline rate. Its 4.95% flat tax is " +
        "above Indiana's 3% and Pennsylvania's 3.07%, but below Wisconsin's top 7.65% and the " +
        "graduated scales in Iowa and Minnesota. Because Illinois has no local income tax, " +
        "the flat 4.95% is often the only state-level charge, while Ohio and Pennsylvania " +
        "workers also pay a municipal or school district rate.",
      "Illinois runs no state disability insurance and no paid family leave payroll tax, " +
        "unlike California, New Jersey, New York, and Washington. The state's unemployment " +
        "insurance is funded by employer contributions rather than employee withholding, so " +
        "it never shows up as a deduction on a stub.",
    ],
    faqs: [
      {
        q: "What is the Illinois state income tax rate?",
        a: "Illinois taxes wage income at a flat 4.95%. The rate is set by the Illinois Income Tax Act and applies to every dollar of Illinois net income, with no marginal brackets and no high-income surcharge.",
      },
      {
        q: "Does Illinois have a standard deduction?",
        a: "No. Illinois has no standard deduction. It grants a personal exemption allowance instead: $2,850 for the taxpayer, and the same amount for a spouse on a joint return or for each dependent. The allowance has been frozen at $2,850 since tax year 2010.",
      },
      {
        q: "Does Illinois have a local income tax?",
        a: "No. Illinois has no local or municipal income tax on wages, and Chicago does not levy a city income tax on individuals. The 4.95% state rate is the only state or local income tax withheld from an Illinois paycheck.",
      },
      {
        q: "How much is taken out of a $65,000 salary in Illinois?",
        a: "For 2026, a single filer paid biweekly takes home about $1,973.84 per paycheck from a $65,000 salary: $2,500.00 gross, $216.15 federal income tax, $155.00 Social Security, $36.25 Medicare, and $118.75 Illinois state income tax. That is $51,319.94 a year.",
      },
      {
        q: "Does Illinois have disability or paid family leave withholding?",
        a: "No. Illinois has no state disability insurance program and no paid family leave payroll tax, so neither is deducted from a paycheck. The state's unemployment insurance is an employer-paid tax, not an employee deduction.",
      },
      {
        q: "Is the Illinois income tax progressive?",
        a: "No. Illinois uses a single flat 4.95% rate. A proposed graduated income tax was rejected by voters in the November 2020 referendum, so the flat structure stands. Only the personal exemption allowance separates taxpayers of different means.",
      },
      {
        q: "Does Illinois have reciprocal tax agreements with other states?",
        a: "Yes. Illinois has reciprocal agreements with Iowa, Kentucky, Michigan, and Wisconsin. An Illinois resident who works in one of those states has that wage taxed by Illinois instead of the work state, so only Illinois income tax is withheld. Illinois has no such agreement with Indiana or Missouri.",
      },
      {
        q: "Where can I check Illinois' tax rates?",
        a: "The Illinois Department of Revenue publishes the income tax rate, the personal exemption amount, and Form IL-1040 instructions at tax.illinois.gov. The rate itself is set by the Illinois Income Tax Act, 35 ILCS 5/201.",
      },
    ],
    sources: [
      { label: "Illinois Department of Revenue — Individual Income Tax", url: "https://tax.illinois.gov/tax-resources/individuals.html" },
      { label: "Illinois Department of Revenue — Form IL-1040 Instructions", url: "https://tax.illinois.gov/forms/incometax/currentyear/individual/il-1040-instr.html" },
      { label: "Illinois Department of Revenue — Tax Rate Database", url: "https://tax.illinois.gov/research/taxrates.html" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-GA",
    abbr: "ga",
    slug: "georgia",
    name: "Georgia",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Georgia Department of Revenue.
    hasIncomeTax: true,
    title: "Georgia Paycheck Calculator - Take-Home Pay After GA Tax",
    description:
      "Free Georgia paycheck calculator. Estimate take-home pay after Georgia's flat 4.99% income tax, the 2026 standard deduction, and federal withholdings.",
    intro:
      "See what a Georgia paycheck keeps after tax. Georgia charges wage income a single " +
      "flat rate, and for 2026 it pairs that rate with a larger standard deduction. Enter " +
      "your salary and pay frequency to see the federal, state, and FICA amounts that leave " +
      "each period.",
    keyHeading: "How does Georgia tax a paycheck?",
    keyParagraphs: [
      "Georgia taxes wages at one flat rate. For tax year 2026 that rate is 4.99%, set in " +
        "O.C.G.A. § 48-7-20 and signed in May 2026 with retroactive effect to January 1. It " +
        "replaced the 5.19% rate that had applied since mid-2025. Georgia retired its old " +
        "graduated schedule in 2024, and the 4.99% figure is written into the code as a " +
        "permanent reduction rather than a one-time rebate, with further step-downs toward " +
        "3.99% planned if revenue targets are met.",
      "Before the rate applies, Georgia subtracts a standard deduction. For 2026 the " +
        "Department of Revenue raised it to $15,000 for a single filer, a head of household, " +
        "or a married person filing separately, and to $30,000 for a married couple filing " +
        "jointly. A taxpayer who itemizes instead can use the federal-style itemized " +
        "deductions, and Georgia grants a separate $4,000 exemption for each dependent.",
      "Georgia levies no local or county income tax on wages, so the flat state rate is the " +
        "entire state-and-local picture on a paycheck. The state operates no disability " +
        "insurance fund and no paid family leave payroll tax, so nothing is withheld for a " +
        "state leave benefit either.",
    ],
    calcSteps: [
      "<strong>Gross pay per period.</strong> Take your yearly salary, or an hourly rate multiplied by hours worked, and express it as one paycheck for your pay frequency.",
      "<strong>Pre-tax deductions first.</strong> A traditional 401(k), an HSA, or a health premium reduces the wages that federal and Georgia income tax are charged on.",
      "<strong>Federal income tax.</strong> The federal standard deduction is removed, then the remaining income runs up the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the annual wage base, Medicare at 1.45%, and the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>Georgia flat tax.</strong> Georgia subtracts its standard deduction and then charges one rate &mdash; 4.99% for 2026 &mdash; with no bracket table.",
      "<strong>Model caveat.</strong> This calculator still applies Georgia's 2025 figures ($12,000 standard deduction and a 5.19% rate), so its state line runs slightly high until the dataset is refreshed.",
    ],
    compareParagraphs: [
      "Georgia's flat 4.99% sits in the middle of the Southern states that tax wages. It is " +
        "above North Carolina's 3.99% and Florida's zero, and below the top brackets in " +
        "California, New Jersey, or New York. Because Georgia has no local income tax, the " +
        "flat rate is often the only state-level charge, unlike Ohio or Pennsylvania, where " +
        "a municipal or school district rate is withheld on top.",
      "Georgia runs no state disability insurance and no paid family leave payroll tax, so " +
        "there is no state leave deduction the way there is in California, New Jersey, or " +
        "Washington. Georgia unemployment insurance is funded by employer contributions, " +
        "not employee withholding. Georgia also exempts Social Security benefits from state " +
        "tax and offers a retirement income exclusion for filers 65 and older, a break that " +
        "the wage-taxing states in the Northeast do not match.",
    ],
    faqs: [
      {
        q: "Does Georgia have a state income tax?",
        a: "Yes. Georgia taxes wage income at a single flat rate of 4.99% for 2026 under O.C.G.A. § 48-7-20. Georgia moved from a graduated schedule to a flat tax in 2024, and the rate is scheduled to step down toward 3.99% in later years if revenue targets are met.",
      },
      {
        q: "What is the Georgia income tax rate for 2026?",
        a: "4.99%. Governor Brian Kemp signed the reduction in May 2026 with retroactive effect to January 1, cutting the rate from 5.19%. Employers may withhold at 4.99% starting May 11, 2026, and should use the 2026 Employer's Tax Guide for the withholding tables.",
      },
      {
        q: "Does Georgia have a standard deduction?",
        a: "Yes. For 2026 Georgia raised its standard deduction to $15,000 for a single filer, head of household, or married person filing separately, and to $30,000 for a married couple filing jointly. Georgia also permits itemized deductions and a $4,000 exemption for each dependent.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Georgia?",
        a: "For 2026, a single filer paid biweekly takes home about $1,842.26 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $95.82 Georgia state income tax. That is $47,898.80 a year.",
      },
      {
        q: "Does Georgia have a local or county income tax?",
        a: "No. No Georgia county or city levies an income tax on wages. Local revenue comes from sales and use taxes and property taxes, which are collected at the register or on property, not withheld from a paycheck.",
      },
      {
        q: "Does Georgia have disability or paid family leave withholding?",
        a: "No. Georgia has no state disability insurance program and no state paid family leave payroll tax, so neither is deducted from a paycheck. Georgia unemployment insurance is an employer-paid tax, not an employee deduction.",
      },
      {
        q: "Does Georgia tax retirement income?",
        a: "Georgia exempts Social Security benefits from state income tax and allows a retirement income exclusion for taxpayers 65 and older, which has been rising toward $65,000 per person. Those breaks apply to retirement income, not to the wages this calculator models.",
      },
      {
        q: "Does Georgia have reciprocal tax agreements with other states?",
        a: "No. Georgia has no reciprocal income tax agreements, so a Georgia resident who works in another state generally files in the work state and claims a credit in Georgia for tax paid there. Georgia income tax is withheld from Georgia wages regardless of where the employer is based.",
      },
    ],
    sources: [
      { label: "Georgia Department of Revenue — Important Tax Updates", url: "https://dor.georgia.gov/important-tax-updates" },
      { label: "Georgia Department of Revenue — Withholding Tax for Employers", url: "https://dor.georgia.gov/taxes/withholding-tax-employers" },
      { label: "O.C.G.A. § 48-7-20 — Income tax rate", url: "https://law.justia.com/codes/georgia/title-48/chapter-7/article-2/section-48-7-20/" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-NC",
    abbr: "nc",
    slug: "north-carolina",
    name: "North Carolina",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the North Carolina Department of Revenue.
    hasIncomeTax: true,
    title: "North Carolina Paycheck Calculator - Take-Home Pay After NC Tax",
    description:
      "Free North Carolina paycheck calculator. Estimate take-home pay after North Carolina's 3.99% flat income tax for 2026, its standard deduction, and federal withholdings.",
    intro:
      "Estimate what a North Carolina paycheck keeps after tax. North Carolina charges " +
      "wage income a single flat percentage with no bracket table, and it has trimmed that " +
      "rate in most years since 2022. Enter your salary and pay frequency to see the " +
      "federal, state, and FICA amounts taken from each period.",
    keyHeading: "How does North Carolina tax a paycheck?",
    keyParagraphs: [
      "North Carolina taxes wages at one flat rate rather than a graduated schedule. " +
        "G.S. 105-153.7 sets that rate at 3.99% for taxable years beginning after 2025, " +
        "down from 4.25% in 2025 and 4.50% in 2024. The same section holds a trigger: when " +
        "state General Fund revenue clears a set threshold, the rate drops another half " +
        "point, with a floor of 2.49%.",
      "The flat rate applies to North Carolina taxable income, which starts from federal " +
        "adjusted gross income. G.S. 105-153.5 allows a standard deduction of $12,750 for " +
        "a single filer or a married person filing separately, $19,125 for a head of " +
        "household, and $25,500 for a married couple filing jointly. Those amounts are " +
        "fixed in the statute instead of being indexed for inflation, so they have held " +
        "steady for several years. North Carolina also grants a child deduction that " +
        "shrinks as adjusted gross income rises.",
      "North Carolina levies no county or municipal income tax on wages, and it operates " +
        "no state disability insurance fund and no paid family leave payroll tax. The flat " +
        "state rate is therefore the only state-level deduction on a North Carolina " +
        "paycheck. Unemployment insurance in the state is an employer-paid tax, not an " +
        "employee withholding.",
    ],
    calcSteps: [
      "<strong>Gross pay per period.</strong> Your yearly salary, or an hourly rate multiplied by hours worked, expressed as one paycheck for the frequency you selected.",
      "<strong>Pre-tax deductions first.</strong> A traditional 401(k), an HSA contribution, or a health premium lowers the wages that federal and North Carolina income tax are charged on.",
      "<strong>Federal income tax.</strong> The federal standard deduction comes off first, then the remaining income moves up the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the annual wage base, Medicare at 1.45%, and the extra 0.9% Medicare tax once income passes the high-earner threshold.",
      "<strong>North Carolina flat tax.</strong> North Carolina removes its own standard deduction and then applies one rate &mdash; 3.99% for 2026 &mdash; with no brackets to step through.",
      "<strong>Model caveat.</strong> The calculator still holds North Carolina's 2025 figures (a 4.25% rate), so its state line runs roughly $4.73 high on a biweekly $60,000 paycheck until the dataset is refreshed.",
    ],
    compareParagraphs: [
      "North Carolina's flat rate is among the lowest of the states that tax wages. At " +
        "3.99% for 2026 it sits under Georgia's 4.99% and far below the top marginal rates " +
        "in California, New Jersey, or New York, though it remains above the zero of " +
        "Florida and Tennessee. Because no North Carolina county adds an income tax, the " +
        "flat state rate is the whole state-and-local charge, unlike Ohio or Pennsylvania, " +
        "where a municipal rate is withheld on top.",
      "North Carolina has no state disability insurance and no paid family leave payroll " +
        "tax, so a paycheck carries no state leave deduction the way one does in " +
        "California, New Jersey, or Washington. The state also exempts Social Security " +
        "benefits from taxable income and honors the Bailey settlement for certain " +
        "government retirees, both of which touch retirement income rather than the wages " +
        "modeled here.",
    ],
    faqs: [
      {
        q: "Does North Carolina have a state income tax?",
        a: "Yes. North Carolina taxes wage income at a single flat rate under G.S. 105-153.7. For taxable years beginning after 2025 that rate is 3.99%, reduced from 4.25% in 2025. North Carolina replaced its old graduated schedule with a flat tax in 2014.",
      },
      {
        q: "What is the North Carolina income tax rate for 2026?",
        a: "3.99% for taxable years beginning after 2025. The rate was 4.25% for 2025 and 4.50% for 2024. G.S. 105-153.7 also contains a revenue trigger that can cut the rate by another half point in later years, down to a floor of 2.49%.",
      },
      {
        q: "What is the North Carolina standard deduction?",
        a: "For a single filer or a married person filing separately it is $12,750; for a head of household, $19,125; and for a married couple filing jointly, $25,500. These amounts are written into G.S. 105-153.5 and are not indexed for inflation, so they do not rise each year the way the federal standard deduction does.",
      },
      {
        q: "How much is taken out of a $60,000 salary in North Carolina?",
        a: "For 2026, a single filer paid biweekly takes home about $1,860.84 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $77.24 North Carolina state income tax. That is $48,381.88 a year.",
      },
      {
        q: "Does North Carolina have a local or county income tax?",
        a: "No. No North Carolina county or city levies an income tax on wages. Local government revenue in the state comes from sales and use taxes and property taxes, neither of which is withheld from a paycheck.",
      },
      {
        q: "Does North Carolina have disability or paid family leave withholding?",
        a: "No. North Carolina has no state disability insurance program and no state paid family leave payroll tax, so neither appears on a paycheck. North Carolina unemployment insurance is funded by employer contributions rather than employee withholding.",
      },
      {
        q: "Will the North Carolina income tax rate drop again?",
        a: "Possibly. G.S. 105-153.7 includes a trigger that lowers the rate by half a percentage point when total General Fund revenue exceeds a set amount for a fiscal year, with the first threshold tied to fiscal year 2025-2026. The rate cannot fall below 2.49% under that mechanism.",
      },
      {
        q: "Does North Carolina tax Social Security or retirement income?",
        a: "North Carolina exempts Social Security benefits from state taxable income, and the Bailey settlement excludes certain state and local government retirement benefits. Those rules apply to retirement income, not to the wage income this calculator estimates.",
      },
    ],
    sources: [
      { label: "North Carolina Department of Revenue — Tax Rate Schedules", url: "https://www.ncdor.gov/taxes-forms/individual-income-tax/tax-rate-schedules" },
      { label: "N.C. Gen. Stat. § 105-153.7 — Individual income tax imposed", url: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-153.7.html" },
      { label: "N.C. Gen. Stat. § 105-153.5 — Standard deduction amounts", url: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_105/GS_105-153.5.html" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-NJ",
    abbr: "nj",
    slug: "new-jersey",
    name: "New Jersey",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the New Jersey Division of Taxation.
    hasIncomeTax: true,
    title: "New Jersey Paycheck Calculator - Take-Home Pay After NJ Tax",
    description:
      "Free New Jersey paycheck calculator. Estimate take-home pay after the New Jersey graduated income tax, the TDI and FLI payroll deductions, and federal withholdings.",
    intro:
      "Work out what a New Jersey paycheck actually clears. New Jersey charges wage income " +
      "a graduated rate, then adds two employee-funded payroll deductions that most states " +
      "do not have at all: Temporary Disability Insurance and Family Leave Insurance. Put in " +
      "your salary and pay frequency to see the state, federal, and FICA pieces that leave " +
      "each period.",
    keyHeading: "Does New Jersey have a state income tax?",
    keyParagraphs: [
      "Yes. New Jersey taxes wage income under the Gross Income Tax, a graduated schedule " +
        "whose marginal rate climbs from 1.4% to a 10.75% top rate on taxable income of " +
        "$1 million or more. Unlike New York, New Jersey levies no city or county income tax " +
        "on wages at all, so Trenton and Newark employees pay the same state rate. That is " +
        "the opposite of the New York side of the Hudson, where a New York City resident " +
        "pays a municipal income tax on top of the state one.",
      "The 2026 data behind this calculator approximates the schedule with three bands " +
        "&mdash; 1.4%, 6.075%, and 10.75% &mdash; and subtracts a $1,000 New Jersey standard " +
        "deduction for a single filer before applying them. That approximation overstates " +
        "the tax for a middle-income filer, because the real schedule steps through 1.75%, " +
        "3.5%, and 5.53% before it ever reaches 6.075%. Read the New Jersey line here as a " +
        "conservative estimate, not as a payroll-system figure.",
      "New Jersey also withholds two state payroll taxes that are not income tax: " +
        "Temporary Disability Insurance at 0.19% and Family Leave Insurance at 0.23% of " +
        "covered wages for 2026, each capped at the first $171,100 of wages. They are " +
        "separate lines on a pay stub, and this calculator does not subtract them yet, so a " +
        "real New Jersey net is slightly lower than the figure shown above.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they lower the wages that New Jersey and federal income tax are charged on.",
      "<strong>New Jersey income tax.</strong> The $1,000 New Jersey standard deduction comes off a single filer's wages, then the remainder runs through the state's graduated rates, which reach 10.75% at the top.",
      "<strong>Federal income tax.</strong> The federal standard deduction is applied, then the remaining income runs through the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the annual wage base) and Medicare at 1.45%, plus the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>New Jersey TDI and FLI.</strong> Two separate employee deductions: Temporary Disability Insurance at 0.19% and Family Leave Insurance at 0.23% of covered wages, each capped at the first $171,100 for 2026. Neither is subtracted by this calculator.",
    ],
    compareParagraphs: [
      "New Jersey's top rate of 10.75% is close to New York's 10.9% and far above the flat " +
        "rates charged by Pennsylvania (3.07%) or Illinois (4.95%), but the two neighbours " +
        "diverge below the top bracket. New York stacks a local income tax on its state tax, " +
        "with a New York City resident income tax and a Yonkers surcharge; New Jersey has no " +
        "municipal wage tax anywhere in the state. New Jersey does tax more of a middle " +
        "income than New York does, because its first bracket is only $20,000 wide on the " +
        "real schedule and it grants a smaller standard deduction.",
      "New Jersey is one of a minority of states that withhold for both disability and paid " +
        "family leave. In 2026 the employee shares are 0.19% for TDI and 0.23% for FLI, " +
        "capped at the first $171,100 of wages, and the two together come to 0.42% of covered " +
        "pay. New York funds paid leave the same way at 0.432%, while Pennsylvania, Illinois, " +
        "Georgia, and North Carolina withhold nothing for a state leave benefit at all.",
      "New Jersey's wage base for the disability and family leave taxes is the largest " +
        "state-level figure that appears on a paycheck in the region, and it is not the " +
        "Social Security wage base. A high earner pays the 0.42% on the first $171,100, a " +
        "maximum of $325.09 for TDI and $393.53 for FLI.",
    ],
    faqs: [
      {
        q: "Does New Jersey have a state income tax?",
        a: "Yes. New Jersey taxes wage income under the Gross Income Tax, a graduated schedule that runs from 1.4% to a top marginal rate of 10.75% on taxable income of $1 million or more. The 2026 data used here approximates that schedule with 1.4%, 6.075%, and 10.75% bands.",
      },
      {
        q: "How much is taken out of a $60,000 salary in New Jersey?",
        a: "For 2026, a single filer paid biweekly takes home about $1,827.19 per paycheck from a $60,000 salary: $2,307.69 gross, $110.88 New Jersey income tax, $193.08 federal income tax, $143.08 Social Security, and $33.46 Medicare. The TDI and FLI deductions come out on top of that.",
      },
      {
        q: "What is the New Jersey income tax rate for 2026?",
        a: "New Jersey uses graduated rates rather than one flat rate. For a single filer the real schedule starts at 1.4% on the first $20,000 of taxable income, steps up through 1.75%, 3.5%, and 5.53%, then 6.37% on income above $75,000, and reaches 8.97% above $500,000 and 10.75% above $1 million.",
      },
      {
        q: "Does New Jersey have a local or city income tax on wages?",
        a: "No. No New Jersey city or county levies an income tax on wages, so there is no municipal wage tax anywhere in the state. Newark does charge a payroll tax, but it is levied on employers with at least 50 employees, not withheld from a worker's paycheck.",
      },
      {
        q: "What is the New Jersey TDI deduction for 2026?",
        a: "Employees contribute 0.19% of covered wages to Temporary Disability Insurance in 2026, on the first $171,100 of wages, for a maximum annual contribution of $325.09. TDI pays cash benefits to workers who cannot work because of a non-work illness, injury, or pregnancy recovery.",
      },
      {
        q: "What is the New Jersey FLI deduction for 2026?",
        a: "Employees contribute 0.23% of covered wages to Family Leave Insurance in 2026, on the first $171,100 of wages, for a maximum annual contribution of $393.53. Employers contribute nothing to FLI. It funds paid leave to bond with a new child or care for a seriously ill family member.",
      },
      {
        q: "Does New Jersey have a standard deduction on its income tax?",
        a: "Yes. For 2026 the New Jersey standard deduction is $1,000 for a single filer or a married person filing separately, $1,500 for a head of household, and $2,000 for a married couple filing jointly. It is subtracted from wages before the graduated rates apply, and it is smaller than the federal standard deduction.",
      },
      {
        q: "Do Pennsylvania residents working in New Jersey pay New Jersey income tax?",
        a: "No. The PA/NJ Reciprocal Personal Income Tax Agreement exempts compensation earned by a Pennsylvania resident working in New Jersey from New Jersey income tax, and the reverse also holds. The exemption covers wages only; other income taxable in both states still has to be reported on a New Jersey nonresident return.",
      },
    ],
    sources: [
      { label: "New Jersey Division of Taxation — NJ Income Tax Rates", url: "https://www.nj.gov/treasury/taxation/taxtables.shtml" },
      { label: "New Jersey Division of Taxation — Employer Payroll Tax (withholding)", url: "https://www.nj.gov/treasury/taxation/businesses/payroll/index.shtml" },
      { label: "New Jersey Department of Labor — TDI and FLI employer information and 2026 contributions", url: "https://www.nj.gov/labor/myleavebenefits/employer/" },
      { label: "New Jersey Division of Taxation — PA/NJ Reciprocal Income Tax Agreement", url: "https://www.nj.gov/treasury/taxation/njit25.shtml" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-MI",
    abbr: "mi",
    slug: "michigan",
    name: "Michigan",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Michigan Department of Treasury.
    hasIncomeTax: true,
    title: "Michigan Paycheck Calculator - Take-Home Pay After MI Tax",
    description:
      "Free Michigan paycheck calculator. Estimate take-home pay after Michigan's 4.25% flat income tax, federal income tax, Social Security, and Medicare for 2026.",
    intro:
      "Estimate your take-home pay in Michigan. Michigan charges a single flat income tax " +
      "on wages rather than a bracket schedule, and a handful of Michigan cities add their " +
      "own city income tax on top. Enter your salary and pay frequency to see your net pay " +
      "per period.",
    keyHeading: "Does Michigan have a state income tax?",
    keyParagraphs: [
      "Yes. Michigan taxes wage income at one flat rate instead of graduated brackets. " +
        "For the 2026 tax year the Department of Treasury set that rate at 4.25%, which " +
        "applies to every dollar of taxable income once the personal exemption is " +
        "subtracted. Michigan briefly fell to 4.05% in 2023 under a revenue-trigger formula " +
        "in the Income Tax Act, but the trigger did not fire again and the rate returned to " +
        "4.25%.",
      "The calculator on this page applies the flat 4.25% rate after the Michigan standard " +
        "deduction used in the 2026 data ($5,600 for a single filer). Michigan&rsquo;s actual " +
        "personal exemption is $5,900 per person for 2026, so the state line here is a close " +
        "estimate; your employer withholds using the state&rsquo;s own tables and Form MI-W4.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they lower the income that Michigan and federal tax are charged on.",
      "<strong>Michigan income tax.</strong> A flat 4.25% for 2026 is charged on taxable wages after the state standard deduction, with no bracket tiers to climb.",
      "<strong>Federal income tax.</strong> The federal standard deduction is applied, then the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the wage base) and Medicare at 1.45%, plus the 0.9% additional Medicare tax above the high-earner threshold.",
      "<strong>City income tax (not included).</strong> Residents of the 24 Michigan cities with a local income tax owe a separate city tax. This calculator does not subtract it.",
    ],
    compareParagraphs: [
      "Michigan sits in the middle of the state-tax pack. Its 4.25% flat rate is higher than " +
        "Ohio&rsquo;s graduated rates for lower earners and close to Illinois&rsquo; 4.95% flat " +
        "rate, but far below California&rsquo;s graduated schedule and far above zero-tax states " +
        "like Texas, Florida, and Washington. A flat rate also means a high earner and an " +
        "average earner pay the same percentage on each taxable dollar.",
      "What separates Michigan from most flat-tax states is the city layer. Detroit residents " +
        "pay a 2.4% city income tax and Detroit nonresidents who work in the city pay 1.2%; " +
        "Grand Rapids charges residents 1.5% and nonresidents 0.75%. Cities act under the City " +
        "Income Tax Act (Act 284 of 1964), and the Department of Treasury lists 24 cities that " +
        "levy an income-related tax. None of that city tax appears on the state line, so a " +
        "Detroit paycheck nets less than the state-only estimate here.",
    ],
    faqs: [
      {
        q: "Does Michigan have a state income tax?",
        a: "Yes. Michigan taxes wage income at a flat 4.25% for the 2026 tax year. There are no graduated brackets; the same rate applies to every dollar of taxable income after the personal exemption is subtracted.",
      },
      {
        q: "What is the Michigan income tax rate for 2026?",
        a: "Michigan's flat individual income tax rate is 4.25% for the 2026 tax year, as set by the Department of Treasury after applying the revenue-trigger formula in the Income Tax Act.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Michigan?",
        a: "For 2026, a single filer paid biweekly takes home about $1,849.15 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $88.92 Michigan state income tax. A city income tax such as Detroit's is not included.",
      },
      {
        q: "Do Michigan cities charge their own income tax?",
        a: "Yes. Twenty-four Michigan cities levy an income-related municipal tax under the City Income Tax Act. Detroit residents pay 2.4% and Detroit nonresidents 1.2%, while Grand Rapids charges residents 1.5% and nonresidents 0.75%. Other cities on the list include Lansing, Flint, Saginaw, Pontiac, Jackson, and Muskegon.",
      },
      {
        q: "How does the Michigan personal exemption work?",
        a: "Michigan grants a personal exemption that is subtracted before the flat rate is applied. For 2026 the exemption is $5,900 per person, and it is claimed through Form MI-W4 with your employer. The simplified state data used by this calculator uses $5,600, so treat the state figure here as an estimate.",
      },
      {
        q: "Does Michigan have a state disability or paid family leave payroll tax?",
        a: "No. Michigan does not operate a state disability insurance program or a state paid family leave program, so no state payroll tax for either is withheld from a Michigan paycheck.",
      },
      {
        q: "What withholding form does a Michigan employee file?",
        a: "A Michigan employee files Form MI-W4 with their employer to set state income tax withholding. It is separate from the federal Form W-4 and controls how the state personal exemption is applied to each paycheck.",
      },
      {
        q: "Why did the Michigan income tax rate change a few years ago?",
        a: "Michigan's Income Tax Act contains a formula that lowers the flat rate when general fund revenue exceeds a trigger threshold. That happened for tax year 2023, when the rate fell to about 4.05%. The trigger did not repeat, so the rate returned to 4.25% and remains there for 2026.",
      },
    ],
    sources: [
      { label: "Michigan Department of Treasury — 4.25% Income Tax Rate for Individuals and Fiduciaries in 2026 Tax Year", url: "https://www.michigan.gov/treasury/reference/taxpayer-notices/2026/04/15/425-income-tax-rate-for-individuals-and-fiduciaries-in-2026-tax-year" },
      { label: "Michigan Department of Treasury — Which cities impose an income tax?", url: "https://www.michigan.gov/taxes/citytax/what-cities-impose-an-income-tax" },
      { label: "Michigan Department of Treasury — Withholding Tax", url: "https://www.michigan.gov/taxes/business-taxes/withholding-tax" },
      { label: "Michigan Legislature — City Income Tax Act, Act 284 of 1964 (MCL 141.501)", url: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-Act-284-of-1964" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-VA",
    abbr: "va",
    slug: "virginia",
    name: "Virginia",
    example: { salary: 65000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against Virginia Tax (tax.virginia.gov).
    hasIncomeTax: true,
    title: "Virginia Paycheck Calculator - Take-Home Pay After VA Tax",
    description:
      "Free Virginia paycheck calculator. Estimate take-home pay after Virginia's 2% to 5.75% graduated income tax, federal income tax, Social Security, and Medicare for 2026.",
    intro:
      "Estimate your take-home pay in Virginia. Virginia taxes wages on four graduated " +
      "brackets that top out at 5.75%, but it levies no city or county wage tax and runs " +
      "no state disability or paid-leave payroll deduction, so the state line on a Virginia " +
      "paycheck stays simpler than in Pennsylvania, Ohio, or New York. Enter your salary " +
      "and pay frequency to see your net pay per period.",
    keyHeading: "Does Virginia have a state income tax?",
    keyParagraphs: [
      "Yes. Section 58.1-320 of the Code of Virginia imposes a graduated individual income " +
        "tax: 2% on the first $3,000 of Virginia taxable income, 3% on the next $2,000, 5% " +
        "on income from $5,000 up to $17,000, and 5.75% on everything above $17,000. Because " +
        "the top bracket begins at $17,000, nearly every full-time Virginia wage earner is " +
        "already inside the 5.75% band, and those bracket thresholds have not moved since " +
        "1990.",
      "The calculator on this page applies a simplified three-band version of that schedule " +
        "(2%, 3.875%, and 5.75%) after the Virginia standard deduction held in the 2026 data " +
        "($8,500 for a single filer). Section 58.1-322.03 actually sets the single standard " +
        "deduction at $8,750 for tax years 2025 and 2026, and Virginia also allows a $930 " +
        "personal exemption per person that this simplified data does not subtract. Your " +
        "employer withholds using the Virginia withholding tables and your Form VA-4, so " +
        "treat the state figure here as a close estimate.",
    ],
    calcSteps: [
      "<strong>Start with gross pay.</strong> Annual salary divided by the number of pay periods you selected, or hourly rate times hours worked for an hourly employee.",
      "<strong>Subtract pre-tax benefits.</strong> 401(k), HSA, and health insurance premiums come off first, and they reduce the wages that both Virginia and the IRS tax.",
      "<strong>Take the Virginia standard deduction.</strong> The state figure used here is $8,500 for a single filer, removed before any Virginia bracket is reached.",
      "<strong>Run the Virginia brackets.</strong> 2% on the first $3,000 of what remains, 3.875% on the next stretch up to $100,000, then 5.75% on the rest, which is where most Virginia salaries sit.",
      "<strong>Federal income tax.</strong> The federal standard deduction and marginal brackets are applied separately to the same wages.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the annual wage base, Medicare at 1.45%, plus the additional 0.9% Medicare tax once wages pass the high-earner threshold.",
      "<strong>Nothing else at the state level.</strong> Virginia has no local wage tax, no state disability insurance, and no paid-leave payroll premium, so the state withholding ends with the income tax line.",
    ],
    compareParagraphs: [
      "Virginia's 5.75% top rate sits in the middle of the state pack: above North Carolina's " +
        "flat 4.25% and Georgia's 5.19%, level with Maryland's top rate, and well below New " +
        "Jersey and California. What Virginia does not do is stack a local layer on top. " +
        "Pennsylvania's earned income tax, Ohio's municipal tax, and New York City's resident " +
        "tax all take a second bite at wages that Virginia cities and counties cannot take, " +
        "because Virginia localities raise their own revenue from property, sales, and " +
        "business license taxes instead.",
      "Virginia also sits inside a regional tax compact that most states do not have. Under " +
        "the reciprocity agreements summarized by Virginia Tax, a Virginia resident who works " +
        "in the District of Columbia, Kentucky, Maryland, Pennsylvania, or West Virginia " +
        "generally pays income tax only to Virginia, and a resident of one of those places " +
        "who works in Virginia generally pays only to their home state. No second state " +
        "withholding is taken out, so a Northern Virginia commuter's paycheck looks like any " +
        "other Virginia paycheck.",
    ],
    faqs: [
      {
        q: "Does Virginia have a state income tax?",
        a: "Yes. Virginia taxes wage income on four graduated brackets under section 58.1-320 of the Code of Virginia: 2% on the first $3,000, 3% on the next $2,000, 5% from $5,000 to $17,000, and 5.75% on all income above $17,000.",
      },
      {
        q: "What is the Virginia income tax rate for 2026?",
        a: "Virginia's top marginal rate is 5.75%, reached at just $17,000 of Virginia taxable income. Because that threshold is so low, most Virginia employees pay 5.75% on nearly all of their taxable wages, and the rate schedule has been unchanged since 1990.",
      },
      {
        q: "How much is taken out of a $65,000 salary in Virginia?",
        a: "For 2026, a single filer paid biweekly takes home about $2,019.21 per paycheck from a $65,000 salary: $2,500.00 gross, $216.15 federal income tax, $155.00 Social Security, $36.25 Medicare, and $73.39 Virginia state income tax.",
      },
      {
        q: "Do Virginia cities or counties charge a local income tax on wages?",
        a: "No. Virginia localities do not levy an income tax on wages, so there is no city wage tax of the kind Philadelphia, Detroit, or New York City residents pay. Virginia counties and cities fund themselves with property taxes, local sales taxes, and the business license (BPOL) tax.",
      },
      {
        q: "Does Virginia have a state disability or paid family leave payroll tax?",
        a: "No. Virginia operates no state disability insurance program and no paid family and medical leave insurance premium, so no state payroll deduction funds either one. Virginia does require paid sick leave for certain home health and similar workers under Title 40.1, Chapter 3, Article 2.1, but that leave is funded by the employer, not withheld from the employee's paycheck.",
      },
      {
        q: "What is the Virginia standard deduction for 2026?",
        a: "Section 58.1-322.03 sets the standard deduction at $8,750 for a single filer and $17,500 for a married couple filing jointly for tax years beginning in 2025 or 2026. Virginia also allows a $930 personal exemption per person. The simplified 2026 data behind this calculator uses an $8,500 standard deduction and no personal exemption, so the state line here runs slightly high.",
      },
      {
        q: "What withholding form does a Virginia employee file?",
        a: "A Virginia employee files Form VA-4, the Employee's Virginia Income Tax Withholding Exemption Certificate, with their employer. It is separate from the federal Form W-4 and tells the employer how many Virginia exemptions to apply against each paycheck.",
      },
      {
        q: "Which states have income tax reciprocity with Virginia?",
        a: "Virginia has reciprocity with the District of Columbia, Kentucky, Maryland, Pennsylvania, and West Virginia. If you live in Virginia and work in one of those places, you generally owe Virginia income tax only; the reverse holds if you live in one of them and work in Virginia. Reciprocity covers individual income tax on wages, not other taxes.",
      },
    ],
    sources: [
      { label: "Virginia Tax — Reciprocity", url: "https://www.tax.virginia.gov/reciprocity" },
      { label: "Virginia Tax — Individual Income Tax Filing", url: "https://www.tax.virginia.gov/individual-income-tax-filing" },
      { label: "Virginia Tax — Withholding Tax", url: "https://www.tax.virginia.gov/withholding-tax" },
      { label: "Code of Virginia § 58.1-320 — Imposition of tax", url: "https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-320/" },
      { label: "Code of Virginia § 58.1-322.03 — Virginia taxable income; deductions", url: "https://law.lis.virginia.gov/vacode/title58.1/chapter3/section58.1-322.03/" },
      { label: "Code of Virginia Title 40.1, Chapter 3, Article 2.1 — Paid Sick Leave", url: "https://law.lis.virginia.gov/vacode/title40.1/chapter3/section40.1-33.6/" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-WA",
    abbr: "wa",
    slug: "washington",
    name: "Washington",
    example: { salary: 90000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Department of Revenue.
    hasIncomeTax: false,
    title: "Washington Paycheck Calculator - Take-Home Pay After WA Taxes",
    description:
      "Free Washington paycheck calculator. Washington has no wage income tax, but Paid Leave and WA Cares come out of pay. Estimate 2026 take-home pay after federal tax.",
    intro:
      "Estimate your take-home pay in Washington. Washington does not tax wage income, so " +
      "federal income tax, Social Security, and Medicare are the only income taxes " +
      "withheld. Washington paychecks are not deduction-free, though: the state Paid " +
      "Family and Medical Leave premium and the WA Cares Fund premium come out of wages " +
      "as well. Enter your salary and pay frequency to see your net pay per period.",
    keyHeading: "Does Washington have a state income tax?",
    keyParagraphs: [
      "No, not on wages. The Department of Revenue states plainly that Washington does " +
        "not currently have an individual income tax, and no state income tax is withheld " +
        "from a Washington paycheck. The state raises most of its money from sales and use " +
        "tax, property tax, and the business and occupation tax instead.",
      "Two recent laws are worth knowing about, because both are easy to confuse with a " +
        "payroll income tax. The first is the capital gains excise tax in RCW 82.87, a 7% " +
        "excise tax on long-term capital gains above a standard deduction. It is an excise " +
        "tax on the sale of assets, not a tax on wages, and nothing is withheld from a " +
        "paycheck for it. The second is Senate Bill 6346, signed in 2026, which creates a " +
        "9.9% income tax on individuals and married couples filing jointly with annual " +
        "adjusted gross income above $1 million. That tax does not take effect until " +
        "January 1, 2028, and the first returns are due in April 2029, so it changes " +
        "nothing on a 2026 paycheck and this calculator does not withhold it.",
      "What a Washington paycheck does carry is a pair of state premium lines: Paid Family " +
        "and Medical Leave at 1.13% of gross wages up to the 2026 Social Security cap of " +
        "$184,500, and the WA Cares Fund at 0.58% of gross wages with no cap. Both are " +
        "insurance premiums rather than income tax, which is why Washington can levy them " +
        "without an income tax.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Your annual salary, or hourly rate times hours worked, converted to the pay period you selected.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health premiums come out first, so they lower the income that federal tax is charged on.",
      "<strong>Federal income tax.</strong> The standard deduction is applied, then the remaining income runs through the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% (up to the annual wage base) and Medicare at 1.45%, plus the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>Washington income tax: $0.</strong> Washington does not tax wage income, so this line is always zero. The 9.9% tax created by SB 6346 starts in 2028 and applies only above $1 million of annual income.",
      "<strong>Washington Paid Leave and WA Cares.</strong> Two state premium deductions that the calculator does not yet subtract: Paid Family and Medical Leave at 1.13% of wages up to $184,500 (the employee pays up to 71.43% of that, roughly 0.81% of wages) and WA Cares at 0.58% of wages with no cap.",
    ],
    compareParagraphs: [
      "Washington is grouped with the nine states that do not tax wage income, alongside " +
        "Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, and " +
        "Wyoming. A Washington salary therefore keeps more than the same salary earned in " +
        "Oregon, which taxes wages at rates that climb past 9%, or in California.",
      "The difference from Texas, the largest of the no-tax states, is that Washington " +
        "does run state payroll deductions. Paid Family and Medical Leave and WA Cares are " +
        "withheld from Washington wages, while a Texas paycheck carries no state " +
        "deduction at all. Washington also has no city or county income tax, so Seattle " +
        "and Spokane employees pay no local wage tax.",
    ],
    faqs: [
      {
        q: "Does Washington have a state income tax?",
        a: "Not on wages. The Washington Department of Revenue says the state does not currently have an individual income tax, so no state income tax is withheld from a paycheck. Senate Bill 6346 does create a 9.9% income tax on annual adjusted gross income above $1 million, but it takes effect January 1, 2028, with the first returns due in April 2029.",
      },
      {
        q: "What is the Washington Paid Family and Medical Leave premium for 2026?",
        a: "The 2026 premium is 1.13% of gross wages, not including tips, up to the 2026 Social Security cap of $184,500. The employee pays up to 71.43% of that premium, which is about 0.81% of wages, and the employer pays the remaining 28.57% if the business has 50 or more employees.",
      },
      {
        q: "What is the WA Cares Fund deduction on a Washington paycheck?",
        a: "WA Cares is a 0.58% premium on gross wages, withheld from employees since July 1, 2023. Unlike Paid Family and Medical Leave, it has no wage cap, so it applies to every dollar of wages. Employees pay the whole premium; employers pay no share of it, though they must collect it.",
      },
      {
        q: "How much is taken out of a $90,000 salary in Washington?",
        a: "For 2026, a single filer paid biweekly takes home about $2,774.81 per paycheck from a $90,000 salary: $3,461.54 gross, $421.92 federal income tax, $214.62 Social Security, $50.19 Medicare, and $0.00 Washington income tax. Paid Leave of roughly $28 and WA Cares of $20.08 come out on top of that.",
      },
      {
        q: "Do Washington cities or counties charge a local income tax?",
        a: "No. Washington cities and counties do not levy a local income tax on wages, so there is no city wage tax like those in New York City, Philadelphia, or Ohio municipalities. Local revenue in Washington comes from sales and property taxes.",
      },
      {
        q: "What is the Washington capital gains excise tax?",
        a: "RCW 82.87 imposes a 7% excise tax on long-term capital gains above a standard deduction, which is adjusted for inflation each year. It is an excise tax on the sale of assets such as stock, not an income tax on wages, and nothing is withheld from a paycheck for it.",
      },
      {
        q: "Do you have to file a Washington state tax return?",
        a: "There is no Washington personal income tax return to file for wage income. If you owe the capital gains excise tax, you file a separate excise tax return with the Department of Revenue. The new SB 6346 income tax will require a return for affected filers beginning with tax year 2028.",
      },
      {
        q: "Can you opt out of Washington Paid Leave or WA Cares?",
        a: "Paid Family and Medical Leave is mandatory for almost all Washington employees; only narrow groups such as some federal workers and self-employed people who choose not to opt in are outside it. WA Cares allows certain exemptions, including some workers on non-immigrant visas and employees who already bought a qualifying long-term care policy before November 1, 2021, and those employees must apply to the state rather than simply telling an employer.",
      },
    ],
    sources: [
      { label: "Washington Department of Revenue — Income tax", url: "https://dor.wa.gov/taxes-rates/income-tax" },
      { label: "Washington Department of Revenue — Taxes and rates", url: "https://dor.wa.gov/taxes-rates" },
      { label: "Washington Paid Family and Medical Leave — Employer roles and responsibilities", url: "https://paidleave.wa.gov/employer-roles-responsibilities/" },
      { label: "WA Cares Fund — Employers", url: "https://wacaresfund.wa.gov/employers/" },
      { label: "RCW 82.87 — Capital gains tax", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=82.87" },
      { label: "RCW 50A.04.130 — Paid family and medical leave premium rates", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=50A.04.130" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-MA",
    abbr: "ma",
    slug: "massachusetts",
    name: "Massachusetts",
    example: { salary: 80000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Department of Revenue and MGL.
    hasIncomeTax: true,
    title: "Massachusetts Paycheck Calculator - Take-Home Pay After MA Tax",
    description:
      "Free Massachusetts paycheck calculator. Estimate 2026 take-home pay after the 5% Massachusetts flat tax, the 4% millionaire surtax, PFML, federal tax, and FICA.",
    intro:
      "Estimate your take-home pay in Massachusetts. The Commonwealth charges a flat " +
      "5% on most wage income, adds a 4% surtax above $1 million, and withholds a Paid " +
      "Family and Medical Leave premium on top of that. There is no city or county wage " +
      "tax anywhere in Massachusetts, so a Boston paycheck and a Springfield paycheck face " +
      "the same state withholding. Enter your salary and pay frequency to see your net pay " +
      "per period.",
    keyHeading: "Does Massachusetts have a state income tax?",
    keyParagraphs: [
      "Yes. Chapter 62, section 4 of the Massachusetts General Laws taxes Part B income, " +
        "which is where wages and most other ordinary income land, at a flat 5%. Unlike a " +
        "graduated state, Massachusetts applies that single rate to every dollar of taxable " +
        "wages once the personal exemption and any deductions are subtracted, so the state " +
        "withholding rate does not change as a salary climbs from $40,000 to $400,000.",
      "The one place the rate does change is above $1 million. Chapter 62, section 4(d), " +
        "added by a 2022 constitutional amendment, taxes the portion of a taxpayer's Part A, " +
        "B, and C income above $1,000,000 at an additional 4%, which makes the marginal rate " +
        "on that slice 9%. Only the income above the $1 million line is hit; the first " +
        "million dollars of taxable income is still taxed at the ordinary 5% rate.",
      "Massachusetts also withholds a Paid Family and Medical Leave premium. The 2026 total " +
        "contribution rate is 0.88% of eligible wages up to the Social Security wage base, " +
        "split so that the employee pays 0.46% and the employer pays 0.42% at employers with " +
        "25 or more covered workers. Employers with fewer than 25 covered workers owe only " +
        "the employee share, so their employees pay the full 0.88%.",
      "The calculator on this page applies the simplified 2026 data held in this repo: a " +
        "flat 5% rate on wages after a $4,400 standard deduction for a single filer. Chapter " +
        "62, section 3(b) actually allows a personal exemption of up to $4,400 for a single " +
        "filer and $8,800 for a married couple filing jointly, and renters may deduct half " +
        "of their rent up to $4,000. Massachusetts also has a 4% millionaire surtax that the " +
        "simplified data does not model, so a very high earner should treat the state line " +
        "here as low.",
    ],
    calcSteps: [
      "<strong>Gross pay.</strong> Annual salary divided by the number of pay periods you selected, or hourly rate times hours worked for an hourly employee.",
      "<strong>Pre-tax deductions.</strong> 401(k), HSA, and health insurance premiums come out first, and they lower the wages that both Massachusetts and the IRS tax.",
      "<strong>Massachusetts standard deduction.</strong> The 2026 data used here subtracts $4,400 for a single filer before any state tax is charged. Massachusetts labels that allowance a personal exemption.",
      "<strong>Massachusetts income tax.</strong> A flat 5% on what remains. The rate does not step up with income, except that taxable income above $1 million carries an extra 4%, which this simplified data does not model.",
      "<strong>Federal income tax.</strong> The federal standard deduction and marginal brackets are applied separately to the same wages.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the 2026 wage base of $184,500, Medicare at 1.45%, plus the additional 0.9% Medicare tax once wages pass $200,000 for a single filer.",
      "<strong>Massachusetts Paid Family and Medical Leave.</strong> A 0.88% premium on eligible wages up to the Social Security wage base, of which the employee pays 0.46% at employers with 25 or more covered workers. The calculator does not yet subtract this line.",
    ],
    compareParagraphs: [
      "A flat 5% puts Massachusetts below New York, New Jersey, and California on wage " +
        "income, and above the flat-tax states it is most often compared with. Illinois is " +
        "at 4.95%, Michigan at 4.25%, North Carolina at 4.25%, and Georgia at 5.19%, so a " +
        "Massachusetts paycheck withholds about the same state tax as a Georgia paycheck and " +
        "more than a Michigan or Illinois one. What Massachusetts adds that none of those " +
        "states do is the 4% surtax on taxable income above $1 million.",
      "Massachusetts differs from its neighbours on local tax. New York stacks a New York " +
        "City or Yonkers resident tax on top of state withholding, and Pennsylvania and Ohio " +
        "let municipalities levy their own wage tax; Massachusetts has no local income tax at " +
        "all, so Boston, Worcester, and Cambridge employees pay the same state rate. " +
        "Massachusetts does run a paid-leave premium, which New Hampshire and Florida do not, " +
        "though it is far smaller than New Jersey's combined TDI and FLI deductions.",
    ],
    faqs: [
      {
        q: "What is the Massachusetts income tax rate for 2026?",
        a: "Massachusetts taxes wages at a flat 5% under Chapter 62, section 4 of the General Laws. There are no graduated brackets for ordinary wage income. A 2022 constitutional amendment added a 4% surtax on the portion of taxable income above $1 million, which brings the marginal rate on that slice to 9%.",
      },
      {
        q: "How much is taken out of an $80,000 salary in Massachusetts?",
        a: "For 2026, a single filer paid biweekly takes home about $2,312.23 per paycheck from an $80,000 salary: $3,076.92 gross, $337.31 federal income tax, $190.77 Social Security, $44.62 Medicare, and $192.00 Massachusetts state income tax. The PFML employee premium of roughly $14.15 per paycheck comes out on top of that.",
      },
      {
        q: "Does Massachusetts have a local or city income tax?",
        a: "No. No Massachusetts city or town levies an income tax on wages, so there is no Boston, Worcester, or Cambridge wage tax and no county income tax. Massachusetts municipalities raise local revenue from property tax and local option excise taxes, none of which are withheld from a paycheck.",
      },
      {
        q: "What is the Massachusetts Paid Family and Medical Leave contribution rate for 2026?",
        a: "The 2026 total PFML contribution rate is 0.88% of eligible wages, up to the Social Security wage base. At an employer with 25 or more covered individuals the employee pays 0.46% of wages and the employer pays 0.42%. At an employer with fewer than 25 covered individuals, the employer owes no share and the employee pays the full 0.88%.",
      },
      {
        q: "What is the Massachusetts personal exemption for 2026?",
        a: "Chapter 62, section 3(b) sets the personal exemption at up to $4,400 for a single filer and up to $8,800 for a married couple filing jointly. The exemption is inflation-adjusted and capped, and there are extra amounts for a taxpayer 65 or older, for a blind taxpayer, and for dependents. The simplified 2026 data behind this calculator uses the $4,400 single figure as its standard deduction.",
      },
      {
        q: "Do you have to file a Massachusetts state tax return?",
        a: "Yes, if you had Massachusetts income above the filing threshold or had Massachusetts tax withheld. Massachusetts residents file Form 1; part-year residents and nonresidents who worked in the Commonwealth file Form 1-NR/PY. The return is filed with the Massachusetts Department of Revenue, separate from the federal Form 1040.",
      },
      {
        q: "What is the Massachusetts millionaire surtax?",
        a: "A 2022 amendment to the Massachusetts Constitution added Chapter 62, section 4(d), which taxes the portion of a taxpayer's Part A, B, and C income above $1,000,000 at an additional 4%. The result is a 9% marginal rate on that slice of income. It applies only to the dollars above the $1 million threshold, and the $1 million threshold itself is adjusted annually for inflation.",
      },
      {
        q: "Can a Massachusetts employee opt out of PFML?",
        a: "Most Massachusetts W-2 employees cannot opt out; the PFML contribution is mandatory for covered individuals. The main exceptions are federal employees, employees of other states, and certain other categories outside the definition of a covered individual in Chapter 175M. Self-employed people and sole proprietors are not covered automatically and must opt in.",
      },
    ],
    sources: [
      { label: "Massachusetts Department of Revenue — Personal income tax", url: "https://www.mass.gov/orgs/massachusetts-department-of-revenue" },
      { label: "MGL Chapter 62, Section 4 — Rates of tax", url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter62/Section4" },
      { label: "MGL Chapter 62, Section 3 — Deductions and exemptions", url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter62/Section3" },
      { label: "MGL Chapter 175M — Paid Family and Medical Leave", url: "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXXII/Chapter175M" },
      { label: "Massachusetts Paid Family and Medical Leave — Contribution rates", url: "https://www.mass.gov/info-details/paid-family-and-medical-leave-contribution-rates" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-AZ",
    abbr: "az",
    slug: "arizona",
    name: "Arizona",
    example: { salary: 70000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Unique per-state copy. Reviewed against the Arizona Department of Revenue.
    hasIncomeTax: true,
    title: "Arizona Paycheck Calculator - Take-Home Pay After AZ Tax",
    description:
      "Free Arizona paycheck calculator. Estimate take-home pay after Arizona's flat 2.5% income tax, its standard deduction, and federal withholding. 2026.",
    intro:
      "Work out what an Arizona paycheck leaves you. Since 2023 Arizona has charged wage " +
      "income one flat rate instead of a bracket table, so the state line is a straight " +
      "percentage of taxable pay. Enter your salary and pay frequency to see federal, " +
      "Arizona, and FICA withholding for each period.",
    keyHeading: "How does Arizona tax a paycheck?",
    keyParagraphs: [
      "Arizona taxes wages at a single flat rate of 2.5%. The Legislature replaced the old " +
        "graduated schedule with that rate under S.B. 1828 (2021), and the Department of " +
        "Revenue confirms a 2.5% tax rate for all income levels and filing statuses. Because " +
        "the rate is flat, a single filer and a married couple filing jointly owe the same " +
        "percentage, and the only thing that changes the Arizona line is how much taxable " +
        "income is left after deductions.",
      "Arizona applies its own standard deduction before the 2.5% is charged. For tax year " +
        "2025 the Department of Revenue set the single and married-filing-separately amount " +
        "at $15,750, with $31,500 for a married couple filing jointly and $23,600 for a head " +
        "of household; the amounts are indexed to the Phoenix consumer price index and are " +
        "adjusted again for 2026. Arizona also allows an increased standard deduction for " +
        "charitable contributions and a credit for contributions to school tuition " +
        "organizations.",
      "Above the flat rate, A.R.S. § 43-1013 adds a 3.5% public education surcharge on " +
        "taxable income over $250,000 for a single filer or married person filing separately, " +
        "and over $500,000 for a joint return or head of household. Arizona collects no local " +
        "or county income tax on wages, and it runs no state disability insurance and no paid " +
        "family leave payroll tax, so nothing is withheld for a state leave benefit.",
    ],
    calcSteps: [
      "<strong>Gross pay per period.</strong> Convert your annual salary, or an hourly rate times hours worked, into one paycheck at the frequency you chose.",
      "<strong>Pre-tax deductions.</strong> A traditional 401(k), an HSA, or a health insurance premium comes out first and lowers the wages that federal and Arizona income tax are charged on.",
      "<strong>Federal income tax.</strong> The federal standard deduction is subtracted, then the remaining income climbs the federal marginal brackets.",
      "<strong>FICA.</strong> Social Security at 6.2% up to the annual wage base, Medicare at 1.45%, plus the extra 0.9% Medicare tax above the high-earner threshold.",
      "<strong>Arizona flat tax.</strong> Arizona removes its standard deduction and charges a single 2.5% rate on what remains &mdash; there is no bracket to step through.",
      "<strong>Public education surcharge.</strong> Income above the $250,000 single threshold (or $500,000 joint) also carries the 3.5% A.R.S. § 43-1013 surcharge.",
    ],
    compareParagraphs: [
      "Arizona's flat 2.5% is among the lowest state income tax rates in the country, and it " +
        "sits well below the top marginal rates in California, New York, or New Jersey. It is " +
        "also lower than the flat rates in Georgia, Illinois, or North Carolina, though those " +
        "states pair their rate with a different standard deduction, so a like-for-like " +
        "comparison depends on the taxable income left after each state's subtraction.",
      "Unlike Pennsylvania, Ohio, or New York, Arizona levies no local income tax: no city " +
        "or county rate is withheld on top of the state tax, so the 2.5% is the whole " +
        "state-and-local picture. Arizona also has no state disability insurance and no paid " +
        "family leave payroll tax, so there is no state leave deduction the way there is in " +
        "California, New Jersey, or Washington. Arizona unemployment insurance is funded by " +
        "employer contributions, not employee withholding.",
    ],
    faqs: [
      {
        q: "Does Arizona have a state income tax?",
        a: "Yes. Arizona taxes wage income at a single flat rate of 2.5%. The Legislature replaced the old graduated schedule with that rate under S.B. 1828 in 2021, and the Arizona Department of Revenue confirms a 2.5% rate for all income levels and filing statuses.",
      },
      {
        q: "What is the Arizona income tax rate for 2026?",
        a: "2.5% for every filing status. Because Arizona uses one flat rate, single filers, heads of household, and married couples filing jointly all pay the same percentage of taxable income after the Arizona standard deduction.",
      },
      {
        q: "Does Arizona have a standard deduction?",
        a: "Yes. For tax year 2025 the Arizona standard deduction was $15,750 for a single filer or married person filing separately, $31,500 for a married couple filing jointly, and $23,600 for a head of household. The amounts are indexed to the Phoenix consumer price index and are adjusted for 2026.",
      },
      {
        q: "How much is taken out of a $70,000 salary in Arizona?",
        a: "For 2026, a single filer paid biweekly takes home about $2,180.38 per paycheck from a $70,000 salary: $2,692.31 gross, $252.69 federal income tax, $166.92 Social Security, $39.04 Medicare, and $53.27 Arizona state income tax. That is $56,690 a year, an effective tax rate of about 19.0%.",
      },
      {
        q: "What is the Arizona public education surcharge?",
        a: "A.R.S. § 43-1013 adds a 3.5% surcharge on taxable income above $250,000 for a single filer or a married person filing separately, and above $500,000 for a joint return or head of household. It is collected with the regular income tax and funds the student support and safety fund. Most wage earners never reach the threshold.",
      },
      {
        q: "Do Arizona cities or counties charge a local income tax?",
        a: "No. No Arizona city or county levies an income tax on wages. Municipal revenue in Arizona comes from transaction privilege (sales) tax and property tax, neither of which is withheld from a paycheck.",
      },
      {
        q: "Does Arizona have disability or paid family leave withholding?",
        a: "No. Arizona has no state disability insurance program and no state paid family leave payroll tax, so neither appears as a deduction on an Arizona paycheck. Arizona unemployment insurance is an employer-paid tax, not an employee withholding.",
      },
      {
        q: "Did Arizona's flat tax reduce what employees pay?",
        a: "Yes. Before the flat rate took effect, Arizona used a graduated schedule whose top rate was 4.50%, so most wage earners saw the state withholding percentage fall. Because the rate is now flat, an Arizona paycheck's state line is the same 2.5% regardless of filing status.",
      },
    ],
    sources: [
      { label: "Arizona Department of Revenue — Individual income tax highlights", url: "https://azdor.gov/forms/individual-income-tax-highlights" },
      { label: "Arizona Department of Revenue", url: "https://azdor.gov/" },
      { label: "A.R.S. § 43-1011 — Taxes and tax rates", url: "https://www.azleg.gov/ars/43/01011.htm" },
      { label: "A.R.S. § 43-1013 — Income tax surcharge for public education", url: "https://www.azleg.gov/ars/43/01013.htm" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-TN",
    abbr: "tn",
    slug: "tennessee",
    name: "Tennessee",
    example: { salary: 55000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Tennessee: no tax on wages, protected by a 2014 constitutional amendment.
    hasIncomeTax: false,
    title: "Tennessee Paycheck Calculator - Take-Home Pay After Taxes",
    description:
      "Free Tennessee paycheck calculator. Tennessee has no tax on wages, so estimate take-home pay after federal income tax, Social Security, and Medicare. 2026.",
    intro:
      "Work out what a Tennessee paycheck actually leaves in your account. Tennessee " +
      "withholds nothing from wages for state income tax, so federal income tax, Social " +
      "Security, and Medicare are the only deductions the calculator applies. Enter your " +
      "pay rate and frequency to see net pay per period.",
    keyHeading: "Does Tennessee tax your paycheck?",
    keyParagraphs: [
      "No. Tennessee collects no tax on wages or salaries, so the state income tax line on " +
        "a Tennessee pay stub is either blank or absent entirely. Tennessee voters settled " +
        "the question in 2014 by ratifying Amendment 3, which added Article II, Section 28 " +
        "to the state constitution and made it unlawful for the General Assembly to levy a " +
        "tax on any individual's earned income or on any payroll tax on employers.",
      "The amendment drew a line between earned income, which is now constitutionally " +
        "off limits, and investment income, which the state was still allowed to reach. That " +
        "left the Hall income tax, a levy on interest and dividends, as Tennessee's only " +
        "personal income tax. The General Assembly phased it down a point at a time and it " +
        "expired for tax years beginning January 1, 2021, so Tennessee now taxes no personal " +
        "income of any kind.",
      "A Tennessee employee therefore sees only three deductions on a normal paycheck: " +
        "federal income tax, Social Security at 6.2%, and Medicare at 1.45%. The calculator " +
        "on this page computes exactly those, using 2026 federal brackets.",
    ],
    calcSteps: [
      "Start with gross pay for the period. A $55,000 salary paid biweekly is $2,115.38 before deductions.",
      "Subtract federal income tax, withheld using the IRS percentage method for your filing status and Form W-4.",
      "Subtract Social Security at 6.2% of gross pay up to the annual wage base ($184,500 for 2026).",
      "Subtract Medicare at 1.45% of all gross pay, plus the 0.9% Additional Medicare Tax above $200,000 of wages.",
      "Subtract no state income tax. Tennessee has none, and no city or county in the state imposes one either.",
      "The remainder is net take-home pay for that period.",
    ],
    compareParagraphs: [
      "Against other states with no wage tax, Tennessee is unusual in that the ban is written " +
        "into the constitution rather than resting on a statute the legislature could repeal. " +
        "Texas and Florida rely on their constitutions too, but Tennessee is the only state " +
        "that added its prohibition by a statewide referendum in the modern era, which is why " +
        "its treatment of investment income changed at the same time.",
      "What Tennessee gives up on income tax it recovers elsewhere. The state sales tax rate " +
        "is 7%, the highest state-level rate in the country, and local option sales taxes push " +
        "the average combined rate near 9.6%. Tennessee also has no state property tax on real " +
        "estate, so local governments rely on county and municipal property levies and on the " +
        "sales tax. For a wage earner, the practical result is a lower paycheck deduction and a " +
        "higher cost at the register.",
      "Tennessee is not a high-wage state, so the federal standard deduction and the 10% and " +
        "12% brackets absorb most of a typical salary. A single filer earning $55,000 keeps " +
        "roughly 84% of gross pay before any 401(k) or health insurance election, and those " +
        "pre-tax elections reduce the federal bill further.",
    ],
    faqs: [
      {
        q: "Does Tennessee have a state income tax?",
        a: "No. Tennessee taxes neither wages nor any other form of personal income. Amendment 3, ratified in 2014, added Article II, Section 28 to the Tennessee Constitution, prohibiting a tax on earned income. The Hall income tax on interest and dividends, the state's last personal income tax, was phased out and expired after 2020.",
      },
      {
        q: "What is withheld from a Tennessee paycheck?",
        a: "Three things: federal income tax, Social Security at 6.2% up to the annual wage base, and Medicare at 1.45%. If you elect pre-tax benefits such as a 401(k) or a health savings account, those come out first and reduce the federal income tax withheld. Nothing is withheld for Tennessee.",
      },
      {
        q: "How much is taken out of a $55,000 salary in Tennessee?",
        a: "For 2026, a single filer paid biweekly takes home about $1,783.56 per paycheck from a $55,000 salary: $2,115.38 gross, $170.00 federal income tax, $131.15 Social Security, $30.67 Medicare, and $0 Tennessee state income tax. That is $46,372.50 a year, an effective tax rate of about 15.7%.",
      },
      {
        q: "Do Tennessee cities or counties charge a local income tax?",
        a: "No. Tennessee has no municipal or county income tax on wages. Local revenue comes from local option sales tax, county property tax, and business taxes. This is one reason the state's combined sales tax rate is among the highest in the country.",
      },
      {
        q: "Do you have to file a Tennessee state tax return?",
        a: "Not for wages. With no personal income tax, Tennessee has no individual income tax return for wage earners to file. The Hall income tax return is gone as well. You still file a federal return with the IRS, and businesses file separately with the Tennessee Department of Revenue.",
      },
      {
        q: "Does Tennessee have disability or paid family leave withholding?",
        a: "No. Tennessee has no state disability insurance program and no state paid family leave payroll tax, so neither shows up as a paycheck deduction. Tennessee unemployment insurance is an employer-paid tax and is not withheld from employee wages.",
      },
      {
        q: "Did the Hall income tax affect paychecks?",
        a: "It never touched wages. The Hall income tax applied only to interest and dividend income above an exemption, was collected through an annual return rather than payroll withholding, and was repealed in stages from 2016 until it expired for tax years beginning January 1, 2021.",
      },
      {
        q: "Does Tennessee tax bonuses or overtime differently?",
        a: "No. Because the state taxes no wage income, a bonus or overtime payment is treated the same as regular pay for state purposes. Only the federal withholding calculation changes, since supplemental wages such as bonuses can be withheld at a flat 22% rate instead of the bracket method.",
      },
    ],
    sources: [
      { label: "Tennessee Department of Revenue — Taxes", url: "https://www.tn.gov/revenue/taxes.html" },
      { label: "Tennessee Constitution, Article II, Section 28 (Amendment 3, 2014)", url: "https://ballotpedia.org/Tennessee_Income_Tax_Prohibition,_Amendment_3_(2014)" },
      { label: "Tennessee Department of Revenue — Hall income tax repeal", url: "https://www.tn.gov/revenue/taxes/tennessee-income-tax-hall-income-tax.html" },
      { label: "IRS Publication 15 (Circular E)", url: "https://www.irs.gov/publications/p15" },
    ],
  },
  {
    code: "US-IN",
    abbr: "in",
    slug: "indiana",
    name: "Indiana",
    example: { salary: 60000, pay_frequency: "biweekly", filing_status: "single", tax_year: 2026 },

    // Indiana: flat state rate, but all 92 counties levy a Local Income Tax.
    hasIncomeTax: true,
    title: "Indiana Paycheck Calculator - Take-Home Pay After IN Tax",
    description:
      "Free Indiana paycheck calculator. Estimate take-home pay after Indiana's 2.95% flat income tax, federal income tax, Social Security, and Medicare for 2026.",
    intro:
      "Work out what an Indiana paycheck actually leaves in your account. Indiana charges " +
      "one flat state rate on wages, and every one of the state&rsquo;s 92 counties adds a " +
      "local income tax of its own on top, which is why two Indiana workers on the same " +
      "salary can take home different amounts. Enter your pay rate and frequency to see net " +
      "pay per period.",
    keyHeading: "How Indiana taxes a paycheck",
    keyParagraphs: [
      "Indiana taxes wage income at a single flat rate rather than on a ladder of brackets. " +
        "For the 2026 tax year the Department of Revenue states the individual adjusted gross " +
        "income tax rate as 2.95% (Departmental Notice #1, effective October 1, 2026). The " +
        "flat shape follows from Article 10, Section 1 of the Indiana Constitution, which " +
        "requires taxes on the same class of property to be uniform; the General Assembly has " +
        "been stepping the rate down in stages under Indiana Code 6-3-2-1.1, so a pay stub " +
        "from a few years ago shows a higher rate than this one.",
      "Indiana does not build its own income figure. It starts from the federal adjusted gross " +
        "income on your return, which is why a pre-tax 401(k) or health savings account " +
        "contribution cuts the Indiana bill as well as the federal one. From that starting " +
        "point the state subtracts a $1,000 personal exemption, $1,500 for each dependent, and " +
        "$3,000 for an adopted child, all of which you claim on Form WH-4 with your employer.",
      "Read the state line on this page as a close estimate rather than a payroll-system " +
        "figure. The 2026 data behind the calculator approximates Indiana&rsquo;s flat 2.95% " +
        "with three bands&mdash;3%, 3.075%, and 3.15%&mdash;and applies the $1,000 personal " +
        "exemption. Your employer withholds using the state&rsquo;s own percentage tables, so " +
        "the exact cents can differ.",
    ],
    calcSteps: [
      "Start with gross pay for the period. A $60,000 salary paid biweekly is $2,307.69 before any deduction.",
      "Subtract pre-tax elections first. A 401(k), HSA, or health premium reduces federal adjusted gross income, and because Indiana begins there, it reduces the state bill too.",
      "Subtract Indiana income tax at the flat state rate on wages after the $1,000 personal exemption. Indiana has no bracket tiers to climb and no separate state calculation to make.",
      "Subtract federal income tax, withheld under the IRS percentage method for your filing status and Form W-4.",
      "Subtract Social Security at 6.2% of gross pay up to the annual wage base ($184,500 for 2026) and Medicare at 1.45% of all gross pay, plus the 0.9% Additional Medicare Tax above $200,000 of wages.",
      "Subtract nothing for county tax here. Every Indiana county levies a Local Income Tax, but this calculator does not know your county, so the figure it reports is the state-only estimate.",
      "The remainder is net take-home pay for that period.",
    ],
    compareParagraphs: [
      "In Indiana the county matters about as much as the state. All 92 counties levy a Local " +
        "Income Tax under Indiana Code 6-3.6, at rates the Department of Revenue publishes in " +
        "Departmental Notice #1. They run from 0.5% in Porter County to 3% in Randolph County. " +
        "Marion County, which contains Indianapolis, charges 2.02%. Because every county levies " +
        "something, no Indiana wage earner escapes the local layer, and for a worker in a " +
        "high-rate county the local tax can rival the state tax.",
      "Which county applies is decided on January 1 of the tax year, not on the day you are " +
        "paid. If you live in an Indiana county on January 1, your county of residence sets the " +
        "rate for the whole year. If you live out of state on January 1 but your principal " +
        "place of business is an Indiana county, that county&rsquo;s rate applies instead. It " +
        "is also why a payroll department asks a new hire for a county even when nothing has " +
        "changed about their address.",
      "Against its neighbors Indiana charges the lowest state rate but layers on the widest " +
        "local tax. Michigan charges a flat 4.25% and adds a city income tax in only 24 cities. " +
        "Illinois charges 4.95% with no local income tax at all. Ohio uses graduated state " +
        "rates plus a municipal tax. Indiana&rsquo;s 2.95% sits below all of them, which is " +
        "why the county rate, not the state rate, usually decides which of two paychecks is " +
        "larger.",
      "Indiana also runs no state disability insurance and no state paid family leave payroll " +
        "tax, so no SDI or PFL line appears on an Indiana pay stub and neither is subtracted " +
        "here. The state does have reciprocal agreements with Kentucky, Michigan, Ohio, " +
        "Pennsylvania, and Wisconsin: a resident of one of those states who commutes into " +
        "Indiana files Form IT-40RNR and is not subject to Indiana withholding on those wages.",
    ],
    faqs: [
      {
        q: "What is the Indiana income tax rate for 2026?",
        a: "Indiana's individual adjusted gross income tax rate is a flat 2.95% for the 2026 tax year, as stated in Department of Revenue Departmental Notice #1 effective October 1, 2026. The same rate applies to every dollar of taxable income after exemptions, because Indiana has no graduated brackets.",
      },
      {
        q: "Does Indiana have a flat income tax?",
        a: "Yes. Indiana applies one flat rate to wage income rather than a bracket schedule. Article 10, Section 1 of the Indiana Constitution requires taxes on the same class of property to be uniform, and the General Assembly has been lowering the single rate in stages under Indiana Code 6-3-2-1.1.",
      },
      {
        q: "Does Indiana have a local income tax?",
        a: "Yes. All 92 Indiana counties levy a Local Income Tax under Indiana Code 6-3.6, at rates published in Departmental Notice #1. The rates range from 0.5% in Porter County to 3% in Randolph County, and Marion County, which includes Indianapolis, charges 2.02%. This calculator reports the state tax only, so an Indiana paycheck nets less than the figure shown here.",
      },
      {
        q: "Which county's income tax rate applies to me?",
        a: "The county where you lived on January 1 of the tax year. If you lived outside Indiana on January 1 but your principal place of work or business is in an Indiana county, that county's rate applies instead. Indiana fixes the county for the whole year on that January 1 date, so a mid-year move does not change your withholding rate until the following year.",
      },
      {
        q: "How much is taken out of a $60,000 salary in Indiana?",
        a: "For 2026, a single filer paid biweekly takes home about $1,868.73 per paycheck from a $60,000 salary: $2,307.69 gross, $193.08 federal income tax, $143.08 Social Security, $33.46 Medicare, and $69.35 Indiana state income tax. That is $48,587.00 a year, an effective tax rate of about 19.0%. County income tax is not included.",
      },
      {
        q: "What is the Indiana personal exemption?",
        a: "Indiana subtracts $1,000 for each personal exemption, $1,500 for each dependent, and $3,000 for an adopted child before applying the flat rate. You claim these on Form WH-4 with your employer. The 2026 data behind this calculator uses the $1,000 personal exemption for a single filer.",
      },
      {
        q: "Does Indiana have disability or paid family leave withholding?",
        a: "No. Indiana operates no state disability insurance program and no state paid family leave payroll tax, so neither appears as a deduction on an Indiana paycheck. Indiana unemployment insurance is an employer-paid tax and is not withheld from employee wages.",
      },
      {
        q: "Does Indiana withhold tax differently on a bonus or overtime?",
        a: "For a bonus or other one-time payment, Indiana Department of Revenue guidance is to compute withholding without applying the exemption amount, so more of a bonus is withheld per dollar than of regular pay. Overtime in a normal pay period is treated as ordinary wages and withheld at the flat rate after exemptions, unlike the federal supplemental-wage rate of 22% that employers may use on bonuses.",
      },
    ],
    sources: [
      { label: "Indiana Department of Revenue — Departmental Notice #1: State and county withholding rates", url: "https://www.in.gov/dor/files/dn01.pdf" },
      { label: "Indiana Department of Revenue — County Tax Rates (Local Income Tax)", url: "https://www.in.gov/dor/i-am-a/business-corp/county-tax-information" },
      { label: "Indiana Department of Revenue — Individual Income Tax Overview", url: "https://www.in.gov/dor/i-am-a/individual/individual-income-tax-overview" },
      { label: "Indiana Code 6-3.6 — Local Income Taxes", url: "https://iga.in.gov/laws/2023/ic/titles/6#6-3.6" },
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
