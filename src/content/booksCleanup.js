/**
 * Copy and data for the /books-cleanup landing page (Google Ads + Bing Ads
 * "books cleanup" / catch-up bookkeeping ad groups).
 *
 * AD-POLICY CONSTRAINT — read before editing any string in this file.
 * Same rules as src/content/bookkeepingPackages.js: no copy here may name VAT,
 * corporate tax, the FTA, EmaraTax, TRN, WPS or a ministry, claim any
 * registration, filing or submission to an authority, or mention another
 * Finanshels domain. The disapproval is keyword-triggered on the built output.
 * Reassurance is carried by what we do to the books themselves: catch-up,
 * reconciliation, close, management reporting, year-end schedules an auditor
 * can work from.
 */

/** Where the cleanup CTAs scroll to. */
export const CLEANUP_QUOTE_ANCHOR_ID = 'get-a-quote';

/** Turnaround promised on the form, stated in exactly one place. */
export const CLEANUP_RESPONSE_TIME = 'within 1 business day';

/** The one number the ad promises. Keep as displayed string, no separators logic. */
export const CLEANUP_PRICE = '1,499';

/** Backlog bands offered on the quote form — how an owner describes the mess. */
export const backlogBands = [
  'Less than 3 months behind',
  '3 – 6 months behind',
  '6 – 12 months behind',
  '1 – 2 years behind',
  'More than 2 years behind',
  'Not sure — books are a mess',
];

/** What the cleanup engagement delivers, shown before the visitor is asked for anything. */
export const cleanupDeliverables = [
  {
    title: 'Every transaction captured and categorised',
    description:
      'We work through the full backlog — bank accounts, cards and payment gateways — so every month is complete, not estimated.',
  },
  {
    title: 'Bank and card reconciliation, month by month',
    description:
      'Each account reconciled to its statement for every month in the backlog, with differences investigated instead of written off.',
  },
  {
    title: 'Duplicates, errors and miscodings fixed',
    description:
      'We find the double entries, wrong categories and unposted items that crept in, and correct them at the source.',
  },
  {
    title: 'Ledgers rebuilt to IFRS standards',
    description:
      'Your books end the cleanup at the standard your auditor, your bank and your investors expect to see.',
  },
  {
    title: 'Clean year-end schedules and working papers',
    description:
      'Reconciled, documented schedules handed over ready — so year-end becomes a handover, not a reconstruction.',
  },
  {
    title: 'A clear picture of your numbers',
    description:
      'Profit and loss, balance sheet and cash position for the cleaned-up period, so you finally know where the business stands.',
  },
];

/** Proof points beside the decision. Same figures published on the other pages. */
export const cleanupProofPoints = [
  { value: '7,000+', label: 'UAE businesses served' },
  { value: '4.9', label: 'Average client rating' },
  { value: '150+', label: 'Qualified accountants' },
  { value: 'Fixed', label: 'Quote before we start' },
];

/** The three steps between "my books are a mess" and "my books are clean". */
export const cleanupSteps = [
  {
    step: '1',
    title: 'Tell us how far behind you are',
    description:
      'Share your backlog and your setup on the form. A senior accountant reviews it and replies with a fixed cleanup quote — no hourly surprises.',
  },
  {
    step: '2',
    title: 'We rebuild the backlog',
    description:
      'Your dedicated accountant works through every month: capturing, categorising and reconciling until each period closes clean.',
  },
  {
    step: '3',
    title: 'You get clean books and a plan',
    description:
      'You receive reconciled ledgers, year-end schedules and a written summary of what we fixed — plus a monthly plan if you want the books to stay clean.',
  },
];

export const cleanupFaqs = [
  {
    question: 'How much does a books cleanup cost?',
    answer:
      'Cleanup engagements start from AED 1,499. The final quote depends on how many months are in the backlog, how many accounts you run and the state of the records — which is why we ask for the backlog on the quote form and confirm a fixed price before any work starts.',
  },
  {
    question: 'How long does a cleanup take?',
    answer:
      'Most cleanups complete within 1 to 3 weeks depending on the size of the backlog. You get a committed timeline with your quote, and a named accountant who reports progress as each period closes.',
  },
  {
    question: 'My records are incomplete. Can you still clean up my books?',
    answer:
      'Yes. We reconstruct from what exists — bank statements, invoices, payment-gateway exports and supplier records — and give you a clear list of anything genuinely missing, so nothing is silently estimated.',
  },
  {
    question: 'Which software do you clean up in?',
    answer:
      'Zoho Books, Xero, QuickBooks and FreshBooks, plus spreadsheet-kept books that need moving into proper software. If you have no setup yet, we recommend one and migrate the cleaned history into it at no extra cost.',
  },
  {
    question: 'What do I actually receive at the end?',
    answer:
      'Reconciled ledgers for the full cleanup period, month-by-month bank reconciliations, corrected categorisations, year-end schedules your auditor can work from, and a written summary of what was fixed.',
  },
  {
    question: 'What happens after the cleanup?',
    answer:
      'That is up to you. Many businesses move onto a monthly bookkeeping package from AED 499/month so the backlog never rebuilds — but the cleanup is a standalone engagement and there is no obligation to continue.',
  },
];
