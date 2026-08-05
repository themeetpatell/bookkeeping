/**
 * Renders the page markup from the same data the JSX uses, as discrete
 * sections the assembler can group into Webflow embeds.
 *
 * react-icons are replaced by one inline SVG sprite referenced with <use>,
 * which keeps every block comfortably under Webflow's 50,000-char limit.
 */

const WHATSAPP_PHONE = '971521549572';
const WHATSAPP_MESSAGE =
  "Hi Finanshels! I'd like to learn more about your AI-native accounting services.";

export const WA = (
  `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}` +
  `&text=${encodeURIComponent(WHATSAPP_MESSAGE)}&type=phone_number&app_absent=0`
).replace(/&/g, '&amp;');

/** Client logos are served from the React app's origin (verified reachable). */
const ASSETS = 'https://accounting.finanshels.com';

const ZOHO_FORM_ACTION =
  'https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit';

/* ---------- icon sprite ---------- */
const FEATHER =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const SYMBOLS = {
  check: [FEATHER, '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'],
  chevron: [FEATHER, '<polyline points="6 9 12 15 18 9"/>'],
  flag: [FEATHER, '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'],
  x: [FEATHER, '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'],
  zap: [FEATHER, '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'],
  eye: [FEATHER, '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'],
  shield: [FEATHER, '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'],
  book: [FEATHER, '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'],
  percent: [FEATHER, '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'],
  briefcase: [FEATHER, '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'],
  users: [FEATHER, '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'],
  trending: [FEATHER, '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'],
  file: [FEATHER, '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'],
  arrow: [FEATHER, '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'],
  spark: ['viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"', '<path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8"/>'],
  whatsapp: ['viewBox="0 0 448 512" fill="currentColor"', '<path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>'],
};

export const SPRITE = `  <svg class="fsai-sprite" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
${Object.entries(SYMBOLS)
  .map(([id, [attrs, body]]) => `    <symbol id="fsai-i-${id}" ${attrs}>${body}</symbol>`)
  .join('\n')}
  </svg>`;

const icon = (id, cls) =>
  `<svg${cls ? ` class="${cls}"` : ''} aria-hidden="true" focusable="false"><use href="#fsai-i-${id}"/></svg>`;

const I = new Proxy({}, { get: (_, id) => icon(id) });
const spark = (cls) => icon('spark', cls);

/* ---------- data (mirrors AIAccountingLanding.jsx) ---------- */
const heroFeedItems = [
  { icon: 'check', text: '214 transactions categorized', meta: 'Emirates NBD · Mashreq' },
  { icon: 'check', text: 'Bank reconciliation complete', meta: '0 discrepancies' },
  { icon: 'flag', text: '3 invoices flagged for review', meta: 'Routed to your accountant' },
  { icon: 'check', text: 'VAT return drafted', meta: 'Due 28 Aug · ready early' },
  { icon: 'human', text: 'Reviewed &amp; approved', meta: 'Senior accountant sign-off' },
];

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

const pillars = [
  ['01', 'AI does the repetitive work', 'Categorization, reconciliation, data capture and deadline tracking run continuously — not once a month. Your books are current every morning.'],
  ['02', 'Accountants own the outcome', 'Every number the AI produces is reviewed by a qualified accountant before it reaches you or the FTA. AI drafts. Humans sign.'],
  ['03', 'You see everything, live', 'No more waiting for month-end PDFs. A real-time dashboard shows cash, runway, VAT position and P&amp;L the moment anything changes.'],
];

const comparisonRows = [
  ['Monthly close', 'Weeks after month-end', 'Days — AI reconciles continuously'],
  ['Data entry', 'Manual keying, human error', 'Automated capture, accountant-verified'],
  ['Visibility', 'Static PDFs, once a month', 'Live dashboard, always current'],
  ['Tax deadlines', 'Last-minute scrambles', 'Tracked by AI, filed early'],
  ['Errors', 'Discovered at audit', 'Flagged the moment they happen'],
  ['Cost', 'Grows with headcount', 'Grows with software — not people'],
];

