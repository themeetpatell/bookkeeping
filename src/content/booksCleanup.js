/**
 * Copy and data for the /books-cleanup landing page (Google Ads + Bing Ads
 * "books cleanup" / catch-up bookkeeping ad groups).
 */

/** Where the cleanup CTAs scroll to. */
export const CLEANUP_QUOTE_ANCHOR_ID = 'get-a-quote';

/** Turnaround promised on the form, stated in exactly one place. */
export const CLEANUP_RESPONSE_TIME = 'within 1 business day';

/** The one number the ad promises. Keep as displayed string, no separators logic. */
export const CLEANUP_PRICE = '1,499';

/**
 * The three intents the ad groups actually buy, as a selector directly under
 * the hero. Each `id` is a real anchor target so a Google Ads final URL can
 * deep-link straight to the matching card (/books-cleanup#software-cleanup).
 *
 * `value` is what gets stamped on the quote form as the cleanup type. It is
 * snake_case and stable — treat it as an identifier, not display copy, because
 * it is what reporting groups on.
 */
export const cleanupIntents = [
  {
    id: 'catch-up-bookkeeping',
    value: 'catch_up_bookkeeping',
    title: 'Months Behind on Bookkeeping?',
    copy: 'We capture missing transactions, correct categorisation and close each overdue month in order.',
    cta: 'Scope My Backlog',
  },
  {
    id: 'software-cleanup',
    value: 'software_cleanup',
    title: 'QuickBooks, Xero or Zoho Books Cleanup',
    copy: 'We fix duplicates, miscoding, opening balances and unreconciled entries without selling software licences.',
    cta: 'Clean Up My Software Books',
  },
  {
    id: 'reconciliation',
    value: 'reconciliation',
    title: 'Bank and Balance-Sheet Reconciliation',
    copy: 'We match bank and card activity, investigate differences and deliver support for every corrected balance.',
    cta: 'Reconcile My Accounts',
  },
];

/** Backlog bands offered on the quote form — how an owner describes the mess. */
export const backlogBands = [
  'Less than 3 months behind',
  '3 – 6 months behind',
  '6 – 12 months behind',
  '1 – 2 years behind',
  'More than 2 years behind',
  'Not sure — books are a mess',
];

/**
 * The artefacts handed over at the end of the engagement.
 *
 * Distinct from `cleanupDeliverables`, which describes the WORK performed —
 * this is what the client actually receives, which is what makes the
 * engagement tangible enough to buy.
 */
export const cleanupOutputs = [
  'Every supplied bank and card account reconciled through the agreed closing date.',
  'Missing, duplicated and miscoded transactions identified and corrected.',
  'A clean general ledger and trial balance.',
  'An exception list showing unresolved items that still need client evidence.',
  'Closing schedules ready for tax filing, audit or ongoing monthly bookkeeping.',
];

/** Stated immediately under the outputs so the fixed-quote promise is qualified. */
export const cleanupScopeNote =
  'Final scope and price depend on months behind, transaction volume, number of accounts and condition of the records. Finanshels confirms both before work starts.';

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
    title: 'Scope the backlog',
    description:
      'You tell us the months behind, software and number of bank or card accounts.',
  },
  {
    step: '2',
    title: 'Receive a fixed quote',
    description:
      'A Finanshels accountant reviews the scope and confirms the fee, documents and delivery timeline.',
  },
  {
    step: '3',
    title: 'Approve the cleaned books',
    description:
      'We reconcile the records, flag missing evidence and deliver the final schedules for approval.',
  },
];

/**
 * The price box under the steps.
 *
 * Deliberately carries no turnaround claim. The delivery timeline is confirmed
 * per engagement at step 2 — the operating team has not confirmed a defensible
 * range to publish, and an unconditional one on a paid landing page is a promise
 * the delivery team has to keep.
 */
export const cleanupPriceBox = {
  headline: `Starting from AED ${CLEANUP_PRICE}`,
  note:
    'Suitable for smaller cleanups. The final fixed quote is based on backlog length, transaction volume, account count and record quality.',
};

export const cleanupFaqs = [
  {
    question: 'How much does bookkeeping cleanup cost in the UAE?',
    answer:
      'Cleanup engagements start from AED 1,499. The final fixed quote depends on how many months are in the backlog, transaction volume, how many bank and card accounts you run and the condition of the records. We confirm the fee in writing before any work starts, and it is not billed by the hour.',
  },
  {
    question: 'Can you clean up QuickBooks, Xero or Zoho Books?',
    answer:
      'Yes — QuickBooks, Xero, Zoho Books and FreshBooks, plus books kept in spreadsheets that need moving into proper software. We work inside the file you already own and we do not sell software licences. If you have no setup yet, we recommend one and migrate the cleaned history into it at no extra cost.',
  },
  {
    question: 'What documents do you need to start?',
    answer:
      'Bank and credit-card statements for every month in the backlog, access to your accounting file if you have one, and whatever invoices, bills and payment-gateway exports exist. You do not need a complete set to begin — the scoping step tells us what is there, and anything genuinely missing goes on the exception list rather than being estimated.',
  },
  {
    question: 'Can you fix more than one year of overdue books?',
    answer:
      'Yes. Multi-year backlogs are normal work for us and are quoted the same way as a short one — the length of the backlog is one of the inputs to the fixed quote. We close each overdue period in order so every year stands on its own rather than being merged into a single adjustment.',
  },
  {
    question: 'Will the cleaned books be ready for tax filing or audit?',
    answer:
      'We prepare closing schedules and reconciled ledgers to the standard your tax agent or auditor works from. Whether they are sufficient for a specific filing or audit depends on the evidence you are able to supply and on the scope we agreed — where evidence is missing, it is named on the exception list rather than assumed. We do not make submissions to any authority on your behalf.',
  },
  {
    question: 'How do you handle missing documents or unexplained transactions?',
    answer:
      'We reconstruct from what exists — statements, invoices, gateway exports and supplier records — and everything we cannot support with evidence goes on a written exception list with the amount, the date and what is needed to resolve it. Nothing is silently estimated or forced to balance.',
  },
];

/**
 * The named specialist who reviewed this page's claims.
 *
 * A named, credentialed human with a real photo and a reachable profile is the
 * whole point of the module — an unnamed "expert" or a stock portrait is worse
 * than no attribution, because it reads as manufactured authority.
 *
 * `photo` degrades to initials if the file is absent, so a missing asset can
 * never ship a broken image to a paid landing page.
 *
 * `profileUrl` is empty and the link is not rendered while it is. The natural
 * destination is the main Finanshels web presence; the Google Ads constraint
 * that previously blocked that link was resolved on 2026-09-11, so this can now
 * be set to a real profile URL.
 */
export const cleanupReviewer = {
  name: 'Suhail K Y, CMA\u00ae',
  role: 'Bookkeeping, finance, audit and CFO specialist at Finanshels.',
  photo: '/authors/suhail-ky.jpg',
  profileUrl: '',
};
