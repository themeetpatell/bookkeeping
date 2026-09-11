/**
 * Generates (or verifies) src/content/quoteQuestions.js from the live FinCore
 * pricing catalog.
 *
 * The question set is frozen into the repo rather than fetched at runtime: this
 * is a paid landing page, so the hero must paint without waiting on a third
 * party and must not go blank when that party is down. The trade-off is drift —
 * if someone edits the catalog in FinCore admin, our copy silently goes stale.
 *
 *   node scripts/sync-quote-questions.mjs          # rewrite the content file
 *   node scripts/sync-quote-questions.mjs --check  # exit 1 if it has drifted
 *
 * Run --check in CI. A drift failure is not an emergency; it means someone
 * changed pricing questions and this file needs regenerating and re-reviewing.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const API = 'https://fincore.finanshels.com/api/pricing/public';
const OUT = new URL('../src/content/quoteQuestions.js', import.meta.url);

/* Every service any page can quote, and which of its base questions we ask.
   The indexes are into the service's base-question list, in catalog order.

   All of them are asked BEFORE the price, and every answer is sent to /resolve
   and stored on the proposal's pathSnapshot. That is the point: an answer that
   does not reach the proposal is an answer the advisor never sees.

   Not all of them move the number. On accounting, entity count is the big one —
   a ~9.5x multiplier (1 entity = AED 1,339/mo, 20+ = AED 12,679/mo on otherwise
   identical answers) — so omitting it would quote a single-entity price to a
   group. Catch-up backlog and finance operations move the recurring price by
   exactly zero; they are here because FinCore attaches service suggestions to
   them, which makes them the two most useful qualifying signals sales can get.

   `periodType` and `serviceName` are declared here rather than read from the
   catalog because two of these services are `showInCatalog: false` and never
   appear in /services at all, even though /questions/base and /resolve serve
   them normally. Where a service IS listed, the declared values are checked
   against the catalog and a mismatch fails the sync — that is the drift guard
   the lookup used to provide. */
const SERVICES = {
  'accounting-bookkeeping': {
    serviceId: '91ba4950-e80f-4010-bc74-d3482bc38f95',
    serviceName: 'Accounting & Bookkeeping',
    periodType: 'start_only',
    chooserLabel: 'Accounting & bookkeeping',
    chooserHint: 'Monthly books, reconciliations and management accounts',
    /* Index 3 (VAT / Corporate Tax registration status) is deliberately skipped:
       it costs a tap and changes neither the price nor a suggestion. */
    questions: [0, 1, 2, 4, 5, 6, 7],
  },
  /* Hidden service (showInCatalog: false). This is what /payroll-accounting
     actually sells — the page promises salary processing, payroll bookkeeping
     and reporting, and this is the only service in FinCore that delivers it. */
  'finance-operations': {
    serviceId: '86dc56ed-c3d5-454d-8361-fe03526bdd64',
    serviceName: 'Finance Operations (AR/AP & Payroll)',
    periodType: 'start_only',
    questions: [0],
  },
  /* Hidden service (showInCatalog: false), and the one FinCore's own accounting
     flow suggests for a backlog. Three questions rather than the seven on the
     public Books Cleanup service, and it is the catch-up product sales quote. */
  'prior-period-catch-up': {
    serviceId: 'd7ac6cee-d90c-4dcc-8920-459dc4a870ad',
    serviceName: 'Prior-Period Catch-Up & Books Cleanup',
    periodType: 'date_range',
    questions: [0, 1, 2],
  },
  'vat-filing': {
    serviceId: '088c991a-86c4-4a84-a086-e17e942c0163',
    serviceName: 'VAT Filing',
    periodType: 'start_only',
    chooserLabel: 'VAT filing',
    chooserHint: 'Prepare and submit your VAT returns',
    questions: [0, 1],
  },
  'vat-registration': {
    serviceId: '108d4944-654c-442e-bbb7-6bf1475b2bcb',
    serviceName: 'VAT Registration',
    periodType: 'none',
    chooserLabel: 'VAT registration',
    chooserHint: 'Register with the FTA, or apply for an exception',
    questions: [0, 1, 2, 3],
  },
  'corporate-tax-filing': {
    serviceId: '03d06317-9125-4100-ae21-5883873ee5b6',
    serviceName: 'Corporate Tax Filing',
    periodType: 'start_only',
    chooserLabel: 'Corporate Tax filing',
    chooserHint: 'File your Corporate Tax return with the FTA',
    questions: [0, 1, 2],
  },
  'corporate-tax-registration': {
    serviceId: '40fdbfb3-d008-442d-aaf2-bef36f085e22',
    serviceName: 'Corporate Tax Registration',
    periodType: 'none',
    chooserLabel: 'Corporate Tax registration',
    chooserHint: 'Get your Corporate Tax registration number',
    questions: [0],
  },
  'audit-services': {
    serviceId: '91e0af24-0c80-4590-b6cd-24f8dce0bf6c',
    serviceName: 'Audit Services',
    periodType: 'start_only',
    chooserLabel: 'Audit',
    chooserHint: 'Audited financials for a licence, a bank or an investor',
    questions: [0, 1, 2, 3, 4, 5, 6],
  },
  'aml-compliance': {
    serviceId: '6c84fabd-28ff-45b6-b04f-7628a0c20a7d',
    serviceName: 'AML Compliance',
    periodType: 'start_only',
    chooserLabel: 'AML compliance',
    chooserHint: 'goAML, policies, screening and staff training',
    questions: [0, 1, 2, 3, 4, 5, 6],
  },
  'dedicated-remote-accountant': {
    serviceId: '83990d6f-6d27-41db-9f7f-19771778a0a1',
    serviceName: 'Dedicated Remote Accountant',
    periodType: 'start_only',
    chooserLabel: 'A dedicated remote accountant',
    chooserHint: 'Your own accountant, part-time or full-time',
    questions: [0, 1, 2, 3, 4, 5, 6],
  },
};