const workflowSteps = [
  ['01', 'Connect', 'We link your banks, invoicing tools and accounting software — QuickBooks, Xero, Zoho Books or ours. Migration handled for you.'],
  ['02', 'AI agents process', 'Transactions are captured, categorized and reconciled daily. Anomalies, duplicates and missing documents get flagged automatically.'],
  ['03', 'Accountants review', 'Your dedicated accountant checks every output, resolves exceptions and signs off on filings. Nothing ships on AI confidence alone.'],
  ['04', 'You decide', 'Clean books, live dashboards and on-time VAT &amp; Corporate Tax filings — plus a team on WhatsApp when you need an answer.'],
];

const aiDuties = [
  'Categorizes every transaction, daily',
  'Reconciles bank feeds continuously',
  'Extracts data from invoices &amp; receipts',
  'Tracks VAT and Corporate Tax deadlines',
  'Drafts returns and monthly reports',
  'Flags anomalies and duplicates instantly',
];

const humanDuties = [
  'Reviews and approves every AI output',
  'Resolves flagged exceptions with context',
  'Signs off on VAT &amp; Corporate Tax filings',
  'Advises on structure, cash and runway',
  'Answers you on WhatsApp — a person, fast',
  'Owns the numbers at audit time',
];

const services = [
  ['book', 'Bookkeeping', 'Daily, AI-reconciled books reviewed by your dedicated accountant. Always audit-ready.'],
  ['percent', 'VAT Compliance', 'Registration, quarterly returns and FTA correspondence — drafted by AI, filed by humans.'],
  ['briefcase', 'Corporate Tax', '9% Corporate Tax registration, planning and filing with deadlines tracked automatically.'],
  ['users', 'Payroll &amp; WPS', 'Salaries processed, WPS files generated and gratuity accruals kept current every month.'],
  ['trending', 'CFO Insights', 'Cash-flow forecasts, budgets and board-ready reporting from live data — not stale exports.'],
  ['file', 'Audit Support', 'Clean trails and organized documents mean audits close faster and cost less.'],
];

const dashboardKpis = [
  ['Revenue Growth MoM', '+18.4%', 'AED 412K this month', 'up'],
  ['GP Margin', '62.3%', '+8.1pp vs industry', 'up'],
  ['Burn Rate (Monthly)', 'AED 96K', '21.4% of revenue', 'neutral'],
  ['Runway', '18.2 mo', 'Above 6-month target', 'up'],
];

const dashboardPnl = [
  ['Revenue', '412,090', '+18.4%', 'up', false],
  ['Cost of Revenue', '(155,301)', '', 'neutral', false],
  ['Gross Profit', '256,789', '62.3%', 'up', true],
  ['Operating Expenses', '(149,204)', '+4.2%', 'down', false],
  ['Net Profit', '107,585', '+26.1%', 'up', true],
];

const dashboardGuardrails = [
  ['Min Cash Reserve', 'Target: AED 250K', 'AED 1.2M'],
  ['Cash Runway', 'Target: ≥ 6 months', '18.2 mo'],
  ['AR Days (DSO)', 'Target: ≤ 45 days', '32 days'],
];

const testimonials = [
  ['They designed an accounting system tailor made to our needs &amp; completely automated our finance operations just like they promised. They’ve been super helpful for us to scale.', 'Jeremy Khatar', 'CEO, Ronin Global LLC', 'JK'],
  ['Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving. Very happy that I took the decision to work with them.', 'Szilvia Vitos', 'Founder, Livvity', 'SV'],
  ['They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times.', 'Meet Patel', 'Former COO, StudentHub &amp; BAWES', 'MP'],
];

const faqs = [
  ['What does "AI-native" actually mean?', 'Most firms bolt AI tools onto a manual workflow. We built our workflow around AI from day one: agents handle categorization, reconciliation, document capture and deadline tracking continuously, and our accountants spend their time on review, exceptions and advice — not data entry. The result is books that are 10× faster to close and current every day.'],
  ['Is AI doing my accounting on its own?', 'No. AI drafts, humans sign. Every categorization, reconciliation and filing is reviewed by a qualified accountant before it reaches you or the FTA. You get the speed of automation with the accountability of a licensed firm.'],
  ['Which tools do you integrate with?', 'QuickBooks, Xero, Zoho Books, major UAE bank feeds and custom stacks. If you’re on spreadsheets today, we handle the migration as part of onboarding.'],
  ['Is my financial data safe?', 'Yes. Data is encrypted in transit and at rest, access is role-restricted, and your data is never used to train third-party AI models. We follow industry-standard security protocols across our entire stack.'],
  ['How fast can we start?', 'Onboarding is structured and typically completes within 45 days — from connecting your tools and migrating history to delivering your first complete financial pack. Most clients see their live dashboard in the first two weeks.'],
  ['Does AI-native mean cheaper?', 'Usually, yes. Because software does the repetitive work, our pricing scales with your transaction volume — not with billable hours. Book a free consultation and we’ll quote against what you pay today.'],
];

