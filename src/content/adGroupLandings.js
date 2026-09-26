/**
 * Copy and data for the seven Bookkeeping_UAE_Search ad-group landing pages.
 * One entry per path; src/pages/AdGroupLandingLight.jsx lays them out in the
 * light, conversion-first design (extra layout data in src/content/adGroupLight.js).
 *
 * Every page carries, in this order: hero with the lead form in the first
 * fold, client logos, the problem, the solution, an in-house vs Finanshels
 * comparison, the brief's own sections, how it works, the published pricing
 * packages, client testimonials, FAQ, and the lead form again in the last fold.
 * WhatsApp sits in the hero, the pricing cards and the phone sticky bar.
 *
 * Copy rules:
 * - H1s and subheads are verbatim from the brief.
 * - Numbers are only ones already published on this site or stated in the
 *   brief. Unsourced figures (backlog weeks, client tenure, years operating,
 *   hire-cost amounts) stay out until a source is supplied.
 * - Penalties and deadlines carry a footnote to the official source.
 * - The credential is "FTA Registered Tax Agency", No. 30022628. Nothing else.
 */

/** Hero form anchor (first fold) and final form anchor (last fold). */
export const HERO_FORM_ID = 'get-started';
export const FINAL_FORM_ID = 'get-started-final';

/**
 * The published monthly packages, identical to the pricing on /bookkeeping so
 * a visitor comparing pages never sees a different number.
 */
