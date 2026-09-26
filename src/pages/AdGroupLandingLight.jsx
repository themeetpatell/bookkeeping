import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePostHog } from '@posthog/react';
import { FiArrowRight, FiCheck, FiChevronDown, FiStar, FiX } from 'react-icons/fi';
import Seo from '../components/Seo';
import ZohoConsultationForm from '../components/ZohoConsultationForm';
import { canonicalUrl } from '../utils/site';
import { getBookingPath } from '../utils/booking';
import { adGroupMessage, adGroupOfferMessage, buildWhatsAppUrl } from '../utils/whatsapp';
import { getLeadSourceForChannel } from '../utils/zohoForms';
import { FINAL_FORM_ID, HERO_FORM_ID, adGroupLandings } from '../content/adGroupLandings';
import {
  defaultAnnualOffer,
  featuredLogos,
  lightPages,
  plans,
  specialists,
  testimonialPool,
} from '../content/adGroupLight';
import './AdGroupLandingLight.css';

/**
 * Light, conversion-first layout for the seven Bookkeeping_UAE_Search
 * ad-group pages. Copy comes from src/content/adGroupLandings.js; logos,
 * trimmed pricing, testimonials and the per-page feature photo come from
 * src/content/adGroupLight.js (see its header for the evidence).
 *
 * Rules this layout follows:
 * - White page, navy text; orange is used on the primary CTA only, on every
 *   page. One high-contrast action colour, repeated, outperforms a mix: a
 *   second button colour reads as a second, competing action (2026-09-26).
 * - Nothing that looks like a button unless it is one. Credentials, rating and
 *   the offer are plain text.
 * - One goal: a call with an accountant. The same label is repeated; the form
 *   appears in the first and last fold with a specific submit label.
 * - Fixed order: hero, logos, pains, what you get (photo), comparison, the
 *   brief's own sections, how it works, pricing, testimonials, FAQ, sources,
 *   form.
 */

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="agll-wa-glyph">
    <path
      fill="currentColor"
      d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.02c-.24.68-1.42 1.31-1.95 1.35-.5.04-.95.22-3.2-.67-2.7-1.06-4.42-3.82-4.56-4-.13-.18-1.1-1.46-1.1-2.78 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34.18 0 .36 0 .52.01.17.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.13.12.29.02.47-.09.18-.14.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.54.15.27.66 1.09 1.42 1.76.97.87 1.79 1.13 2.05 1.26.26.13.41.11.56-.07.15-.18.65-.76.82-1.02.17-.27.34-.22.57-.13.24.09 1.5.71 1.76.84.26.13.43.2.49.31.07.11.07.63-.17 1.31Z"
    />
  </svg>
);

const Stars = () => (
  <span className="agll-stars" aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <FiStar key={i} />
    ))}
  </span>
);

const LeadForm = ({ id, formId, title, subtitle }) => (
  <div className="agll-form-card" id={id}>
    <ZohoConsultationForm
      formId={formId}
      title={title}
      subtitle={subtitle}
      leadSource={getLeadSourceForChannel('google')}
      submitLabel="Request My Call Back"
      privacyNote="No commitment. We reply within 24 hours. Your data is never shared."
    />
  </div>
);

const Credential = () => (
  <p className="agll-credential">
    <img src="/fta-logo.png" alt="" width="54" height="24" loading="lazy" decoding="async" />
    FTA Registered Tax Agency, Agency Registration No. 30022628
  </p>
);

const initials = (name) =>
  name
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

// 'team' is rendered separately, on every page, with real headshots.
const BRIEF_SECTION_TYPES = ['penalties', 'beforeAfter', 'scope', 'serviceGrid', 'table', 'explainer'];

