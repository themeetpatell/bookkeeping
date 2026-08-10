/**
 * Renders the pricing page markup as discrete sections the assembler groups
 * into Webflow embeds.
 *
 * Content is reconciled from two sources:
 *   - finanshels.com/accounting-packages (live)  — plan names, feature matrix
 *   - finanshels-website.vercel.app/pricing (planned) — positioning, process,
 *     FAQs, the in-house comparison
 *
 * Deliberately QUOTE-BASED: no monthly figures appear anywhere, matching what
 * is live today. The two sources disagreed on transaction caps (cards said
 * 60/200/2,000/3,600, both comparison tables said 100/500/1,500); the table
 * numbers are used because they are corroborated on both pages.
 */

const WHATSAPP_PHONE = '971521549572';
const WHATSAPP_MESSAGE =
  "Hi Finanshels! I'd like a quote for your accounting packages.";

/** Builds a wa.me deep link with the chat pre-filled. */
const waUrl = (message) => (
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}` +
  `&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`
).replace(/&/g, '&amp;');

export const WA = waUrl(WHATSAPP_MESSAGE);

/** Client logos are served from the React app's origin, same as the AI page. */
const ASSETS = 'https://accounting.finanshels.co';

const ZOHO_FORM_ACTION =
  'https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit';

/* ---------- icon sprite ---------- */
const FEATHER =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const SYMBOLS = {
  check: [FEATHER, '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'],
  tick: [FEATHER, '<polyline points="20 6 9 17 4 12"/>'],
  chevron: [FEATHER, '<polyline points="6 9 12 15 18 9"/>'],
  'chev-left': [FEATHER, '<polyline points="15 18 9 12 15 6"/>'],
  'chev-right': [FEATHER, '<polyline points="9 18 15 12 9 6"/>'],
  /* Rotated 45deg by CSS on an open FAQ row, so one symbol covers open+close. */
  plus: [FEATHER, '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'],
  arrow: [FEATHER, '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'],
  shield: [FEATHER, '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'],
  clock: [FEATHER, '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'],
  cpu: [FEATHER, '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>'],
  human: [FEATHER, '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>'],
  lock: [FEATHER, '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'],
  award: [FEATHER, '<circle cx="12" cy="8" r="6"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>'],
  refresh: [FEATHER, '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'],
  plug: [FEATHER, '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v3a6 6 0 0 1-12 0V8z"/>'],
  star: ['viewBox="0 0 24 24" fill="currentColor"', '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'],
  whatsapp: ['viewBox="0 0 448 512" fill="currentColor"', '<path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>'],
};

export const SPRITE = `  <svg class="fspr-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
${Object.entries(SYMBOLS)
  .map(([id, [attrs, body]]) => `    <symbol id="fspr-i-${id}" ${attrs}>${body}</symbol>`)
  .join('\n')}
  </svg>`;

const icon = (id, cls) =>
  `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true" focusable="false"><use href="#fspr-i-${id}"/></svg>`;

const I = new Proxy({}, { get: (_, id) => icon(id) });

/**
 * Tracking hook for the Webflow site's existing WhatsApp analytics.
 *
 * On the Webflow side `data-wa-track` is a CSS class (it sits in the Style
 * selector next to `call-button`), so it is emitted as a class here. It is
 * also emitted as a bare attribute, because a GTM trigger keyed on
 * `[data-wa-track]` is just as likely as one keyed on `.data-wa-track`, and
 * carrying both costs nothing. The cascade fence outranks any host rule that
 * happens to style `.data-wa-track`, so the class cannot change how these
 * buttons look.
 *
 * The per-source `data-fspr-wa` stays alongside it — that is what feeds the
 * `whatsapp_click` dataLayer push and keeps the entry points distinguishable.
 */
const WA_TRACK = 'data-wa-track';

const waLink = (source, cls, label) => `<a
          href="${WA}"
          target="_blank"
          rel="noopener noreferrer"
          class="${cls} ${WA_TRACK}"
          ${WA_TRACK}
          data-fspr-wa="${source}"
        >${label}</a>`;

/* ---------- data ---------- */

/** Mirrors the AI-accounting page's strip — same marks, same order. */
const clientLogos = [
  ['Binary.png', 'Binary'],
  ['actualize.png', 'Actualize'],
  ['carbonsirf.png', 'CarbonSirf'],
  ['cotu.avif', 'COTU Ventures'],
  ['fuze.png', 'Fuze'],
  ['growdash.png', 'Growdash'],
  ['humlog.png', 'Humlog'],
  ['veehive.png', 'Veehive'],
  ['zywa.png', 'Zywa'],
];

/* The AI-native claim only converts if it comes with the human counterweight,
   so the two columns are authored as one pair and always render together. */
const softwareDuties = [
  'Sorts every transaction, every day',
  'Matches your bank lines as they land',
  'Reads your invoices and receipts',
  'Watches every VAT and Corporate Tax deadline',
  'Drafts your returns and monthly reports',
  'Flags duplicates and odd entries for review',
];

