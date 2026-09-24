/**
 * Copy and data for the seven Bookkeeping_UAE_Search ad-group landing pages.
 * One entry per path. The brief (Google Doc "Landing page recommendations")
 * fixes the H1, subhead, proof points, body sections and CTA per page; this
 * file carries them verbatim, and src/pages/AdGroupLanding.jsx only lays out
 * whatever each entry lists.
 *
 * Rules the entries follow (see the site guide):
 * - Every page has its own H1, hero composition (`heroVariant`), proof set and
 *   body copy. Nothing below is shared between two entries.
 * - Numbers are only ones already published on this site or given in the
 *   brief. Unsourced figures from the brief (backlog weeks, client tenure,
 *   years operating, hire-cost amounts, response SLA) are left out until a
 *   source is supplied.
 * - Any penalty or deadline carries a footnote to the official source.
 * - The credential is "FTA Registered Tax Agency", No. 30022628. Nothing else.
 */

/** Shared form anchor id. Each page renders exactly one lead form. */
export const LEAD_FORM_ID = 'get-started';

/** Official source for UAE tax administrative penalties, checked 24 Sep 2026. */
const FTA_PENALTIES_SOURCE = {
  id: 'fta-penalties',
  text:
    'Cabinet Decision No. 40 of 2017 on Administrative Penalties for Violations of Tax Laws in the UAE, as amended (including Cabinet Decision No. 129 of 2025, in force from 14 April 2026). Consolidated text published by the Federal Tax Authority, November 2025. Checked 24 September 2026.',
  url:
    'https://tax.gov.ae/Datafolder/Files/Legislation/2025/Cabinet%20Decision%20No.%2040%20of%202017%20and%20its%20amendments%20-%20publishing%2011%202025.pdf',
  label: 'tax.gov.ae',
};

const FTA_AGENCY = 'FTA Registered Tax Agency, Agency Registration No. 30022628';

