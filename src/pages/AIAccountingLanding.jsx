import { useEffect, useRef, useState } from 'react';
import {
  FiCheckCircle,
  FiChevronDown,
  FiFlag,
  FiX,
  FiZap,
  FiEye,
  FiShield,
  FiBookOpen,
  FiPercent,
  FiBriefcase,
  FiUsers,
  FiTrendingUp,
  FiFileText,
  FiArrowRight,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import Seo from '../components/Seo';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import './AIAccountingLanding.css';

const WHATSAPP_MESSAGE =
  "Hi Finanshels! I'd like to learn more about your AI-native accounting services.";

/* Eight-point starburst — the page's recurring accent mark */
const Spark = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

const REVEAL_SELECTOR = '[data-reveal], [data-reveal-stagger]';

/**
 * Fades sections up as they scroll into view.
 *
 * The hidden state lives behind an `is-ready` class that only gets added once
 * the observer is wired, so if this effect never runs — no JS, old browser,
 * hydration failure — the page still renders fully visible instead of blank.
 *
 * @returns {import('react').RefObject<HTMLDivElement>} ref for the page root
 */
const useScrollReveal = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const targets = root.querySelectorAll(REVEAL_SELECTOR);
    if (!targets.length) {
      return undefined;
    }

    root.classList.add('is-ready');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-in'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return rootRef;
};

const ZOHO_FORM_ACTION =
  'https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit';

const ZohoHiddenFields = () => (
  <>
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
  </>
);

const ZohoConsultationForm = ({ formId }) => (
  <form
    action={ZOHO_FORM_ACTION}
    name="form"
    id={formId || 'form'}
    method="POST"
    acceptCharset="UTF-8"
    encType="multipart/form-data"
    className="ai-zoho-form"
  >
    <ZohoHiddenFields />

    <div className="ai-form-row">
      <div className="ai-form-group">
        <label>First Name</label>
        <input type="text" maxLength="255" name="Name_First" placeholder="John" />
      </div>
      <div className="ai-form-group">
        <label>Last Name</label>
        <input type="text" maxLength="255" name="Name_Last" placeholder="Smith" />
      </div>
    </div>

    <div className="ai-form-group">
      <label>Email *</label>
      <input type="text" maxLength="255" name="Email" placeholder="john@company.com" required />
    </div>

    <div className="ai-form-group">
      <label>Phone Number *</label>
      <input
        type="text"
        name="PhoneNumber_countrycode"
        maxLength="20"
        id="international_PhoneNumber_countrycode"
        placeholder="+971 00 000 0000"
        required
      />
    </div>

    <div className="ai-form-group">
      <label>Company Name *</label>
      <input type="text" name="SingleLine1" maxLength="255" placeholder="Your Company LLC" required />
    </div>

    <button type="submit" className="ai-btn ai-btn-primary ai-form-submit">
      Book My Free Consultation
      <FiArrowRight aria-hidden="true" />
    </button>
  </form>
);

const heroFeedItems = [
  { icon: 'check', text: '214 transactions categorized', meta: 'Emirates NBD · Mashreq' },
  { icon: 'check', text: 'Bank reconciliation complete', meta: '0 discrepancies' },
  { icon: 'flag', text: '3 invoices flagged for review', meta: 'Routed to your accountant' },
  { icon: 'check', text: 'VAT return drafted', meta: 'Due 28 Aug · ready early' },
  { icon: 'human', text: 'Reviewed & approved', meta: 'Senior accountant sign-off' },
];

const clientLogos = [
  { src: '/clients/Binary.png', alt: 'Binary' },
  { src: '/clients/actualize.png', alt: 'Actualize' },
  { src: '/clients/carbonsirf.png', alt: 'CarbonSirf' },
  { src: '/clients/cotu.avif', alt: 'COTU Ventures' },
  { src: '/clients/fuze.png', alt: 'Fuze' },
  { src: '/clients/growdash.png', alt: 'Growdash' },
  { src: '/clients/humlog.png', alt: 'Humlog' },
  { src: '/clients/veehive.png', alt: 'Veehive' },
  { src: '/clients/zywa.png', alt: 'Zywa' },
];

const pillars = [
  {
    number: '01',
    title: 'AI does the repetitive work',
    text: 'Categorization, reconciliation, data capture and deadline tracking run continuously — not once a month. Your books are current every morning.',
  },
  {
    number: '02',
    title: 'Accountants own the outcome',
    text: 'Every number the AI produces is reviewed by a qualified accountant before it reaches you or the FTA. AI drafts. Humans sign.',
  },
  {
    number: '03',
    title: 'You see everything, live',
    text: 'No more waiting for month-end PDFs. A real-time dashboard shows cash, runway, VAT position and P&L the moment anything changes.',
  },
];

