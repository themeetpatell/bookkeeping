import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import {
  FiCheck,
  FiX,
  FiArrowRight,
  FiChevronDown,
  FiFileText,
  FiPercent,
  FiBookOpen,
  FiBarChart2,
  FiClipboard,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi';
import Seo from '../components/Seo';
import FtaStamp from '../components/FtaStamp';
import Testimonials from '../components/Testimonials';
import ReviewedBy from '../components/ReviewedBy';
import ZohoConsultationForm from '../components/ZohoConsultationForm';
import clientLogos from '../data/clientLogos';
import { canonicalUrl } from '../utils/site';
import { getBookingPath } from '../utils/booking';
import { getLeadSourceForChannel } from '../utils/zohoForms';
import { LEAD_FORM_ID, adGroupLandings } from '../content/adGroupLandings';
import './AdGroupLanding.css';

/**
 * One layout, seven Bookkeeping_UAE_Search ad-group pages. Every word, number
 * and section on a page comes from its entry in src/content/adGroupLandings.js;
 * this file only knows how to draw each section type, plus a hero composition
 * per page (`heroVariant`) so no two pages share a hero.
 *
 * Mobile first: one column until 900px. No hero photography: the hero visuals
 * are HTML and CSS, so nothing heavy competes with the H1 on a throttled
 * phone connection. One primary CTA above the fold; the sticky bar on phones
 * repeats that same action and nothing else.
 */

/* ---------------------------------------------------------------- heroes */

const HeroAccountantCard = () => (
  <div className="agl-visual agl-visual-card" aria-hidden="true">
    <div className="agl-vc-head">
      <span className="agl-vc-avatar">
        <FiUser />
      </span>
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

const HeroCostScale = () => (
  <div className="agl-visual agl-visual-scale" aria-hidden="true">
    <div className="agl-vs-row">
      <span className="agl-vs-label">Full-time hire</span>
      <span className="agl-vs-bar agl-vs-bar-long">
        <i>Salary</i><i>Visa</i><i>Benefits</i><i>Desk</i>
      </span>
    </div>
    <div className="agl-vs-row">
      <span className="agl-vs-label">Remote Finanshels</span>
      <span className="agl-vs-bar agl-vs-bar-short">
        <i>One monthly fee</i>
      </span>
    </div>
  </div>
);

const BACKLOG_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const HeroBacklogTimeline = () => (
  <div className="agl-visual agl-visual-timeline" aria-hidden="true">
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

const HeroFunctionStack = () => (
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
const HeroServiceTiles = () => (
  <div className="agl-visual agl-visual-tiles" aria-hidden="true">
    <div className="agl-vt-tiles">
      {SERVICE_TILES.map(({ icon: Icon, label }) => (
        <span key={label} className="agl-vt-tile">
          <Icon />
          {label}
        </span>
      ))}
    </div>
    <div className="agl-vt-chips">
      <span>Dubai</span>
      <span>Abu Dhabi</span>
      <span>Sharjah</span>
    </div>
  </div>
);

const HeroFirmCredentials = () => (
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

const HeroMerge = () => (
  <div className="agl-visual agl-visual-merge" aria-hidden="true">
    <span className="agl-vm-doc is-old">Bookkeeping invoice</span>
    <span className="agl-vm-doc is-old">Compliance invoice</span>
    <span className="agl-vm-doc is-new">
      <FiCheck /> One invoice
    </span>
  </div>
);

const HERO_VISUALS = {
  'accountant-card': HeroAccountantCard,
  'cost-scale': HeroCostScale,
  'backlog-timeline': HeroBacklogTimeline,
  'function-stack': HeroFunctionStack,
  'service-tiles': HeroServiceTiles,
  'firm-credentials': HeroFirmCredentials,
  merge: HeroMerge,
};

/* -------------------------------------------------------------- sections */

const SectionHeader = ({ eyebrow, title, copy }) => (
  <header className="agl-section-head">
    {eyebrow ? <p className="agl-eyebrow">{eyebrow}</p> : null}
    <h2 className="agl-h2">{title}</h2>
    {copy ? <p className="agl-section-copy">{copy}</p> : null}
  </header>
);

const CompareSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
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
  </>
);

/* Stacks into labelled cards under 700px rather than scrolling sideways. */
const TableSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className="agl-table" role="table" aria-label={section.title}>
      <div className="agl-table-row agl-table-head" role="row">
        {section.columns.map((column, index) => (
          <span key={column || index} role="columnheader" className={index === section.columns.length - 1 ? 'is-us' : ''}>
            {column}
          </span>
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
  </>
);

const StepsSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <ol className={section.variant === 'timeline' ? 'agl-steps is-timeline' : 'agl-steps'}>
      {section.steps.map((step, index) => (
        <li key={step.title} className="agl-step">
          <span className="agl-step-num" aria-hidden="true">{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </li>
      ))}
    </ol>
  </>
);

const CardsSection = ({ section, className }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className={`agl-cards ${className}`}>
      {section.items.map((item) => (
        <article key={item.title} className="agl-card">
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </article>
      ))}
    </div>
  </>
);

const PriceStatementSection = ({ section }) => (
  <div className="agl-price-statement">
    <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.lead} />
    <ul className="agl-ticks">
      {section.points.map((point) => (
        <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
      ))}
    </ul>
  </div>
);

const PlansSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
    <div className="agl-plans">
      {section.plans.map((plan) => (
        <article key={plan.name} className={plan.featured ? 'agl-plan is-featured' : 'agl-plan'}>
          <h3>{plan.name}</h3>
          <p className="agl-plan-price">
            {plan.price}
            <small>{plan.period}</small>
          </p>
          <p className="agl-plan-fit">{plan.fit}</p>
          <ul className="agl-ticks">
            {plan.points.map((point) => (
              <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </>
);

const PlanRowsSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
    <ul className="agl-plan-rows">
      {section.rows.map((row) => (
        <li key={row.name}>
          <strong>{row.name}</strong>
          <span>{row.fit}</span>
          <em>{row.price}</em>
        </li>
      ))}
    </ul>
  </>
);

const PenaltiesSection = ({ section, footnoteNumber }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} copy={section.copy} />
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

const BeforeAfterSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className="agl-compare">
      <div className="agl-compare-col is-old">
        <h3>Before</h3>
        <ul>
          {section.before.map((line) => (
            <li key={line}><FiX aria-hidden="true" /> {line}</li>
          ))}
        </ul>
      </div>
      <div className="agl-compare-col is-new">
        <h3>After</h3>
        <ul>
          {section.after.map((line) => (
            <li key={line}><FiCheck aria-hidden="true" /> {line}</li>
          ))}
        </ul>
      </div>
    </div>
  </>
);

const ScopeSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <ul className="agl-scope">
      {section.rows.map((row) => (
        <li key={row.label}>
          <span className="agl-scope-box" aria-hidden="true"><FiCheck /></span>
          <strong>{row.label}</strong>
          <span>{row.copy}</span>
        </li>
      ))}
    </ul>
  </>
);

const LogosSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className="agl-logos">
      {clientLogos.slice(0, section.count).map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={`${logo.alt} logo`}
          width="120"
          height="40"
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  </>
);

const ServiceGridSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className="agl-service-grid">
      {section.items.map((item) => (
        <article key={item.title} className="agl-service">
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
  </>
);

const FaqSection = ({ section }) => {
  const [open, setOpen] = useState(null);
  return (
    <>
      <SectionHeader eyebrow={section.eyebrow} title={section.title} />
      <div className="agl-faq">
        {section.items.map((item, index) => (
          <div key={item.q} className={open === index ? 'agl-faq-item is-open' : 'agl-faq-item'}>
            <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
              <span>{item.q}</span>
              <FiChevronDown aria-hidden="true" />
            </button>
            {open === index ? <p>{item.a}</p> : null}
          </div>
        ))}
      </div>
    </>
  );
};

const TeamSection = ({ section }) => (
  <>
    <SectionHeader eyebrow={section.eyebrow} title={section.title} />
    <div className="agl-team">
      {section.people.map((person) => (
        <div key={person.name} className="agl-team-member">
          <ReviewedBy name={person.name} role={person.role} photo={person.photo} />
          <p className="agl-team-focus">Leads: {person.focus}</p>
        </div>
      ))}
    </div>
  </>
);

const ExplainerSection = ({ section }) => (
  <div className="agl-explainer">
    <div>
      <SectionHeader eyebrow={section.eyebrow} title={section.title} />
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="agl-section-copy">{paragraph}</p>
      ))}
    </div>
    <ul className="agl-ticks agl-explainer-scope">
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
  const [ctaTargetOnScreen, setCtaTargetOnScreen] = useState(false);

  const ctaTargetId = page.cta.kind === 'booking' ? LEAD_FORM_ID : page.cta.target;
  const bookingPath = getBookingPath(pathname);

  /* The phone sticky bar hides while its own destination is on screen, so it
     never sits on top of the form's submit button. */
  useEffect(() => {
    const target = document.getElementById(ctaTargetId);
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaTargetOnScreen(entry.isIntersecting),
      { rootMargin: '-10% 0px -10% 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [ctaTargetId]);

  const trackCta = (location) =>
    posthog?.capture('adgroup_cta_clicked', { location, page_path: page.path, cta: page.cta.label });

  const scrollToTarget = (event, location) => {
    event.preventDefault();
    trackCta(location);
    document.getElementById(page.cta.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const ctaClass = page.cta.color === 'blue' ? 'agl-btn agl-btn-blue' : 'agl-btn agl-btn-orange';

  const renderCta = (location, className = ctaClass) =>
    page.cta.kind === 'booking' ? (
      <Link to={bookingPath} className={className} onClick={() => trackCta(location)}>
        {page.cta.label}
      </Link>
    ) : (
      <a href={`#${page.cta.target}`} className={className} onClick={(event) => scrollToTarget(event, location)}>
        {page.cta.label}
      </a>
    );

  const footnoteNumber = (id) => page.footnotes.findIndex((note) => note.id === id) + 1;

  const renderSection = (section) => {
    switch (section.type) {
      case 'compare': return <CompareSection section={section} />;
      case 'table': return <TableSection section={section} />;
      case 'steps': return <StepsSection section={section} />;
      case 'credentials': return <CardsSection section={section} className="is-credentials" />;
      case 'trust': return <CardsSection section={section} className="is-trust" />;
      case 'priceStatement': return <PriceStatementSection section={section} />;
      case 'plans': return <PlansSection section={section} />;
      case 'planRows': return <PlanRowsSection section={section} />;
      case 'penalties': return <PenaltiesSection section={section} footnoteNumber={footnoteNumber} />;
      case 'beforeAfter': return <BeforeAfterSection section={section} />;
      case 'scope': return <ScopeSection section={section} />;
      case 'logos': return <LogosSection section={section} />;
      case 'serviceGrid': return <ServiceGridSection section={section} />;
      case 'faq': return <FaqSection section={section} />;
      case 'team': return <TeamSection section={section} />;
      case 'explainer': return <ExplainerSection section={section} />;
      default: return null;
    }
  };

  const HeroVisual = HERO_VISUALS[page.heroVariant];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'Finanshels',
    url: canonicalUrl(page.path),
    description: page.seoDescription,
    areaServed: 'AE',
    telephone: '+971521549572',
  };

  return (
    <div className={`agl agl-${pageKey}`}>
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        canonicalPath={page.path}
        jsonLd={jsonLd}
      />

      <section className="agl-hero">
        <div className="agl-wrap agl-hero-grid">
          <div className="agl-hero-copy">
            <p className="agl-eyebrow">{page.eyebrow}</p>
            <h1 className="agl-h1">{page.h1}</h1>
            <p className="agl-subhead">{page.subhead}</p>
            <div className="agl-hero-cta">
              {renderCta('hero')}
              <p className="agl-microcopy">{page.cta.microcopy}</p>
            </div>
            <ul className="agl-proof">
              {page.proof.map((point) => (
                <li key={point.label}>
                  <strong>{point.value}</strong>
                  <span>{point.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {HeroVisual ? <HeroVisual /> : null}
        </div>
      </section>

      {page.sections.map((section, index) =>
        section.type === 'reviews' ? (
          <div key={section.id} className="agl-reviews">
            <Testimonials />
          </div>
        ) : (
          <section
            key={section.id}
            id={section.id}
            className={index % 2 === 0 ? 'agl-section' : 'agl-section is-tinted'}
          >
            <div className="agl-wrap">{renderSection(section)}</div>
          </section>
        ),
      )}

      <section className="agl-section agl-final" id={`${LEAD_FORM_ID}-section`}>
        <div className="agl-wrap agl-final-grid">
          <div>
            <p className="agl-eyebrow">{page.form.eyebrow}</p>
            <h2 className="agl-h2">{page.form.title}</h2>
            <p className="agl-section-copy">{page.form.copy}</p>
            <p className="agl-agency">FTA Registered Tax Agency, Agency Registration No. 30022628</p>
          </div>
          <div className="hero-form-card agl-form-card" id={LEAD_FORM_ID}>
            <FtaStamp />
            <ZohoConsultationForm
              formId={`${pageKey}-form`}
              title={page.form.formTitle}
              subtitle={page.form.formSubtitle}
              leadSource={getLeadSourceForChannel('google')}
            />
          </div>
        </div>
      </section>

      {page.footnotes.length ? (
        <section className="agl-footnotes" aria-label="Sources">
          <div className="agl-wrap">
            <h2>Sources</h2>
            <ol>
              {page.footnotes.map((note) => (
                <li key={note.id} id={`fn-${note.id}`}>
                  {note.text}{' '}
                  <a href={note.url} target="_blank" rel="noopener noreferrer">
                    {note.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <div className={ctaTargetOnScreen ? 'agl-sticky is-hidden' : 'agl-sticky'} hidden={ctaTargetOnScreen}>
        {renderCta('sticky_mobile', `${ctaClass} agl-btn-block`)}
      </div>
    </div>
  );
};

export default AdGroupLanding;