const feedIcon = (type) => (type === 'flag' ? I.flag : type === 'human' ? I.eye : I.check);

const waLink = (source, className, inner) => `<a
          href="${WA}"
          target="_blank"
          rel="noopener noreferrer"
          class="${className}"
          data-fsai-wa="${source}"
        >${inner}</a>`;

const zohoForm = `          <form
            action="${ZOHO_FORM_ACTION}"
            name="form"
            id="fsai-consultation-form"
            method="POST"
            accept-charset="UTF-8"
            enctype="multipart/form-data"
            class="fsai-zoho-form"
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

            <div class="fsai-form-row">
              <div class="fsai-form-group">
                <label for="fsai-first">First Name</label>
                <input id="fsai-first" type="text" maxlength="255" name="Name_First" placeholder="John" />
              </div>
              <div class="fsai-form-group">
                <label for="fsai-last">Last Name</label>
                <input id="fsai-last" type="text" maxlength="255" name="Name_Last" placeholder="Smith" />
              </div>
            </div>

            <div class="fsai-form-group">
              <label for="fsai-email">Email *</label>
              <input id="fsai-email" type="text" maxlength="255" name="Email" placeholder="john@company.com" required />
            </div>

            <div class="fsai-form-group">
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

            <div class="fsai-form-group">
              <label for="fsai-company">Company Name *</label>
              <input id="fsai-company" type="text" name="SingleLine1" maxlength="255" placeholder="Your Company LLC" required />
            </div>

            <button type="submit" class="fsai-btn fsai-btn-primary fsai-form-submit">
              Book My Free Consultation
              ${I.arrow}
            </button>
          </form>`;

/**
 * Ordered page sections. `css` names the chunk from css.mjs that styles it,
 * so the assembler can ship style and markup together.
 */
