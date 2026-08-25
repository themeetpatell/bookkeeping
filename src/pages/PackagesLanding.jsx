import { useState } from 'react';
import { FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { usePostHog } from '@posthog/react';
import Seo from '../components/Seo';
import Testimonials from '../components/Testimonials';
import PackageQuoteForm from '../components/PackageQuoteForm';
import clientLogos from '../data/clientLogos';
import { absoluteUrl } from '../utils/site';
import { ZOHO_BING_FORM_ACTION, ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import {
  QUOTE_ANCHOR_ID,
  QUOTE_RESPONSE_TIME,
  comparisonRows,
  faqs,
  includedItems,
  packages,
  proofPoints,
  switchSteps,
} from '../content/bookkeepingPackages';

/* The shared page chrome — hero, section headers, pricing cards, FAQ, final CTA
   — is already defined for /bookkeeping. Importing it keeps one design system
   instead of a second 2,600-line copy that drifts. PackagesLanding.css only
   adds what this page introduces: the proof strip, the attribute-by-attribute
   comparison, the scope grid and the switching band. */
import './BookkeepingLanding.css';
import './PackagesLanding.css';

const PAGE_PATH = '/packages';

/* Copy on this page is constrained by the Google Ads government-documents
   policy — see the header of src/content/bookkeepingPackages.js before editing
   any string here or in that file. */
const SEO_TITLE = 'Bookkeeping Packages UAE | Monthly Bookkeeping Plans from AED 499';
const SEO_DESCRIPTION =
  'Compare monthly bookkeeping packages for UAE businesses from AED 499/month. Clear bookkeeping pricing, a dedicated accountant, management reports and a 48-hour switch.';

/**
 * One component, two routes: /packages (Google Ads) and /packages-bing.
 * The Bing twin serves identical content at its own URL so Bing traffic stays
 * separable in analytics, posts to the Bing Zoho form, and — because the path
 * ends in `-bing` — the nav/footer booking CTAs resolve to the Bing scheduler
 * automatically (see src/utils/booking.js).
 * @param {{ channel?: 'google' | 'bing' }} props
 */
const PackagesLanding = ({ channel = 'google' }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const posthog = usePostHog();

  const isBing = channel === 'bing';
  const pagePath = isBing ? `${PAGE_PATH}-bing` : PAGE_PATH;
  const formAction = isBing ? ZOHO_BING_FORM_ACTION : ZOHO_GOOGLE_FORM_ACTION;

  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  const trackCta = (location, plan) =>
    posthog?.capture('packages_cta_clicked', { location, plan, page_path: pagePath });

  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bookkeeping Packages (UAE)',
    serviceType: 'Bookkeeping',
    url: absoluteUrl(pagePath),
    image: absoluteUrl('/Dubai.jpg'),
    description: SEO_DESCRIPTION,
    areaServed: 'AE',
    telephone: '+971521549572',
    offers: packages.map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} bookkeeping package`,
      price: plan.price.replace(/,/g, ''),
      priceCurrency: 'AED',
      description: plan.fit,
    })),
  };

  return (
    <div className="new-homepage packages-landing">
      {/* The twin canonicalises to the original so the two URLs never compete;
          the whole site is noindex anyway (vercel.json X-Robots-Tag). */}
      <Seo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonicalPath={PAGE_PATH}
        image="/Dubai.jpg"
        jsonLd={seoJsonLd}
      />

      {/* Hero — the message, the proof and the quote form all sit above the
          fold, because the ad promises a price and the visitor arrived to get
          one. */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="trust-badge">
              <span className="trust-dot" aria-hidden="true" />
              <span className="trust-text">Trusted by 7,000+ UAE businesses</span>
            </div>

            <h1 className="hero-title">
              Bookkeeping Packages UAE
              <br />
              <span className="highlight-green">from AED 499/month</span>
            </h1>

            <p className="hero-description">
              Choose a package built for your business. A dedicated accountant manages
              your books, your reconciliations and your management reports — on clear
              monthly bookkeeping pricing, with no lock-in.
            </p>

            <div className="hero-features">
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Three packages, published prices</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>A real accountant owns your numbers</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Switch your bookkeeping in 48 hours</strong>
                </div>
              </div>
            </div>

            <div className="hero-ctas">
              <a
                href="#pricing"
                className="btn-primary"
                onClick={() => trackCta('hero_compare', null)}
              >
                Compare Packages &amp; Get a Quote
              </a>
            </div>

            <ul className="pkg-proof-strip">
              {proofPoints.map((point) => (
                <li key={point.label} className="pkg-proof-item">
                  <span className="pkg-proof-value">{point.value}</span>
                  <span className="pkg-proof-label">{point.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-right">
            <div className="consultation-form" id={QUOTE_ANCHOR_ID}>
              <PackageQuoteForm
                formId="packages-quote-hero"
                action={formAction}
                title="Get Your Package Quote"
                subtitle={`Tell us your volume and a senior accountant replies with the right package and price ${QUOTE_RESPONSE_TIME}.`}
              />

              <p className="form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your
                data is secure and will never be shared.
              </p>

              <div className="form-badges">
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>No obligation</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>No setup fee</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>Reply {QUOTE_RESPONSE_TIME}</span>
                </div>
              </div>
            </div>
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
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages — placed directly below the hero, because comparing is the
          job the visitor came to do. The id is "pricing" because the global Nav
          scrolls to that anchor on every page; renaming it here would leave the
          nav's Pricing link dead on this route. */}
      <section className="pricing-section" id="pricing">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">BOOKKEEPING PACKAGES</p>
            <h2 className="section-title">
              Compare our monthly
              <br />
              <span className="highlight-green">bookkeeping packages</span>
            </h2>
            <p className="section-subtitle">
              Every package includes a dedicated accountant, reconciled books and
              management reporting. Pick by transaction volume — we confirm the fit
              before you commit to anything.
            </p>
          </div>

          <div className="pricing-grid pkg-grid">
            {packages.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}

                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-subtitle">{plan.fit}</p>
                </div>

                <div className="pricing-price">
                  <span className="currency">AED </span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/mo</span>
                </div>

                <p className="plan-transactions">{plan.volume}</p>

                <p className="pkg-reporting">
                  <span className="pkg-reporting-label">Reporting</span>
                  {plan.reporting}
                </p>

                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <FiCheckCircle className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`#${QUOTE_ANCHOR_ID}`}
                  className={`btn-plan ${plan.popular ? 'btn-plan-popular' : ''}`}
                  onClick={() => trackCta('plan_card', plan.id)}
                >
                  Get a Quote
                </a>
              </div>
            ))}
          </div>

          {/* Attribute-by-attribute view. The cards sell; this settles the
              "which one is actually different" question without a scroll war. */}
          <div className="pkg-compare" role="table" aria-label="Bookkeeping package comparison">
            <div className="pkg-compare-row pkg-compare-head" role="row">
              <div className="pkg-compare-cell pkg-compare-label" role="columnheader">
                Compare plans
              </div>
              {packages.map((plan) => (
                <div key={plan.id} className="pkg-compare-cell" role="columnheader">
                  {plan.name}
                </div>
              ))}
            </div>

            {comparisonRows.map((row) => (
              <div key={row.field} className="pkg-compare-row" role="row">
                <div className="pkg-compare-cell pkg-compare-label" role="rowheader">
                  {row.label}
                </div>
                {packages.map((plan) => (
                  <div key={plan.id} className="pkg-compare-cell" role="cell">
                    <span className="pkg-compare-mobile-head" aria-hidden="true">
                      {plan.name}
                    </span>
                    {plan[row.field]}
                  </div>
                ))}
              </div>
            ))}

            <div className="pkg-compare-row pkg-compare-foot" role="row">
              <div className="pkg-compare-cell pkg-compare-label" role="rowheader">
                Get started
              </div>
              {packages.map((plan) => (
                <div key={plan.id} className="pkg-compare-cell" role="cell">
                  <a
                    href={`#${QUOTE_ANCHOR_ID}`}
                    className="pkg-compare-cta"
                    onClick={() => trackCta('compare_table', plan.id)}
                  >
                    Quote {plan.name}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <p className="pkg-offer-terms">
            <strong>3 months free on annual plans.</strong> Pay for 12 months up front
            and receive 3 additional months of the same package at no charge — 15 months
            in total. Not available on monthly billing, and not combinable with other
            offers.
          </p>
        </div>
      </section>

      {/* Scope, stated before the visitor is asked for anything. */}
      <section className="pkg-included-section" id="services">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">WHAT&rsquo;S INCLUDED</p>
            <h2 className="section-title">
              Bookkeeping pricing UAE:
              <br />
              <span className="highlight-green">what every plan includes</span>
            </h2>
            <p className="section-subtitle">
              The same standard of work sits under all three bookkeeping plans. Only the
              volume, the reporting cadence and the depth of advisory change.
            </p>
          </div>

          <div className="pkg-included-grid">
            {includedItems.map((item) => (
              <div key={item.title} className="pkg-included-card">
                <FiCheckCircle className="pkg-included-icon" aria-hidden="true" />
                <h3 className="pkg-included-title">{item.title}</h3>
                <p className="pkg-included-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Switching anxiety is the objection that kills this ad group: the
          visitor already has a bookkeeper. */}
      <section className="pkg-switch-section">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">CHANGING PROVIDER</p>
            <h2 className="section-title">
              Switch your bookkeeping in{' '}
              <span className="highlight-green">48 hours</span>
            </h2>
            <p className="section-subtitle">
              We handle onboarding, organise the handover and give you a clear view of
              what happens next. You send one email — we do the rest.
            </p>
          </div>

          <ol className="pkg-switch-steps">
            {switchSteps.map((item) => (
              <li key={item.step} className="pkg-switch-step">
                <span className="pkg-switch-number" aria-hidden="true">
                  {item.step}
                </span>
                <h3 className="pkg-switch-title">{item.title}</h3>
                <p className="pkg-switch-description">{item.description}</p>
              </li>
            ))}
          </ol>

          <div className="pkg-switch-cta-row">
            <a
              href={`#${QUOTE_ANCHOR_ID}`}
              className="btn-primary"
              onClick={() => trackCta('switch_band', null)}
            >
              Get My Package Quote
            </a>
          </div>
        </div>
      </section>

      <div id="testimonials">
        <Testimonials />
      </div>

      <section className="faq-section" id="faq">
        <div className="content-container-small">
          <div className="section-header">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="section-title">
              Bookkeeping package <span className="highlight-orange">questions</span>
            </h2>
            <p className="section-subtitle">
              Pricing, scope and switching — answered before you talk to anyone.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={openFaqIndex === index}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <FiChevronDown
                    className={`faq-icon ${openFaqIndex === index ? 'rotated' : ''}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="final-cta-container">
          <div className="final-cta-left">
            <p className="section-eyebrow">GET YOUR QUOTE</p>
            <h2 className="cta-title">
              Tell us your volume.
              <br />
              We&rsquo;ll tell you the package.
            </h2>
            <p className="cta-description">
              Join 7,000+ UAE businesses on clear monthly bookkeeping plans. No setup
              fee, no lock-in, and a named accountant from day one.
            </p>

            <div className="cta-steps">
              <div className="cta-step">
                <div className="step-number">1</div>
                <span>Share your business and approximate monthly transactions</span>
              </div>
              <div className="cta-step">
                <div className="step-number">2</div>
                <span>A senior accountant replies with your package and price {QUOTE_RESPONSE_TIME}</span>
              </div>
              <div className="cta-step">
                <div className="step-number">3</div>
                <span>Switch in 48 hours — we organise the handover</span>
              </div>
            </div>
          </div>

          <div className="final-cta-right">
            <div className="final-consultation-form">
              <PackageQuoteForm
                formId="packages-quote-final"
                action={formAction}
                title="Compare Packages &amp; Get a Quote"
                subtitle={`Four questions. A senior accountant replies ${QUOTE_RESPONSE_TIME}.`}
                submitLabel="Send My Quote Request"
              />

              <p className="form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your
                data is secure and will never be shared.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesLanding;
