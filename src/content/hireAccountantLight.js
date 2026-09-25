/**
 * Extra copy for the light, conversion-first layout of /hire-accountant
 * (src/pages/AdGroupLandingLight.jsx). The H1, subhead, CTA, comparison, steps
 * and FAQ still come from src/content/adGroupLandings.js; this file adds only
 * what the lighter layout needs.
 *
 * Layout decisions and the evidence behind them (research brief, Sep 2026):
 * - Light background, dark text: NN/g reports better legibility for positive
 *   polarity, and the gap widens at small (phone) text sizes.
 * - One goal, one repeated CTA label, a specific submit label (not "Submit").
 * - Rating with review count near the CTA; logos as one calm strip.
 * - Plain-language copy, short sections, 3 pain points, 3 to 4 steps.
 * - Pricing kept to price, volume and 3 lines per plan; one plan highlighted.
 * - Real testimonials with name, company and photo (already published on the
 *   site); sticky CTA plus WhatsApp on phones.
 */

/**
 * Client logos, most recognisable UAE institutions first. Files are the
 * colour-on-transparent set in public/clients/clean, shown in greyscale.
 */
export const featuredLogos = [
  { src: '/clients/clean/DFDF.png', alt: 'Dubai Future District Fund' },
  { src: '/clients/clean/tie-dubai.png', alt: 'TiE Dubai' },
  { src: '/clients/clean/sharjah-book-authority.png', alt: 'Sharjah Book Authority' },
  { src: '/clients/clean/MBHRS.png', alt: 'MBHRS' },
  { src: '/clients/clean/Qureos.png', alt: 'Qureos' },
  { src: '/clients/clean/silkhaus-logo.png', alt: 'Silkhaus' },
  { src: '/clients/clean/sace.png', alt: 'SACE' },
  { src: '/clients/clean/Bit2me.svg', alt: 'Bit2Me' },
  { src: '/clients/clean/premialab.png', alt: 'Premialab' },
  { src: '/clients/clean/abwaab.png', alt: 'Abwaab' },
  { src: '/clients/clean/zywa.png', alt: 'Zywa' },
  { src: '/clients/clean/Binary.png', alt: 'Binary' },
  { src: '/clients/clean/cellusys.png', alt: 'Cellusys' },
  { src: '/clients/clean/Signum.png', alt: 'Signum' },
  { src: '/clients/clean/kroolo.png', alt: 'Kroolo' },
  { src: '/clients/clean/growdash.png', alt: 'Growdash' },
  { src: '/clients/clean/carbonsifr.png', alt: 'CarbonSifr' },
  { src: '/clients/clean/wittify-ai.png', alt: 'Wittify AI' },
  { src: '/clients/clean/prime-financials.png', alt: 'Prime Financials' },
  { src: '/clients/clean/actualize.png', alt: 'Actualize' },
  { src: '/clients/clean/blooming-box.png', alt: 'Blooming Box' },
  { src: '/clients/clean/cotu.png', alt: 'COTU Ventures' },
  { src: '/clients/clean/humlog.png', alt: 'Humlog' },
  { src: '/clients/clean/veehive.png', alt: 'Veehive' },
  { src: '/clients/clean/fuze.png', alt: 'Fuze' },
  { src: '/clients/clean/optimize.png', alt: 'Optimize' },
  { src: '/clients/clean/retold.png', alt: 'Retold' },
  { src: '/clients/clean/swyt.png', alt: 'Swyt' },
  { src: '/clients/clean/bigbadwolf.png', alt: 'Big Bad Wolf' },
];

/** Three pain points, not four: shorter pages convert better in this sector. */
export const pains = [
  { title: 'Hiring takes months', copy: 'Job ads, interviews, notice periods and a visa before the first entry is made.' },
  { title: 'One person, no backup', copy: 'When your only accountant is on leave or resigns, the books stop.' },
  { title: 'Nobody checks the work', copy: 'Without a senior review, small errors end up in your tax return.' },
];

/** What you get, shown beside the photo. */
export const benefits = [
  { title: 'One named accountant', copy: 'Call, email or WhatsApp the person who knows your books.' },
  { title: 'Monthly CA review', copy: 'A Chartered Accountant checks your numbers before each month closes.' },
  { title: 'VAT and corporate tax, same team', copy: 'Returns prepared from the books we keep, filed by an FTA Registered Tax Agency.' },
  { title: 'Reports you can use', copy: 'Profit, cash and balances, on the schedule your plan includes.' },
];

/**
 * Pricing, trimmed: price, volume and three lines per plan. Same prices as
 * /bookkeeping. Each plan's WhatsApp message names the plan so sales knows
 * which one was picked.
 */
export const plans = [
  {
    name: 'Starter',
    price: '499',
    volume: 'Up to 50 transactions a year',
    points: ['Annual financial statements', 'Quarterly management accounts', 'Dedicated support manager'],
  },
  {
    name: 'Essential',
    price: '799',
    volume: 'Up to 200 transactions a year',
    points: ['Monthly account reconciliation', 'Quarterly accounting reports', 'Priority support'],
  },
  {
    name: 'Growth',
    price: '999',
    volume: 'Up to 2,000 transactions a year',
    popular: true,
    points: ['Quarterly bookkeeping', 'Cash flow and budget vs actual', 'Dedicated account manager'],
  },
  {
    name: 'Scale',
    price: '1,999',
    volume: 'Up to 3,600 transactions a year',
    points: ['Monthly bookkeeping and reports', 'Custom dashboard and integrations', 'CFO advisory'],
  },
];

/** Real, already-published client testimonials (src/components/Testimonials.jsx). */
export const testimonials = [
  {
    quote:
      'They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times to streamline and structure our complex financial ops.',
    name: 'Meet Patel',
    title: 'Former COO, StudentHub & BAWES',
    avatar: '/Founders/themeetpatel.jpg',
  },
  {
    quote:
      'Bookkeeping, a piece of cake with Finanshels! Sahal has been extremely helpful in managing the books! He makes sure its up-to-date and super clean!',
    name: 'Sapna Mulani',
    title: 'Sr Accountant, Growdash',
    avatar: '/Founders/sapna.jpg',
  },
  {
    quote:
      'Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving.',
    name: 'Szilvia Vitos',
    title: 'Founder, Livvity',
    avatar: '/Founders/szilvia.jpeg',
  },
];
