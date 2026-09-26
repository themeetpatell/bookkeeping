/**
 * Shared and per-page data for the light, conversion-first ad-group layout
 * (src/pages/AdGroupLandingLight.jsx). Headlines, comparison, steps, FAQ and
 * the brief's own sections still come from src/content/adGroupLandings.js;
 * this file adds what the light layout needs: logos, trimmed pricing, real
 * testimonials, and per page the feature photo, its two floating cards and
 * (where the page needs a tighter set) its pains and benefits.
 *
 * Layout evidence (research brief, Sep 2026): light background with dark
 * text; one goal and one repeated CTA label; rating with review count near the
 * CTA; logos as one calm strip; short plain-language sections; pricing kept to
 * price, volume and three lines with one plan highlighted; real testimonials
 * with name, company and photo; sticky CTA plus WhatsApp on phones.
 */

/** Client logos, most recognisable UAE institutions first, shown greyscale. */
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

/** Pricing, trimmed: price, volume and three lines per plan. Same prices as /bookkeeping. */
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

/** The annual-plan offer (same offer the site offer bar runs; terms as in the /packages FAQ). */
export const defaultAnnualOffer = {
  title: 'Get 3 Months Free With Annual Accounting Packages',
  copy: 'Pay for 12 months and get 3 more months of the same package at no charge.',
  cta: 'Get Started',
  whatsappMessage: "Hi, I saw your Google ad. I'd like to claim the 3 months free offer on annual accounting packages.",
};

/**
 * Real, already-published client testimonials (src/components/Testimonials.jsx).
 * Quotes are verbatim or trimmed at a sentence boundary, never reworded.
 */
export const testimonialPool = {
  meet: {
    quote:
      'They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times to streamline and structure our complex financial ops.',
    name: 'Meet Patel',
    title: 'Former COO, StudentHub & BAWES',
    avatar: '/Founders/themeetpatel.jpg',
  },
  sapna: {
    quote:
      'Bookkeeping, a piece of cake with Finanshels! Sahal has been extremely helpful in managing the books! He makes sure its up-to-date and super clean!',
    name: 'Sapna Mulani',
    title: 'Sr Accountant, Growdash',
    avatar: '/Founders/sapna.jpg',
  },
  szilvia: {
    quote:
      'Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving.',
    name: 'Szilvia Vitos',
    title: 'Founder, Livvity',
    avatar: '/Founders/szilvia.jpeg',
  },
  jeremy: {
    quote:
      "They designed an accounting system tailor made to our needs & completely automated our finance operations just like they promised. They've been super helpful for us to scale.",
    name: 'Jeremy Khatar',
    title: 'CEO, Ronin Global LLC, USA',
    avatar: '/Founders/jeremy.jpg',
  },
  bader: {
    quote:
      "If you ever do any financial modeling/forecasting, I seriously can't recommend Finanshels enough. they are a dependable team of professionals who work hard to deliver results.",
    name: 'Bader Al Kazimi',
    title: 'Founder, Optimize App',
    avatar: '/Founders/bader.jpeg',
  },
  jomon: {
    quote:
      'I am extremely grateful for the exceptional service we received from Finanshels. We insurancehub.ae highly recommend their services to anyone seeking reliable and trustworthy Accounting Partner.',
    name: 'Jomon Ulahannan',
    title: 'Founder & CEO, INSURANCE HUB',
    avatar: '/Founders/jomon.jpg',
  },
  pravin: {
    quote: 'Super fast team and I can always depend on these guys...way to go',
    name: 'Pravin Rai',
    title: 'Founder & CEO, QuicKart',
    avatar: '/Founders/pravin.jpeg',
  },
  usama: {
    quote: 'The team was super responsive and the entire service was efficiently processed.',
    name: 'Usama Naeem',
    title: 'Co-founder, Qureos',
    avatar: '/Founders/usama.jpeg',
  },
};

/**
 * The named specialists, shown on every ad-group page with their real
 * headshots (the same portraits their author pages on finanshels.com use).
 */
export const specialists = [
  {
    name: 'Gautam Sanoj',
    role: 'Senior Tax Advisor',
    focus: 'VAT and corporate tax',
    photo: '/authors/gautam-sanoj.webp',
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
    photo: '/authors/krishna-subash-nair.jpg',
  },
];