const AdGroupLandingLight = ({ pageKey }) => {
  const page = adGroupLandings[pageKey];
  const light = lightPages[pageKey];
  const posthog = usePostHog();
  const { pathname } = useLocation();
  const [openFaq, setOpenFaq] = useState(0);
  const [formOnScreen, setFormOnScreen] = useState(false);

  // Every WhatsApp message names the ad group, e.g. "Hi, I saw your Google
  // ad about hire-accountant and would like to learn more."
  const whatsappUrl = buildWhatsAppUrl(adGroupMessage(pageKey));
  const bookingPath = getBookingPath(pathname);

  const pains = light.pains || page.problems.items.slice(0, 3);
  const benefits = light.benefits || page.solution.features;
  const testimonials = light.testimonials.map((key) => testimonialPool[key]).filter(Boolean);
  const annualOffer = page.annualOffer || (light.annualOffer ? defaultAnnualOffer : null);
  const footnotes = page.footnotes || [];
  const footnoteNumber = (id) => footnotes.findIndex((note) => note.id === id) + 1;
  const briefSections = (page.sections || []).filter((section) => BRIEF_SECTION_TYPES.includes(section.type));
  const briefTeam = (page.sections || []).find((section) => section.type === 'team');
  const teamTitle = briefTeam?.title || 'The Specialists Behind Your Books';
  const teamSubtitle =
    briefTeam?.subtitle ||
    'Qualified accountants and tax specialists work on your file, not an anonymous back office.';

  // The phone sticky bar steps aside while either form is on screen.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
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
    [HERO_FORM_ID, FINAL_FORM_ID]
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pageKey]);

  const trackCta = (location) =>
    posthog?.capture('adgroup_cta_clicked', { location, page_path: page.path, cta: page.cta.label });

  const ctaTone = 'agll-btn-primary';

  /* The brief sets one primary CTA per page: a booking call, or a jump to a
     section of the page (plans, the form, the service menu). */
  const primaryCta = (location, extraClass = '') => {
    const className = `agll-btn ${ctaTone} ${extraClass}`.trim();
    if (page.cta.kind === 'anchor' && page.cta.target) {
      return (
        <a
          href={`#${page.cta.target}`}
          className={className}
          onClick={(event) => {
            trackCta(location);
            const target = document.getElementById(page.cta.target);
            if (target) {
              event.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          {page.cta.label}
        </a>
      );
    }
    return (
      <Link to={bookingPath} className={className} onClick={() => trackCta(location)}>
        {page.cta.label}
      </Link>
    );
  };

  /* whatsapp_click is fired by the delegated listener in LeadEventTracker from
     data-wa-location; the data-wa-track class binds the Gallabox tracker. */
  const whatsappLink = (location, className, children, href = whatsappUrl, label) => (
    <a
      href={href}
      className={`${className} data-wa-track`}
      target="_blank"
      rel="noreferrer"
      data-wa-location={location}
      aria-label={label}
    >
      {children}
    </a>
  );

  const planMessage = (plan) =>
    adGroupMessage(pageKey, `the ${plan.name} plan (AED ${plan.price}/month)`);

  const sourceRef = (id) => {
    const n = footnoteNumber(id);
    if (!n) return null;
    return (
      <sup className="agll-ref">
        <a href={`#fn-${id}`} aria-label={`Source ${n}`}>[{n}]</a>
      </sup>
    );
  };

  const renderSection = (section) => {
    const head = (
      <header className="agll-head">
        <h2 className="agll-h2">{section.title}</h2>
        {section.subtitle ? <p className="agll-sub">{section.subtitle}</p> : null}
      </header>
    );

    switch (section.type) {
      case 'penalties':
        return (
          <div className="agll-wrap">
            {head}
            <div className="agll-facts">
              {section.items.map((item) => (
                <div key={item.label} className="agll-fact">
                  <p className="agll-fact-label">{item.label}</p>
                  <p className="agll-fact-value">
                    {item.value}
                    {sourceRef(item.source)}
                  </p>
                  <p className="agll-fact-detail">{item.detail}</p>
                </div>
              ))}
            </div>
            {section.note ? <p className="agll-fineprint">{section.note}</p> : null}
          </div>
        );
      case 'beforeAfter':
        return (
          <div className="agll-wrap agll-narrow">
            {head}
            <div className="agll-ba">
              <div className="agll-ba-col">
                <h3>Before</h3>
                <ul>
                  {section.before.map((line) => (
                    <li key={line}><FiX aria-hidden="true" className="agll-x" /> {line}</li>
                  ))}
                </ul>
              </div>
              <div className="agll-ba-col is-after">
                <h3>After</h3>
                <ul>
                  {section.after.map((line) => (
                    <li key={line}><FiCheck aria-hidden="true" /> {line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'scope':
        return (
          <div className="agll-wrap agll-narrow">
            {head}
            <ul className="agll-scope">
              {section.rows.map((row) => (
                <li key={row.label}>
                  <span className="agll-tick" aria-hidden="true"><FiCheck /></span>
                  <span>
                    <strong>{row.label}</strong>
                    {row.copy}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'serviceGrid':
        return (
          <div className="agll-wrap">
            {head}
            <div className="agll-services">
              {section.items.map((item) => (
                <div key={item.title} className="agll-service">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  {item.href ? (
                    <Link to={item.href} className="agll-text-link agll-service-link">
                      Learn more <FiArrowRight aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="agll-center">
              <Link to={bookingPath} className="agll-text-link" onClick={() => trackCta('service_menu')}>
                Not sure which you need? Book a free call <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="agll-wrap">
            {head}
            <div className="agll-team">
              {section.people.map((person) => (
                <div key={person.name} className="agll-person">
                  {person.photo ? (
                    <img src={person.photo} alt="" width="88" height="88" loading="lazy" decoding="async" />
                  ) : (
                    <span className="agll-person-initials" aria-hidden="true">{initials(person.name)}</span>
                  )}
                  <h3>{person.name}</h3>
                  <p className="agll-person-role">{person.role}</p>
                  <p>{person.focus}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="agll-wrap agll-narrow">
            {head}
            <div className="agll-table-scroll">
              <table className="agll-table">
                <thead>
                  <tr>
                    {section.columns.map((col, index) => (
                      <th
                        key={col || 'label'}
                        scope="col"
                        className={index === section.columns.length - 1 ? 'is-us' : undefined}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) =>
                        index === 0 ? (
                          <th key={cell} scope="row">{cell}</th>
                        ) : (
                          <td key={`${row[0]}-${index}`} className={index === row.length - 1 ? 'is-us' : undefined}>
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'explainer':
        return (
          <div className="agll-wrap agll-split agll-explainer">
            <div>
              <h2 className="agll-h2">{section.title}</h2>
              {section.paragraphs.map((para) => (
                <p key={para} className="agll-sub agll-sub-left">{para}</p>
              ))}
            </div>
            <ul className="agll-checks agll-explainer-list">
              {section.scope.map((item) => (
                <li key={item}><FiCheck aria-hidden="true" /> {item}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

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
    <div className="agll">
      <Seo
        title={page.seoTitle}
        description={page.seoDescription}
        canonicalPath={page.path}
        jsonLd={jsonLd}
      />

      {/* ------------------------------------------------ first fold */}
      <section className="agll-hero">
        <div className="agll-wrap agll-hero-grid">
          <div className="agll-hero-copy">
            <p className="agll-eyebrow">{page.eyebrow}</p>
            <h1 className="agll-h1">{page.h1}</h1>
            <p className="agll-lead">{page.subhead}</p>

            <ul className="agll-checks">
              {page.heroPoints.map((point) => (
                <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
              ))}
            </ul>

            <div className="agll-cta-row">
              {primaryCta('hero')}
              {whatsappLink('hero', 'agll-text-link', <><WhatsAppGlyph /> or chat on WhatsApp</>)}
            </div>

            <p className="agll-rating">
              <Stars />
              <strong>4.9 on Trustpilot</strong> from 239 reviews
              <span className="agll-dot" aria-hidden="true">&middot;</span>
              7,000+ UAE businesses
              <span className="agll-dot" aria-hidden="true">&middot;</span>
              150+ qualified accountants
            </p>
            <Credential />
          </div>

          <LeadForm
            id={HERO_FORM_ID}
            formId={`${pageKey}-hero`}
            title={page.heroForm.title}
            subtitle={page.heroForm.subtitle}
          />
        </div>
      </section>

      {/* ---------------------------------------------------- logos */}
      <section className="agll-logos" aria-label="Clients">
        <p className="agll-logos-label">Trusted by 7,000+ UAE businesses, including</p>
        <div className="agll-marquee">
          <div className="agll-marquee-track">
            {[...featuredLogos, ...featuredLogos].map((logo, index) => (
              <img
                key={`${logo.alt}-${index}`}
                src={logo.src}
                alt={index < featuredLogos.length ? `${logo.alt} logo` : ''}
                aria-hidden={index >= featuredLogos.length ? 'true' : undefined}
                width="140"
                height="40"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- pains */}
      <section className="agll-section">
        <div className="agll-wrap">
          <header className="agll-head">
            <h2 className="agll-h2">{page.problems.title}</h2>
            <p className="agll-sub">{page.problems.subtitle}</p>
          </header>
          <div className="agll-pains">
            {pains.map((pain, index) => (
              <div key={pain.title} className="agll-pain">
                <span className="agll-pain-num" aria-hidden="true">0{index + 1}</span>
                <h3>{pain.title}</h3>
                <p>{pain.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------ what you get + photo */}
      <section className="agll-section agll-feature" id="services">
        {/* Decorative line pattern behind the photo, as in the reference. */}
        <svg className="agll-feature-lines" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <rect
              key={i}
              x={60 + i * 18}
              y={60 + i * 18}
              width={480 - i * 36}
              height={480 - i * 36}
              rx={240 - i * 18}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          ))}
        </svg>
        <div className="agll-wrap agll-split">
          <div>
            <h2 className="agll-h2">{page.solution.title}</h2>
            <p className="agll-sub agll-sub-left">{page.solution.description}</p>
            <ul className="agll-benefits">
              {benefits.map((benefit) => (
                <li key={benefit.title}>
                  <span className="agll-tick" aria-hidden="true"><FiCheck /></span>
                  <span>
                    <strong>{benefit.title}</strong>
                    {benefit.copy}
                  </span>
                </li>
              ))}
            </ul>
            <div className="agll-feature-cta">{primaryCta('what_you_get')}</div>
          </div>
          {/* A finance professional at work, with two small cards showing what
              working with Finanshels looks like. Licensed stock (Pexels
              License), not a named employee, so the cards describe the service
              rather than the person. Swap in a real team photo at the same path
              when one is available. */}
          <figure className="agll-feature-media" aria-hidden="true">
            <img
              className="agll-feature-photo"
              src={light.photo}
              alt=""
              width="900"
              height="1000"
              loading="lazy"
              decoding="async"
              style={{ objectPosition: light.photoPosition }}
            />
            <div className="agll-mock agll-mock-meeting">
              <span className="agll-mock-date">
                <small>Mon</small>
                <strong>6</strong>
              </span>
              <span className="agll-mock-meeting-copy">
                <strong>{light.meeting.title}</strong>
                <small>{light.meeting.note}</small>
              </span>
            </div>
            <div className="agll-mock agll-mock-message">
              <p className="agll-mock-bar">New message</p>
              <p className="agll-mock-subject">
                <span>Subject:</span> {light.message.subject}
              </p>
              <p className="agll-mock-file">{light.message.file}</p>
              <p className="agll-mock-from">From {light.message.from}</p>
            </div>
          </figure>
        </div>
      </section>

      {/* --------------------------------- in-house vs Finanshels */}
      <section className="agll-section" id="comparison">
        <div className="agll-wrap agll-narrow">
          <header className="agll-head">
            <h2 className="agll-h2">{page.comparison.title}</h2>
            <p className="agll-sub">{page.comparison.subtitle}</p>
          </header>
          <div className="agll-compare" role="table" aria-label={page.comparison.title}>
            <div className="agll-compare-row agll-compare-head" role="row">
              <span role="columnheader">{page.comparison.beforeLabel}</span>
              <span role="columnheader">{page.comparison.afterLabel}</span>
            </div>
            {page.comparison.rows.map(([before, after]) => (
              <div key={before} className="agll-compare-row" role="row">
                <span role="cell" data-label={page.comparison.beforeLabel}>{before}</span>
                <span role="cell" data-label={page.comparison.afterLabel}><FiCheck aria-hidden="true" /> {after}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------- the brief's own sections */}
      {briefSections.map((section) => (
        <section key={section.id} className="agll-section agll-brief" id={section.id}>
          {renderSection(section)}
        </section>
      ))}

      {/* --------------------------------------- named specialists */}
      <section className="agll-section agll-brief" id="team">
        <div className="agll-wrap">
          <header className="agll-head">
            <h2 className="agll-h2">{teamTitle}</h2>
            <p className="agll-sub">{teamSubtitle}</p>
          </header>
          <div className="agll-team">
            {specialists.map((person) => (
              <div key={person.name} className="agll-person">
                <img src={person.photo} alt={person.name} width="88" height="88" loading="lazy" decoding="async" />
                <h3>{person.name}</h3>
                <p className="agll-person-role">{person.role}</p>
                <p>{person.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- how it works */}
      <section className="agll-section agll-alt">
        <div className="agll-wrap">
          <header className="agll-head">
            <h2 className="agll-h2">{page.steps.title}</h2>
            {page.steps.subtitle ? <p className="agll-sub">{page.steps.subtitle}</p> : null}
          </header>
          <ol className="agll-steps" style={{ '--agll-step-cols': page.steps.items.length }}>
            {page.steps.items.map((step, index) => (
              <li key={step.stage}>
                <span className="agll-step-num" aria-hidden="true">{index + 1}</span>
                <p className="agll-step-when">{step.timeline}</p>
                <h3>{step.stage}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
          <div className="agll-center">{primaryCta('steps')}</div>
        </div>
      </section>

      {/* ---------------------------------------------------- pricing */}
      <section className="agll-section" id="pricing">
        <div className="agll-wrap">
          <header className="agll-head">
            <h2 className="agll-h2">{page.pricing.title}</h2>
            <p className="agll-sub">{page.pricing.subtitle}</p>
          </header>

          {page.pricing.offer ? (
            <article className="agll-oneoff">
              <div>
                <h3>{page.pricing.offer.name}</h3>
                <p className="agll-plan-price">
                  <span>{page.pricing.offer.prefix}</span>{page.pricing.offer.price}
                </p>
                <p className="agll-plan-volume">{page.pricing.offer.note}</p>
              </div>
              <ul>
                {page.pricing.offer.features.map((point) => (
                  <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
                ))}
              </ul>
              <div className="agll-oneoff-cta">
                {primaryCta('pricing_offer', 'agll-btn-block')}
                {whatsappLink('pricing_offer', 'agll-text-link', <><WhatsAppGlyph /> Ask on WhatsApp</>)}
              </div>
            </article>
          ) : null}

          {page.pricing.offer ? (
            <p className="agll-plans-label">Once you are current: monthly plans to stay that way</p>
          ) : null}

          {annualOffer ? (
            <p className="agll-offer">
              <strong>{annualOffer.title}.</strong> {annualOffer.copy}{' '}
              {whatsappLink(
                'annual_offer',
                'agll-text-link agll-offer-link',
                <>{annualOffer.cta} &rarr;</>,
                buildWhatsAppUrl(adGroupOfferMessage(pageKey)),
              )}
            </p>
          ) : null}

          <div className="agll-plans">
            {plans.map((plan) => (
              <article key={plan.name} className={plan.popular ? 'agll-plan is-popular' : 'agll-plan'}>
                {plan.popular ? <p className="agll-plan-flag">Most popular</p> : null}
                <h3>{plan.name}</h3>
                <p className="agll-plan-price">
                  <span>AED</span> {plan.price}<small>/month</small>
                </p>
                <p className="agll-plan-volume">{plan.volume}</p>
                <ul>
                  {plan.points.map((point) => (
                    <li key={point}><FiCheck aria-hidden="true" /> {point}</li>
                  ))}
                </ul>
                {whatsappLink(
                  `pricing_${plan.name.toLowerCase()}`,
                  plan.popular ? 'agll-btn agll-btn-primary agll-btn-block' : 'agll-btn agll-btn-outline agll-btn-block',
                  'Get Started',
                  buildWhatsAppUrl(planMessage(plan)),
                )}
              </article>
            ))}
          </div>
          <p className="agll-fineprint">
            No setup fee. Cancel anytime. Pay only if satisfied. We confirm the right plan on your first call.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ testimonials */}
      <section className="agll-section agll-alt" id="testimonials">
        <div className="agll-wrap">
          <header className="agll-head">
            <h2 className="agll-h2">What clients say</h2>
            <p className="agll-sub">
              <Stars /> Rated 4.9 on Trustpilot from 239 reviews
            </p>
          </header>
          <div className="agll-quotes">
            {testimonials.map((t) => (
              <figure key={t.name} className="agll-quote">
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <img src={t.avatar} alt="" width="44" height="44" loading="lazy" decoding="async" />
                  <span>
                    <strong>{t.name}</strong>
                    {t.title}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- FAQ */}
      <section className="agll-section" id="faq">
        <div className="agll-wrap agll-narrow">
          <header className="agll-head">
            <h2 className="agll-h2">Common questions</h2>
          </header>
          <div className="agll-faq">
            {page.faqs.map((faq, index) => (
              <div key={faq.q} className={openFaq === index ? 'agll-faq-item is-open' : 'agll-faq-item'}>
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <FiChevronDown aria-hidden="true" />
                </button>
                {openFaq === index ? <p>{faq.a}</p> : null}
              </div>
            ))}
          </div>

          {footnotes.length ? (
            <ol className="agll-sources" aria-label="Sources">
              {footnotes.map((note) => (
                <li key={note.id} id={`fn-${note.id}`}>
                  {note.text}{' '}
                  <a href={note.url} target="_blank" rel="noreferrer">{note.label}</a>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </section>

      {/* -------------------------------------------------- last fold */}
      <section className="agll-final" id="consultation">
        <div className="agll-wrap agll-hero-grid">
          <div>
            <h2 className="agll-h2">{page.final.title}</h2>
            <p className="agll-lead">{page.final.description}</p>
            <ol className="agll-final-steps">
              {page.final.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {whatsappLink('final', 'agll-text-link', <><WhatsAppGlyph /> Prefer WhatsApp? Message us</>)}
            <Credential />
          </div>
          <LeadForm
            id={FINAL_FORM_ID}
            formId={`${pageKey}-final`}
            title={page.heroForm.title}
            subtitle={page.heroForm.subtitle}
          />
        </div>
      </section>

      {/* Phone sticky bar: the one primary action. */}
      <div className={formOnScreen ? 'agll-sticky is-hidden' : 'agll-sticky'} hidden={formOnScreen}>
        {/* WhatsApp and call sit just above this bar (floating contacts). */}
        {primaryCta('sticky_mobile', 'agll-sticky-primary')}
      </div>
    </div>
  );
};

export default AdGroupLandingLight;