export const SECTIONS = [
  {
    key: 'hero',
    css: ['HERO'],
    html: `  <section class="fsai-hero">
    <div class="fsai-container">
      <div class="fsai-hero-grid">
        <div class="fsai-hero-copy">
          <div class="fsai-hero-badge">
            ${spark('fsai-badge-spark')}
            <span>First AI-native accounting firm &middot; UAE</span>
          </div>

          <h1 class="fsai-hero-headline">
            Books that close themselves.
            <br />
            <span class="fsai-accent">Accountants</span> who stand behind them.
          </h1>

          <p class="fsai-hero-sub">
            Finanshels pairs AI agents that categorize, reconcile and draft your filings with
            qualified accountants who review every number. 10&times; faster closes,
            audit-ready always &mdash; for 7,000+ UAE businesses.
          </p>

          <div class="fsai-hero-actions">
            <a href="#fsai-consultation" class="fsai-btn fsai-btn-primary">
              Get a Free Consultation
              ${I.arrow}
            </a>
            ${waLink('ai_landing_hero', 'fsai-btn fsai-btn-ghost', 'Talk on WhatsApp')}
          </div>

          <dl class="fsai-hero-stats">
            <div class="fsai-stat"><dt>7,000+</dt><dd>UAE businesses</dd></div>
            <div class="fsai-stat"><dt>10&times;</dt><dd>Faster than manual</dd></div>
            <div class="fsai-stat"><dt>4.9</dt><dd>Trustpilot rating</dd></div>
            <div class="fsai-stat"><dt>150+</dt><dd>Accountants in the loop</dd></div>
          </dl>
        </div>

        <!-- Live agent feed card — the page's one inverted surface -->
        <div class="fsai-hero-visual">
          <div class="fsai-feed-card">
            <div class="fsai-feed-header">
              <span class="fsai-feed-live">
                <span class="fsai-live-dot"></span>
                Finanshels AI &middot; working now
              </span>
              <span class="fsai-feed-date">Today, 6:04 AM</span>
            </div>

            <ul class="fsai-feed-list">
${heroFeedItems
  .map(
    (item, index) => `              <li class="fsai-feed-item fsai-feed-${item.icon}" style="animation-delay: ${(0.5 + index * 0.35).toFixed(2)}s">
                <span class="fsai-feed-icon">${feedIcon(item.icon)}</span>
                <span class="fsai-feed-text">
                  ${item.text}
                  <span class="fsai-feed-meta">${item.meta}</span>
                </span>
              </li>`,
  )
  .join('\n')}
              <li class="fsai-feed-item fsai-feed-typing" style="animation-delay: 2.4s">
                <span class="fsai-typing-dots"><span></span><span></span><span></span></span>
                <span class="fsai-feed-text">Preparing your July P&amp;L&hellip;</span>
              </li>
            </ul>

            <div class="fsai-feed-footer">
              ${I.shield}
              Every action reviewed by a qualified accountant
            </div>
          </div>
          ${spark('fsai-hero-spark fsai-hero-spark-1')}
          ${spark('fsai-hero-spark fsai-hero-spark-2')}
        </div>
      </div>
    </div>
  </section>`,
  },

  {
    key: 'logos',
    css: ['LOGOS'],
    html: `  <section class="fsai-logos" aria-label="Client logos">
    <div class="fsai-container">
      <p class="fsai-logos-label">Trusted by leading UAE businesses</p>
      <div class="fsai-logos-track" data-reveal>
${clientLogos
  .map(
    ([file, alt]) => `        <div class="fsai-logo-tile">
          <img src="${ASSETS}/clients/${file}" alt="${alt} logo" loading="lazy" decoding="async" />
        </div>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'manifesto',
    css: ['MANIFESTO'],
    html: `  <section class="fsai-manifesto">
    <div class="fsai-container">
      <p class="fsai-eyebrow fsai-eyebrow-light">
        ${spark('fsai-eyebrow-spark')} Why AI-native
      </p>
      <h2 class="fsai-manifesto-headline" data-reveal>
        Most firms <em>added</em> AI.
        <br />
        We were <span class="fsai-accent">built on it.</span>
      </h2>
      <p class="fsai-manifesto-sub" data-reveal>
        When the workflow is designed around AI from day one, everything changes: what used to
        take a team a month now happens overnight &mdash; and your accountants finally have
        time to think about your business, not your data entry.
      </p>

      <div class="fsai-pillars" data-reveal-stagger>
${pillars
  .map(
    ([number, title, text]) => `        <article class="fsai-pillar">
          <span class="fsai-pillar-number">${number}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'compare',
    css: ['COMPARISON'],
    html: `  <section class="fsai-compare">
    <div class="fsai-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} The difference</p>
        <h2>Traditional firm vs. <span class="fsai-accent">AI-native</span></h2>
      </div>

      <div class="fsai-compare-table" data-reveal role="table" aria-label="Traditional firm versus AI-native comparison">
        <div class="fsai-compare-row fsai-compare-head" role="row">
          <span role="columnheader"></span>
          <span role="columnheader">The old way</span>
          <span role="columnheader" class="fsai-compare-now-head">
            ${spark('fsai-compare-spark')} Finanshels
          </span>
        </div>
${comparisonRows
  .map(
    ([label, oldWay, now]) => `        <div class="fsai-compare-row" role="row">
          <span class="fsai-compare-label" role="cell">${label}</span>
          <span class="fsai-compare-old" role="cell">${oldWay}</span>
          <span class="fsai-compare-now" role="cell">${I.check}${now}</span>
        </div>`,
  )
  .join('\n')}
      </div>

      <!-- Mobile-only: two stacked panels instead of the table -->
      <div class="fsai-compare-mobile" data-reveal>
        <div class="fsai-compare-panel fsai-compare-panel-old">
          <h3>The old way</h3>
          <ul>
${comparisonRows
  .map(([label, oldWay]) => `            <li>${I.x}<span><strong>${label}.</strong> ${oldWay}</span></li>`)
  .join('\n')}
          </ul>
        </div>
        <div class="fsai-compare-panel fsai-compare-panel-new">
          <h3>${spark('fsai-compare-panel-spark')} With Finanshels</h3>
          <ul>
${comparisonRows
  .map(([label, , now]) => `            <li>${I.check}<span><strong>${label}.</strong> ${now}</span></li>`)
  .join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`,
  },

  {
    key: 'lead-strip',
    css: ['LEAD STRIP — the one saturated band on the page'],
    html: `  <section class="fsai-lead-strip" aria-label="Get a free quote">
    <div class="fsai-container">
      <div class="fsai-lead-inner" data-reveal>
        <div class="fsai-lead-copy">
          <h2>See what AI-native accounting costs for your business</h2>
          <p>Message us on WhatsApp — a real accountant replies in minutes.</p>
        </div>
        ${waLink('ai_landing_strip', 'fsai-btn fsai-lead-whatsapp', `
          ${I.whatsapp}
          Chat on WhatsApp
        `)}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'workflow',
    css: ['WORKFLOW'],
    html: `  <section class="fsai-workflow">
    <div class="fsai-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} How it works</p>
        <h2>From your bank feed to <span class="fsai-accent">board-ready</span></h2>
      </div>

      <ol class="fsai-steps" data-reveal-stagger>
${workflowSteps
  .map(
    ([step, title, text]) => `        <li class="fsai-step">
          <span class="fsai-step-number">${step}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </li>`,
  )
  .join('\n')}
      </ol>
    </div>
  </section>`,
  },

  {
    key: 'dashboard',
    css: ['FINDELIVERY DASHBOARD'],
    html: `  <section class="fsai-dashboard">
    <div class="fsai-container">
      <div class="fsai-section-head fsai-dash-head" data-reveal>
        <p class="fsai-eyebrow fsai-eyebrow-light">${spark('fsai-eyebrow-spark')} The product</p>
        <h2>Your numbers, live in <span class="fsai-accent">Findelivery</span></h2>
        <p class="fsai-dash-sub">
          Every Finanshels client gets Findelivery — our AI CFO dashboard. P&amp;L, cash,
          runway and tax positions update as your books do, and you can ask the CFO anything
          in plain English.
        </p>
      </div>

      <div class="fsai-dash-frame" data-reveal aria-label="Preview of the Findelivery AI CFO dashboard">
        <div class="fsai-dash-topbar">
          <span class="fsai-dash-brand">
            ${spark('fsai-dash-brand-spark')}
            Findelivery &middot; AI CFO
          </span>
          <span class="fsai-dash-period">June 2026</span>
          <span class="fsai-dash-ask">Ask CFO</span>
        </div>

        <div class="fsai-dash-kpis">
${dashboardKpis
  .map(
    ([label, value, meta, tone]) => `          <div class="fsai-dash-kpi">
            <span class="fsai-dash-kpi-label">${label}</span>
            <span class="fsai-dash-kpi-value fsai-tone-${tone}">${value}</span>
            <span class="fsai-dash-kpi-meta">${meta}</span>
          </div>`,
  )
  .join('\n')}
        </div>

        <div class="fsai-dash-body">
          <div class="fsai-dash-panel">
            <div class="fsai-dash-panel-head">
              <span>P&amp;L Snapshot</span>
              <span class="fsai-dash-panel-tag">MTD</span>
            </div>
${dashboardPnl
  .map(
    ([item, value, delta, tone, strong]) => `            <div class="fsai-dash-row${strong ? ' fsai-dash-row-strong' : ''}">
              <span class="fsai-dash-row-item">${item}</span>
              <span class="fsai-dash-row-value">${value}</span>
              <span class="fsai-dash-row-delta fsai-tone-${tone}">${delta}</span>
            </div>`,
  )
  .join('\n')}
            <span class="fsai-dash-explain">Explain this P&amp;L ${I.arrow}</span>
          </div>

          <div class="fsai-dash-panel">
            <div class="fsai-dash-panel-head"><span>Cash &amp; Guardrails</span></div>
            <div class="fsai-dash-cash">
              <span class="fsai-dash-cash-label">Cash on hand</span>
              <span class="fsai-dash-cash-value">AED 1.2M</span>
            </div>
${dashboardGuardrails
  .map(
    ([label, target, value]) => `            <div class="fsai-dash-guardrail">
              <span><strong>${label}</strong><em>${target}</em></span>
              <span class="fsai-dash-guardrail-value">${I.check}${value}</span>
            </div>`,
  )
  .join('\n')}
          </div>
        </div>
      </div>
    </div>
  </section>`,
  },

  {
    key: 'split',
    css: ['AI + HUMAN SPLIT'],
    html: `  <section class="fsai-split">
    <div class="fsai-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} Division of labor</p>
        <h2>AI drafts. <span class="fsai-accent">Humans sign.</span></h2>
      </div>

      <div class="fsai-split-grid" data-reveal-stagger>
        <div class="fsai-split-card fsai-split-machine">
          <div class="fsai-split-card-head">
            ${I.zap}
            <h3>What the AI does</h3>
          </div>
          <ul>
${aiDuties.map((duty) => `            <li>${I.check}${duty}</li>`).join('\n')}
          </ul>
        </div>

        <div class="fsai-split-card fsai-split-human">
          <div class="fsai-split-card-head">
            ${I.eye}
            <h3>Where humans stay in the loop</h3>
          </div>
          <ul>
${humanDuties.map((duty) => `            <li>${I.check}${duty}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
  </section>`,
  },

  {
    key: 'services',
    css: ['SERVICES — the signature bento'],
    html: `  <section class="fsai-services" id="fsai-services">
    <div class="fsai-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} Everything covered</p>
        <h2>One firm for your entire <span class="fsai-accent">finance stack</span></h2>
      </div>

      <div class="fsai-services-grid" data-reveal-stagger>
${services
  .map(
    ([iconId, title, text]) => `        <article class="fsai-service-card">
          <span class="fsai-service-icon">${I[iconId]}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </article>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'testimonials',
    css: ['TESTIMONIALS'],
    html: `  <section class="fsai-testimonials" id="fsai-testimonials">
    <div class="fsai-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} In their words</p>
        <h2>Founders who made the <span class="fsai-accent">switch</span></h2>
      </div>

      <div class="fsai-testimonials-grid" data-reveal-stagger>
${testimonials
  .map(
    ([text, name, title, initials]) => `        <figure class="fsai-testimonial-card">
          ${spark('fsai-quote-spark')}
          <blockquote>${text}</blockquote>
          <figcaption>
            <span class="fsai-testimonial-avatar">${initials}</span>
            <span>
              <strong>${name}</strong>
              <em>${title}</em>
            </span>
          </figcaption>
        </figure>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'faq',
    css: ['FAQ'],
    html: `  <section class="fsai-faq" id="fsai-faq">
    <div class="fsai-container fsai-faq-container">
      <div class="fsai-section-head" data-reveal>
        <p class="fsai-eyebrow">${spark('fsai-eyebrow-spark')} Questions</p>
        <h2>Fair questions about <span class="fsai-accent">AI accounting</span></h2>
      </div>

      <div class="fsai-faq-list" data-reveal>
${faqs
  .map(
    ([question, answer], index) => `        <div class="fsai-faq-item">
          <button type="button" class="fsai-faq-question" aria-expanded="false" aria-controls="fsai-faq-panel-${index}">
            ${question.replace(/"/g, '&quot;')}
            ${I.chevron}
          </button>
          <div class="fsai-faq-answer" id="fsai-faq-panel-${index}">
            <p>${answer}</p>
          </div>
        </div>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
  },

  {
    key: 'cta',
    css: ['FINAL CTA', 'Animations', 'Responsive'],
    html: `  <span id="fsai-pricing"></span>
  <section class="fsai-cta" id="fsai-consultation">
    <div class="fsai-container">
      <div class="fsai-cta-grid">
        <div class="fsai-cta-copy" data-reveal>
          ${spark('fsai-cta-spark')}
          <h2>
            See your books run
            <br />
            the <span class="fsai-accent">AI-native</span> way.
          </h2>
          <p>
            A 30-minute call with our team. We&rsquo;ll look at your current setup, show you
            the live dashboard, and quote against what you pay today. No obligation.
          </p>
          <ul class="fsai-cta-points">
            <li>${I.check} Pay only if satisfied</li>
            <li>${I.check} Dedicated accountant + AI agents</li>
            <li>${I.check} Onboarded within 45 days</li>
          </ul>
          ${waLink('ai_landing_footer', 'fsai-cta-whatsapp', `
            Prefer chat? Message us on WhatsApp ${I.arrow}
          `)}
        </div>

        <div class="fsai-cta-form-card" data-reveal>
          <h3>Get your free consultation</h3>
          <p>Tell us where your books stand — we&rsquo;ll take it from there.</p>
${zohoForm}
          <p class="fsai-form-privacy">Your data is secure and will never be shared.</p>
        </div>
      </div>
    </div>
  </section>`,
  },
];