/**
 * Per page: feature photo (licensed Pexels stock, never presented as a named
 * employee; chosen to reflect a mostly Indian accounting team and a mixed
 * Arab, Asian and European client base), its crop, the two floating cards, testimonials, and optional
 * tighter pains/benefits. Pages without `pains`/`benefits` use their
 * problems/solution copy from adGroupLandings.js.
 */
export const lightPages = {
  'hire-accountant': {
    photo: '/landing/accountant-professional.jpg',
    photoPosition: '50% 35%',
    meeting: { title: 'Monthly review with your accountant', note: 'Books reconciled · CA review done' },
    message: { subject: 'Your monthly report is ready', file: 'Management-Report.pdf', from: 'your Finanshels accountant' },
    testimonials: ['meet', 'sapna', 'szilvia'],
    pains: [
      { title: 'Hiring takes months', copy: 'Job ads, interviews, notice periods and a visa before the first entry is made.' },
      { title: 'One person, no backup', copy: 'When your only accountant is on leave or resigns, the books stop.' },
      { title: 'Nobody checks the work', copy: 'Without a senior review, small errors end up in your tax return.' },
    ],
    benefits: [
      { title: 'One named accountant', copy: 'Call, email or WhatsApp the person who knows your books.' },
      { title: 'Monthly CA review', copy: 'A Chartered Accountant checks your numbers before each month closes.' },
      { title: 'VAT and corporate tax, same team', copy: 'Returns prepared from the books we keep, filed by an FTA Registered Tax Agency.' },
      { title: 'Reports you can use', copy: 'Profit, cash and balances, on the schedule your plan includes.' },
    ],
    annualOffer: true,
  },
  'remote-bookkeeper': {
    photo: '/landing/remote-bookkeeper.jpg',
    photoPosition: '50% 40%',
    meeting: { title: 'Weekly check-in with your bookkeeper', note: 'Online · 15 minutes' },
    message: { subject: 'Your books are reconciled', file: 'Reconciliation-Summary.pdf', from: 'your remote bookkeeper' },
    testimonials: ['jeremy', 'pravin', 'sapna'],
    annualOffer: true,
  },
  'backlog-catch-up': {
    photo: '/landing/backlog-catch-up.jpg',
    photoPosition: '50% 45%',
    meeting: { title: 'Catch-up assessment call', note: 'Scope and fixed quote' },
    message: { subject: 'Your catch-up quote is ready', file: 'Catch-Up-Quote.pdf', from: 'your Finanshels accountant' },
    testimonials: ['meet', 'jomon', 'usama'],
    annualOffer: false,
  },
  'outsource-accounting': {
    photo: '/landing/outsource-accounting.jpg',
    photoPosition: '50% 55%',
    meeting: { title: 'Month-end close review', note: 'Books, VAT and reports in one call' },
    message: { subject: 'Your month-end pack is ready', file: 'Month-End-Pack.pdf', from: 'your account manager' },
    testimonials: ['jeremy', 'meet', 'bader'],
    annualOffer: true,
  },
  'accounting-services': {
    photo: '/landing/accounting-services.jpg',
    photoPosition: '50% 40%',
    meeting: { title: 'Quarterly VAT review', note: 'Prepared from your reconciled books' },
    message: { subject: 'Your VAT return is ready to review', file: 'VAT-Return-Summary.pdf', from: 'your Finanshels team' },
    testimonials: ['jomon', 'szilvia', 'usama'],
    annualOffer: true,
  },
  'accounting-firm': {
    photo: '/landing/accounting-firm.jpg',
    photoPosition: '50% 45%',
    meeting: { title: 'Tax and compliance review', note: 'With your tax and AML specialists' },
    message: { subject: 'Your compliance update', file: 'Compliance-Checklist.pdf', from: 'your Finanshels specialists' },
    testimonials: ['bader', 'jomon', 'meet'],
    annualOffer: true,
  },
  'accounting-and-bookkeeping': {
    photo: '/landing/accounting-and-bookkeeping.jpg',
    photoPosition: '50% 25%',
    meeting: { title: 'One review for books and tax', note: 'One team, one agenda' },
    message: { subject: 'Your monthly report and invoice', file: 'Monthly-Report.pdf', from: 'your Finanshels team' },
    testimonials: ['sapna', 'pravin', 'szilvia'],
    annualOffer: true,
  },
};