/* Which services each landing page quotes.

   A page with one service goes straight from contact to that service's
   questions. A page with several asks the visitor to pick first — that is the
   generic-page selector, and it is deliberately SINGLE-select: FinCore switches
   to /combo/detect and /combo/resolve as soon as more than one service is in
   play, and this client implements no combo pricing, so a multi-select would
   post a total that is simply wrong.

   Nothing in a chooser may be `date_range` or `combo_lookup`: the first needs
   the extra period step and the second needs a pricing flow we do not have. */
const PLANS = {
  accounting: { services: ['accounting-bookkeeping'] },
  payroll: { services: ['finance-operations'] },
  booksCleanup: { services: ['prior-period-catch-up'] },
  general: {
    chooserTitle: 'What do you need help with?',
    chooserSubtitle: 'Pick one to price. We can add the rest on the call.',
    services: [
      'accounting-bookkeeping',
      'vat-filing',
      'vat-registration',
      'corporate-tax-filing',
      'corporate-tax-registration',
      'audit-services',
      'aml-compliance',
      'dedicated-remote-accountant',
    ],
  },
};

const short = (q) => ({
  id: q.id,
  text: q.questionText,
  help: q.helpText || '',
  options: (q.options || []).map((o) => ({
    id: o.id,
    value: o.optionValue,
    text: o.optionText,
  })),
});

/* Period types this client knows how to fill in. `none` and `start_only` are
   filled without asking; `date_range` adds a from/to step. An unhandled type
   must fail the sync loudly rather than ship and 400 in front of a visitor. */
const SUPPORTED_PERIOD_TYPES = new Set(['none', 'start_only', 'date_range']);

/* A chooser prices one service at a time, so anything needing the period step or
   FinCore's combo endpoints is barred from appearing in one. */
const CHOOSABLE_PERIOD_TYPES = new Set(['none', 'start_only']);

