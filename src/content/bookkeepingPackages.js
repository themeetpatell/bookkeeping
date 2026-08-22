/**
 * Copy and data for the /packages landing page (Google Ads "bookkeeping
 * packages" ad group).
 *
 * Kept out of the page component for two reasons: the component stays readable,
 * and the next ad-group variation forks this file rather than a 700-line JSX
 * tree.
 *
 * AD-POLICY CONSTRAINT — read before editing any string in this file.
 * Google Ads disapproved this destination once already under the government
 * documents & official services policy. No copy here may name VAT, corporate
 * tax, the FTA, EmaraTax, TRN, WPS or a ministry, claim any registration,
 * filing or submission to an authority, or mention another Finanshels domain.
 * The disapproval is keyword-triggered on the built output, so it fires on
 * collapsed FAQ answers and class names too. Verify with the grep in README.md
 * against dist/ before shipping. Reassurance is carried by what we do to our
 * own books instead: reconciliation, close, management reporting, year-end
 * schedules an auditor can work from.
 */

/** Where the plan CTAs and the hero CTA scroll to. */
export const QUOTE_ANCHOR_ID = 'get-a-quote';

/** Turnaround promised on the form, so the page states it in exactly one place. */
export const QUOTE_RESPONSE_TIME = 'within 1 business day';

/**
 * The three published tiers, matching the pricing already live on /bookkeeping
 * so a visitor comparing the two pages never sees a different number.
 *
 * `reporting` is deliberately its own field rather than another bullet: the ad
 * group sells on reporting cadence, so it has to be scannable in the comparison
 * without opening a plan.
 */