const accountantDuties = [
  'Checks and approves the work',
  'Resolves anything the software set aside',
  'Signs off on VAT &amp; Corporate Tax filings',
  'Talks through cash, runway and structure',
  'Answers on WhatsApp &mdash; as a person, quickly',
  'Owns the numbers at audit time',
];

const trustPoints = [
  ['lock', 'Encrypted end to end', 'Your data is encrypted in transit and at rest, with role-restricted access for the team on your account.'],
  ['shield', 'Never trains outside models', 'Your financials are never handed to third-party AI providers for training. Not now, not later.'],
  ['award', 'FTA-registered tax agency', 'Returns are filed under a licensed UAE tax agency, so someone regulated is accountable for them.'],
  ['human', 'A named team, every month', 'The same accountant and reviewer month after month &mdash; not whoever picks up the ticket.'],
];

const plans = [
  {
    tag: 'Basic',
    name: 'Essential',
    for: 'Solo founders and early-stage companies that need the books clean and the filings on time.',
    volume: 'Up to 100',
    volumeLabel: 'transactions / year',
    cadence: 'Cash-basis, reported annually',
    features: [
      'Annual management report',
      'Annual bank &amp; credit card reconciliation',
      'Free tax advisory &mdash; 1 hour a year',
      'Free Corporate Tax registration',
      'Free Corporate Tax filing',
      'Unlimited email &amp; chat support',
    ],
  },
  {
    tag: 'Most picked',
    name: 'Growth',
    featured: true,
    for: 'Growing SMEs that want quarterly numbers and VAT handled without chasing anyone.',
    volume: 'Up to 500',
    volumeLabel: 'transactions / year',
    cadence: 'Cash-basis, reported quarterly',
    inherit: 'Everything in Essential, plus',
    features: [
      'Quarterly management reports',
      'Quarterly bank &amp; credit card reconciliation',
      'Free tax advisory &mdash; 2 hours a quarter',
      'Free VAT registration',
      'Free quarterly VAT filing',
    ],
  },
  {
    tag: 'Enterprise',
    name: 'Scale',
    for: 'Higher-volume operators that need monthly accrual accounting and a fuller picture.',
    volume: 'Up to 1,500',
    volumeLabel: 'transactions / year',
    cadence: 'Accrual-basis, reported monthly',
    inherit: 'Everything in Growth, plus',
    features: [
      'Monthly management reports',
      'Monthly bank &amp; credit card reconciliation',
      'Free tax advisory &mdash; 1 hour a month',
      'Receivables &amp; payables summaries',
      'Schedule preparation',
    ],
  },
];

/** Feature matrix. `true` renders a tick, `false` a dash. */
const compareRows = [
  ['Bookkeeping', 'Up to 100 txn/yr', 'Up to 500 txn/yr', 'Up to 1,500 txn/yr'],
  ['Accounting type', 'Cash-basis (annual)', 'Cash-basis (quarterly)', 'Accrual-basis (monthly)'],
  ['Management reports', 'Annual', 'Quarterly', 'Monthly'],
  ['Bank reconciliation', 'Annual', 'Quarterly', 'Monthly'],
  ['Credit card reconciliation', 'Annual', 'Quarterly', 'Monthly'],
  ['Free tax advisory', '1 hr / year', '2 hrs / quarter', '1 hr / month'],
  ['Corporate Tax registration', true, true, true],
  ['Corporate Tax filing', true, true, true],
  ['Unlimited email &amp; chat support', true, true, true],
  ['VAT registration', false, true, true],
  ['Quarterly VAT filing', false, true, true],
  ['Receivables summary', false, false, true],
  ['Payables summary', false, false, true],
  ['Schedule preparation', false, false, true],
];

const assurances = [
  ['shield', 'Pay only if satisfied', 'Zero errors and total confidence, or your money back.'],
  ['refresh', 'No lock-in', 'Move up or down a plan whenever your volume changes.'],
  ['clock', 'Live in 7 days', 'Most clients are fully onboarded inside a week.'],
  ['plug', 'Keep your tools', 'We plug into your existing banks, ERP and invoicing stack.'],
];

const altRows = [
  ['Monthly cost', 'AED 12,000&ndash;25,000+ in salary, visa and benefits', 'AED 3,000&ndash;10,000+, often billed by the hour', 'One fixed monthly fee, quoted to your volume'],
  ['Time to productive', '3&ndash;6 months of hiring, onboarding and visas', '2&ndash;4 weeks scoping, then a slow ramp-up', 'Fully operational within 7 days'],
  ['Coverage', 'One generalist, with gaps in VAT, CT or CFO work', 'Audit or tax only &mdash; rarely both', 'VAT, CT, AML, accounting and CFO under one roof'],
  ['Compliance risk', 'A single point of failure if that person leaves', 'Reactive &mdash; you chase them for updates', 'Proactive alerts and a tracked filing calendar'],
  ['Scales with you', 'Another hire at every growth stage', 'Re-scope and renegotiate every year', 'Change plan in minutes, no new contract'],
];