export const adGroupLandings = {
  /* ------------------------------------------------------------------ 1 */
  'hire-accountant': {
    path: '/hire-accountant',
    seoTitle: 'Hire a Chartered Accountant in Dubai | Finanshels',
    seoDescription:
      'A named chartered accountant owns your books, VAT and corporate tax. Reviewed every month. Trusted by 7,000+ UAE businesses.',
    heroVariant: 'accountant-card',
    eyebrow: 'CHARTERED ACCOUNTANTS IN DUBAI',
    h1: 'Hire a Chartered Accountant in Dubai — Not a Spreadsheet',
    subhead:
      'A real accountant owns your numbers. FTA-compliant books, VAT and corporate tax handled, reviewed by a CA every month.',
    proof: [
      { value: '7,000+', label: 'UAE businesses served' },
      { value: '4.9', label: 'Trustpilot rating, 239 reviews' },
      { value: '10x', label: 'Faster close cycle' },
      { value: '1', label: 'Named accountant per client, not a ticket queue' },
    ],
    cta: {
      label: 'Talk to Your Accountant',
      color: 'orange',
      kind: 'booking',
      microcopy: 'Book a 30-minute call. You speak to an accountant, not a sales rep.',
    },
    sections: [
      {
        type: 'compare',
        id: 'services',
        eyebrow: 'THE OLD WAY VS FINANSHELS',
        title: 'A generic bookkeeper keeps records. Your accountant owns them.',
        leftLabel: 'Freelancer or generic bookkeeper',
        rightLabel: 'Your Finanshels chartered accountant',
        rows: [
          ['Enters transactions when there is time', 'Closes your books every month on a set calendar'],
          ['VAT and corporate tax passed to someone else', 'VAT and corporate tax handled by the same team'],
          ['Nobody senior checks the work', 'A CA reviews your numbers every month'],
          ['You chase them for updates', 'One named accountant who knows your business'],
          ['Leaves when a better job comes along', 'A firm with 150+ accountants behind your account'],
        ],
      },
      {
        type: 'credentials',
        id: 'credentials',
        eyebrow: 'CREDENTIALS',
        title: 'Qualified for UAE books, not just any books',
        items: [
          {
            title: 'Chartered Accountant review',
            copy: 'Every client file is reviewed by a qualified CA before the month is closed.',
          },
          {
            title: 'FTA Registered Tax Agency',
            copy: 'Agency Registration No. 30022628. We prepare and file VAT and corporate tax returns on EmaraTax.',
          },
          {
            title: 'UAE-specific experience',
            copy: 'Mainland, free zone and multi-entity businesses across VAT, corporate tax and year-end.',
          },
        ],
      },
      {
        type: 'priceStatement',
        id: 'pricing',
        eyebrow: 'PRICING',
        title: 'The price you see is the price you pay',
        lead: 'Bookkeeping packages start from AED 499 a month. VAT and corporate tax are quoted on the same plan.',
        points: [
          'No setup fee',
          'No charge for onboarding or migrating your history',
          'Billed monthly, no lock-in',
          'Your quote is confirmed in writing before you start',
        ],
      },
    ],
    form: {
      eyebrow: 'SPEAK TO AN ACCOUNTANT',
      title: 'Prefer we call you?',
      copy: 'Leave your number and an accountant calls you back within 1 business day.',
      formTitle: 'Request a call from an accountant',
      formSubtitle: 'Takes 30 seconds. No obligation.',
    },
    footnotes: [],
  },

  /* ------------------------------------------------------------------ 2 */
  'remote-bookkeeper': {
    path: '/remote-bookkeeper',
    seoTitle: 'Remote & Part-Time Bookkeeper UAE | From AED 499/month',
    seoDescription:
      'Skip the full-time hire. Cloud bookkeeping and part-time accounting for UAE businesses, on a flat monthly plan from AED 499.',
    heroVariant: 'cost-scale',
    eyebrow: 'REMOTE, PART-TIME AND CLOUD BOOKKEEPING',
    h1: 'Skip the Full-Time Hire. Get a Remote Bookkeeper Instead.',
    subhead:
      'Flexible bookkeeping and part-time accounting, done cloud-first — no desk, no payroll overhead, no onboarding headache.',
    proof: [
      { value: 'AED 499', label: 'Flat monthly plans start here' },
      { value: '0', label: 'Visas, desks or payroll to add' },
      { value: 'Cloud', label: 'Zoho Books, Xero, QuickBooks or FreshBooks' },
      { value: 'WhatsApp', label: 'Reach your bookkeeper where you already work' },
    ],
    cta: {
      label: 'See Remote Bookkeeping Plans',
      color: 'blue',
      kind: 'anchor',
      target: 'pricing',
      microcopy: 'Three plans, published prices. Pick one or ask us to size it for you.',
    },
    sections: [
      {
        type: 'table',
        id: 'services',
        eyebrow: 'IN-HOUSE HIRE VS REMOTE FINANSHELS TEAM',
        title: 'What a full-time hire really costs you',
        columns: ['', 'In-house hire', 'Remote Finanshels team'],
        rows: [
          ['Cost', 'Salary plus benefits, visa and insurance', 'One flat monthly fee'],
          ['Setup', 'Recruiting, desk, laptop and software', 'Nothing to set up on your side'],
          ['Cover', 'Stops when they are sick or on leave', 'A team keeps your books moving'],
          ['Turnover risk', 'Knowledge walks out when they resign', 'Your file stays with the firm'],
          ['Scaling', 'A second hire when volume grows', 'Move up a plan, same accountant'],
        ],
      },
      {
        type: 'steps',
        id: 'how-it-works',
        eyebrow: 'HOW REMOTE BOOKKEEPING WORKS',
        title: 'Three steps. No office visits.',
        steps: [
          {
            title: 'Connect your accounts',
            copy: 'Give read access to your bank feeds and your Zoho Books, Xero, QuickBooks or FreshBooks file.',
          },
          {
            title: 'We reconcile',
            copy: 'Your remote bookkeeper categorises every transaction and reconciles every bank and card account.',
          },
          {
            title: 'You review the dashboard',
            copy: 'Profit, cash and balances on your dashboard, on the reporting cadence your plan includes.',
          },
        ],
      },
      {
        type: 'plans',
        id: 'pricing',
        eyebrow: 'REMOTE BOOKKEEPING PLANS',
        title: 'Scale up or down as the business changes',
        copy: 'Start small, move up a plan when volume grows, move down if it slows. No re-onboarding either way.',
        plans: [
          {
            name: 'Starter',
            price: 'AED 499',
            period: '/month',
            fit: 'Solo founders and new companies with light activity',
            points: ['Up to 50 transactions a year', 'Quarterly management accounts', 'Annual financial statements'],
          },
          {
            name: 'Growth',
            price: 'AED 999',
            period: '/month',
            fit: 'Steady month-on-month activity',
            featured: true,
            points: ['Up to 2,000 transactions a year', 'Quarterly bookkeeping and reports', 'Budget vs actual, multi-currency'],
          },
          {
            name: 'Scale',
            price: 'AED 1,999',
            period: '/month',
            fit: 'Higher volume or more than one entity',
            points: ['Up to 3,600 transactions a year', 'Monthly close and reports', 'Custom dashboard and integrations'],
          },
        ],
      },
    ],
    form: {
      eyebrow: 'GET SIZED FOR A PLAN',
      title: 'Not sure which plan fits?',
      copy: 'Tell us roughly how many transactions you run. We recommend a plan within 1 business day.',
      formTitle: 'Get a remote bookkeeping plan',
      formSubtitle: 'We reply within 1 business day.',
    },
    footnotes: [],
  },

  /* ------------------------------------------------------------------ 3 */
  'backlog-catch-up': {
    path: '/backlog-catch-up',
    seoTitle: 'Backlog Accounting Catch-Up UAE | Finanshels',
    seoDescription:
      'Months behind on your books? One-time backlog accounting that reconciles every period and brings you current. Fixed quote from AED 1,499.',
    heroVariant: 'backlog-timeline',
    eyebrow: 'BACKLOG ACCOUNTING, ONE-TIME RECOVERY',
    h1: "Months Behind on Your Books? We'll Catch You Up.",
    subhead:
      'Backlog accounting for businesses that fell behind — reconciled, FTA-compliant, and current again in weeks, not months.',
    proof: [
      { value: 'AED 1,499', label: 'Catch-up engagements start from' },
      { value: 'Fixed', label: 'Quote confirmed before work starts' },
      { value: 'In order', label: 'Every overdue period closed one by one' },
      { value: '1 day', label: 'Assessment reply, within 1 business day' },
    ],
    cta: {
      label: 'Start Your Catch-Up Assessment',
      color: 'orange',
      kind: 'anchor',
      target: 'get-started',
      microcopy: 'Tell us how far behind you are. We come back with scope and a fixed price.',
    },
    sections: [
      {
        type: 'steps',
        id: 'services',
        eyebrow: 'THE CATCH-UP PROCESS',
        title: 'From behind to current in four stages',
        variant: 'timeline',
        steps: [
          { title: 'Assessment', copy: 'We look at what exists: statements, invoices, your software file. You get scope and a fixed quote.' },
          { title: 'Reconciliation', copy: 'Every overdue month rebuilt and reconciled to the bank, in date order.' },
          { title: 'Filing catch-up', copy: 'Overdue VAT or corporate tax returns prepared from the reconciled numbers.' },
          { title: 'Ongoing handoff', copy: 'Once you are current, you can move onto monthly bookkeeping so the backlog does not rebuild.' },
        ],
      },
      {
        type: 'penalties',
        id: 'penalties',
        eyebrow: "WHAT HAPPENS IF YOU DON'T CATCH UP",
        title: 'The FTA penalty structure, stated plainly',
        copy: 'These are the administrative penalties the law sets. They are the reason to act now, not a reason to panic.',
        items: [
          {
            label: 'Tax return not filed on time',
            value: 'AED 1,000',
            detail: 'First time. AED 2,000 if repeated within 24 months.',
            source: 'fta-penalties',
          },
          {
            label: 'Tax not paid by the due date',
            value: '14% a year',
            detail: 'Charged monthly on the unpaid amount, for each month or part of a month.',
            source: 'fta-penalties',
          },
          {
            label: 'Required records not kept',
            value: 'AED 10,000',
            detail: 'Per violation. AED 20,000 if repeated within 24 months.',
            source: 'fta-penalties',
          },
        ],
        note: 'Figures are the published penalties, not a prediction of what applies to your business. Your assessment tells you where you stand.',
      },
      {
        type: 'beforeAfter',
        id: 'before-after',
        eyebrow: 'BEFORE AND AFTER',
        title: "We've done this before. Here is what changes.",
        before: [
          'Bank accounts not reconciled for months',
          'Receipts and invoices in inboxes and folders',
          'Returns late or filed on estimates',
          'No idea what the real profit is',
        ],
        after: [
          'Every account reconciled to the closing date',
          'A clean general ledger and trial balance',
          'Overdue returns prepared from real numbers',
          'An exception list for anything still missing',
        ],
      },
    ],
    form: {
      eyebrow: 'CATCH-UP ASSESSMENT',
      title: 'Start with an honest look at the backlog',
      copy: 'A senior accountant reviews your details and replies with scope and a fixed quote within 1 business day.',
      formTitle: 'Start your catch-up assessment',
      formSubtitle: 'No commitment. We confirm scope and price first.',
    },
    footnotes: [FTA_PENALTIES_SOURCE],
  },

  /* ------------------------------------------------------------------ 4 */
  'outsource-accounting': {
    path: '/outsource-accounting',
    seoTitle: 'Outsourced Accounting Dubai | Full Accounting Function',
    seoDescription:
      'Outsource the whole accounting function: books, reporting, VAT and audit prep. One partner instead of three vendors.',
    heroVariant: 'function-stack',
    eyebrow: 'OUTSOURCED ACCOUNTING IN DUBAI',
    h1: 'Outsource Your Accounting Function, Not Just Your Bookkeeping',
    subhead:
      'Full-function outsourced accounting — books, reporting, VAT, and a team that scales with you. One partner instead of three vendors.',
    proof: [
      { value: '3 in 1', label: 'Bookkeeping, reporting and tax in one engagement' },
      { value: '150+', label: 'Accountants in the team behind you' },
      { value: '1', label: 'Account manager as your single point of contact' },
      { value: '4', label: 'Functions covered: books, VAT, reporting, audit prep' },
    ],
    cta: {
      label: 'Get an Outsourcing Quote',
      color: 'orange',
      kind: 'anchor',
      target: 'get-started',
      microcopy: 'Tell us what your finance function does today. We quote the full scope.',
    },
    sections: [
      {
        type: 'table',
        id: 'what-it-replaces',
        eyebrow: 'WHAT OUTSOURCING REPLACES',
        title: 'An in-house accounting department, line by line',
        columns: ['', 'In-house department', 'Finanshels'],
        rows: [
          ['People', 'Accountant, senior accountant, finance manager', 'A dedicated team sized to your volume'],
          ['Tax', 'A separate tax consultant for VAT and corporate tax', 'Included, from an FTA Registered Tax Agency'],
          ['Tools', 'Software licences and add-ons', 'We work inside your existing software'],
          ['Overheads', 'Salaries, visas, insurance, training, leave cover', 'One monthly fee'],
          ['Management time', 'Hiring, managing and replacing staff', 'One partner to hold accountable'],
        ],
      },
      {
        type: 'scope',
        id: 'services',
        eyebrow: 'SERVICE SCOPE',
        title: 'Everything the function covers, ticked',
        rows: [
          { label: 'Bookkeeping', copy: 'Categorisation, reconciliation and month-end close' },
          { label: 'VAT', copy: 'Returns prepared and filed, records kept to FTA requirements' },
          { label: 'CFO-lite reporting', copy: 'Management reports, cash flow and budget vs actual' },
          { label: 'Audit prep', copy: 'Year-end schedules and working papers your auditor can use' },
        ],
      },
      {
        type: 'logos',
        id: 'clients',
        eyebrow: 'CLIENTS',
        title: 'Finance functions we run today',
        count: 10,
      },
    ],
    form: {
      eyebrow: 'OUTSOURCING QUOTE',
      title: 'Get one quote for the whole function',
      copy: 'Share the basics. We map your current setup and send a scoped quote within 1 business day.',
      formTitle: 'Get an outsourcing quote',
      formSubtitle: 'One quote. Bookkeeping, reporting and tax together.',
    },
    footnotes: [],
  },

  /* ------------------------------------------------------------------ 5 */
  'accounting-services': {
    path: '/accounting-services',
    seoTitle: 'Accounting Services in Dubai | Built for UAE Compliance',
    seoDescription:
      'Bookkeeping, VAT, corporate tax, audit prep and CFO consultation from one accounting team. Serving Dubai, Abu Dhabi and Sharjah.',
    heroVariant: 'service-tiles',
    eyebrow: 'ACCOUNTING SERVICES, UAE-WIDE',
    h1: 'Accounting Services in Dubai — Built for UAE Compliance',
    subhead:
      'Bookkeeping, VAT, corporate tax, and audit-ready reporting — one accounting team, one dashboard, FTA-compliant by design.',
    proof: [
      { value: '5', label: 'Core services under one team' },
      { value: '7,000+', label: 'Businesses served' },
      { value: '3', label: 'Emirates covered: Dubai, Abu Dhabi, Sharjah' },
      { value: '1', label: 'Dashboard for every service' },
    ],
    cta: {
      label: 'Explore Our Services',
      color: 'blue',
      kind: 'anchor',
      target: 'services',
      microcopy: 'See what each service covers, then tell us which ones you need.',
    },
    sections: [
      {
        type: 'serviceGrid',
        id: 'services',
        eyebrow: 'SERVICE MENU',
        title: 'Pick one service or run them all through us',
        items: [
          { title: 'Bookkeeping', copy: 'Transactions categorised, accounts reconciled, books closed on schedule.', href: '/bookkeeping' },
          { title: 'VAT', copy: 'Registration, returns and the records the FTA expects you to keep.' },
          { title: 'Corporate Tax', copy: 'Registration, return preparation and filing on EmaraTax.' },
          { title: 'Audit prep', copy: 'Reconciled schedules and working papers ready for your auditor.' },
          { title: 'CFO consultation', copy: 'Cash flow, budgets and the numbers behind big decisions.' },
        ],
      },
      {
        type: 'trust',
        id: 'why',
        eyebrow: 'WHY UAE BUSINESSES CHOOSE FINANSHELS',
        title: 'Why UAE businesses choose Finanshels',
        items: [
          { title: FTA_AGENCY, copy: 'Tax work filed by a registered agency, not a freelancer.' },
          { title: '4.9 on Trustpilot', copy: 'Rated by clients across 239 reviews.' },
          { title: '150+ accountants', copy: 'Enough depth that your file never depends on one person.' },
        ],
      },
      {
        type: 'faq',
        id: 'faq',
        eyebrow: 'FAQ',
        title: 'Questions people ask before they start',
        items: [
          {
            q: 'Do you work with businesses outside Dubai?',
            a: 'Yes. We serve businesses across the UAE, including Abu Dhabi and Sharjah, and all work is delivered online.',
          },
          {
            q: 'Which accounting software do you use?',
            a: 'We work in Zoho Books, Xero, QuickBooks and FreshBooks. If you do not have a setup yet, we recommend one during onboarding.',
          },
          {
            q: 'Can you file my VAT and corporate tax returns?',
            a: 'Yes. Finanshels is an FTA Registered Tax Agency, Agency Registration No. 30022628, and files returns on EmaraTax.',
          },
          {
            q: 'How is pricing set?',
            a: 'By the services you choose and your transaction volume. Bookkeeping packages start from AED 499 a month, and every quote is confirmed in writing before you start.',
          },
        ],
      },
    ],
    form: {
      eyebrow: 'TELL US WHAT YOU NEED',
      title: 'Not sure where to start?',
      copy: 'Tell us about the business. We recommend the services that fit and reply within 1 business day.',
      formTitle: 'Get a services recommendation',
      formSubtitle: 'Free, and no obligation.',
    },
    footnotes: [],
  },

  /* ------------------------------------------------------------------ 6 */
  'accounting-firm': {
    path: '/accounting-firm',
    seoTitle: 'Chartered Accounting Firm in the UAE | Finanshels',
    seoDescription:
      'A full chartered accounting firm with CAs, tax specialists and AML compliance experts on staff. FTA Registered Tax Agency No. 30022628.',
    heroVariant: 'firm-credentials',
    eyebrow: 'A CHARTERED ACCOUNTING FIRM',
    h1: 'A Chartered Accounting Firm for Growing UAE Businesses',
    subhead:
      'Not a freelancer, not a single bookkeeper — a full accounting firm with CAs, tax specialists, and AML compliance experts on staff.',
    proof: [
      { value: '150+', label: 'Qualified accountants on staff' },
      { value: '7,000+', label: 'Client businesses' },
      { value: '4.9/5', label: 'Trustpilot, from 239 reviews' },
      { value: '30022628', label: 'FTA Registered Tax Agency number' },
    ],
    cta: {
      label: 'Talk to Our Firm',
      color: 'orange',
      kind: 'anchor',
      target: 'get-started',
      microcopy: 'A conversation with a senior accountant, not a sales script.',
    },
    sections: [
      {
        type: 'team',
        id: 'team',
        eyebrow: 'THE SPECIALISTS BEHIND YOUR ACCOUNT',
        title: 'Named specialists, not an anonymous back office',
        people: [
          {
            name: 'Gautam Sanoj',
            role: 'Senior Tax Advisor',
            focus: 'VAT and corporate tax',
            photo: '',
          },
          {
            name: 'Suhail K Y, CMA®',
            role: 'Bookkeeping, finance and audit specialist',
            focus: 'Bookkeeping, audit and CFO work',
            photo: '/authors/suhail-ky.jpg',
          },
          {
            name: 'Krishna Subash Nair',
            role: 'AML compliance specialist',
            focus: 'AML compliance',
            photo: '',
          },
        ],
      },
      {
        type: 'table',
        id: 'services',
        eyebrow: 'FIRM VS FREELANCER VS SOFTWARE',
        title: 'Three ways to get your accounting done',
        columns: ['', 'Freelancer', 'Software alone', 'Finanshels firm'],
        rows: [
          ['Who does the work', 'One person', 'You', 'A team of CAs and tax specialists'],
          ['Tax filing', 'Depends on the person', 'Not included', 'FTA Registered Tax Agency'],
          ['AML compliance', 'Rarely', 'No', 'Specialists on staff'],
          ['Senior review', 'None', 'None', 'Chartered accountant review'],
          ['If someone leaves', 'Work stops', 'You still do the work', 'The firm keeps your file moving'],
        ],
      },
      {
        type: 'reviews',
        id: 'testimonials',
      },
    ],
    form: {
      eyebrow: 'TALK TO OUR FIRM',
      title: 'Speak to the firm, not a call centre',
      copy: 'Tell us about the business. A senior member of the team replies within 1 business day.',
      formTitle: 'Talk to our firm',
      formSubtitle: 'Confidential. No obligation.',
    },
    footnotes: [],
  },

  /* ------------------------------------------------------------------ 7 */
  'accounting-and-bookkeeping': {
    path: '/accounting-and-bookkeeping',
    seoTitle: 'Accounting & Bookkeeping Services UAE | One Team',
    seoDescription:
      'Accounting and bookkeeping combined. One team for the books and the compliance, one invoice every month.',
    heroVariant: 'merge',
    eyebrow: 'ACCOUNTING AND BOOKKEEPING, TOGETHER',
    h1: 'Accounting & Bookkeeping — Combined, Not Complicated',
    subhead:
      "One team handles the books and the compliance, so you're not managing two vendors and two invoices.",
    proof: [
      { value: '1', label: 'Invoice a month' },
      { value: '1', label: 'Team for books and compliance' },
      { value: '0', label: 'Handoffs between vendors' },
    ],
    cta: {
      label: 'See Combined Plans',
      color: 'blue',
      kind: 'anchor',
      target: 'pricing',
      microcopy: 'Published prices. Books and compliance on one invoice.',
    },
    sections: [
      {
        type: 'explainer',
        id: 'services',
        eyebrow: "WHY SEPARATE ISN'T NECESSARY",
        title: 'Two vendors means two versions of your numbers',
        paragraphs: [
          'When one firm keeps the books and another handles compliance, every return starts with a handover. Questions go back and forth, and you sit in the middle.',
          'With one team, the people who reconcile your accounts are the people who prepare your returns. Nothing is re-checked because nothing changed hands.',
        ],
        scope: [
          'Bookkeeping and bank reconciliation',
          'VAT returns',
          'Corporate tax returns',
          'Management reports',
          'Year-end financial statements',
        ],
      },
      {
        type: 'planRows',
        id: 'pricing',
        eyebrow: 'COMBINED PLANS',
        title: 'Pick a plan by volume',
        copy: 'Compliance work is added to the same plan and the same monthly invoice. Your quote confirms the total before you start.',
        rows: [
          { name: 'Starter', price: 'from AED 499/month', fit: 'Bookkeeping base for up to 50 transactions a year' },
          { name: 'Growth', price: 'AED 999/month', fit: 'Bookkeeping base for up to 2,000 transactions a year' },
          { name: 'Scale', price: 'AED 1,999/month', fit: 'Bookkeeping base for up to 3,600 transactions a year' },
        ],
      },
    ],
    form: {
      eyebrow: 'GET STARTED',
      title: 'One team, one invoice',
      copy: 'Share your details and we confirm the right plan within 1 business day.',
      formTitle: 'Get a combined plan',
      formSubtitle: 'No setup fee. No lock-in.',
    },
    footnotes: [],
  },
};

export default adGroupLandings;