export const packages = [
  {
    id: 'starter',
    name: 'Starter',
    price: '499',
    priceNote: 'from AED 499/month',
    fit: 'Freelancers, solo founders and new companies with light activity.',
    volume: 'Up to 50 transactions a year',
    reporting: 'Quarterly management accounts + annual financial statements',
    accountant: 'Dedicated support manager',
    yearEnd: 'Annual financial statements prepared for you',
    features: [
      'Bank reconciliation on every account',
      'Annual financial statements',
      'Quarterly management accounts',
      'Dedicated support manager',
      '30-minute finance review',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '999',
    priceNote: 'AED 999/month',
    popular: true,
    fit: 'Trading and service companies with steady month-on-month activity.',
    volume: 'Up to 2,000 transactions a year',
    reporting: 'Quarterly bookkeeping, quarterly reports, budget vs actual',
    accountant: 'Dedicated account manager',
    yearEnd: 'Year-end schedules your auditor can work from',
    features: [
      'Everything in Starter, plus:',
      'Quarterly bookkeeping and expense categorisation',
      'Cash-flow analysis',
      'Budget vs actual reporting',
      'Multi-currency support',
      'Dedicated account manager',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    price: '1,999',
    priceNote: 'AED 1,999/month',
    fit: 'Multi-entity and higher-volume businesses that need the numbers monthly.',
    volume: 'Up to 3,600 transactions a year',
    reporting: 'Monthly bookkeeping + monthly management reports',
    accountant: 'Dedicated account manager + CFO advisory',
    yearEnd: 'Year-end schedules plus a review call before close',
    features: [
      'Everything in Growth, plus:',
      'Monthly bookkeeping and month-end close',
      'Monthly management reports',
      'Advanced reporting suite and custom dashboard',
      'API integrations with your stack',
      'CFO advisory services',
    ],
  },
];

/**
 * Rows of the side-by-side comparison. Each row reads one field off every plan,
 * so adding an attribute means adding one entry here and nothing else.
 */
export const comparisonRows = [
  { label: 'Monthly price', field: 'priceNote' },
  { label: 'Best for', field: 'fit' },
  { label: 'Bookkeeping scope', field: 'volume' },
  { label: 'Reporting', field: 'reporting' },
  { label: 'Accountant support', field: 'accountant' },
  { label: 'Year-end', field: 'yearEnd' },
];

/** "What's included" — the scope a visitor sees before committing to the form. */
export const includedItems = [
  {
    title: 'Daily transaction categorisation',
    description:
      'Every transaction categorised and every bank, card and payment account reconciled — not batched up and rushed at year-end.',
  },
  {
    title: 'Management reports on your cadence',
    description:
      'Profit and loss, balance sheet and cash position, delivered quarterly or monthly depending on the package you choose.',
  },
  {
    title: 'Books kept to IFRS standards',
    description:
      'Ledgers and schedules maintained to the standard your auditor, your bank and your investors expect to see.',
  },
  {
    title: 'Clean year-end schedules',
    description:
      'Reconciled, documented working papers handed over ready — so year-end is a handover, not a three-week reconstruction.',
  },
  {
    title: 'A dedicated accountant',
    description:
      'One named accountant who knows your business, answers on WhatsApp, and owns your numbers month after month.',
  },
  {
    title: 'Onboarding and switching handled',
    description:
      'We collect the handover from your current provider, migrate the history and tell you exactly what happens on each day.',
  },
];

/** Proof points placed beside the decision, not buried below it. */
export const proofPoints = [
  { value: '7,000+', label: 'UAE businesses served' },
  { value: '4.9', label: 'Average client rating' },
  { value: '150+', label: 'Qualified accountants' },
  { value: '48 hrs', label: 'To switch providers' },
];

/** The three switching steps. Answers "what happens to my current books?". */
export const switchSteps = [
  {
    step: '1',
    title: 'You introduce us',
    description:
      'One email to your current provider. We take the conversation from there and request the handover ourselves.',
  },
  {
    step: '2',
    title: 'We organise the handover',
    description:
      'We collect your ledgers, bank data and open items, reconcile what we receive and flag anything that looks incomplete.',
  },
  {
    step: '3',
    title: 'You see the plan',
    description:
      'Within 48 hours you get a written view of where your books stand, what we are fixing first, and your reporting calendar.',
  },
];

/**
 * Monthly transaction bands offered on the quote form. Bands are monthly
 * because that is how an owner thinks about their own volume; the packages are
 * scoped annually, so the copy on each option carries the plan it points at.
 */
export const transactionVolumeBands = [
  'Fewer than 20 a month',
  '20 – 80 a month',
  '80 – 170 a month',
  '170 – 300 a month',
  'More than 300 a month',
  'Not sure yet',
];

export const faqs = [
  {
    question: 'What do your bookkeeping packages actually cost?',
    answer:
      'Packages start at AED 499 a month for Starter and are billed monthly with no lock-in. Growth is AED 999 a month and Scale is AED 1,999 a month. The price you see is the price you pay — there is no setup fee and no charge for onboarding or migrating your history.',
  },
  {
    question: 'How do the 3 free months work?',
    answer:
      'The offer applies to annual plans only: pay for 12 months up front and you receive 3 additional months of the same package at no charge, for 15 months in total. It cannot be combined with monthly billing. Confirm current availability with your accountant when you request your quote.',
  },
  {
    question: 'Which package should I choose?',
    answer:
      'Pick by transaction volume first. Under roughly 20 transactions a month, Starter is enough. Between 20 and 170, Growth fits. Above that, or if you run more than one entity and need the numbers monthly rather than quarterly, choose Scale. Tell us your volume on the quote form and we will confirm the right fit before you commit.',
  },
  {
    question: 'What if I outgrow my package?',
    answer:
      'You move up at any time and we prorate the difference — nothing is re-onboarded and your accountant stays the same. We flag it ourselves when your volume approaches the ceiling, so you are never billed for an overage you did not see coming.',
  },
  {
    question: 'How quickly can I switch from my current bookkeeper?',
    answer:
      'Most businesses are switched within 48 hours. We request the handover from your existing provider, migrate your history and give you a written view of where your books stand and what we are correcting first. You do not need to manage the transition yourself.',
  },
  {
    question: 'Which accounting software do you work with?',
    answer:
      'Zoho Books, Xero, QuickBooks and FreshBooks, plus most bank and payment-gateway feeds. If you already have a setup, we work inside it. If you do not, we will recommend one as part of onboarding at no extra cost.',
  },
];