/* Add-ons sourced from the live accounting-packages page ("Our Most Popular
   Add-On Services") plus the service list in that site's nav. AML is flagged
   because it carries a hard regulatory deadline for regulated activities.
 *
 * Each one is its own funnel: a pre-filled WhatsApp thread naming the service.
 *
 * The per-service "Learn more" links were removed on 2026-08-08. They pointed
 * at finanshels.com, which Google has flagged, and their slugs spelled out the
 * exact terms that trip the government-services policy check
 * (…/services/corporate-tax-registration-in-uae, …/vat-registration-in-uae).
 * Re-add them only once equivalent pages exist on the .co domain under slugs
 * that avoid "registration".
 */
const addons = [
  {
    name: 'Corporate Tax Registration',
    text: 'Register with the FTA and get your Corporate Tax TRN before the deadline.',
  },
  {
    name: 'Corporate Tax Filing',
    text: 'Annual return prepared, reviewed by an accountant and filed on time.',
  },
  {
    name: 'Corporate Tax De-registration',
    text: 'Closing or restructuring? We handle the exit filing properly.',
  },
  {
    name: 'VAT Registration',
    text: 'Threshold check, application and TRN &mdash; handled end to end.',
  },
  {
    name: 'VAT Filing',
    text: 'Quarterly returns prepared and submitted to the FTA.',
  },
  {
    name: 'VAT De-registration',
    text: 'Deregister cleanly once you drop below the threshold.',
  },
  {
    name: 'AML Compliance',
    text: 'Policies, goAML registration and ongoing reporting for regulated activities.',
    flagged: true,
  },
  {
    name: 'Audit &amp; Assurance',
    text: 'Statutory audit plus the year-end support that goes with it.',
  },
  {
    name: 'Audited Financial Statements',
    text: 'Statements your bank, investors or free zone will accept.',
  },
  {
    name: 'Liquidation Report',
    text: 'The liquidator report you need to close a licence.',
  },
  {
    name: 'Invoicing &amp; Quotation',
    text: 'Invoice and quotation set-up so billing stops leaking revenue.',
  },
  {
    name: 'CFO Consultation',
    text: 'Fractional CFO time for pricing, runway and board prep.',
  },
  {
    name: 'Financial Modelling',
    text: 'Forecasts and models built for fundraising or planning.',
  },
];

