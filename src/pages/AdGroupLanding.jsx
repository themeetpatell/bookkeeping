import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClipboard,
  FiClock,
  FiCloud,
  FiCreditCard,
  FiFileText,
  FiMessageCircle,
  FiPercent,
  FiSearch,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import Seo from '../components/Seo';
import FtaStamp from '../components/FtaStamp';
import Testimonials from '../components/Testimonials';
import ReviewedBy from '../components/ReviewedBy';
import ZohoConsultationForm from '../components/ZohoConsultationForm';
import clientLogos from '../data/clientLogos';
import { canonicalUrl } from '../utils/site';
import { getBookingPath } from '../utils/booking';
import { buildWhatsAppUrl } from '../utils/whatsapp';
import { getLeadSourceForChannel } from '../utils/zohoForms';
import {
  FINAL_FORM_ID,
  HERO_FORM_ID,
  adGroupLandings,
  pricingPlans,
} from '../content/adGroupLandings';
/* Built on the /bookkeeping design system (the campaign's source page), so
   these pages share its hero, form card, logo row, comparison, how-it-works,
   pricing, testimonials, FAQ and final CTA styling. AdGroupLanding.css only
   adds what the brief's own sections and the per-page visuals need. */
import './BookkeepingLanding.css';
import './AdGroupLanding.css';

/**
 * One layout, seven Bookkeeping_UAE_Search ad-group pages. Every word and
 * number comes from src/content/adGroupLandings.js.
 *
 * Page order: hero with the lead form (first fold) and client logos, problem,
 * solution, in-house vs Finanshels comparison, the brief's sections, how it
 * works, pricing packages, testimonials, FAQ, lead form again (last fold).
 * WhatsApp is in the hero, on every pricing card and in the phone sticky bar.
 */

const ICONS = {
  alert: FiAlertTriangle,
  book: FiBookOpen,
  chart: FiBarChart2,
  chat: FiMessageCircle,
  check: FiCheckCircle,
  clipboard: FiClipboard,
  clock: FiClock,
  cloud: FiCloud,
  file: FiFileText,
  percent: FiPercent,
  search: FiSearch,
  shield: FiShield,
  star: FiStar,
  trend: FiTrendingUp,
  user: FiUser,
  users: FiUsers,
  wallet: FiCreditCard,
};

const Icon = ({ name }) => {
  const Component = ICONS[name] || FiCheckCircle;
  return <Component aria-hidden="true" />;
};

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="agl-wa-glyph">
    <path
      fill="currentColor"
      d="M12.04 2c-5.46 0-9.910 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.42 1.31-1.95 1.35-.5.04-.95.22-3.2-.67-2.7-1.06-4.42-3.82-4.56-4-.13-.18-1.1-1.46-1.1-2.78 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.34-.22.57-.13.24.09 1.5.71 1.76.84.26.13.43.2.49.31.07.11.07.63-.17 1.31Z"
    />
  </svg>
);

/* ---------------------------------------------------------- page visuals */

const VisualAccountantCard = () => (
  <div className="agl-visual" aria-hidden="true">
    <div className="agl-vc-head">
      <span className="agl-vc-avatar"><FiUser /></span>
      <span>
        <strong>Your accountant</strong>
        <small>Chartered Accountant, assigned to you</small>
      </span>
    </div>
    <ul className="agl-vc-list">
      <li><FiCheck /> Books reconciled</li>
      <li><FiCheck /> VAT return prepared</li>
      <li><FiCheck /> Corporate tax on track</li>
      <li><FiCheck /> CA review signed off</li>
    </ul>
    <p className="agl-vc-foot">This month: closed</p>
  </div>
);

const VisualCostScale = () => (
  <div className="agl-visual agl-visual-scale" aria-hidden="true">
    <div className="agl-vs-row">
      <span className="agl-vs-label">Full-time hire</span>
      <span className="agl-vs-bar agl-vs-bar-long">
        <i>Salary</i><i>Visa</i><i>Benefits</i><i>Desk</i>
      </span>
    </div>
    <div className="agl-vs-row">
      <span className="agl-vs-label">Remote Finanshels</span>
      <span className="agl-vs-bar agl-vs-bar-short"><i>One monthly fee</i></span>
    </div>
  </div>
);