const comparisonRows = [
  {
    label: 'Monthly close',
    old: 'Weeks after month-end',
    now: 'Days — AI reconciles continuously',
  },
  {
    label: 'Data entry',
    old: 'Manual keying, human error',
    now: 'Automated capture, accountant-verified',
  },
  {
    label: 'Visibility',
    old: 'Static PDFs, once a month',
    now: 'Live dashboard, always current',
  },
  {
    label: 'Tax deadlines',
    old: 'Last-minute scrambles',
    now: 'Tracked by AI, filed early',
  },
  {
    label: 'Errors',
    old: 'Discovered at audit',
    now: 'Flagged the moment they happen',
  },
  {
    label: 'Cost',
    old: 'Grows with headcount',
    now: 'Grows with software — not people',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Connect',
    text: 'We link your banks, invoicing tools and accounting software — QuickBooks, Xero, Zoho Books or ours. Migration handled for you.',
  },
  {
    step: '02',
    title: 'AI agents process',
    text: 'Transactions are captured, categorized and reconciled daily. Anomalies, duplicates and missing documents get flagged automatically.',
  },
  {
    step: '03',
    title: 'Accountants review',
    text: 'Your dedicated accountant checks every output, resolves exceptions and signs off on filings. Nothing ships on AI confidence alone.',
  },
  {
    step: '04',
    title: 'You decide',
    text: 'Clean books, live dashboards and on-time VAT & Corporate Tax filings — plus a team on WhatsApp when you need an answer.',
  },
];

const aiDuties = [
  'Categorizes every transaction, daily',
  'Reconciles bank feeds continuously',
  'Extracts data from invoices & receipts',
  'Tracks VAT and Corporate Tax deadlines',
  'Drafts returns and monthly reports',
  'Flags anomalies and duplicates instantly',
];

const humanDuties = [
  'Reviews and approves every AI output',
  'Resolves flagged exceptions with context',
  'Signs off on VAT & Corporate Tax filings',
  'Advises on structure, cash and runway',
  'Answers you on WhatsApp — a person, fast',
  'Owns the numbers at audit time',
];

const services = [
  {
    icon: FiBookOpen,
    title: 'Bookkeeping',
    text: 'Daily, AI-reconciled books reviewed by your dedicated accountant. Always audit-ready.',
  },
  {
    icon: FiPercent,
    title: 'VAT Compliance',
    text: 'Registration, quarterly returns and FTA correspondence — drafted by AI, filed by humans.',
  },
  {
    icon: FiBriefcase,
    title: 'Corporate Tax',
    text: '9% Corporate Tax registration, planning and filing with deadlines tracked automatically.',
  },
  {
    icon: FiUsers,
    title: 'Payroll & WPS',
    text: 'Salaries processed, WPS files generated and gratuity accruals kept current every month.',
  },
  {
    icon: FiTrendingUp,
    title: 'CFO Insights',
    text: 'Cash-flow forecasts, budgets and board-ready reporting from live data — not stale exports.',
  },
  {
    icon: FiFileText,
    title: 'Audit Support',
    text: 'Clean trails and organized documents mean audits close faster and cost less.',
  },
];

const dashboardKpis = [
  { label: 'Revenue Growth MoM', value: '+18.4%', meta: 'AED 412K this month', tone: 'up' },
  { label: 'GP Margin', value: '62.3%', meta: '+8.1pp vs industry', tone: 'up' },
  { label: 'Burn Rate (Monthly)', value: 'AED 96K', meta: '21.4% of revenue', tone: 'neutral' },
  { label: 'Runway', value: '18.2 mo', meta: 'Above 6-month target', tone: 'up' },
];

const dashboardPnl = [
  { item: 'Revenue', value: '412,090', delta: '+18.4%', tone: 'up', isStrong: false },
  { item: 'Cost of Revenue', value: '(155,301)', delta: '', tone: 'neutral', isStrong: false },
  { item: 'Gross Profit', value: '256,789', delta: '62.3%', tone: 'up', isStrong: true },
  { item: 'Operating Expenses', value: '(149,204)', delta: '+4.2%', tone: 'down', isStrong: false },
  { item: 'Net Profit', value: '107,585', delta: '+26.1%', tone: 'up', isStrong: true },
];