/** `Audit &amp; Assurance` -> `audit-assurance`, for GTM event labels. */
const slugify = (name) =>
  name
    .replace(/&[a-z]+;/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Plain text for the WhatsApp body — entities would arrive literally. */
const plainName = (name) => name.replace(/&amp;/g, '&').replace(/&mdash;/g, '—');

const steps = [
  ['Week 1', 'We take the mess off your plate', 'We migrate your books, reconcile the history and connect your banks and tools &mdash; without disturbing a single deadline.'],
  ['Weeks 2&ndash;3', 'You finally see your numbers clearly', 'Live reporting, a compliance calendar, and a named team that knows your business rather than a ticket queue.'],
  ['Every month', 'It just runs', 'Reports on time, VAT and Corporate Tax handled ahead of the deadline, and someone to call when you need an answer.'],
];

/* Every quote below is already published under the same attribution on
 * finanshels.com — six of them run on the service pages (AML, CFO, Corporate
 * Tax filing, VAT filing, SMEs) and the homepage; the ZWAG AI and Nassib
 * Sawaya quotes were already on this page. Nothing here is written for the
 * page: these are real customers, so the wording stays as published.
 *
 * The only edit is to Jomon Ulahannan's, which reads "We insurancehub.ae
 * highly recommend" live — a stray domain mid-sentence. The fragment is
 * dropped and nothing else changed; his company is already named beneath it.
 *
 * Ordered to cover a different service each time rather than by strength, so
 * a reader swiping through sees the range: automation, long-term bookkeeping,
 * reporting, modelling, Corporate Tax, VAT, and a complex multi-entity fix.
 */
const voices = [
  ['They designed an accounting system tailor made to our needs &amp; completely automated our finance operations just like they promised. They&rsquo;ve been super helpful for us to scale.', 'Jeremy Khatar', 'CEO, Ronin Global LLC', 'JK'],
  ['Finanshels team is very professional. They have been handling ZWAG AI&rsquo;s accounts since 2022. From bookkeeping to auditing and Corporate Tax filings, they made it simple and hassle free for me. Highly recommended.', 'Priya M Nair', 'Founder, ZWAG AI', 'PN'],
  ['Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving. Very happy that I took the decision to work with them.', 'Szilvia Vitos', 'Founder, Livvity', 'SV'],
  ['If you ever do any financial modeling/forecasting, I seriously can&rsquo;t recommend Finanshels enough. They are a dependable team of professionals who work hard to deliver results.', 'Bader Al Kazimi', 'Founder, Optimize App', 'BK'],
  ['We are genuinely happy with the way Finanshels have been handling our accounts. From day one the team has been proactive and professional, and always available to answer our questions. They have done a great job filing our Corporate Taxes and keeping our books sound.', 'Nassib Sawaya', 'Director, UAE Business', 'NS'],
  ['Fast, friendly, and very professional. I love how communicative they were handling our Corporate tax registration.', 'Abdulla Al-Ogail', 'Co-founder &amp; CEO, Olymon', 'AO'],
  ['I am extremely grateful for the exceptional service we received from Finanshels.com. We highly recommend their services to anyone seeking a reliable and trustworthy accounting partner.', 'Jomon Ulahannan', 'Founder &amp; CEO, Insurance Hub', 'JU'],
  ['They thoroughly understood our business processes and streamlined our accounting processes perfectly where both our in-house and outsourced accountants failed multiple times.', 'Meet Patel', 'Former COO, StudentHub &amp; BAWES', 'MP'],
];

/* Grouped rather than one flat list: ten questions in a single column reads as
   a wall, and the labels let someone scan straight to the one they came for. */
const faqGroups = [
  {
    label: 'Pricing &amp; quoting',
    items: [
      ['Why don&rsquo;t you show prices on this page?', 'Because the honest answer depends on your transaction volume, how many entities you run and how much historical clean-up is needed. We quote a fixed monthly fee against your actual numbers rather than publishing a figure you would have to renegotiate later. Most quotes come back within 24 hours of the call.'],
      ['Is there a setup fee?', 'Setup is included on annual plans. On quarterly or monthly billing we charge a one-time onboarding fee based on how much historical clean-up is involved &mdash; quoted upfront, never a surprise.'],
      ['Can I change plans later?', 'Yes, up or down, whenever your volume changes. Most clients start on Growth and move to Scale as their transaction count climbs.'],
    ],
  },
  {
    label: 'Getting started',
    items: [
      ['What happens during onboarding?', 'Days 0&ndash;7 are digitisation &mdash; books, banking and reconciliations. Days 8&ndash;21 bring the reporting and compliance trackers online. From day 22 you are on a steady monthly cadence with investor-ready reporting.'],
      ['I&rsquo;m switching from another firm &mdash; how painful is it?', 'Not painful. Historical clean-up, data migration and reconciling gaps from your previous setup are all part of onboarding. No downtime, no lost records, and no missed filing deadlines during the handover.'],
      ['Do I have to change accounting software?', 'No. We plug into the ERPs and banks you already use &mdash; QuickBooks, Xero, Zoho Books, major UAE bank feeds and custom stacks. If a migration genuinely makes sense we scope it as a separate project and run it for you.'],
    ],
  },
  {
    label: 'AI &amp; your data',
    items: [
      ['Is AI doing my accounting on its own?', 'No. AI drafts, a qualified accountant signs. Every categorisation, reconciliation and filing is reviewed by a person before it reaches you or the FTA. You get the speed of automation with the accountability of a licensed firm &mdash; that is what the fixed fee buys you.'],
      ['What does &ldquo;AI-native&rdquo; actually change for me?', 'Most firms bolt AI onto a manual month-end. Our workflow was built around it, so sorting, matching, document capture and deadline tracking run continuously instead of in a scramble at close. That is why the price scales with your transaction volume rather than with billable hours.'],
      ['Is my financial data safe?', 'Yes. Data is encrypted in transit and at rest, access is role-restricted to the team on your account, and your financials are never handed to third-party AI providers for model training.'],
    ],
  },
  {
    label: 'Working together',
    items: [
      ['How do we actually communicate?', 'WhatsApp or Slack for quick questions, a regular finance review, and a monthly reporting pack. You get a named team, not a ticket queue.'],
      ['Can you support multi-entity or multi-country companies?', 'Yes. We handle consolidations, inter-company billing, and cross-border tax and AML requirements for the whole group. Multi-entity work is scoped on the call and priced into the quote.'],
    ],
  },
];

/** Index of each group's first question in the flat list, so every
 *  `aria-controls` id stays unique once the questions are split into groups. */
const faqOffsets = faqGroups.reduce(
  (offsets, group) => [...offsets, offsets[offsets.length - 1] + group.items.length],
  [0],
);

/* ---------- section renderers ---------- */

/**
 * Repeatable ask. The page converts on quote requests, so each proof block
 * closes with one rather than banking everything on the footer form.
 */
const rail = (source, title, sub) => `      <div class="fspr-rail" data-reveal>
        <div class="fspr-rail-copy">
          <b>${title}</b>
          <span>${sub}</span>
        </div>
        <div class="fspr-rail-actions">
          <a href="#fspr-quote" class="fspr-btn fspr-btn-primary">
            Request a quote
            ${I.arrow}
          </a>
          ${waLink(source, 'fspr-btn fspr-btn-ghost', 'WhatsApp us')}
        </div>
      </div>`;

/* Growth is the default tab: it is the recommended plan, and opening on it
   means the most-picked option is the one people see without tapping. */
const DEFAULT_PLAN = 1;

const planSwitch = `      <div class="fspr-plan-switch" role="tablist" aria-label="Choose a plan">
${plans
  .map((plan, index) => `        <button
          type="button"
          role="tab"
          id="fspr-plan-tab-${index}"
          class="fspr-plan-switch-btn${index === DEFAULT_PLAN ? ' is-active' : ''}"
          aria-selected="${index === DEFAULT_PLAN}"
          aria-controls="fspr-plan-${index}"
          data-fspr-plan="${index}"${plan.featured ? ' data-pr-popular' : ''}
        >${plan.name}</button>`)
  .join('\n')}
      </div>`;

const planCard = (plan, index) => `        <article
          class="fspr-plan${plan.featured ? ' fspr-plan-featured' : ''}${index === DEFAULT_PLAN ? ' is-active' : ''}"
          id="fspr-plan-${index}"
          role="tabpanel"
          aria-labelledby="fspr-plan-tab-${index}"
        >
          <span class="fspr-plan-tag">${plan.tag}</span>
          <h3>${plan.name}</h3>
          <p class="fspr-plan-for">${plan.for}</p>

          <div class="fspr-plan-volume">
            <b>${plan.volume}</b>
            <span>${plan.volumeLabel}</span>
          </div>

          <p class="fspr-plan-cadence">${I.check} ${plan.cadence}</p>
${plan.inherit ? `          <p class="fspr-plan-inherit">${plan.inherit}</p>\n` : ''}          <ul class="fspr-plan-list">
${plan.features.map((f) => `            <li>${I.tick} ${f}</li>`).join('\n')}
          </ul>

          <div class="fspr-plan-actions">
            <a href="#fspr-quote" class="fspr-btn fspr-btn-primary">
              Request a quote
              ${I.arrow}
            </a>
            ${waLink(`pricing_plan_${plan.name.toLowerCase()}`, 'fspr-btn fspr-btn-ghost', 'Chat with an expert')}
          </div>
          <p class="fspr-plan-note">Fixed monthly fee &middot; quoted in 24h</p>
        </article>`;

/**
 * Each add-on is a standalone service, so each card is a standalone funnel:
 * WhatsApp opens a thread already naming the service, rather than sending the
 * visitor back to the generic quote form.
 */
const addonCard = (addon) => {
  const slug = slugify(addon.name);
  const flag = addon.flagged
    ? '<span class="fspr-addon-flag">Deadline-driven</span>'
    : '';

  return `        <div class="fspr-addon${addon.flagged ? ' fspr-addon-flagged' : ''}">
          <p class="fspr-addon-name">${I.tick} <span>${addon.name}${flag}</span></p>
          <p class="fspr-addon-desc">${addon.text}</p>

          <div class="fspr-addon-actions">
            <a
              href="${waUrl(`Hi Finanshels! I'd like a quote for ${plainName(addon.name)}.`)}"
              target="_blank"
              rel="noopener noreferrer"
              class="fspr-addon-wa ${WA_TRACK}"
              ${WA_TRACK}
              data-fspr-wa="pricing_addon_${slug}"
            >
              ${I.whatsapp}
              <span>WhatsApp</span>
            </a>
          </div>
        </div>`;
};

const cell = (value) => {
  if (value === true) return `<span class="fspr-tick">${icon('tick', 'fspr-tick')}</span>`;
  if (value === false) return '<span class="fspr-none">&mdash;</span>';
  return value;
};

export const SECTIONS = [
  {
    key: 'hero',
    css: ['HERO'],
    html: `  <section class="fspr-hero">
    <div class="fspr-container">
      <div class="fspr-hero-badge">
        <span>Accounting packages &middot; UAE</span>
      </div>

      <h1>Pick the plan. We&rsquo;ll quote the number.</h1>

      <p class="fspr-hero-sub">
        Three packages built around how many transactions you actually run. Tell us your
        volume and we&rsquo;ll come back with one fixed monthly fee &mdash; no hourly billing,
        no surprise invoices.
      </p>

      <div class="fspr-hero-actions">
        <a href="#fspr-quote" class="fspr-btn fspr-btn-primary">
          Request a quote
          ${I.arrow}
        </a>
        ${waLink('pricing_hero', 'fspr-btn fspr-btn-ghost', 'Chat with an expert')}
      </div>

      <ul class="fspr-hero-trust">
        <li>${I.check} 7,000+ UAE businesses</li>
        <li>${I.check} FTA-registered tax agency</li>
        <li>${I.check} Pay only if satisfied</li>
      </ul>
    </div>
  </section>`,
  },

  {
    key: 'logos',
    css: ['LOGOS'],
    html: `  <section class="fspr-logos" aria-label="Client logos">
    <div class="fspr-container">
      <p class="fspr-logos-label">Trusted by 7,000+ leading UAE businesses</p>
      <div class="fspr-logos-track" data-reveal>
${clientLogos
      .map(([file, alt]) => `        <div class="fspr-logo-tile">
          <img src="${ASSETS}/clients/${file}" alt="${alt} logo" loading="lazy" decoding="async" />
        </div>`)
      .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'plans',
    css: ['PLANS'],
    html: `  <section class="fspr-plans" id="fspr-plans">
    <div class="fspr-container">
${planSwitch}

      <div class="fspr-plans-grid" data-reveal-stagger>
${plans.map(planCard).join('\n\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'compare',
    css: ['COMPARE'],
    html: `  <section class="fspr-compare">
    <div class="fspr-container">
      <div class="fspr-section-head" data-reveal>
        <p class="fspr-eyebrow">Plan comparison</p>
        <h2>Every line, side by side</h2>
        <p>The same table our team quotes from. If a row matters to you and it isn&rsquo;t here, ask on the call &mdash; most things can be added.</p>
      </div>

      <div class="fspr-compare-scroll" data-reveal>
        <div class="fspr-compare-scroll-inner">
          <table class="fspr-compare-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col"><b>Essential</b>Basic</th>
                <th scope="col" class="fspr-col-featured"><b>Growth</b>Most picked</th>
                <th scope="col"><b>Scale</b>Enterprise</th>
              </tr>
            </thead>
            <tbody>
${compareRows
      .map(([label, a, b, c]) => `              <tr>
                <th scope="row">${label}</th>
                <td>${cell(a)}</td>
                <td class="fspr-col-featured">${cell(b)}</td>
                <td>${cell(c)}</td>
              </tr>`)
      .join('\n')}
            </tbody>
          </table>
        </div>
      </div>

      <p class="fspr-compare-hint">${I.arrow} Swipe to compare plans</p>

${rail(
  'pricing_compare',
  'Still between two plans?',
  'Send us a month of transactions and we&rsquo;ll tell you which one you actually need &mdash; and what it costs.',
)}
    </div>
  </section>`,
  },

  {
    key: 'assurance',
    css: ['ASSURANCE'],
    html: `  <section class="fspr-assurance">
    <div class="fspr-container">
      <div class="fspr-assurance-grid" data-reveal>
${assurances
      .map(([ico, title, text]) => `        <div class="fspr-assurance-item">
          ${I[ico]}
          <span>
            <b>${title}</b>
            <span>${text}</span>
          </span>
        </div>`)
      .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'included',
    css: ['INCLUDED'],
    html: `  <section class="fspr-included" id="fspr-included">
    <div class="fspr-container">
      <div class="fspr-section-head" data-reveal>
        <p class="fspr-eyebrow">What you get</p>
        <h2>The plan sets your volume. This part never changes.</h2>
        <p>
          Whichever package you land on, the same AI-native operation sits behind it &mdash;
          software doing the repetitive work every single day, and a qualified accountant
          signing off before anything reaches you or the FTA.
        </p>
      </div>

      <div class="fspr-split" data-reveal>
        <div class="fspr-split-col">
          <div class="fspr-split-head">
            <span class="fspr-split-icon">${I.cpu}</span>
            <span>
              <b>The software does</b>
              <span>Continuously &mdash; not once at month-end</span>
            </span>
          </div>
          <ul class="fspr-split-list">
${softwareDuties.map((duty) => `            <li>${I.tick} ${duty}</li>`).join('\n')}
          </ul>
        </div>

        <div class="fspr-split-col fspr-split-human">
          <div class="fspr-split-head">
            <span class="fspr-split-icon">${I.human}</span>
            <span>
              <b>Your accountant does</b>
              <span>Named, qualified and accountable</span>
            </span>
          </div>
          <ul class="fspr-split-list">
${accountantDuties.map((duty) => `            <li>${I.tick} ${duty}</li>`).join('\n')}
          </ul>
        </div>
      </div>

      <p class="fspr-split-seal" data-reveal>
        ${I.shield}
        <span><b>AI drafts. A human signs.</b> Nothing is filed on the software&rsquo;s say-so alone.</span>
      </p>

      <div class="fspr-trust-row" data-reveal-stagger>
${trustPoints
      .map(([ico, title, text]) => `        <div class="fspr-trust-item">
          ${I[ico]}
          <b>${title}</b>
          <p>${text}</p>
        </div>`)
      .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'addons',
    css: ['ADD-ONS'],
    html: `  <section class="fspr-addons" id="fspr-addons">
    <div class="fspr-container">
      <div class="fspr-section-head" data-reveal>
        <p class="fspr-eyebrow">Add-ons</p>
        <h2>Everything else you might need</h2>
        <p>Your plan covers the books. Each of these is a separate service, quoted the same way &mdash; one fixed fee, agreed before we start. Message us about any single one, or read the full detail on its own page.</p>
      </div>

      <div class="fspr-addons-grid" data-reveal>
${addons.map(addonCard).join('\n')}
      </div>

      <p class="fspr-addons-note">
        Need something that isn&rsquo;t listed &mdash; a group consolidation, an ESR filing, a
        one-off clean-up? <a href="#fspr-quote">Ask on the call</a> and we&rsquo;ll price it with
        the rest of your quote.
      </p>
    </div>
  </section>`,
  },

  {
    key: 'alternatives',
    css: ['ALTERNATIVES'],
    html: `  <section class="fspr-alt">
    <div class="fspr-container">
      <div class="fspr-section-head" data-reveal>
        <p class="fspr-eyebrow">The alternatives</p>
        <h2>Three ways to run finance</h2>
        <p>Worth comparing honestly before you pick one. Here is how an in-house hire, a traditional firm and a Finanshels plan actually differ.</p>
      </div>

      <table class="fspr-alt-table" data-reveal>
        <thead>
          <tr>
            <th scope="col">Criteria</th>
            <th scope="col">In-house hire</th>
            <th scope="col">Traditional firm</th>
            <th scope="col" class="fspr-col-featured">Finanshels</th>
          </tr>
        </thead>
        <tbody>
${altRows
      .map(([label, a, b, c]) => `          <tr>
            <th scope="row">${label}</th>
            <td data-label="In-house hire">${a}</td>
            <td data-label="Traditional firm">${b}</td>
            <td data-label="Finanshels" class="fspr-col-featured">${c}</td>
          </tr>`)
      .join('\n')}
        </tbody>
      </table>

      <p class="fspr-alt-note">
        In-house and traditional-firm figures are typical UAE market ranges for comparison only
        &mdash; they are not Finanshels-verified statistics.
      </p>

      <dl class="fspr-alt-stats" data-reveal>
        <div class="fspr-alt-stat"><dt>7,000+</dt><dd>UAE businesses served</dd></div>
        <div class="fspr-alt-stat"><dt>180+</dt><dd>Finance specialists</dd></div>
        <div class="fspr-alt-stat"><dt>&lt;24h</dt><dd>Reply time</dd></div>
        <div class="fspr-alt-stat"><dt>4.9&#9733;</dt><dd>Trustpilot rating</dd></div>
      </dl>

${rail(
  'pricing_alternatives',
  'Cheaper than a hire, broader than a firm.',
  'One 30-minute call and you&rsquo;ll have a fixed monthly number to compare against both.',
)}
    </div>
  </section>`,
  },

  {
    key: 'process',
    css: ['PROCESS'],
    html: `  <section class="fspr-process">
    <div class="fspr-container">
      <div class="fspr-section-head" data-reveal>
        <p class="fspr-eyebrow">How it works</p>
        <h2>From messy books to a month that runs itself</h2>
        <p>No long ramp-up. Most clients are fully live inside a week &mdash; and then it just keeps happening.</p>
      </div>

      <div class="fspr-steps" data-reveal-stagger>
${steps
      .map(([when, title, text]) => `        <div class="fspr-step">
          <span class="fspr-step-when">${when}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>`)
      .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'voices',
    css: ['VOICES'],
    html: `  <section class="fspr-voices">
    <div class="fspr-container">
      <div class="fspr-voices-head" data-reveal>
        <div>
          <p class="fspr-eyebrow">In their words</p>
          <h2>Founders who made the switch</h2>
        </div>

        <div class="fspr-voices-nav">
          <button class="fspr-voices-arrow" type="button" data-fspr-voices="prev" aria-label="Previous reviews" aria-controls="fspr-voices-rail">
            ${I['chev-left']}
          </button>
          <button class="fspr-voices-arrow" type="button" data-fspr-voices="next" aria-label="Next reviews" aria-controls="fspr-voices-rail">
            ${I['chev-right']}
          </button>
        </div>
      </div>

      <p class="fspr-voices-meta" data-reveal>
        <span class="fspr-voices-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
        <span><b>4.9</b> average rating</span>
        <span class="fspr-voices-sep" aria-hidden="true"></span>
        <span><b>7,000+</b> UAE businesses served</span>
      </p>

      <!-- tabindex makes the rail focusable so it can be scrolled with the
           arrow keys, which is the only route through for keyboard users who
           can't reach the buttons. -->
      <div
        class="fspr-voices-rail"
        id="fspr-voices-rail"
        tabindex="0"
        role="group"
        aria-label="Customer reviews, scrollable"
      >
${voices
      .map(([quote, name, role, initials]) => `        <figure class="fspr-voice">
          <div class="fspr-voice-stars" aria-label="5 out of 5">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <blockquote>${quote}</blockquote>
          <figcaption>
            <span class="fspr-voice-avatar" aria-hidden="true">${initials}</span>
            <span class="fspr-voice-who">
              <span class="fspr-voice-name">${name}</span>
              <span class="fspr-voice-role">${role}</span>
            </span>
          </figcaption>
        </figure>`)
      .join('\n')}
      </div>

      <div class="fspr-voices-progress" aria-hidden="true"><i></i></div>
    </div>
  </section>`,
  },

  {
    key: 'faq',
    css: ['FAQ'],
    html: `  <section class="fspr-faq" id="fspr-faq">
    <div class="fspr-container">
      <div class="fspr-faq-shell">
        <!-- Sticky on desktop so the heading stays with whichever answer is
             open; a plain stacked header below 940px. -->
        <aside class="fspr-faq-aside" data-reveal>
          <p class="fspr-eyebrow">Questions</p>
          <h2>Answers before you book the call.</h2>
          <p class="fspr-faq-aside-sub">
            Everything founders ask us about the fee, the handover and who is
            actually doing the work.
          </p>

          <dl class="fspr-faq-facts">
            <div>
              <dt>Quote turnaround</dt>
              <dd>Within 24 hours</dd>
            </div>
            <div>
              <dt>Fully onboarded</dt>
              <dd>7 days, typically</dd>
            </div>
            <div>
              <dt>Businesses served</dt>
              <dd>7,000+ in the UAE</dd>
            </div>
          </dl>
        </aside>

        <div class="fspr-faq-main">
${faqGroups
      .map(({ label, items }, groupIndex) => `          <div class="fspr-faq-group" data-reveal>
            <p class="fspr-faq-group-label">
              <span>${String(groupIndex + 1).padStart(2, '0')}</span>
              ${label}
            </p>

${items
        .map(([question, answer], itemIndex) => {
          const id = faqOffsets[groupIndex] + itemIndex;
          return `            <div class="fspr-faq-item">
              <button class="fspr-faq-question" type="button" aria-expanded="false" aria-controls="fspr-faq-a-${id}">
                <span>${question}</span>
                <span class="fspr-faq-toggle" aria-hidden="true">${I.plus}</span>
              </button>
              <div class="fspr-faq-answer" id="fspr-faq-a-${id}">
                <div><p>${answer}</p></div>
              </div>
            </div>`;
        })
        .join('\n')}
          </div>`)
      .join('\n\n')}

          <div class="fspr-faq-cta" data-reveal>
            <div class="fspr-faq-cta-copy">
              <b>Still not answered?</b>
              <span>Ask it on the call &mdash; or message us now and get an answer before you book anything.</span>
            </div>
            <div class="fspr-faq-cta-actions">
              <a href="#fspr-quote" class="fspr-btn fspr-btn-primary">
                Request a quote
                ${I.arrow}
              </a>
              ${waLink('pricing_faq', 'fspr-btn fspr-btn-ghost', 'WhatsApp us')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`,
  },

  {
    key: 'cta',
    css: ['FINAL CTA'],
    html: `  <section class="fspr-cta" id="fspr-quote">
    <div class="fspr-container">
      <div class="fspr-cta-grid">
        <div class="fspr-cta-copy" data-reveal>
          <h2>Tell us your volume. Get your number.</h2>
          <p>
            A 30-minute call to look at your transaction count, entities and current setup.
            You get a fixed monthly quote within 24 hours &mdash; and no obligation to take it.
          </p>
          <ul class="fspr-cta-points">
            <li>${I.check} One fixed fee, quoted upfront</li>
            <li>${I.check} Pay only if satisfied</li>
            <li>${I.check} Onboarded within 7 days</li>
          </ul>
          ${waLink('pricing_footer', 'fspr-cta-whatsapp', `Prefer chat? Message us on WhatsApp ${I.arrow}`)}
        </div>

        <div class="fspr-form-card" data-reveal>
          <h3>Request your quote</h3>
          <p>Tell us where your books stand &mdash; we&rsquo;ll take it from there.</p>
          <form
            action="${ZOHO_FORM_ACTION}"
            name="form"
            id="fspr-quote-form"
            method="POST"
            accept-charset="UTF-8"
            enctype="multipart/form-data"
            class="fspr-form"
          >
            <input type="hidden" name="zf_referrer_name" value="" />
            <input type="hidden" name="zf_redirect_url" value="" />
            <input type="hidden" name="zc_gad" value="" />
            <input type="hidden" name="utm_source" value="" />
            <input type="hidden" name="utm_medium" value="" />
            <input type="hidden" name="utm_campaign" value="" />
            <input type="hidden" name="utm_term" value="" />
            <input type="hidden" name="utm_content" value="" />
            <input type="hidden" name="gclid" value="" />
            <input type="hidden" name="referrername" value="" />

            <div class="fspr-form-row">
              <div class="fspr-form-group">
                <label for="fspr-first">First Name</label>
                <input id="fspr-first" type="text" maxlength="255" name="Name_First" placeholder="John" />
              </div>
              <div class="fspr-form-group">
                <label for="fspr-last">Last Name</label>
                <input id="fspr-last" type="text" maxlength="255" name="Name_Last" placeholder="Smith" />
              </div>
            </div>

            <div class="fspr-form-group">
              <label for="fspr-email">Email *</label>
              <input id="fspr-email" type="text" maxlength="255" name="Email" placeholder="john@company.com" required />
            </div>

            <div class="fspr-form-group">
              <label for="international_PhoneNumber_countrycode">Phone Number *</label>
              <input
                type="text"
                name="PhoneNumber_countrycode"
                maxlength="20"
                id="international_PhoneNumber_countrycode"
                placeholder="+971 00 000 0000"
                required
              />
            </div>

            <div class="fspr-form-group">
              <label for="fspr-company">Company Name *</label>
              <input id="fspr-company" type="text" name="SingleLine1" maxlength="255" placeholder="Your Company LLC" required />
            </div>

            <button type="submit" class="fspr-btn fspr-btn-primary fspr-form-submit">
              Request My Quote
              ${I.arrow}
            </button>
          </form>
          <p class="fspr-form-privacy">Your data is secure and will never be shared.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile-only quote bar. Fixed positioning, so it does not matter where
       in the page this sits; JS reveals it past the hero and retracts it once
       the form above is on screen. -->
  <div class="fspr-sticky-cta" data-fspr-sticky>
    <div class="fspr-sticky-cta-inner">
      <div class="fspr-sticky-cta-copy">
        <b>One fixed monthly fee</b>
        <span>Quoted in 24 hours</span>
      </div>
      ${waLink('pricing_sticky', 'fspr-sticky-cta-wa', `${I.whatsapp}<span class="fspr-sr-only">Chat on WhatsApp</span>`)}
      <a href="#fspr-quote" class="fspr-btn fspr-btn-primary">Get my quote</a>
    </div>
  </div>`,
  },
];
