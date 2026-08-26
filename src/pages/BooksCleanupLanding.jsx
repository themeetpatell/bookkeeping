import { useState } from 'react';
import { FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { usePostHog } from '@posthog/react';
import Seo from '../components/Seo';
import Testimonials from '../components/Testimonials';
import PackageQuoteForm from '../components/PackageQuoteForm';
import clientLogos from '../data/clientLogos';
import { absoluteUrl } from '../utils/site';
import {
  getLeadSourceForChannel,
  ZOHO_BING_FORM_ACTION,
  ZOHO_GOOGLE_FORM_ACTION,
} from '../utils/zohoForms';
import {
  CLEANUP_PRICE,
  CLEANUP_QUOTE_ANCHOR_ID,
  CLEANUP_RESPONSE_TIME,
  backlogBands,
  cleanupDeliverables,
  cleanupFaqs,
  cleanupProofPoints,
  cleanupSteps,
} from '../content/booksCleanup';

/* Shares the /packages design system: BookkeepingLanding.css carries the page
   chrome, PackagesLanding.css the proof strip / scope grid / steps band, and
   BooksCleanupLanding.css only what this page introduces (the single-offer
   pricing layout). The root element keeps the `packages-landing` class so the
   pkg-* rules scoped under it apply here too. */
import './BookkeepingLanding.css';
import './PackagesLanding.css';
import './BooksCleanupLanding.css';

const PAGE_PATH = '/books-cleanup';

/* Copy on this page is constrained by the Google Ads government-documents
   policy — see the header of src/content/booksCleanup.js before editing any
   string here or in that file. */
const SEO_TITLE = 'Books Cleanup UAE | Catch-Up Bookkeeping from AED 1,499';
const SEO_DESCRIPTION =
  'Behind on your books? We clean up months or years of backlog — every transaction captured, every account reconciled — from AED 1,499, with a fixed quote before we start.';

/**
 * One component, two routes: /books-cleanup (Google Ads) and
 * /books-cleanup-bing. The Bing twin serves identical content at its own URL so
 * Bing traffic stays separable in analytics, posts to the Bing Zoho form, and —
 * because the path ends in `-bing` — the nav/footer booking CTAs resolve to the
 * Bing scheduler automatically (see src/utils/booking.js).
 * @param {{ channel?: 'google' | 'bing' }} props
 */
const BooksCleanupLanding = ({ channel = 'google' }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const posthog = usePostHog();

  const isBing = channel === 'bing';
  const pagePath = isBing ? `${PAGE_PATH}-bing` : PAGE_PATH;
  const formAction = isBing ? ZOHO_BING_FORM_ACTION : ZOHO_GOOGLE_FORM_ACTION;
  const leadSource = getLeadSourceForChannel(channel);

  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  const trackCta = (location) =>
    posthog?.capture('cleanup_cta_clicked', { location, page_path: pagePath });

  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Books Cleanup & Catch-Up Bookkeeping (UAE)',
    serviceType: 'Bookkeeping',
    url: absoluteUrl(pagePath),
    image: absoluteUrl('/Dubai.jpg'),
    description: SEO_DESCRIPTION,
    areaServed: 'AE',
    telephone: '+971521549572',
    offers: [
      {
        '@type': 'Offer',
        name: 'Books cleanup engagement',
        price: CLEANUP_PRICE.replace(/,/g, ''),
        priceCurrency: 'AED',
        description: 'One-time catch-up bookkeeping and reconciliation engagement.',
      },
    ],
  };

  return (
    <div className="new-homepage packages-landing books-cleanup-landing">
      {/* The twin canonicalises to the original so the two URLs never compete;
          the whole site is noindex anyway (vercel.json X-Robots-Tag). */}
      <Seo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        canonicalPath={PAGE_PATH}
        image="/Dubai.jpg"
        jsonLd={seoJsonLd}
      />

      {/* Hero — the promise, the price and the quote form all above the fold:
          the ad promised a cleanup at a price, and the visitor arrived with a
          backlog they already know is a problem. */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="trust-badge">
              <span className="trust-dot" aria-hidden="true" />
              <span className="trust-text">Trusted by 7,000+ UAE businesses</span>
            </div>

            <h1 className="hero-title">
              Books a mess? We clean them up
              <br />
              <span className="highlight-green">from AED {CLEANUP_PRICE}</span>
            </h1>

            <p className="hero-description">
              Months — or years — behind on your bookkeeping? A dedicated accountant
              works through the full backlog: every transaction captured, every account
              reconciled, every error fixed. Fixed quote before we start, no hourly
              surprises.
            </p>

            <div className="hero-features">
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Fixed cleanup quote, agreed up front</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Every month reconciled to the bank</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Clean books in as little as 1–3 weeks</strong>
                </div>
              </div>
            </div>

            <div className="hero-ctas">
              <a
                href={`#${CLEANUP_QUOTE_ANCHOR_ID}`}
                className="btn-primary"
                onClick={() => trackCta('hero_quote')}
              >
                Get My Cleanup Quote
              </a>
            </div>

            <ul className="pkg-proof-strip">
              {cleanupProofPoints.map((point) => (
                <li key={point.label} className="pkg-proof-item">
                  <span className="pkg-proof-value">{point.value}</span>
                  <span className="pkg-proof-label">{point.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-right">
            <div className="consultation-form" id={CLEANUP_QUOTE_ANCHOR_ID}>
              <PackageQuoteForm
                formId="cleanup-quote-hero"
                action={formAction}
                leadSource={leadSource}
                title="Get Your Cleanup Quote"
                subtitle={`Your fixed cleanup quote ${CLEANUP_RESPONSE_TIME}.`}
                submitLabel="Get My Cleanup Quote"
                selectLabel="How far behind are your books?"
                selectHint="A rough answer is fine — it tells us the size of the backlog to quote."
                selectOptions={backlogBands}
              />

              <p className="form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your
                data is secure and will never be shared.
              </p>

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

      {/* One engagement, one price. The id stays "pricing" because the global
          Nav scrolls to that anchor on every page. */}
      <section className="pricing-section" id="pricing">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">CLEANUP PRICING</p>
            <h2 className="section-title">
              One engagement.
              <br />
              <span className="highlight-green">Clean books at the end.</span>
            </h2>
            <p className="section-subtitle">
              Cleanup starts from AED {CLEANUP_PRICE} and is quoted as a fixed price
              once we know your backlog — never billed by the hour.
            </p>
          </div>

          <div className="cleanup-offer">
            <div className="pricing-card popular cleanup-offer-card">
              <div className="popular-badge">Fixed Quote</div>

              <div className="pricing-header">
                <h3 className="plan-name">Books Cleanup</h3>
                <p className="plan-subtitle">
                  For businesses months or years behind on their bookkeeping.
                </p>
              </div>

              <div className="pricing-price">
                <span className="currency">from AED </span>
                <span className="amount">{CLEANUP_PRICE}</span>
              </div>

              <p className="plan-transactions">
                Final quote depends on backlog size and number of accounts
              </p>

              <ul className="plan-features">
                <li>
                  <FiCheckCircle className="check-icon" />
                  <span>Full backlog captured and categorised</span>
                </li>
                <li>
                  <FiCheckCircle className="check-icon" />
                  <span>Month-by-month bank and card reconciliation</span>
                </li>
                <li>
                  <FiCheckCircle className="check-icon" />
                  <span>Duplicates, errors and miscodings corrected</span>
                </li>
                <li>
                  <FiCheckCircle className="check-icon" />
                  <span>Year-end schedules your auditor can work from</span>
                </li>
                <li>
                  <FiCheckCircle className="check-icon" />
                  <span>Written summary of everything we fixed</span>
                </li>
              </ul>

              <a
                href={`#${CLEANUP_QUOTE_ANCHOR_ID}`}
                className="btn-plan btn-plan-popular"
                onClick={() => trackCta('offer_card')}
              >
                Get My Fixed Quote
              </a>
            </div>
          </div>

          <p className="pkg-offer-terms">
            <strong>Staying on after the cleanup?</strong> Monthly bookkeeping packages
            start at AED 499/month, and cleanup clients move onto one with no setup fee
            — so the backlog never rebuilds. Entirely optional.
          </p>
        </div>
      </section>

      {/* Scope, stated before the visitor is asked for anything. */}
      <section className="pkg-included-section" id="services">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">WHAT&rsquo;S INCLUDED</p>
            <h2 className="section-title">
              What a Finanshels cleanup
              <br />
              <span className="highlight-green">actually covers</span>
            </h2>
            <p className="section-subtitle">
              The same standard of work as our monthly bookkeeping — applied to every
              month in your backlog until each one closes clean.
            </p>
          </div>

          <div className="pkg-included-grid">
            {cleanupDeliverables.map((item) => (
              <div key={item.title} className="pkg-included-card">
                <FiCheckCircle className="pkg-included-icon" aria-hidden="true" />
                <h3 className="pkg-included-title">{item.title}</h3>
                <p className="pkg-included-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The path out of the mess, in three steps. */}
      <section className="pkg-switch-section">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">HOW IT WORKS</p>
            <h2 className="section-title">
              From backlog to clean books in{' '}
              <span className="highlight-green">three steps</span>
            </h2>
            <p className="section-subtitle">
              You share the backlog once. We do the digging, the reconciling and the
              fixing — and report progress as each period closes.
            </p>
          </div>

          <ol className="pkg-switch-steps">
            {cleanupSteps.map((item) => (
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
              href={`#${CLEANUP_QUOTE_ANCHOR_ID}`}
              className="btn-primary"
              onClick={() => trackCta('steps_band')}
            >
              Get My Cleanup Quote
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
              Books cleanup <span className="highlight-orange">questions</span>
            </h2>
            <p className="section-subtitle">
              Price, timeline and what you receive — answered before you talk to anyone.
            </p>
          </div>

          <div className="faq-list">
            {cleanupFaqs.map((faq, index) => (
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
              Tell us the backlog.
              <br />
              We&rsquo;ll tell you the price.
            </h2>
            <p className="cta-description">
              Join 7,000+ UAE businesses that trust Finanshels with their books. A fixed
              cleanup quote, a named accountant, and clean books at the end.
            </p>

            <div className="cta-steps">
              <div className="cta-step">
                <div className="step-number">1</div>
                <span>Share your business and how far behind the books are</span>
              </div>
              <div className="cta-step">
                <div className="step-number">2</div>
                <span>A senior accountant replies with a fixed quote {CLEANUP_RESPONSE_TIME}</span>
              </div>
              <div className="cta-step">
                <div className="step-number">3</div>
                <span>We rebuild the backlog and hand over clean, reconciled books</span>
              </div>
            </div>
          </div>

          <div className="final-cta-right">
            <div className="final-consultation-form">
              <PackageQuoteForm
                formId="cleanup-quote-final"
                action={formAction}
                leadSource={leadSource}
                title="Get Your Cleanup Quote"
                subtitle={`A senior accountant replies ${CLEANUP_RESPONSE_TIME}.`}
                submitLabel="Send My Quote Request"
                selectLabel="How far behind are your books?"
                selectHint="A rough answer is fine — it tells us the size of the backlog to quote."
                selectOptions={backlogBands}
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

export default BooksCleanupLanding;