const dashboardGuardrails = [
  { label: 'Min Cash Reserve', target: 'Target: AED 250K', value: 'AED 1.2M' },
  { label: 'Cash Runway', target: 'Target: ≥ 6 months', value: '18.2 mo' },
  { label: 'AR Days (DSO)', target: 'Target: ≤ 45 days', value: '32 days' },
];

const testimonials = [
  {
    text: 'They designed an accounting system tailor made to our needs & completely automated our finance operations just like they promised. They’ve been super helpful for us to scale.',
    name: 'Jeremy Khatar',
    title: 'CEO, Ronin Global LLC',
    initials: 'JK',
  },
  {
    text: 'Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving. Very happy that I took the decision to work with them.',
    name: 'Szilvia Vitos',
    title: 'Founder, Livvity',
    initials: 'SV',
  },
  {
    text: 'They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times.',
    name: 'Meet Patel',
    title: 'Former COO, StudentHub & BAWES',
    initials: 'MP',
  },
];

const faqs = [
  {
    question: 'What does "AI-native" actually mean?',
    answer:
      'Most firms bolt AI tools onto a manual workflow. We built our workflow around AI from day one: agents handle categorization, reconciliation, document capture and deadline tracking continuously, and our accountants spend their time on review, exceptions and advice — not data entry. The result is books that are 10× faster to close and current every day.',
  },
  {
    question: 'Is AI doing my accounting on its own?',
    answer:
      'No. AI drafts, humans sign. Every categorization, reconciliation and filing is reviewed by a qualified accountant before it reaches you or the FTA. You get the speed of automation with the accountability of a licensed firm.',
  },
  {
    question: 'Which tools do you integrate with?',
    answer:
      'QuickBooks, Xero, Zoho Books, major UAE bank feeds and custom stacks. If you’re on spreadsheets today, we handle the migration as part of onboarding.',
  },
  {
    question: 'Is my financial data safe?',
    answer:
      'Yes. Data is encrypted in transit and at rest, access is role-restricted, and your data is never used to train third-party AI models. We follow industry-standard security protocols across our entire stack.',
  },
  {
    question: 'How fast can we start?',
    answer:
      'Onboarding is structured and typically completes within 45 days — from connecting your tools and migrating history to delivering your first complete financial pack. Most clients see their live dashboard in the first two weeks.',
  },
  {
    question: 'Does AI-native mean cheaper?',
    answer:
      'Usually, yes. Because software does the repetitive work, our pricing scales with your transaction volume — not with billable hours. Book a free consultation and we’ll quote against what you pay today.',
  },
];

const seoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: 'Finanshels — First AI-Native Accounting Firm',
  description:
    'UAE’s First AI-native accounting firm. AI agents reconcile and draft; qualified accountants review and file. Bookkeeping, VAT, Corporate Tax, payroll and CFO insights.',
  areaServed: 'AE',
  url: 'https://www.finanshels.com/ai-accounting',
};

const AIAccountingLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const rootRef = useScrollReveal();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const trackWhatsAppClick = (source) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source });
    }
  };

  const feedIcon = (type) => {
    if (type === 'flag') return <FiFlag aria-hidden="true" />;
    if (type === 'human') return <FiEye aria-hidden="true" />;
    return <FiCheckCircle aria-hidden="true" />;
  };

  return (
    <div className="ai-landing" ref={rootRef}>
      <Seo
        title="First AI-Native Accounting Firm in UAE | Finanshels"
        description="AI agents reconcile your books daily. Qualified accountants review and file. Bookkeeping, VAT, Corporate Tax and payroll for 7,000+ UAE businesses — 10× faster."
        canonicalPath="/ai-accounting"
        jsonLd={seoJsonLd}
      />

      {/* ============ HERO ============ */}
      <section className="ai-hero">
        <div className="ai-container">
          <div className="ai-hero-grid">
            <div className="ai-hero-copy">
              <div className="ai-hero-badge">
                <Spark className="ai-badge-spark" />
                <span>First AI-native accounting firm &middot; UAE</span>
              </div>

              <h1 className="ai-hero-headline">
                Books that close themselves.
                <br />
                <span className="ai-accent">Accountants</span> who stand behind them.
              </h1>

              <p className="ai-hero-sub">
                Finanshels pairs AI agents that categorize, reconcile and draft your filings with
                qualified accountants who review every number. 10&times; faster closes,
                audit-ready always &mdash; for 7,000+ UAE businesses.
              </p>

              <div className="ai-hero-actions">
                <a href="#consultation" className="ai-btn ai-btn-primary">
                  Get a Free Consultation
                  <FiArrowRight aria-hidden="true" />
                </a>
                <a
                  href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ai-btn ai-btn-ghost"
                  onClick={() => trackWhatsAppClick('ai_landing_hero')}
                >
                  Talk on WhatsApp
                </a>
              </div>

              <dl className="ai-hero-stats">
                <div className="ai-stat">
                  <dt>7,000+</dt>
                  <dd>UAE businesses</dd>
                </div>
                <div className="ai-stat">
                  <dt>10&times;</dt>
                  <dd>Faster than manual</dd>
                </div>
                <div className="ai-stat">
                  <dt>4.9</dt>
                  <dd>Trustpilot rating</dd>
                </div>
                <div className="ai-stat">
                  <dt>150+</dt>
                  <dd>Accountants in the loop</dd>
                </div>
              </dl>
            </div>

            {/* Live agent feed card */}
            <div className="ai-hero-visual">
              <div className="ai-feed-card">
                <div className="ai-feed-header">
                  <span className="ai-feed-live">
                    <span className="ai-live-dot" />
                    Finanshels AI &middot; working now
                  </span>
                  <span className="ai-feed-date">Today, 6:04 AM</span>
                </div>

                <ul className="ai-feed-list">
                  {heroFeedItems.map((item, index) => (
                    <li
                      key={item.text}
                      className={`ai-feed-item ai-feed-${item.icon}`}
                      style={{ animationDelay: `${0.5 + index * 0.35}s` }}
                    >
                      <span className="ai-feed-icon">{feedIcon(item.icon)}</span>
                      <span className="ai-feed-text">
                        {item.text}
                        <span className="ai-feed-meta">{item.meta}</span>
                      </span>
                    </li>
                  ))}
                  <li className="ai-feed-item ai-feed-typing" style={{ animationDelay: '2.4s' }}>
                    <span className="ai-typing-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                    <span className="ai-feed-text">Preparing your July P&amp;L&hellip;</span>
                  </li>
                </ul>

                <div className="ai-feed-footer">
                  <FiShield aria-hidden="true" />
                  Every action reviewed by a qualified accountant
                </div>
              </div>
              <Spark className="ai-hero-spark ai-hero-spark-1" />
              <Spark className="ai-hero-spark ai-hero-spark-2" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ LOGOS ============ */}
      <section className="ai-logos" aria-label="Client logos">
        <div className="ai-container">
          <p className="ai-logos-label">Trusted by leading UAE businesses</p>
          <div className="ai-logos-track" data-reveal>
            {clientLogos.map((logo) => (
              <div key={logo.alt} className="ai-logo-tile">
                <img src={logo.src} alt={`${logo.alt} logo`} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="ai-manifesto">
        <div className="ai-container">
          <p className="ai-eyebrow ai-eyebrow-light">
            <Spark className="ai-eyebrow-spark" /> Why AI-native
          </p>
          <h2 className="ai-manifesto-headline" data-reveal>
            Most firms <em>added</em> AI.
            <br />
            We were <span className="ai-accent">built on it.</span>
          </h2>
          <p className="ai-manifesto-sub" data-reveal>
            When the workflow is designed around AI from day one, everything changes: what used to
            take a team a month now happens overnight &mdash; and your accountants finally have
            time to think about your business, not your data entry.
          </p>

          <div className="ai-pillars" data-reveal-stagger>
            {pillars.map((pillar) => (
              <article key={pillar.number} className="ai-pillar">
                <span className="ai-pillar-number">{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMPARISON ============ */}
      <section className="ai-compare">
        <div className="ai-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> The difference
            </p>
            <h2>
              Traditional firm vs. <span className="ai-accent">AI-native</span>
            </h2>
          </div>

          <div className="ai-compare-table" data-reveal role="table" aria-label="Traditional firm versus AI-native comparison">
            <div className="ai-compare-row ai-compare-head" role="row">
              <span role="columnheader" />
              <span role="columnheader">The old way</span>
              <span role="columnheader" className="ai-compare-now-head">
                <Spark className="ai-compare-spark" /> Finanshels
              </span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="ai-compare-row" role="row">
                <span className="ai-compare-label" role="cell">
                  {row.label}
                </span>
                <span className="ai-compare-old" role="cell">
                  {row.old}
                </span>
                <span className="ai-compare-now" role="cell">
                  <FiCheckCircle aria-hidden="true" />
                  {row.now}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile-only: two stacked panels instead of the table */}
          <div className="ai-compare-mobile" data-reveal>
            <div className="ai-compare-panel ai-compare-panel-old">
              <h3>The old way</h3>
              <ul>
                {comparisonRows.map((row) => (
                  <li key={row.label}>
                    <FiX aria-hidden="true" />
                    <span>
                      <strong>{row.label}.</strong> {row.old}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ai-compare-panel ai-compare-panel-new">
              <h3>
                <Spark className="ai-compare-panel-spark" /> With Finanshels
              </h3>
              <ul>
                {comparisonRows.map((row) => (
                  <li key={row.label}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>
                      <strong>{row.label}.</strong> {row.now}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEAD STRIP ============ */}
      <section className="ai-lead-strip" aria-label="Get a free quote">
        <div className="ai-container">
          <div className="ai-lead-inner" data-reveal>
            <div className="ai-lead-copy">
              <h2>See what AI-native accounting costs for your business</h2>
              <p>Message us on WhatsApp — a real accountant replies in minutes.</p>
            </div>
            <a
              href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-btn ai-lead-whatsapp"
              onClick={() => trackWhatsAppClick('ai_landing_strip')}
            >
              <FaWhatsapp aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="ai-workflow">
        <div className="ai-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> How it works
            </p>
            <h2>
              From your bank feed to <span className="ai-accent">board-ready</span>
            </h2>
          </div>

          <ol className="ai-steps" data-reveal-stagger>
            {workflowSteps.map((item) => (
              <li key={item.step} className="ai-step">
                <span className="ai-step-number">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FINDELIVERY DASHBOARD ============ */}
      <section className="ai-dashboard">
        <div className="ai-container">
          <div className="ai-section-head ai-dash-head" data-reveal>
            <p className="ai-eyebrow ai-eyebrow-light">
              <Spark className="ai-eyebrow-spark" /> The product
            </p>
            <h2>
              Your numbers, live in <span className="ai-accent">Findelivery</span>
            </h2>
            <p className="ai-dash-sub">
              Every Finanshels client gets Findelivery — our AI CFO dashboard. P&amp;L, cash,
              runway and tax positions update as your books do, and you can ask the CFO anything
              in plain English.
            </p>
          </div>

          <div className="ai-dash-frame" data-reveal aria-label="Preview of the Findelivery AI CFO dashboard">
            <div className="ai-dash-topbar">
              <span className="ai-dash-brand">
                <Spark className="ai-dash-brand-spark" />
                Findelivery &middot; AI CFO
              </span>
              <span className="ai-dash-period">June 2026</span>
              <span className="ai-dash-ask">Ask CFO</span>
            </div>

            <div className="ai-dash-kpis">
              {dashboardKpis.map((kpi) => (
                <div key={kpi.label} className="ai-dash-kpi">
                  <span className="ai-dash-kpi-label">{kpi.label}</span>
                  <span className={`ai-dash-kpi-value ai-tone-${kpi.tone}`}>{kpi.value}</span>
                  <span className="ai-dash-kpi-meta">{kpi.meta}</span>
                </div>
              ))}
            </div>

            <div className="ai-dash-body">
              <div className="ai-dash-panel">
                <div className="ai-dash-panel-head">
                  <span>P&amp;L Snapshot</span>
                  <span className="ai-dash-panel-tag">MTD</span>
                </div>
                {dashboardPnl.map((row) => (
                  <div
                    key={row.item}
                    className={`ai-dash-row ${row.isStrong ? 'ai-dash-row-strong' : ''}`}
                  >
                    <span className="ai-dash-row-item">{row.item}</span>
                    <span className="ai-dash-row-value">{row.value}</span>
                    <span className={`ai-dash-row-delta ai-tone-${row.tone}`}>{row.delta}</span>
                  </div>
                ))}
                <span className="ai-dash-explain">
                  Explain this P&amp;L <FiArrowRight aria-hidden="true" />
                </span>
              </div>

              <div className="ai-dash-panel">
                <div className="ai-dash-panel-head">
                  <span>Cash &amp; Guardrails</span>
                </div>
                <div className="ai-dash-cash">
                  <span className="ai-dash-cash-label">Cash on hand</span>
                  <span className="ai-dash-cash-value">AED 1.2M</span>
                </div>
                {dashboardGuardrails.map((guardrail) => (
                  <div key={guardrail.label} className="ai-dash-guardrail">
                    <span>
                      <strong>{guardrail.label}</strong>
                      <em>{guardrail.target}</em>
                    </span>
                    <span className="ai-dash-guardrail-value">
                      <FiCheckCircle aria-hidden="true" />
                      {guardrail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============ AI + HUMAN SPLIT ============ */}
      <section className="ai-split">
        <div className="ai-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> Division of labor
            </p>
            <h2>
              AI drafts. <span className="ai-accent">Humans sign.</span>
            </h2>
          </div>

          <div className="ai-split-grid" data-reveal-stagger>
            <div className="ai-split-card ai-split-machine">
              <div className="ai-split-card-head">
                <FiZap aria-hidden="true" />
                <h3>What the AI does</h3>
              </div>
              <ul>
                {aiDuties.map((duty) => (
                  <li key={duty}>
                    <FiCheckCircle aria-hidden="true" />
                    {duty}
                  </li>
                ))}
              </ul>
            </div>

            <div className="ai-split-card ai-split-human">
              <div className="ai-split-card-head">
                <FiEye aria-hidden="true" />
                <h3>Where humans stay in the loop</h3>
              </div>
              <ul>
                {humanDuties.map((duty) => (
                  <li key={duty}>
                    <FiCheckCircle aria-hidden="true" />
                    {duty}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="ai-services" id="services">
        <div className="ai-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> Everything covered
            </p>
            <h2>
              One firm for your entire <span className="ai-accent">finance stack</span>
            </h2>
          </div>

          <div className="ai-services-grid" data-reveal-stagger>
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="ai-service-card">
                  <span className="ai-service-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="ai-testimonials" id="testimonials">
        <div className="ai-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> In their words
            </p>
            <h2>
              Founders who made the <span className="ai-accent">switch</span>
            </h2>
          </div>

          <div className="ai-testimonials-grid" data-reveal-stagger>
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="ai-testimonial-card">
                <Spark className="ai-quote-spark" />
                <blockquote>{testimonial.text}</blockquote>
                <figcaption>
                  <span className="ai-testimonial-avatar">{testimonial.initials}</span>
                  <span>
                    <strong>{testimonial.name}</strong>
                    <em>{testimonial.title}</em>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="ai-faq" id="faq">
        <div className="ai-container ai-faq-container">
          <div className="ai-section-head" data-reveal>
            <p className="ai-eyebrow">
              <Spark className="ai-eyebrow-spark" /> Questions
            </p>
            <h2>
              Fair questions about <span className="ai-accent">AI accounting</span>
            </h2>
          </div>

          <div className="ai-faq-list" data-reveal>
            {faqs.map((faq, index) => (
              <div key={faq.question} className={`ai-faq-item ${openFaq === index ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="ai-faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  {faq.question}
                  <FiChevronDown aria-hidden="true" />
                </button>
                <div className="ai-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      {/* "Pricing" in the shared nav lands here — quotes happen on the call */}
      <span id="pricing" />
      <section className="ai-cta" id="consultation">
        <div className="ai-container">
          <div className="ai-cta-grid">
            <div className="ai-cta-copy" data-reveal>
              <Spark className="ai-cta-spark" />
              <h2>
                See your books run
                <br />
                the <span className="ai-accent">AI-native</span> way.
              </h2>
              <p>
                A 30-minute call with our team. We&rsquo;ll look at your current setup, show you
                the live dashboard, and quote against what you pay today. No obligation.
              </p>
              <ul className="ai-cta-points">
                <li>
                  <FiCheckCircle aria-hidden="true" /> Pay only if satisfied
                </li>
                <li>
                  <FiCheckCircle aria-hidden="true" /> Dedicated accountant + AI agents
                </li>
                <li>
                  <FiCheckCircle aria-hidden="true" /> Onboarded within 45 days
                </li>
              </ul>
              <a
                href={buildWhatsAppUrl(WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-cta-whatsapp"
                onClick={() => trackWhatsAppClick('ai_landing_footer')}
              >
                Prefer chat? Message us on WhatsApp <FiArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="ai-cta-form-card" data-reveal>
              <h3>Get your free consultation</h3>
              <p>Tell us where your books stand — we&rsquo;ll take it from there.</p>
              <ZohoConsultationForm formId="ai-consultation-form" />
              <p className="ai-form-privacy">
                Your data is secure and will never be shared.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIAccountingLanding;