const build = async () => {
  const servicesRes = await fetch(`${API}/services`);
  if (!servicesRes.ok) throw new Error(`services fetch failed ${servicesRes.status}`);
  const catalog = await servicesRes.json();

  const services = {};
  for (const [key, spec] of Object.entries(SERVICES)) {
    if (!SUPPORTED_PERIOD_TYPES.has(spec.periodType)) {
      throw new Error(
        `${key}: period type "${spec.periodType}" is not handled by src/lib/quoteApi.js — ` +
          'a proposal for it will be rejected until that is implemented',
      );
    }

    /* Hidden services are absent from /services by design. When one IS listed,
       the catalog is the authority and a disagreement means our copy is stale. */
    const listed = catalog.find((s) => s.id === spec.serviceId);
    if (listed) {
      if (listed.periodType !== spec.periodType) {
        throw new Error(
          `${key}: declared period type "${spec.periodType}" but the catalog says "${listed.periodType}"`,
        );
      }
      if (listed.pricingModel !== 'base_modifier') {
        throw new Error(
          `${key}: pricing model "${listed.pricingModel}" needs FinCore's combo endpoints, which this client does not implement`,
        );
      }
    }

    const res = await fetch(`${API}/questions/base?serviceId=${spec.serviceId}`);
    if (!res.ok) throw new Error(`${key}: questions fetch failed ${res.status}`);
    const all = await res.json();
    const pick = (idx) => {
      const q = all[idx];
      if (!q) throw new Error(`${key}: no base question at index ${idx}`);
      return short(q);
    };

    services[key] = {
      serviceId: spec.serviceId,
      slug: key,
      serviceName: spec.serviceName,
      /* Frozen here so the payload can be built without a second round trip.
         FinCore rejects a proposal whose service needs a period and lacks one. */
      periodType: spec.periodType,
      startDateInstruction: listed?.startDateInstruction || spec.startDateInstruction || '',
      hidden: !listed,
      chooserLabel: spec.chooserLabel || spec.serviceName,
      chooserHint: spec.chooserHint || '',
      questions: spec.questions.map(pick),
    };
  }

  const plans = {};
  for (const [key, plan] of Object.entries(PLANS)) {
    for (const serviceKey of plan.services) {
      if (!services[serviceKey]) throw new Error(`${key}: unknown service "${serviceKey}"`);
      if (plan.services.length > 1 && !CHOOSABLE_PERIOD_TYPES.has(services[serviceKey].periodType)) {
        throw new Error(
          `${key}: "${serviceKey}" is ${services[serviceKey].periodType} and cannot appear in a service chooser`,
        );
      }
    }
    plans[key] = {
      chooserTitle: plan.chooserTitle || '',
      chooserSubtitle: plan.chooserSubtitle || '',
      services: plan.services,
    };
  }

  return { services, plans };
};

const render = ({ services, plans }) =>
  `/**
 * Frozen copy of the FinCore pricing questions this site quotes against.
 *
 * GENERATED — do not edit by hand.
 * Regenerate: node scripts/sync-quote-questions.mjs
 * Verify:     node scripts/sync-quote-questions.mjs --check
 *
 * Option ids are FinCore UUIDs and are what /resolve prices on, so a stale id
 * produces a wrong price rather than an error. The --check run is what catches
 * that; keep it in CI.
 */
export const QUOTE_SERVICES = ${JSON.stringify(services, null, 2)};

export const QUOTE_PLANS = ${JSON.stringify(plans, null, 2)};

/**
 * Resolves a page's plan into the services it can quote.
 *
 * A plan with one service goes straight to its questions. A plan with several
 * asks the visitor to choose first, and that choice is single-select — pricing
 * more than one service at a time needs FinCore's combo endpoints, which this
 * client does not implement.
 *
 * @param {string} key
 * @returns {{ key: string, chooserTitle: string, chooserSubtitle: string,
 *   services: object[], needsChoice: boolean } | undefined}
 */
export const getQuotePlan = (key) => {
  const plan = QUOTE_PLANS[key];
  if (!plan) return undefined;
  const services = plan.services.map((serviceKey) => QUOTE_SERVICES[serviceKey]);
  return {
    key,
    chooserTitle: plan.chooserTitle,
    chooserSubtitle: plan.chooserSubtitle,
    services,
    needsChoice: services.length > 1,
  };
};
`;

const built = await build();
const next = render(built);

if (process.argv.includes('--check')) {
  if (!existsSync(OUT)) {
    console.error('quote questions: content file missing — run the sync');
    process.exit(1);
  }
  const current = readFileSync(OUT, 'utf8');
  if (current !== next) {
    console.error('quote questions: DRIFT — FinCore catalog no longer matches src/content/quoteQuestions.js');
    process.exit(1);
  }
  console.log('quote questions: in sync');
} else {
  writeFileSync(OUT, next);
  for (const [key, s] of Object.entries(built.services)) {
    console.log(`service ${key}: ${s.questions.length} questions, period ${s.periodType}${s.hidden ? ', hidden' : ''}`);
  }
  for (const [key, p] of Object.entries(built.plans)) {
    console.log(`plan ${key}: ${p.services.length} service(s)${p.services.length > 1 ? ' — chooser' : ''}`);
  }
}