const BACKLOG_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const VisualBacklogTimeline = () => (
  <div className="agl-visual" aria-hidden="true">
    <p className="agl-vt-title">Your books, month by month</p>
    <div className="agl-vt-grid">
      {BACKLOG_MONTHS.map((month, index) => (
        <span key={month} className={index < 6 ? 'agl-vt-cell is-behind' : 'agl-vt-cell is-current'}>
          {month}
        </span>
      ))}
    </div>
    <div className="agl-vt-legend">
      <span><i className="is-behind" /> Behind</span>
      <span><i className="is-current" /> Caught up</span>
    </div>
  </div>
);

const VisualFunctionStack = () => (
  <div className="agl-visual agl-visual-stack" aria-hidden="true">
    <div className="agl-vk-vendors">
      <span>Bookkeeper</span>
      <span>Tax consultant</span>
      <span>Reporting</span>
    </div>
    <FiArrowRight className="agl-vk-arrow" />
    <div className="agl-vk-one">
      <strong>Finanshels</strong>
      <small>One accounting function</small>
    </div>
  </div>
);

const SERVICE_TILES = [
  { icon: FiBookOpen, label: 'Bookkeeping' },
  { icon: FiPercent, label: 'VAT' },
  { icon: FiFileText, label: 'Corporate Tax' },
  { icon: FiClipboard, label: 'Audit prep' },
  { icon: FiTrendingUp, label: 'CFO' },
  { icon: FiBarChart2, label: 'Dashboard' },
];
const VisualServiceTiles = () => (
  <div className="agl-visual" aria-hidden="true">
    <div className="agl-vt-tiles">
      {SERVICE_TILES.map(({ icon: TileIcon, label }) => (
        <span key={label} className="agl-vt-tile"><TileIcon />{label}</span>
      ))}
    </div>
    <div className="agl-vt-chips">
      <span>Dubai</span>
      <span>Abu Dhabi</span>
      <span>Sharjah</span>
    </div>
  </div>
);

const VisualFirmCredentials = () => (
  <div className="agl-visual agl-visual-firm" aria-hidden="true">
    <p className="agl-vf-seal">
      <small>FTA Registered Tax Agency</small>
      <strong>No. 30022628</strong>
    </p>
    <ul className="agl-vf-team">
      <li><span>GS</span> Tax</li>
      <li><span>SK</span> Audit</li>
      <li><span>KN</span> AML</li>
    </ul>
  </div>
);

const VisualMerge = () => (
  <div className="agl-visual agl-visual-merge" aria-hidden="true">
    <span className="agl-vm-doc is-old">Bookkeeping invoice</span>
    <span className="agl-vm-doc is-old">Compliance invoice</span>
    <span className="agl-vm-doc is-new"><FiCheck /> One invoice</span>
  </div>
);

const VISUALS = {
  'accountant-card': VisualAccountantCard,
  'cost-scale': VisualCostScale,
  'backlog-timeline': VisualBacklogTimeline,
  'function-stack': VisualFunctionStack,
  'service-tiles': VisualServiceTiles,
  'firm-credentials': VisualFirmCredentials,
  merge: VisualMerge,
};