export const pricingPlans = [
  {
    name: 'Starter',
    subtitle: 'Perfect for freelancers and solopreneurs',
    price: '499',
    transactions: 'Up to 50 transactions/year',
    features: [
      'Annual Financial Statements',
      'Quarterly Management Accounts',
      'Quarterly Financial Statements',
      'Dedicated Support Manager',
      '30 Min Free Finance Review',
    ],
  },
  {
    name: 'Essential',
    subtitle: 'Ideal for growing small businesses',
    price: '799',
    transactions: 'Up to 200 transactions/year',
    features: [
      'Everything in Starter, plus:',
      'Monthly Account Reconciliation',
      'Quarterly Accounting Reports',
      'Priority Support',
      'Expense Categorization',
      'Financial Health Check-up',
    ],
  },
  {
    name: 'Growth',
    subtitle: 'For businesses with higher volume',
    price: '999',
    transactions: 'Up to 2,000 transactions/year',
    popular: true,
    features: [
      'Everything in Essential, plus:',
      'Quarterly Bookkeeping',
      'Cash Flow Analysis',
      'Budget vs Actual Reports',
      'Multi-currency Support',
      'Dedicated Account Manager',
    ],
  },
  {
    name: 'Scale',
    subtitle: 'Enterprise-grade financial management',
    price: '1,999',
    transactions: 'Up to 3,600 transactions/year',
    features: [
      'Everything in Growth, plus:',
      'Monthly Bookkeeping',
      'Advanced Reporting Suite',
      'Custom Dashboard',
      'API Integrations',
      'CFO Advisory Services',
    ],
  },
];

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
  /* ================================================================== 1 */
  'hire-accountant': {
    path: '/hire-accountant',
    seoTitle: 'Hire a Chartered Accountant in Dubai | Finanshels',
    seoDescription:
      'A named chartered accountant owns your books, VAT and corporate tax, reviewed every month. From AED 499/month. Trusted by 7,000+ UAE businesses.',
    visual: 'accountant-card',
    eyebrow: 'CHARTERED ACCOUNTANTS IN DUBAI',
    h1: 'Hire a Chartered Accountant in Dubai — Not a Spreadsheet',
    subhead:
      'A real accountant owns your numbers. FTA-compliant books, VAT and corporate tax handled, reviewed by a CA every month.',
    heroPoints: [
      'One named accountant, not a ticket queue',
      'Chartered Accountant review every month',
      'VAT and corporate tax handled by the same team',
    ],
    heroStats: [
      { value: '7,000+', label: 'UAE businesses served' },
      { value: '4.9', label: 'Trustpilot, 239 reviews' },
      { value: '150+', label: 'Qualified accountants' },
    ],
    cta: { label: 'Talk to Your Accountant', color: 'orange', kind: 'booking' },
    whatsappMessage: 'Hi, I saw your Google ad. I want to hire a chartered accountant for my business.',
    /* Annual-plan offer shown above the pricing cards. Same offer the site
       offer bar runs; terms match the /packages FAQ. */
    annualOffer: {
      title: 'Get 3 Months Free With Annual Accounting Packages',
      copy: 'Pay for 12 months and get 3 more months of the same package at no charge.',
      cta: 'Get Started',
      whatsappMessage: "Hi, I saw your Google ad. I'd like to claim the 3 months free offer on annual accounting packages.",
    },
    heroForm: {
      title: 'Talk to Your Accountant',
      subtitle: 'Leave your details. A qualified accountant calls you back.',
    },
    problems: {
      eyebrow: 'WHY HIRING IS HARD',
      title: 'Finding a Good Accountant in Dubai Takes Too Long',
      subtitle:
        'Most founders do not need a spreadsheet. They need a qualified person who owns the numbers. Getting one in-house is slow, expensive and risky.',
      items: [
        { icon: 'clock', title: 'Months to Recruit', copy: 'Job ads, interviews, notice periods and a visa before the first entry is made.' },
        { icon: 'user', title: 'One Point of Failure', copy: 'When your only accountant is on leave or resigns, the books stop.' },
        { icon: 'alert', title: 'Nobody Checks the Work', copy: 'A junior bookkeeper with no senior review is how errors reach your tax return.' },
        { icon: 'file', title: 'Tax on the Side', copy: 'VAT and corporate tax deadlines handled by whoever has time that week.' },
      ],
    },
    solution: {
      eyebrow: 'THE FINANSHELS WAY',
      title: 'A Qualified Accountant Who Owns Your Numbers',
      description:
        'You get one named accountant who knows your business, backed by a firm of 150+ accountants and a Chartered Accountant who reviews your file every month.',
      features: [
        { icon: 'user', title: 'Your Named Accountant', copy: 'One person you call, email or WhatsApp. They know your business and your history.' },
        { icon: 'shield', title: 'Monthly CA Review', copy: 'A qualified Chartered Accountant reviews your numbers before each month is closed.' },
        { icon: 'file', title: 'VAT and Corporate Tax, Same Team', copy: 'Returns prepared by the same people who keep your books, filed by an FTA Registered Tax Agency.' },
        { icon: 'chart', title: 'Reports You Can Use', copy: 'Management accounts and a clear view of profit and cash, on the cadence your plan includes.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS OUTSOURCED',
      title: 'Hiring an In-House Accountant vs Finanshels',
      subtitle: 'The same outcome, without the salary, visa and hiring risk.',
      beforeLabel: 'In-house accountant',
      afterLabel: 'Your Finanshels accountant',
      rows: [
        ['Salary, visa, medical insurance and a desk', 'One monthly fee, from AED 499'],
        ['Months to recruit and onboard', 'Started within 24 to 48 hours'],
        ['One person, no senior review', 'A named accountant plus monthly CA review'],
        ['Tax work often sent to an outside consultant', 'VAT and corporate tax handled by the same team'],
        ['Work stops when they are away or resign', 'A firm of 150+ accountants keeps your file moving'],
      ],
    },
    sections: [
      {
        type: 'compare',
        id: 'old-way',
        eyebrow: 'THE OLD WAY VS FINANSHELS',
        title: 'A Freelancer Keeps Records. Your Accountant Owns Them.',
        leftLabel: 'Freelancer or generic bookkeeper',
        rightLabel: 'Your Finanshels chartered accountant',
        rows: [
          ['Enters transactions when there is time', 'Closes your books every month on a set calendar'],
          ['Tax passed to someone else', 'VAT and corporate tax under one roof'],
          ['Nobody senior checks the work', 'A CA reviews your numbers every month'],
          ['You chase them for updates', 'One named accountant who knows your business'],
        ],
      },
      {
        type: 'credentials',
        id: 'credentials',
        eyebrow: 'CREDENTIALS',
        title: 'Qualified for UAE Books, Not Just Any Books',
        items: [
          { title: 'Chartered Accountant Review', copy: 'Every client file is reviewed by a qualified CA before the month is closed.' },
          { title: 'FTA Registered Tax Agency', copy: 'Agency Registration No. 30022628. VAT and corporate tax returns prepared and filed on EmaraTax.' },
          { title: 'UAE-Specific Experience', copy: 'Mainland, free zone and multi-entity businesses across VAT, corporate tax and year-end.' },
        ],
      },
    ],
    steps: {
      eyebrow: 'HOW IT WORKS',
      title: 'From First Call to Your First Closed Month',
      subtitle: 'What happens after you book, so there are no surprises.',
      items: [
        { stage: 'Free 30-Minute Call', timeline: 'Day 0', copy: 'Tell us about the business. We tell you what the work involves and what it costs.' },
        { stage: 'Meet Your Accountant', timeline: 'Day 1 to 2', copy: 'You are introduced to the named accountant who will own your file.' },
        { stage: 'Onboarding and Handover', timeline: 'Week 1', copy: 'We connect your bank and software and collect the handover from any previous provider.' },
        { stage: 'First Month Closed', timeline: 'Month 1', copy: 'Books reconciled, CA review done, and your first management report delivered.' },
      ],
    },
    pricing: {
      eyebrow: 'TRANSPARENT PRICING',
      title: 'Accountant Plans With No Hidden Fees',
      subtitle: 'Published monthly prices. No setup fee, no onboarding charge. Cancel anytime.',
    },
    faqs: [
      { q: 'Is my accountant a Chartered Accountant?', a: 'You have one named accountant as your day-to-day contact, and your books are reviewed every month by a qualified Chartered Accountant before the month is closed.' },
      { q: 'Do you handle VAT and corporate tax as well?', a: 'Yes. Finanshels is an FTA Registered Tax Agency, Agency Registration No. 30022628. The same team that keeps your books prepares your VAT and corporate tax returns, so nothing is lost in a handover.' },
      { q: 'How does the cost compare with hiring in-house?', a: 'Plans start from AED 499 a month. There is no salary, visa, insurance, desk or recruitment cost, and no gap in cover when someone is on leave.' },
      { q: 'How quickly can I get started?', a: 'Most businesses start within 24 to 48 hours of the first call. We set up your account, connect your systems and begin work straight away.' },
      { q: 'Can I speak to my accountant directly?', a: 'Yes. You have a named accountant you can reach by call, email or WhatsApp. You never go through a generic support queue.' },
      { q: 'How do the 3 free months work?', a: 'The offer applies to annual plans only: pay for 12 months up front and you receive 3 additional months of the same package at no charge, 15 months in total. It cannot be combined with monthly billing. Confirm current availability with your accountant.' },
    ],
    final: {
      eyebrow: 'SPEAK TO AN ACCOUNTANT',
      title: 'Meet the Accountant Who Will Own Your Numbers',
      description: 'Join 7,000+ UAE businesses that trust Finanshels with their accounting. Book a free call and see what a dedicated accountant changes.',
      steps: ['Book your free 30-minute call', 'Get matched with your named accountant', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },

  /* ================================================================== 2 */
  'remote-bookkeeper': {
    path: '/remote-bookkeeper',
    seoTitle: 'Remote & Part-Time Bookkeeper UAE | From AED 499/month',
    seoDescription:
      'Skip the full-time hire. Remote, part-time and cloud bookkeeping for UAE businesses on a flat monthly plan from AED 499.',
    visual: 'cost-scale',
    eyebrow: 'REMOTE, PART-TIME AND CLOUD BOOKKEEPING',
    h1: 'Skip the Full-Time Hire. Get a Remote Bookkeeper Instead.',
    subhead:
      'Flexible bookkeeping and part-time accounting, done cloud-first — no desk, no payroll overhead, no onboarding headache.',
    heroPoints: [
      'No desk, no visa, no payroll to add',
      'Works in Zoho Books, Xero, QuickBooks or FreshBooks',
      'Move up a plan any time as volume grows',
      'Reach your bookkeeper on WhatsApp',
    ],
    heroStats: [
      { value: 'AED 499', label: 'Plans from, per month' },
      { value: '24h', label: 'Response time' },
      { value: '4.9', label: 'Trustpilot rating' },
    ],
    cta: { label: 'See Remote Bookkeeping Plans', color: 'orange', kind: 'anchor', target: 'pricing' },
    whatsappMessage: 'Hi, I saw your Google ad for remote bookkeeping. I want to see the plans.',
    heroForm: {
      title: 'Get a Remote Bookkeeper',
      subtitle: 'Tell us about your business. We recommend a plan within 24 hours.',
    },
    problems: {
      eyebrow: 'THE PROBLEM WITH A FULL-TIME HIRE',
      title: 'You Need Part-Time Work, Not a Full-Time Salary',
      subtitle:
        'Most small businesses have a few days of bookkeeping a month. Hiring for it means paying for the whole month, every month.',
      items: [
        { icon: 'wallet', title: 'Full-Time Cost', copy: 'Salary, visa, insurance and gratuity for work that fills a fraction of the week.' },
        { icon: 'clock', title: 'Slow to Hire', copy: 'Recruiting and onboarding a bookkeeper takes months you do not have.' },
        { icon: 'users', title: 'Turnover Risk', copy: 'When they resign, your processes and history leave with them.' },
        { icon: 'alert', title: 'Office-Bound Books', copy: 'Work stalls when the one person who does it is away.' },
      ],
    },
    solution: {
      eyebrow: 'REMOTE, DONE PROPERLY',
      title: 'A Remote Bookkeeping Team, Working in Your Cloud File',
      description:
        'Your bookkeeper works directly in your accounting software and bank feeds. You see the numbers on your dashboard and message the team on WhatsApp.',
      features: [
        { icon: 'cloud', title: 'Works in Your Software', copy: 'Zoho Books, Xero, QuickBooks or FreshBooks. If you have none, we recommend one.' },
        { icon: 'check', title: 'Reconciled on Schedule', copy: 'Every transaction categorised and every bank and card account reconciled.' },
        { icon: 'chart', title: 'Live Dashboard View', copy: 'Profit, cash and balances in your own file, not in someone else’s spreadsheet.' },
        { icon: 'chat', title: 'One Contact on WhatsApp', copy: 'Ask a question and get an answer from the person who keeps your books.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS REMOTE',
      title: 'In-House Hire vs Remote Finanshels Team',
      subtitle: 'What a full-time hire really costs you, next to a flat monthly plan.',
      beforeLabel: 'In-house bookkeeper',
      afterLabel: 'Remote Finanshels team',
      rows: [
        ['Salary plus benefits, visa and insurance', 'One flat monthly fee, from AED 499'],
        ['Recruiting, desk, laptop and software', 'Nothing to set up on your side'],
        ['Stops when they are sick or on leave', 'A team keeps your books moving'],
        ['Knowledge walks out when they resign', 'Your file stays with the firm'],
        ['A second hire when volume grows', 'Move up a plan, same bookkeeper'],
      ],
    },
    sections: [],
    steps: {
      eyebrow: 'HOW REMOTE BOOKKEEPING WORKS',
      title: 'Three Steps. No Office Visits.',
      subtitle: 'Everything happens online, from setup to your monthly report.',
      items: [
        { stage: 'Connect Your Accounts', timeline: 'Day 1 to 2', copy: 'Give access to your bank feeds and your cloud accounting file.' },
        { stage: 'We Reconcile', timeline: 'Every period', copy: 'Your remote bookkeeper categorises every transaction and reconciles every account.' },
        { stage: 'You Review the Dashboard', timeline: 'On your cadence', copy: 'Profit, cash and balances in your dashboard, with a report on the schedule your plan includes.' },
      ],
    },
    pricing: {
      eyebrow: 'REMOTE BOOKKEEPING PLANS',
      title: 'Flat Monthly Plans That Grow With You',
      subtitle: 'Start small and move up a plan when volume grows. No re-onboarding. Cancel anytime.',
    },
    faqs: [
      { q: 'Is remote bookkeeping secure?', a: 'Yes. We use bank-level encryption and follow international security standards. Your data is stored in the cloud with backups, and every team member signs a confidentiality agreement.' },
      { q: 'Which accounting software do you work with?', a: 'Zoho Books, Xero, QuickBooks and FreshBooks, plus most bank and payment-gateway feeds. If you have no software yet, we recommend one as part of onboarding.' },
      { q: 'Do I need to be based in Dubai?', a: 'No. Everything is delivered online, so it works for businesses anywhere in the UAE.' },
      { q: 'What do you need from me each month?', a: 'Access to your bank feeds and accounting file, plus invoices and receipts as they come in. Your bookkeeper tells you exactly what is missing, so you are never guessing.' },
      { q: 'What if my business grows?', a: 'You move up a plan at any time and the difference is prorated. Your bookkeeper stays the same, and nothing is re-onboarded.' },
    ],
    final: {
      eyebrow: 'GET STARTED',
      title: 'Hire a Remote Bookkeeper Without Hiring Anyone',
      description: 'Join 7,000+ UAE businesses that keep their books with Finanshels. Tell us your volume and we recommend the right plan.',
      steps: ['Share your business details', 'Get a plan recommendation within 24 hours', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },

  /* ================================================================== 3 */
  'backlog-catch-up': {
    path: '/backlog-catch-up',
    seoTitle: 'Backlog Accounting Catch-Up UAE | From AED 1,499',
    seoDescription:
      'Months behind on your books? One-time backlog accounting that reconciles every period and brings you current. Fixed quote from AED 1,499.',
    visual: 'backlog-timeline',
    eyebrow: 'BACKLOG ACCOUNTING, ONE-TIME RECOVERY',
    h1: "Months Behind on Your Books? We'll Catch You Up.",
    subhead:
      'Backlog accounting for businesses that fell behind — reconciled, FTA-compliant, and current again in weeks, not months.',
    heroPoints: [
      'Fixed quote before any work starts',
      'Every overdue month reconciled in order',
      'Overdue VAT and corporate tax returns prepared',
      'Catch-up engagements from AED 1,499',
    ],
    heroStats: [
      { value: 'AED 1,499', label: 'Catch-up from' },
      { value: 'Fixed', label: 'Quote upfront' },
      { value: '24h', label: 'Assessment reply' },
    ],
    cta: { label: 'Start Your Catch-Up Assessment', color: 'orange', kind: 'anchor', target: 'get-started' },
    whatsappMessage: 'Hi, I saw your Google ad for backlog accounting. My books are behind and I need a catch-up assessment.',
    heroForm: {
      title: 'Start Your Catch-Up Assessment',
      subtitle: 'Tell us how far behind you are. We reply with scope and a fixed quote.',
    },
    problems: {
      eyebrow: 'HOW BACKLOGS BUILD',
      title: 'Falling Behind Is Common. Staying Behind Is Costly.',
      subtitle:
        'A busy quarter turns into a busy year, and suddenly nobody knows what the real numbers are.',
      items: [
        { icon: 'file', title: 'Unreconciled Months', copy: 'Bank and card accounts that have not matched the books for months.' },
        { icon: 'clock', title: 'Late or Estimated Returns', copy: 'VAT or corporate tax filed late, or filed on numbers nobody can support.' },
        { icon: 'alert', title: 'Requests You Cannot Meet', copy: 'An auditor, bank or investor asks for accounts you cannot produce.' },
        { icon: 'users', title: 'No Time In-House', copy: 'The team that fell behind is the same team that is too busy to fix it.' },
      ],
    },
    solution: {
      eyebrow: 'A CALM, COMPETENT RECOVERY',
      title: "We've Done This Before. Here Is How It Works.",
      description:
        'Catch-up is a one-time engagement with a clear start and end. We scope it, fix a price, rebuild every overdue period and hand you back current books.',
      features: [
        { icon: 'search', title: 'Assessment First', copy: 'We review what exists before quoting, so the price reflects the real backlog.' },
        { icon: 'check', title: 'Month-by-Month Rebuild', copy: 'Every overdue month reconciled to the bank, in date order.' },
        { icon: 'file', title: 'Filing Catch-Up', copy: 'Overdue returns prepared from reconciled numbers, not estimates.' },
        { icon: 'shield', title: 'Nothing Forced to Balance', copy: 'Anything we cannot support with evidence goes on a written exception list.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS OUTSOURCED CATCH-UP',
      title: 'Fixing It In-House vs a Finanshels Catch-Up',
      subtitle: 'Why a dedicated recovery beats evenings and weekends.',
      beforeLabel: 'Catching up in-house',
      afterLabel: 'Finanshels catch-up',
      rows: [
        ['Your team fixes it after hours', 'A dedicated team works the backlog'],
        ['A temporary hire who needs training', 'Accountants for whom multi-year backlogs are normal work'],
        ['Open-ended time and cost', 'Fixed quote confirmed before work starts'],
        ['Gaps guessed or forced to balance', 'A written exception list for anything missing'],
        ['Books fall behind again', 'Option to move onto monthly bookkeeping'],
      ],
    },
    sections: [
      {
        type: 'penalties',
        id: 'penalties',
        eyebrow: "WHAT HAPPENS IF YOU DON'T CATCH UP",
        title: 'The FTA Penalty Structure, Stated Plainly',
        subtitle: 'These are the administrative penalties the law sets. They are a reason to act now, not a reason to panic.',
        items: [
          { label: 'Tax return not filed on time', value: 'AED 1,000', detail: 'First time. AED 2,000 if repeated within 24 months.', source: 'fta-penalties' },
          { label: 'Tax not paid by the due date', value: '14% a year', detail: 'Charged monthly on the unpaid amount, for each month or part of a month.', source: 'fta-penalties' },
          { label: 'Required records not kept', value: 'AED 10,000', detail: 'Per violation. AED 20,000 if repeated within 24 months.', source: 'fta-penalties' },
        ],
        note: 'Figures are the published penalties, not a prediction of what applies to your business. Your assessment tells you where you stand.',
      },
      {
        type: 'beforeAfter',
        id: 'before-after',
        eyebrow: 'BEFORE AND AFTER',
        title: 'What Changes When You Are Current Again',
        before: ['Bank accounts not reconciled for months', 'Receipts and invoices in inboxes and folders', 'Returns late or filed on estimates', 'No idea what the real profit is'],
        after: ['Every account reconciled to the closing date', 'A clean general ledger and trial balance', 'Overdue returns prepared from real numbers', 'An exception list for anything still missing'],
      },
    ],
    steps: {
      eyebrow: 'THE CATCH-UP PROCESS',
      title: 'From Behind to Current in Four Stages',
      subtitle: 'The timeline for each stage is confirmed in your quote.',
      items: [
        { stage: 'Assessment', timeline: 'Stage 1', copy: 'We look at statements, invoices and your software file, then send scope and a fixed quote.' },
        { stage: 'Reconciliation', timeline: 'Stage 2', copy: 'Every overdue month rebuilt and reconciled to the bank, in date order.' },
        { stage: 'Filing Catch-Up', timeline: 'Stage 3', copy: 'Overdue VAT or corporate tax returns prepared from the reconciled numbers.' },
        { stage: 'Ongoing Handoff', timeline: 'Stage 4', copy: 'Once current, move onto a monthly plan so the backlog never rebuilds. Optional.' },
      ],
    },
    pricing: {
      eyebrow: 'CATCH-UP PRICING',
      title: 'One Fixed Quote to Catch Up, Then Stay Current',
      subtitle: 'Catch-up is quoted once, from AED 1,499. Staying current afterwards is a published monthly plan.',
      offer: {
        name: 'Backlog Catch-Up',
        price: '1,499',
        prefix: 'from AED ',
        note: 'One-time fixed quote, based on months behind, transaction volume and number of accounts.',
        features: ['Full backlog captured and categorised', 'Month-by-month bank and card reconciliation', 'Overdue returns prepared', 'Written summary and exception list'],
      },
    },
    faqs: [
      { q: 'How much does backlog accounting cost?', a: 'Catch-up engagements start from AED 1,499. The final fixed quote depends on how many months are behind, transaction volume, the number of bank and card accounts and the condition of the records. We confirm it in writing before work starts.' },
      { q: 'How far back can you go?', a: 'Multi-year backlogs are normal work for us. We close each overdue period in order so every year stands on its own.' },
      { q: 'What documents do you need?', a: 'Bank and card statements for every month in the backlog, access to your accounting file if you have one, and whatever invoices and bills exist. You do not need a complete set to start.' },
      { q: 'Can you file my overdue VAT or corporate tax returns?', a: 'Yes. As an FTA Registered Tax Agency, Agency Registration No. 30022628, we prepare overdue returns from the reconciled numbers and file them with you.' },
      { q: 'Will this remove penalties I have already been charged?', a: 'Penalties already charged are decided by the FTA, and we do not promise any outcome. Once your records are accurate, we explain the options available to you.' },
    ],
    final: {
      eyebrow: 'CATCH-UP ASSESSMENT',
      title: 'Tell Us the Backlog. We Will Tell You the Price.',
      description: 'A senior accountant reviews your details and replies with scope and a fixed quote. No commitment until you approve it.',
      steps: ['Share how far behind the books are', 'Get a fixed quote within 24 hours', 'We rebuild the backlog and hand over current books'],
    },
    footnotes: [FTA_PENALTIES_SOURCE],
  },

  /* ================================================================== 4 */
  'outsource-accounting': {
    path: '/outsource-accounting',
    seoTitle: 'Outsourced Accounting Dubai | Full Accounting Function',
    seoDescription:
      'Outsource the whole accounting function: books, reporting, VAT and audit prep. One partner instead of three vendors, from AED 499/month.',
    visual: 'function-stack',
    eyebrow: 'OUTSOURCED ACCOUNTING IN DUBAI',
    h1: 'Outsource Your Accounting Function, Not Just Your Bookkeeping',
    subhead:
      'Full-function outsourced accounting — books, reporting, VAT, and a team that scales with you. One partner instead of three vendors.',
    heroPoints: [
      'Bookkeeping, reporting, VAT and audit prep in one engagement',
      'One account manager for everything',
      'A team that grows with your volume',
    ],
    heroStats: [
      { value: '3 in 1', label: 'Books, reporting, tax' },
      { value: '150+', label: 'Accountants' },
      { value: '7,000+', label: 'Businesses served' },
    ],
    cta: { label: 'Get an Outsourcing Quote', color: 'orange', kind: 'anchor', target: 'get-started' },
    whatsappMessage: 'Hi, I saw your Google ad for outsourced accounting. I want a quote for our full accounting function.',
    heroForm: {
      title: 'Get an Outsourcing Quote',
      subtitle: 'One quote for bookkeeping, reporting and tax together.',
    },
    problems: {
      eyebrow: 'THE PROBLEM',
      title: 'Your Finance Function Is Spread Too Thin',
      subtitle:
        'A bookkeeper here, a tax consultant there, reports built by whoever has time. Nobody owns the whole picture.',
      items: [
        { icon: 'users', title: 'Three Vendors, Three Invoices', copy: 'Every return starts with a handover between people who do not talk to each other.' },
        { icon: 'wallet', title: 'An Expensive Department', copy: 'Salaries, visas, software and training for a function that is not your core business.' },
        { icon: 'user', title: 'Key-Person Risk', copy: 'One resignation and nobody knows how month-end works.' },
        { icon: 'clock', title: 'Reports Arrive Late', copy: 'By the time the numbers are ready, the decision has already been made.' },
      ],
    },
    solution: {
      eyebrow: 'THE SOLUTION',
      title: 'Your Accounting Function, Run End to End',
      description:
        'One partner runs the whole function: daily bookkeeping, month-end close, management reporting, VAT and audit preparation. You get one account manager and one monthly invoice.',
      features: [
        { icon: 'book', title: 'Bookkeeping and Close', copy: 'Categorisation, reconciliation and a month-end close on a set calendar.' },
        { icon: 'chart', title: 'CFO-Lite Reporting', copy: 'Management reports, cash flow and budget vs actual.' },
        { icon: 'file', title: 'VAT Handled', copy: 'Returns prepared and filed, records kept to FTA requirements.' },
        { icon: 'clipboard', title: 'Audit Prep', copy: 'Year-end schedules and working papers your auditor can work from.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS OUTSOURCED',
      title: 'An In-House Accounting Department vs Finanshels',
      subtitle: 'What outsourcing replaces, line by line.',
      beforeLabel: 'In-house department',
      afterLabel: 'Outsourced to Finanshels',
      rows: [
        ['Accountant, senior accountant and finance manager', 'A dedicated team sized to your volume'],
        ['A separate tax consultant for VAT and corporate tax', 'Tax handled by an FTA Registered Tax Agency'],
        ['Software licences and add-ons', 'We work inside your existing software'],
        ['Salaries, visas, insurance, training, leave cover', 'One predictable monthly fee'],
        ['Hiring, managing and replacing staff', 'One partner to hold accountable'],
      ],
    },
    sections: [
      {
        type: 'scope',
        id: 'scope',
        eyebrow: 'SERVICE SCOPE',
        title: 'Everything the Function Covers, Ticked',
        rows: [
          { label: 'Bookkeeping', copy: 'Categorisation, reconciliation and month-end close' },
          { label: 'VAT', copy: 'Returns prepared and filed, records kept to FTA requirements' },
          { label: 'CFO-lite reporting', copy: 'Management reports, cash flow and budget vs actual' },
          { label: 'Audit prep', copy: 'Year-end schedules and working papers your auditor can use' },
        ],
      },
    ],
    steps: {
      eyebrow: 'HOW OUTSOURCING WORKS',
      title: 'Handing Over Your Finance Function, Step by Step',
      subtitle: 'A structured handover, so month-end never slips during the switch.',
      items: [
        { stage: 'Scoping Call', timeline: 'Day 0', copy: 'We map what your finance function does today and who does it.' },
        { stage: 'Handover', timeline: 'Week 1', copy: 'We collect ledgers, bank data and open items from your current team or provider.' },
        { stage: 'First Close', timeline: 'Month 1', copy: 'Books closed, reconciled and your first management report delivered.' },
        { stage: 'Steady State', timeline: 'Ongoing', copy: 'Monthly close, reporting and tax on a fixed calendar, with one account manager.' },
      ],
    },
    pricing: {
      eyebrow: 'OUTSOURCING PRICING',
      title: 'One Monthly Fee for the Whole Function',
      subtitle: 'Published package prices. Tax and audit prep are scoped into your quote. No hidden fees.',
    },
    faqs: [
      { q: 'What does outsourced accounting include?', a: 'Bookkeeping, month-end close, management reporting, VAT returns and audit preparation, run by one team with one account manager. We confirm the exact scope in your quote.' },
      { q: 'Can you work alongside our existing finance staff?', a: 'Yes. We agree who does what during scoping so nothing is duplicated and nothing is missed.' },
      { q: 'How does the handover from our current team work?', a: 'We request the handover ourselves, collect ledgers, bank data and open items, reconcile what we receive and flag anything incomplete.' },
      { q: 'Who is my point of contact?', a: 'One account manager who owns your file and coordinates the team behind it.' },
      { q: 'How is the fee set?', a: 'By transaction volume and scope. Packages start from AED 499 a month, and your quote is confirmed in writing before you start.' },
    ],
    final: {
      eyebrow: 'OUTSOURCING QUOTE',
      title: 'Get One Quote for the Whole Function',
      description: 'Share the basics. We map your current setup and send a scoped quote for bookkeeping, reporting and tax together.',
      steps: ['Tell us how your finance function runs today', 'Get a scoped quote within 24 hours', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },

  /* ================================================================== 5 */
  'accounting-services': {
    path: '/accounting-services',
    seoTitle: 'Accounting Services in Dubai | Built for UAE Compliance',
    seoDescription:
      'Bookkeeping, VAT, corporate tax, audit prep and CFO consultation from one accounting team. Serving Dubai, Abu Dhabi and Sharjah.',
    visual: 'service-tiles',
    eyebrow: 'ACCOUNTING SERVICES, UAE-WIDE',
    h1: 'Accounting Services in Dubai — Built for UAE Compliance',
    subhead:
      'Bookkeeping, VAT, corporate tax, and audit-ready reporting — one accounting team, one dashboard, FTA-compliant by design.',
    heroPoints: [
      'Bookkeeping, VAT, corporate tax, audit prep and CFO consultation',
      'One team and one dashboard for every service',
      'Serving Dubai, Abu Dhabi and Sharjah',
    ],
    heroStats: [
      { value: '5', label: 'Core services' },
      { value: '7,000+', label: 'Businesses served' },
      { value: '3', label: 'Emirates covered' },
    ],
    cta: { label: 'Explore Our Services', color: 'orange', kind: 'anchor', target: 'service-menu' },
    whatsappMessage: 'Hi, I saw your Google ad for accounting services in Dubai. I want to know which services fit my business.',
    heroForm: {
      title: 'Get a Services Recommendation',
      subtitle: 'Tell us about the business. We recommend the services that fit.',
    },
    problems: {
      eyebrow: 'THE PROBLEM',
      title: 'UAE Compliance Has Too Many Moving Parts',
      subtitle: 'Bookkeeping, VAT and corporate tax each have their own rules and deadlines. Handling them separately is where things slip.',
      items: [
        { icon: 'users', title: 'A Provider for Every Service', copy: 'One for the books, one for VAT, another for corporate tax.' },
        { icon: 'clock', title: 'Deadlines You Track Yourself', copy: 'Every filing date sits in your calendar instead of your accountant’s.' },
        { icon: 'file', title: 'Numbers in Three Places', copy: 'Each provider works from a different version of your figures.' },
        { icon: 'wallet', title: 'Unclear Pricing', copy: 'Hourly bills and add-ons you did not see coming.' },
      ],
    },
    solution: {
      eyebrow: 'ONE TEAM FOR EVERYTHING',
      title: 'Every Accounting Service Under One Roof',
      description: 'One accounting team handles the books and the compliance, so every return is prepared from the same reconciled numbers, visible in one dashboard.',
      features: [
        { icon: 'book', title: 'Bookkeeping', copy: 'Transactions categorised, accounts reconciled, books closed on schedule.' },
        { icon: 'percent', title: 'VAT and Corporate Tax', copy: 'Registration, returns and records handled by an FTA Registered Tax Agency.' },
        { icon: 'clipboard', title: 'Audit-Ready Reporting', copy: 'Schedules and working papers ready for your auditor.' },
        { icon: 'trend', title: 'CFO Consultation', copy: 'Cash flow, budgets and the numbers behind big decisions.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS OUTSOURCED',
      title: 'Building an In-House Finance Team vs Finanshels',
      subtitle: 'Full accounting coverage without building a department.',
      beforeLabel: 'In-house finance team',
      afterLabel: 'Finanshels accounting services',
      rows: [
        ['Hire separately for bookkeeping and tax skills', 'Bookkeeping, VAT and corporate tax in one team'],
        ['Salaries, visas and training for each hire', 'Published monthly plans, from AED 499'],
        ['Compliance knowledge depends on one person', 'A firm of 150+ accountants'],
        ['Cover gaps during leave and turnover', 'Continuity built into the team'],
        ['Tools and reporting set up by you', 'One dashboard across every service'],
      ],
    },
    sections: [
      {
        type: 'serviceGrid',
        id: 'service-menu',
        eyebrow: 'SERVICE MENU',
        title: 'Pick One Service or Run Them All Through Us',
        items: [
          { title: 'Bookkeeping', copy: 'Transactions categorised, accounts reconciled, books closed on schedule.', href: '/bookkeeping' },
          { title: 'VAT', copy: 'Registration, returns and the records the FTA expects you to keep.' },
          { title: 'Corporate Tax', copy: 'Registration, return preparation and filing on EmaraTax.' },
          { title: 'Audit Prep', copy: 'Reconciled schedules and working papers ready for your auditor.' },
          { title: 'CFO Consultation', copy: 'Cash flow, budgets and the numbers behind big decisions.' },
        ],
      },
      {
        type: 'trust',
        id: 'why',
        eyebrow: 'WHY UAE BUSINESSES CHOOSE FINANSHELS',
        title: 'Why UAE Businesses Choose Finanshels',
        items: [
          { title: FTA_AGENCY, copy: 'Tax work filed by a registered agency, not a freelancer.' },
          { title: '4.9 on Trustpilot', copy: 'Rated by clients across 239 reviews.' },
          { title: '150+ Accountants', copy: 'Enough depth that your file never depends on one person.' },
        ],
      },
    ],
    steps: {
      eyebrow: 'HOW IT WORKS',
      title: 'Getting Started Takes One Call',
      subtitle: 'We scope the services you need, then run them from one team.',
      items: [
        { stage: 'Free Consultation', timeline: 'Day 0', copy: 'We look at your business and recommend the services that fit.' },
        { stage: 'Setup', timeline: 'Day 1 to 2', copy: 'We connect your bank and software and set your compliance calendar.' },
        { stage: 'First Deliverables', timeline: 'Month 1', copy: 'Books reconciled and your first reports delivered.' },
        { stage: 'Ongoing Compliance', timeline: 'Every period', copy: 'Returns prepared from the same reconciled numbers, on time.' },
      ],
    },
    pricing: {
      eyebrow: 'SIMPLE PRICING',
      title: 'Transparent Plans for Every Business',
      subtitle: 'Bookkeeping packages with published prices. Tax services are scoped into the same plan. Cancel anytime.',
    },
    faqs: [
      { q: 'Do you work with businesses outside Dubai?', a: 'Yes. We serve businesses across the UAE, including Abu Dhabi and Sharjah, and all work is delivered online.' },
      { q: 'Which accounting software do you use?', a: 'Zoho Books, Xero, QuickBooks and FreshBooks. If you do not have a setup yet, we recommend one during onboarding.' },
      { q: 'Can you file my VAT and corporate tax returns?', a: 'Yes. Finanshels is an FTA Registered Tax Agency, Agency Registration No. 30022628, and files returns on EmaraTax.' },
      { q: 'Can I start with one service and add more later?', a: 'Yes. Tell us what you need today. Adding services later happens within the same team, so nothing is re-onboarded.' },
      { q: 'How is pricing set?', a: 'By the services you choose and your transaction volume. Bookkeeping packages start from AED 499 a month, and every quote is confirmed in writing.' },
    ],
    final: {
      eyebrow: 'TELL US WHAT YOU NEED',
      title: 'Find the Right Accounting Services for Your Business',
      description: 'Join 7,000+ UAE businesses that run their accounting with Finanshels. Tell us about the business and we recommend what fits.',
      steps: ['Tell us what the business does', 'Get a services recommendation within 24 hours', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },

  /* ================================================================== 6 */
  'accounting-firm': {
    path: '/accounting-firm',
    seoTitle: 'Chartered Accounting Firm in the UAE | Finanshels',
    seoDescription:
      'A full chartered accounting firm with CAs, tax specialists and AML compliance experts on staff. FTA Registered Tax Agency, Agency Registration No. 30022628.',
    visual: 'firm-credentials',
    eyebrow: 'A CHARTERED ACCOUNTING FIRM',
    h1: 'A Chartered Accounting Firm for Growing UAE Businesses',
    subhead:
      'Not a freelancer, not a single bookkeeper — a full accounting firm with CAs, tax specialists, and AML compliance experts on staff.',
    heroPoints: [
      'CAs, tax specialists and AML experts on staff',
      '4.9 on Trustpilot, from 239 reviews',
      'Named specialists on every account',
    ],
    heroStats: [
      { value: '150+', label: 'Qualified accountants' },
      { value: '7,000+', label: 'Client businesses' },
      { value: '4.9/5', label: 'Trustpilot rating' },
    ],
    cta: { label: 'Talk to Our Firm', color: 'orange', kind: 'anchor', target: 'get-started' },
    whatsappMessage: 'Hi, I saw your Google ad. I am looking for an accounting firm for my business.',
    heroForm: {
      title: 'Talk to Our Firm',
      subtitle: 'Confidential. A senior member of the team replies within 24 hours.',
    },
    problems: {
      eyebrow: 'WHY THE CHOICE MATTERS',
      title: 'The Wrong Accounting Partner Costs More Than Their Fee',
      subtitle: 'Your accounts, tax filings and AML obligations carry your company’s name. Who handles them matters.',
      items: [
        { icon: 'user', title: 'The Freelancer Who Disappears', copy: 'One person, no backup, and your year-end in their inbox.' },
        { icon: 'cloud', title: 'Software Without Accountability', copy: 'An app keeps records. It does not sign off on them.' },
        { icon: 'shield', title: 'AML Obligations Nobody Owns', copy: 'Compliance duties that fall between your bookkeeper and your lawyer.' },
        { icon: 'alert', title: 'No Senior Review', copy: 'Work that goes out without a qualified accountant checking it.' },
      ],
    },
    solution: {
      eyebrow: 'A FULL FIRM',
      title: 'A Firm With the Depth Growing Businesses Need',
      description: 'Finanshels brings chartered accountants, tax specialists and AML compliance experts together in one firm, with named specialists responsible for your account.',
      features: [
        { icon: 'users', title: 'Named Specialists', copy: 'Tax, audit and AML leads you can name, not an anonymous back office.' },
        { icon: 'file', title: 'Registered for Tax', copy: 'FTA Registered Tax Agency, Agency Registration No. 30022628.' },
        { icon: 'shield', title: 'AML Compliance In-House', copy: 'Specialists on staff for your AML obligations.' },
        { icon: 'star', title: 'Proven With Clients', copy: '7,000+ client businesses and a 4.9 Trustpilot rating from 239 reviews.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS AN ACCOUNTING FIRM',
      title: 'An In-House Accountant vs a Full Accounting Firm',
      subtitle: 'One hire gives you one skill set. A firm gives you all of them.',
      beforeLabel: 'In-house accountant',
      afterLabel: 'Finanshels firm',
      rows: [
        ['One person, one skill set', 'CAs, tax specialists and AML experts'],
        ['Tax filing depends on their experience', 'FTA Registered Tax Agency'],
        ['No one senior reviews the work', 'Chartered accountant review'],
        ['Salary, visa and benefits', 'Monthly packages from AED 499, no hourly billing'],
        ['Knowledge leaves when they do', 'The firm keeps your file moving'],
      ],
    },
    sections: [
      {
        type: 'team',
        id: 'team',
        eyebrow: 'THE SPECIALISTS BEHIND YOUR ACCOUNT',
        title: 'Named Specialists, Not an Anonymous Back Office',
        people: [
          { name: 'Gautam Sanoj', role: 'Senior Tax Advisor', focus: 'VAT and corporate tax', photo: '/authors/gautam-sanoj.webp' },
          { name: 'Suhail K Y, CMA®', role: 'Bookkeeping, finance and audit specialist', focus: 'Bookkeeping, audit and CFO work', photo: '/authors/suhail-ky.jpg' },
          { name: 'Krishna Subash Nair', role: 'AML compliance specialist', focus: 'AML compliance', photo: '/authors/krishna-subash-nair.jpg' },
        ],
      },
      {
        type: 'table',
        id: 'firm-vs',
        eyebrow: 'FIRM VS FREELANCER VS SOFTWARE',
        title: 'Three Ways to Get Your Accounting Done',
        columns: ['', 'Freelancer', 'Software alone', 'Finanshels firm'],
        rows: [
          ['Who does the work', 'One person', 'You', 'A team of CAs and tax specialists'],
          ['Tax filing', 'Depends on the person', 'Not included', 'FTA Registered Tax Agency'],
          ['AML compliance', 'Rarely', 'No', 'Specialists on staff'],
          ['Senior review', 'None', 'None', 'Chartered accountant review'],
          ['If someone leaves', 'Work stops', 'You still do the work', 'The firm keeps your file moving'],
        ],
      },
    ],
    steps: {
      eyebrow: 'WORKING WITH OUR FIRM',
      title: 'What Happens After You Get in Touch',
      subtitle: 'A clear process, from first conversation to steady state.',
      items: [
        { stage: 'Conversation', timeline: 'Day 0', copy: 'A senior member of the team learns about your business and obligations.' },
        { stage: 'Specialists Assigned', timeline: 'Day 1 to 2', copy: 'Your account is matched to the right tax, audit and AML specialists.' },
        { stage: 'Onboarding', timeline: 'Week 1', copy: 'We take over your books and compliance calendar from any previous provider.' },
        { stage: 'Ongoing Service', timeline: 'Every period', copy: 'Books, returns and reviews delivered by the same named team.' },
      ],
    },
    pricing: {
      eyebrow: 'FIRM PRICING',
      title: 'Firm-Level Expertise at Published Prices',
      subtitle: 'No hourly billing surprises. Monthly packages with published prices, cancel anytime.',
    },
    faqs: [
      { q: 'Are you a chartered accounting firm?', a: 'Yes. Finanshels has chartered accountants, tax specialists and AML compliance experts on staff, and is an FTA Registered Tax Agency, Agency Registration No. 30022628.' },
      { q: 'Who will actually work on my account?', a: 'A named accountant owns your file day to day, with specialists for tax, audit and AML assigned as your business needs them.' },
      { q: 'Do you handle AML compliance?', a: 'Yes. AML compliance specialists are part of the firm, so it is handled alongside your accounts rather than by a separate provider.' },
      { q: 'How many businesses do you work with?', a: 'More than 7,000 UAE businesses, and clients rate us 4.9 on Trustpilot across 239 reviews.' },
      { q: 'How is a firm priced compared with a freelancer?', a: 'Monthly packages start from AED 499 with published prices, so you get a full firm without hourly billing.' },
    ],
    final: {
      eyebrow: 'TALK TO OUR FIRM',
      title: 'Speak to the Firm, Not a Call Centre',
      description: 'Join 7,000+ UAE businesses that trust Finanshels. Tell us about the business and a senior member of the team will reply.',
      steps: ['Tell us about your business and obligations', 'A senior team member replies within 24 hours', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },

  /* ================================================================== 7 */
  'accounting-and-bookkeeping': {
    path: '/accounting-and-bookkeeping',
    seoTitle: 'Accounting & Bookkeeping Services UAE | One Team',
    seoDescription:
      'Accounting and bookkeeping combined. One team for the books and the compliance, one monthly invoice, from AED 499/month.',
    visual: 'merge',
    eyebrow: 'ACCOUNTING AND BOOKKEEPING, TOGETHER',
    h1: 'Accounting & Bookkeeping — Combined, Not Complicated',
    subhead:
      "One team handles the books and the compliance, so you're not managing two vendors and two invoices.",
    heroPoints: [
      'Books and compliance handled by one team',
      'One invoice a month',
      'No handovers between vendors',
    ],
    heroStats: [
      { value: '1', label: 'Team, one invoice' },
      { value: 'AED 499', label: 'Plans from, per month' },
      { value: '4.9', label: 'Trustpilot rating' },
    ],
    cta: { label: 'See Combined Plans', color: 'orange', kind: 'anchor', target: 'pricing' },
    whatsappMessage: 'Hi, I saw your Google ad for accounting and bookkeeping. I want to see the combined plans.',
    heroForm: {
      title: 'Get a Combined Plan',
      subtitle: 'Books and compliance on one plan. We confirm the right fit.',
    },
    problems: {
      eyebrow: 'THE PROBLEM',
      title: 'Two Vendors Means Two Versions of Your Numbers',
      subtitle: 'When one firm keeps the books and another handles compliance, you end up in the middle.',
      items: [
        { icon: 'users', title: 'Two Relationships to Manage', copy: 'Two contacts, two calendars, two sets of questions.' },
        { icon: 'wallet', title: 'Two Invoices', copy: 'Paying twice for work that overlaps.' },
        { icon: 'file', title: 'Handover Delays', copy: 'Every return waits for numbers to move from one vendor to the other.' },
        { icon: 'alert', title: 'Nobody Owns the Result', copy: 'When something is wrong, each side points at the other.' },
      ],
    },
    solution: {
      eyebrow: 'COMBINED',
      title: 'Accounting and Bookkeeping From One Team',
      description: 'The people who reconcile your accounts are the people who prepare your returns. Nothing is re-checked, because nothing changed hands.',
      features: [
        { icon: 'book', title: 'Bookkeeping', copy: 'Categorisation and bank reconciliation, on schedule.' },
        { icon: 'percent', title: 'VAT and Corporate Tax', copy: 'Returns prepared from the same books, by an FTA Registered Tax Agency.' },
        { icon: 'chart', title: 'Management Reports', copy: 'Profit, cash and balances you can act on.' },
        { icon: 'clipboard', title: 'Year-End Statements', copy: 'Annual financial statements prepared by the same team.' },
      ],
    },
    comparison: {
      eyebrow: 'IN-HOUSE VS OUTSOURCED',
      title: 'In-House Bookkeeper Plus Tax Consultant vs One Finanshels Team',
      subtitle: 'The usual setup, next to the combined one.',
      beforeLabel: 'In-house bookkeeper + outside tax consultant',
      afterLabel: 'One Finanshels team',
      rows: [
        ['A salary plus a separate consultant fee', 'One monthly plan, from AED 499'],
        ['Numbers handed over before every return', 'Returns prepared from the books we keep'],
        ['Two contacts to chase', 'One team, one point of contact'],
        ['Errors found late, between two parties', 'One team accountable for the result'],
      ],
    },
    sections: [
      {
        type: 'explainer',
        id: 'why-combined',
        eyebrow: "WHY SEPARATE ISN'T NECESSARY",
        title: 'Combined Service Scope',
        paragraphs: [
          'Every return starts from reconciled books. When one team does both, the handover step disappears and questions get answered once.',
          'Your plan covers the books; compliance work is added to the same plan and the same monthly invoice. Your quote confirms the total before you start.',
        ],
        scope: ['Bookkeeping and bank reconciliation', 'VAT returns', 'Corporate tax returns', 'Management reports', 'Year-end financial statements'],
      },
    ],
    steps: {
      eyebrow: 'HOW IT WORKS',
      title: 'One Setup for Books and Compliance',
      subtitle: 'Switching two vendors to one team, without a gap.',
      items: [
        { stage: 'Free Call', timeline: 'Day 0', copy: 'We look at your current books and compliance setup.' },
        { stage: 'Handover', timeline: 'Week 1', copy: 'We collect the handover from both current providers.' },
        { stage: 'One Calendar', timeline: 'Month 1', copy: 'Books and filing deadlines on one schedule, owned by one team.' },
      ],
    },
    pricing: {
      eyebrow: 'COMBINED PLANS',
      title: 'One Plan for Books and Compliance',
      subtitle: 'Published bookkeeping packages. Compliance is added to the same plan and the same invoice. Cancel anytime.',
    },
    faqs: [
      { q: 'What does a combined plan include?', a: 'Your bookkeeping package, with VAT, corporate tax and year-end work added to the same plan. Your quote lists exactly what is covered.' },
      { q: 'Will I really get one invoice?', a: 'Yes. Books and compliance are billed together, once a month.' },
      { q: 'Can you take over from my current two providers?', a: 'Yes. We request the handover from both, reconcile what we receive and flag anything incomplete.' },
      { q: 'Are you registered to file tax returns?', a: 'Yes. Finanshels is an FTA Registered Tax Agency, Agency Registration No. 30022628.' },
      { q: 'Do you work with businesses in Abu Dhabi?', a: 'Yes. We work with businesses across the UAE, and all work is delivered online.' },
    ],
    final: {
      eyebrow: 'GET STARTED',
      title: 'One Team. One Invoice. Books Clean.',
      description: 'Join 7,000+ UAE businesses that run their books and compliance with Finanshels.',
      steps: ['Share your current books and tax setup', 'Get a combined plan within 24 hours', 'Pay only if satisfied, no commitment'],
    },
    footnotes: [],
  },
};

export default adGroupLandings;