/* ------------------------------------------------------ shared fragments */

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="section-header">
    {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
    <h2 className="section-title">{title}</h2>
    {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
  </div>
);

const LeadFormCard = ({ id, formId, title, subtitle, className }) => (
  <div className={className} id={id}>
    <FtaStamp />
    <ZohoConsultationForm
      formId={formId}
      title={title}
      subtitle={subtitle}
      leadSource={getLeadSourceForChannel('google')}
      privacyNote=""
    />
    <p className="form-disclaimer">
      By submitting, you agree to receive communications from Finanshels. Your data is secure and
      will never be shared.
    </p>
    <div className="form-badges">
      <div className="badge-item"><FiCheckCircle className="badge-icon" /><span>Pay Only if Satisfied</span></div>
      <div className="badge-item"><FiCheckCircle className="badge-icon" /><span>No Commitment</span></div>
      <div className="badge-item"><FiCheckCircle className="badge-icon" /><span>24h Response</span></div>
    </div>
  </div>
);

/* ------------------------------------------------- brief-specific blocks */

const CompareBlock = ({ section }) => (
  <div className="agl-compare">
    <div className="agl-compare-col is-old">
      <h3>{section.leftLabel}</h3>
      <ul>
        {section.rows.map(([left]) => (
          <li key={left}><FiX aria-hidden="true" /> {left}</li>
        ))}
      </ul>
    </div>
    <div className="agl-compare-col is-new">
      <h3>{section.rightLabel}</h3>
      <ul>
        {section.rows.map(([, right]) => (
          <li key={right}><FiCheck aria-hidden="true" /> {right}</li>
        ))}
      </ul>
    </div>
  </div>
);

const BeforeAfterBlock = ({ section }) => (
  <CompareBlock
    section={{
      leftLabel: 'Before',
      rightLabel: 'After',
      rows: section.before.map((line, index) => [line, section.after[index]]),
    }}
  />
);

const CardsBlock = ({ items, className }) => (
  <div className={`agl-cards ${className}`}>
    {items.map((item) => (
      <article key={item.title} className="agl-card">
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
      </article>
    ))}
  </div>
);

/* Stacks into labelled cards on phones rather than scrolling sideways. */
const TableBlock = ({ section }) => (
  <div className="agl-table" role="table" aria-label={section.title}>
    <div className="agl-table-row agl-table-head" role="row">
      {section.columns.map((column, index) => (
        <span key={column || index} role="columnheader">{column}</span>
      ))}
    </div>
    {section.rows.map((row) => (
      <div key={row[0]} className="agl-table-row" role="row">
        {row.map((cell, index) => (
          <span
            key={`${row[0]}-${index}`}
            role={index === 0 ? 'rowheader' : 'cell'}
            data-label={index === 0 ? undefined : section.columns[index]}
            className={index === row.length - 1 ? 'is-us' : ''}
          >
            {cell}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const PenaltiesBlock = ({ section, footnoteNumber }) => (
  <>
    <div className="agl-penalties">
      {section.items.map((item) => (
        <article key={item.label} className="agl-penalty">
          <h3>{item.label}</h3>
          <p className="agl-penalty-value">
            {item.value}
            <sup>
              <a href={`#fn-${item.source}`} aria-label={`Source ${footnoteNumber(item.source)}`}>
                [{footnoteNumber(item.source)}]
              </a>
            </sup>
          </p>
          <p className="agl-penalty-detail">{item.detail}</p>
        </article>
      ))}
    </div>
    {section.note ? <p className="agl-note">{section.note}</p> : null}
  </>
);

const ScopeBlock = ({ section }) => (
  <ul className="agl-scope">
    {section.rows.map((row) => (
      <li key={row.label}>
        <span className="agl-scope-box" aria-hidden="true"><FiCheck /></span>
        <strong>{row.label}</strong>
        <span>{row.copy}</span>
      </li>
    ))}
  </ul>
);

const ServiceGridBlock = ({ section }) => (
  <div className="agl-cards agl-service-grid">
    {section.items.map((item) => (
      <article key={item.title} className="agl-card">
        <h3>{item.title}</h3>
        <p>{item.copy}</p>
        {item.href ? (
          <Link to={item.href} className="agl-service-link">
            See {item.title.toLowerCase()} <FiArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </article>
    ))}
  </div>
);

const TeamBlock = ({ section }) => (
  <div className="agl-team">
    {section.people.map((person) => (
      <div key={person.name} className="agl-team-member">
        <ReviewedBy name={person.name} role={person.role} photo={person.photo} />
        <p className="agl-team-focus">Leads: {person.focus}</p>
      </div>
    ))}
  </div>
);

const ExplainerBlock = ({ section }) => (
  <div className="agl-explainer">
    <div>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="agl-body-copy">{paragraph}</p>
      ))}
    </div>
    <ul className="agl-ticks">
      {section.scope.map((item) => (
        <li key={item}><FiCheck aria-hidden="true" /> {item}</li>
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------ page */

const AdGroupLanding = ({ pageKey }) => {
  const page = adGroupLandings[pageKey];
  const posthog = usePostHog();
  const { pathname } = useLocation();
  const [openFaq, setOpenFaq] = useState(null);
  const [formOnScreen, setFormOnScreen] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(page.whatsappMessage);
  const bookingPath = getBookingPath(pathname);

  /* The phone sticky bar hides while either lead form is on screen, so it
     never covers a submit button. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const forms = [HERO_FORM_ID, FINAL_FORM_ID]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setFormOnScreen(visible.size > 0);
      },
      { rootMargin: '-10% 0px -10% 0px' },
    );
    forms.forEach((form) => observer.observe(form));
    return () => observer.disconnect();
  }, []);

  const trackCta = (location) =>
    posthog?.capture('adgroup_cta_clicked', { location, page_path: page.path, cta: page.cta.label });

  const scrollTo = (event, id, location) => {
    event.preventDefault();
    trackCta(location);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ctaClass = page.cta.color === 'blue' ? 'agl-btn agl-btn-blue' : 'agl-btn agl-btn-orange';

  const renderCta = (location, className = ctaClass) =>
    page.cta.kind === 'booking' ? (
      <Link to={bookingPath} className={className} onClick={() => trackCta(location)}>
        {page.cta.label}
      </Link>
    ) : (
      <a
        href={`#${page.cta.target}`}
        className={className}
        onClick={(event) => scrollTo(event, page.cta.target, location)}
      >
        {page.cta.label}
      </a>
    );

  /* No onClick on WhatsApp links: whatsapp_click is fired by the delegated
     listener in LeadEventTracker, which reads data-wa-location. The
     data-wa-track class binds the Gallabox tracker. */
  const whatsappLink = (location, className, children, label) => (
    <a
      href={whatsappUrl}
      className={`${className} data-wa-track`}
      target="_blank"
      rel="noreferrer"
      data-wa-location={location}
      aria-label={label}
    >
      {children}
    </a>
  );

  const footnoteNumber = (id) => page.footnotes.findIndex((note) => note.id === id) + 1;

  const renderBriefSection = (section) => {
    switch (section.type) {
      case 'compare': return <CompareBlock section={section} />;
      case 'beforeAfter': return <BeforeAfterBlock section={section} />;
      case 'credentials': return <CardsBlock items={section.items} className="is-credentials" />;
      case 'trust': return <CardsBlock items={section.items} className="is-trust" />;
      case 'table': return <TableBlock section={section} />;
      case 'penalties': return <PenaltiesBlock section={section} footnoteNumber={footnoteNumber} />;
      case 'scope': return <ScopeBlock section={section} />;
      case 'serviceGrid': return <ServiceGridBlock section={section} />;
      case 'team': return <TeamBlock section={section} />;
      case 'explainer': return <ExplainerBlock section={section} />;
      default: return null;
    }
  };

  const Visual = VISUALS[page.visual];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'Finanshels',
    url: canonicalUrl(page.path),
    image: canonicalUrl('/Dubai.jpg'),
    description: page.seoDescription,
    areaServed: 'AE',
    telephone: '+971521549572',
  };

  return (
    <div className={`new-homepage agl agl-${pageKey}`}>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        canonicalPath={page.path}
        image="/Dubai.jpg"
        jsonLd={jsonLd}
      />

      {/* ------------------------------------------------ first fold */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <p className="agl-hero-eyebrow">{page.eyebrow}</p>
            <h1 className="hero-title agl-hero-title">{page.h1}</h1>
            <p className="hero-description">{page.subhead}</p>

            <ul className="agl-hero-points">
              {page.heroPoints.map((point) => (
                <li key={point}><FiCheckCircle aria-hidden="true" /> {point}</li>
              ))}
            </ul>

            <div className="hero-ctas agl-hero-ctas">
              {renderCta('hero')}
              {whatsappLink('hero', 'agl-btn agl-btn-wa', <><WhatsAppGlyph /> WhatsApp an Accountant</>)}
            </div>

            <div className="hero-stats agl-hero-stats">
              {page.heroStats.map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <LeadFormCard
              id={HERO_FORM_ID}
              formId={`${pageKey}-hero`}
              title={page.heroForm.title}
              subtitle={page.heroForm.subtitle}
              className="consultation-form agl-form-card"
            />
          </div>
        </div>

        <div className="hero-trust-row">
          <p className="trust-label">Trusted by leading UAE businesses</p>
          <div className="logo-list-wide">
            {clientLogos.map((logo) => (
              <div key={logo.alt} className="trust-logo">
                <img
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  className="trust-logo-image"
                  width="120"
                  height="28"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- problem */}
      <section className="problem-section">
        <div className="content-container">
          <SectionHeader {...page.problems} />
          <div className="problem-grid">
            {page.problems.items.map((item) => (
              <div key={item.title} className="problem-card">
                <div className="problem-icon"><Icon name={item.icon} /></div>
                <h3 className="problem-title">{item.title}</h3>
                <p className="problem-description">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- solution */}
      <section className="solution-section" id="services">
        <div className="content-container-large">
          <div className="solution-content">
            <div className="solution-left">
              <p className="section-eyebrow">{page.solution.eyebrow}</p>
              <h2 className="section-title agl-left-title">{page.solution.title}</h2>
              <p className="solution-description">{page.solution.description}</p>
              <div className="solution-features">
                {page.solution.features.map((feature) => (
                  <div key={feature.title} className="solution-feature">
                    <div className="solution-icon"><Icon name={feature.icon} /></div>
                    <div className="solution-text">
                      <h4 className="solution-feature-title">{feature.title}</h4>
                      <p className="solution-feature-description">{feature.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              {whatsappLink('solution', 'agl-btn agl-btn-wa', <><WhatsAppGlyph /> Talk to an Expert on WhatsApp</>)}
            </div>
            <div className="solution-right">{Visual ? <Visual /> : null}</div>
          </div>
        </div>
      </section>

      {/* ------------------------------------- in-house vs outsourced */}
      <section className="comparison-section" id="comparison">
        <div className="content-container">
          <SectionHeader {...page.comparison} />
          <div className="comparison-card">
            <div className="comparison-headings">
              <div className="comparison-heading before-heading">
                <FiAlertTriangle className="comparison-icon" />
                <span>{page.comparison.beforeLabel}</span>
              </div>
              <div className="comparison-heading after-heading">
                <FiCheckCircle className="comparison-icon" />
                <span>{page.comparison.afterLabel}</span>
              </div>
            </div>
            <div className="comparison-rows">
              {page.comparison.rows.map(([before, after]) => (
                <div key={before} className="comparison-row">
                  <div className="comparison-cell before">{before}</div>
                  <div className="comparison-cell after">{after}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="comparison-mobile">
            {page.comparison.rows.map(([before, after]) => (
              <div key={before} className="comparison-mobile-card">
                <div className="mobile-col">
                  <div className="mobile-col-heading">
                    <FiAlertTriangle className="comparison-icon" />
                    <span>{page.comparison.beforeLabel}</span>
                  </div>
                  <p className="mobile-col-text">{before}</p>
                </div>
                <div className="mobile-divider"><span>vs</span></div>
                <div className="mobile-col">
                  <div className="mobile-col-heading after">
                    <FiCheckCircle className="comparison-icon" />
                    <span>{page.comparison.afterLabel}</span>
                  </div>
                  <p className="mobile-col-text after-text">{after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- brief's sections */}
      {page.sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={index % 2 === 0 ? 'agl-section' : 'agl-section is-alt'}
        >
          <div className="content-container">
            <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
            {renderBriefSection(section)}
          </div>
        </section>
      ))}

      {/* ------------------------------------------------ how it works */}
      <section className="how-it-works-section">
        <div className="content-container">
          <SectionHeader eyebrow={page.steps.eyebrow} title={page.steps.title} subtitle={page.steps.subtitle} />
          <div className="how-table">
            <div className="how-header">
              <div className="how-heading">Stage</div>
              <div className="how-heading">Timeline</div>
              <div className="how-heading">What Happens</div>
            </div>
            {page.steps.items.map((step) => (
              <div key={step.stage} className="how-row">
                <div className="how-cell"><div className="how-stage">{step.stage}</div></div>
                <div className="how-cell"><span className="timeline-pill">{step.timeline}</span></div>
                <div className="how-cell"><p className="how-description">{step.copy}</p></div>
              </div>
            ))}
          </div>
          <div className="how-mobile-cards">
            {page.steps.items.map((step) => (
              <div key={step.stage} className="how-card">
                <div className="how-card-top">
                  <div className="how-card-stage">{step.stage}</div>
                  <span className="timeline-pill">{step.timeline}</span>
                </div>
                <p className="how-card-description">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- pricing */}
      <section className="pricing-section" id="pricing">
        <div className="content-container">
          <SectionHeader eyebrow={page.pricing.eyebrow} title={page.pricing.title} subtitle={page.pricing.subtitle} />

          <div className="pricing-banner">
            <strong>Pay Only if Satisfied. No Commitment.</strong>
            <p>Only pay if you are satisfied. No questions asked.</p>
          </div>

          {page.pricing.offer ? (
            <div className="agl-offer">
              <div className="pricing-card popular agl-offer-card">
                <div className="popular-badge">Fixed Quote</div>
                <div className="pricing-header">
                  <h3 className="plan-name">{page.pricing.offer.name}</h3>
                  <p className="plan-subtitle">{page.pricing.offer.note}</p>
                </div>
                <div className="pricing-price">
                  <span className="currency">{page.pricing.offer.prefix}</span>
                  <span className="amount">{page.pricing.offer.price}</span>
                </div>
                <ul className="plan-features">
                  {page.pricing.offer.features.map((feature) => (
                    <li key={feature}><FiCheckCircle className="check-icon" /><span>{feature}</span></li>
                  ))}
                </ul>
                <a
                  href={`#${HERO_FORM_ID}`}
                  className="btn-plan btn-plan-popular"
                  onClick={(event) => scrollTo(event, HERO_FORM_ID, 'offer_card')}
                >
                  Get My Fixed Quote
                </a>
              </div>
              <p className="agl-offer-then">Then stay current with a monthly plan:</p>
            </div>
          ) : null}

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular ? <div className="popular-badge">Most Popular</div> : null}
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-subtitle">{plan.subtitle}</p>
                </div>
                <div className="pricing-price">
                  <span className="currency">AED </span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/mo</span>
                </div>
                <p className="plan-transactions">{plan.transactions}</p>
                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}><FiCheckCircle className="check-icon" /><span>{feature}</span></li>
                  ))}
                </ul>
                {whatsappLink(
                  `pricing_${plan.name.toLowerCase()}`,
                  `btn-plan ${plan.popular ? 'btn-plan-popular' : ''}`,
                  'Get Started',
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ testimonials */}
      <Testimonials />

      {/* --------------------------------------------------------- FAQ */}
      <section className="faq-section" id="faq">
        <div className="content-container-small">
          <SectionHeader eyebrow="FAQ" title="Common Questions" />
          <div className="faq-list">
            {page.faqs.map((faq, index) => (
              <div key={faq.q} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <FiChevronDown className={`faq-icon ${openFaq === index ? 'rotated' : ''}`} />
                </button>
                {openFaq === index ? (
                  <div className="faq-answer"><p>{faq.a}</p></div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- last fold */}
      <section className="final-cta-section" id="consultation">
        <div className="final-cta-container">
          <div className="final-cta-left">
            <p className="section-eyebrow">{page.final.eyebrow}</p>
            <h2 className="cta-title">{page.final.title}</h2>
            <p className="cta-description">{page.final.description}</p>
            <div className="cta-steps">
              {page.final.steps.map((step, index) => (
                <div key={step} className="cta-step">
                  <div className="step-number">{index + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            {whatsappLink('final', 'agl-btn agl-btn-wa agl-final-wa', <><WhatsAppGlyph /> Prefer WhatsApp? Message us</>)}
          </div>
          <div className="final-cta-right">
            <LeadFormCard
              id={FINAL_FORM_ID}
              formId={`${pageKey}-final`}
              title={page.heroForm.title}
              subtitle={page.heroForm.subtitle}
              className="final-consultation-form agl-form-card"
            />
          </div>
        </div>
      </section>

      {page.footnotes.length ? (
        <section className="agl-footnotes" aria-label="Sources">
          <div className="content-container">
            <h2>Sources</h2>
            <ol>
              {page.footnotes.map((note) => (
                <li key={note.id} id={`fn-${note.id}`}>
                  {note.text}{' '}
                  <a href={note.url} target="_blank" rel="noopener noreferrer">{note.label}</a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Phone sticky bar: the page's one primary action plus WhatsApp. */}
      <div className={formOnScreen ? 'agl-sticky is-hidden' : 'agl-sticky'} hidden={formOnScreen}>
        {renderCta('sticky_mobile', `${ctaClass} agl-sticky-primary`)}
        {whatsappLink('sticky_mobile', 'agl-sticky-wa', <WhatsAppGlyph />, 'WhatsApp an accountant')}
      </div>
    </div>
  );
};

export default AdGroupLanding;
