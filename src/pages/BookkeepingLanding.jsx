import { useState } from 'react';
import { FiCheckCircle, FiChevronDown, FiFileText, FiClock, FiTrendingDown, FiAlertTriangle, FiUsers, FiZap, FiBarChart2, FiShield } from 'react-icons/fi';
import Testimonials from '../components/Testimonials';
import './BookkeepingLanding.css';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import ZohoHiddenFields from '../components/ZohoHiddenFields';
import { absoluteUrl } from '../utils/site';

const ZohoConsultationForm = ({ formId }) => (
  <form
    action={ZOHO_GOOGLE_FORM_ACTION}
    name="form"
    id={formId || 'form'}
    method="POST"
    acceptCharset="UTF-8"
    encType="multipart/form-data"
  >
    {/* Change or deletion of the name attributes in the input tag will lead to empty values on record submission */}
    <ZohoHiddenFields />
    <div className="form-header">
      <h2 className="form-title">Get Your Free Consultation</h2>
      <p className="form-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
    </div>
    <div className="form-row form-row-half">
      <div className="form-field">
        <label>First Name</label>
        <input
          type="text"
          maxLength="255"
          name="Name_First"
          fieldType="7"
          placeholder="i.e. John"
          className="form-input"
        />
      </div>
      <div className="form-field">
        <label>Last Name</label>
        <input
          type="text"
          maxLength="255"
          name="Name_Last"
          fieldType="7"
          placeholder="i.e. Smith"
          className="form-input"
        />
      </div>
    </div>
    <div className="form-field">
      <label>
        Email <em>*</em>
      </label>
      <input
        type="text"
        maxLength="255"
        name="Email"
        fieldType="9"
        placeholder="i.e. name@yourdomain.com"
        className="form-input"
        required
      />
    </div>
    <div className="form-field">
      <label>
        Phone <em>*</em>
      </label>
      <input
        type="text"
        compname="PhoneNumber"
        name="PhoneNumber_countrycode"
        phoneFormat="1"
        isCountryCodeEnabled="false"
        maxLength="20"
        fieldType="11"
        id="international_PhoneNumber_countrycode"
        placeholder="+971 00 000 0000"
        className="form-input"
        required
      />
    </div>
    <div className="form-field">
      <label>
        Company Name <em>*</em>
      </label>
      <input
        type="text"
        name="SingleLine"
        fieldType="1"
        maxLength="255"
        placeholder="i.e. dropxcell LLC"
        className="form-input"
        required
      />
    </div>
    <button type="submit" className="form-submit">
      <em>Book A Slot</em>
    </button>
  </form>
);

const BookkeepingLanding = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+get+started.&type=phone_number&app_absent=0';
  const trackWhatsAppClick = (source) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source });
    }
  };
  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Finanshels Bookkeeping (UAE)',
    url: absoluteUrl('/bookkeeping'),
    image: absoluteUrl('/Dubai.jpg'),
    description:
      'UAE bookkeeping and management reporting with real-time dashboards. Free consultation and pay only if satisfied.',
    areaServed: 'AE',
    telephone: '+971521549572',
    serviceType: [
      'Bookkeeping',
      'Management Accounts',
      'Bank Reconciliation',
      'Financial Reporting',
      'Cash Flow Forecasting'
    ],
    priceRange: '$$'
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const clientLogos = [
    { src: '/clients/Binary.png', alt: 'Binary' },
    { src: '/clients/actualize.png', alt: 'Actualize' },
    { src: '/clients/carbonsirf.png', alt: 'Carbonsirf' },
    { src: '/clients/cotu.avif', alt: 'Cotu' },
    { src: '/clients/fuze.png', alt: 'Fuze' },
    { src: '/clients/growdash.png', alt: 'Growdash' },
    { src: '/clients/humlog.png', alt: 'Humlog' },
    { src: '/clients/veehive.png', alt: 'Veehive' },
    { src: '/clients/zywa.png', alt: 'Zywa' }
  ];

  const problems = [
    {
      icon: <FiFileText />,
      title: 'Spreadsheet Chaos',
      description: 'Excel files flying back and forth. Manual data entry. Human errors. Sound familiar?'
    },
    {
      icon: <FiClock />,
      title: 'Month-End Scrambles',
      description: 'Bookkeeping only happens at month end. No real-time visibility into your finances.'
    },
    {
      icon: <FiTrendingDown />,
      title: 'Flying Blind',
      description: 'Making business decisions without accurate financial data. Risking costly mistakes.'
    },
    {
      icon: <FiAlertTriangle />,
      title: 'Year-End Panic',
      description: 'Year-end creeps up and the books are months behind. Numbers you cannot defend.'
    }
  ];

  const solutionFeatures = [
    {
      icon: <FiUsers />,
      title: 'Dedicated Finance Team',
      description: 'Your own expert accountant who knows your business inside out. One team manages everything.'
    },
    {
      icon: <FiZap />,
      title: 'Automated Bookkeeping',
      description: 'Built with APIs and machine learning. Human oversight ensures accuracy while saving you 10× the time.'
    },
    {
      icon: <FiBarChart2 />,
      title: 'Real-Time Insights',
      description: 'No more month-end surprises. Get live dashboards and reports to make informed decisions daily.'
    },
    {
      icon: <FiShield />,
      title: 'Always Close-Ready',
      description: 'Reconciled ledgers and clean schedules every month. No year-end scramble.'
    }
  ];

  const beforeAfterPoints = [
    {
      before: '15–20 hrs/month spent chasing accountants',
      after: '2 hrs/month reviewing dashboards'
    },
    {
      before: 'No cashflow visibility',
      after: 'Weekly automated forecasts'
    },
    {
      before: 'Month-end close drags on for weeks',
      after: 'Closed in days, review-ready'
    },
    {
      before: 'Disconnected tools',
      after: 'One AI-driven finance workspace'
    },
    {
      before: 'Costly in-house team',
      after: '70% cost reduction with predictable outcomes'
    }
  ];

  const howItWorksSteps = [
    {
      stage: 'Kickoff & Migration',
      timeline: 'Day 0–7',
      description: 'Connect tools (banks, PSPs, Xero), clean historical data'
    },
    {
      stage: 'Setup & Reporting',
      timeline: 'Day 8–20',
      description: 'Build dashboards, setup cashflow, reporting calendars'
    },
    {
      stage: 'Month-End & Review',
      timeline: 'Day 30–45',
      description: 'Deliver first Day-10 pack + review call'
    },
    {
      stage: 'Steady State',
      timeline: 'Day 45–90',
      description: 'Automated reporting, cashflow, CFO review cadence'
    },
    {
      stage: 'Expansion (Optional)',
      timeline: 'Post 90 days',
      description: 'Add entities, CFO services, or advanced dashboards'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      subtitle: 'Perfect for freelancers and solopreneurs',
      price: '499',
      period: '/mo',
      transactions: 'Up to 50 transactions/year',
      features: [
        'Annual Financial Statements',
        'Quarterly Management Accounts',
        'Quarterly Financial Statements',
        'Dedicated Support Manager',
        '30 Min Free Finance Review'
      ]
    },
    {
      name: 'Essential',
      subtitle: 'Ideal for growing small businesses',
      price: '799',
      period: '/mo',
      transactions: 'Up to 200 transactions/year',
      features: [
        'Everything in Starter, plus:',
        'Monthly Account Reconciliation',
        'Quarterly Accounting Reports',
        'Priority Support',
        'Expense Categorization',
        'Financial Health Check-up'
      ]
    },
    {
      name: 'Growth',
      subtitle: 'For businesses with higher volume',
      price: '999',
      period: '/mo',
      transactions: 'Up to 2,000 transactions/year',
      popular: true,
      features: [
        'Everything in Essential, plus:',
        'Quarterly Bookkeeping',
        'Cash Flow Analysis',
        'Budget vs Actual Reports',
        'Multi-currency Support',
        'Dedicated Account Manager'
      ]
    },
    {
      name: 'Scale',
      subtitle: 'Enterprise-grade financial management',
      price: '1,999',
      period: '/mo',
      transactions: 'Up to 3,600 transactions/year',
      features: [
        'Everything in Growth, plus:',
        'Monthly Bookkeeping',
        'Advanced Reporting Suite',
        'Custom Dashboard',
        'API Integrations',
        'CFO Advisory Services'
      ]
    }
  ];

  const faqs = [
    {
      question: 'What does month-end close look like with Finanshels?',
      answer: 'Your books are reconciled continuously, not in a month-end rush. We close each month within days, deliver management accounts and a cash-flow view, and roll it all into annual financial statements your accountant, bank or investor can rely on.'
    },
    {
      question: 'What accounting software do you support?',
      answer: 'We integrate with all major accounting platforms including Zoho Books, Xero, QuickBooks, and FreshBooks. We can also work with your existing setup or help you choose the best software for your business needs.'
    },
    {
      question: 'How quickly can I get started?',
      answer: 'You can get started within 24-48 hours. After your free consultation, we\'ll set up your account, integrate with your existing systems, and begin processing your transactions immediately. Our dedicated team will guide you through every step.'
    },
    {
      question: 'What happens if my business grows and needs more support?',
      answer: 'That\'s the best problem to have! You can upgrade to a higher plan at any time. Our team will work with you to ensure a smooth transition and adjust our services to match your growing needs without any disruption.'
    },
    {
      question: 'Is my financial data secure?',
      answer: 'Absolutely. We use bank-level encryption and follow international security standards. Your data is stored securely in the cloud with multiple backups, and we never share your information with third parties. All our team members sign strict confidentiality agreements.'
    }
  ];

  return (
    <div className="new-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }}
        />
        <div className="hero-container">
          <div className="hero-left">
            <div className="trust-badge">
              <span className="trust-dot" aria-hidden="true" />
              <span className="trust-text">Trusted by 7,000+ UAE businesses</span>
            </div>
            
            <h1 className="hero-title">
              Buried in<br />
              <span className="highlight-green">Bookkeeping?</span><br />
              Let Experts Manage it For You
            </h1>
            
            <p className="hero-description">
              Expert outsourced accounting & bookkeeping for UAE small businesses.
              Month-end close, management accounts, and real-time financial
              insights — all handled by our dedicated team.
            </p>
            
            <div className="hero-features">
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Pay Only if Satisfied</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Dedicated Account Manager</strong>
                </div>
              </div>
              <div className="hero-feature">
                <FiCheckCircle className="feature-icon" />
                <div>
                  <strong>Comprehensive Financial Dashboard</strong>
                </div>
              </div>
            </div>
            
            <div className="hero-ctas">
              <a href="#consultation" className="btn-primary">Get Free Consultation</a>
              <a href="#pricing" className="btn-secondary">View Pricing</a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-value">7,000+</span>
                <span className="stat-label">Businesses Served</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">4.9</span>
                <span className="stat-label">Trustpilot Rating</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">10×</span>
                <span className="stat-label">Faster Than Manual</span>
              </div>
              <div className="hero-stat">
                <span className="stat-value">150+</span>
                <span className="stat-label">Accountants</span>
              </div>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="consultation-form">
              <ZohoConsultationForm formId="zoho-consultation-hero" />
              
              <p className="form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your data is secure and will never be shared.
              </p>
              
              <div className="form-badges">
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>Pay Only if Satisfied</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>No Commitment</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>24h Response</span>
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

      {/* Problem Section */}
      <section className="problem-section">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">THE PROBLEM</p>
            <h2 className="section-title">
              Managing Small Business<br />
              Accounting is <span className="highlight-green">Draining</span>
            </h2>
            <p className="section-subtitle">
              You started your business to pursue your passion — not to wrestle with spreadsheets and
              month-end close. Yet here you are, spending hours on tasks that drain your energy.
            </p>
          </div>
          
          <div className="problem-grid">
            {problems.map((problem, index) => (
              <div key={index} className="problem-card">
                <div className="problem-icon">{problem.icon}</div>
                <h3 className="problem-title">{problem.title}</h3>
                <p className="problem-description">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="content-container-large">
          <div className="solution-content">
            <div className="solution-left">
              <p className="section-eyebrow">THE SOLUTION</p>
              <h2 className="section-title">
                One Platform. One Team.<br />
                <span className="highlight-green">10x Faster.</span>
              </h2>
              <p className="solution-description">
                In one platform, one dedicated team manages all your finance
                functions. From bookkeeping to management reporting — we handle it so you can
                focus on what you do best.
              </p>
              
              <div className="solution-features">
                {solutionFeatures.map((feature, index) => (
                  <div key={index} className="solution-feature">
                    <div className="solution-icon">{feature.icon}</div>
                    <div className="solution-text">
                      <h4 className="solution-feature-title">{feature.title}</h4>
                      <p className="solution-feature-description">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <a
                className="btn-primary data-wa-track"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppClick('bookkeeping_solution_cta')}
              >
                Talk to an Expert
              </a>
            </div>
            
            <div className="solution-right">
              <div className="dashboard-preview">
                <div className="invoice-toast">
                  <div className="toast-icon">✅</div>
                  <div>
                    <div className="toast-title">Invoice Processed</div>
                    <div className="toast-subtitle">Just now</div>
                  </div>
                </div>
                
                <div className="dashboard-topline">
                  <div className="status-badge">
                    <span className="status-dot"></span>
                    <span>Invoice Processed</span>
                    <span className="status-time">Just now</span>
                  </div>
                  <div className="live-badge">Live</div>
                </div>
                
                <h3 className="dashboard-title">Financial Dashboard</h3>
                
                <div className="dashboard-metrics">
                  <div className="metric">
                    <div className="metric-label">Monthly Revenue</div>
                    <div className="metric-value-green">AED 245K</div>
                    <div className="metric-change">↑ 12% vs last month</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Expenses</div>
                    <div className="metric-value">AED 89K</div>
                    <div className="metric-status">On budget</div>
                  </div>
                </div>
                
                <div className="chart-area">
                  <div className="chart-bars">
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '75%'}}></div>
                    <div className="bar" style={{height: '65%'}}></div>
                    <div className="bar" style={{height: '85%'}}></div>
                    <div className="bar" style={{height: '70%'}}></div>
                    <div className="bar" style={{height: '90%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">TRANSFORMATION</p>
            <h2 className="section-title">Before Finanshels vs After Finanshels</h2>
            <p className="section-subtitle">
              See the shift when automation and a dedicated finance team take over — less time firefighting, more time growing.
            </p>
          </div>

          <div className="comparison-card">
            <div className="comparison-headings">
              <div className="comparison-heading before-heading">
                <FiAlertTriangle className="comparison-icon" />
                <span>Founder Reality (Before)</span>
              </div>
              <div className="comparison-heading after-heading">
                <FiCheckCircle className="comparison-icon" />
                <span>With Finanshels (After)</span>
              </div>
            </div>
            <div className="comparison-rows">
              {beforeAfterPoints.map((item, index) => (
                <div key={index} className="comparison-row">
                  <div className="comparison-cell before">{item.before}</div>
                  <div className="comparison-cell after">{item.after}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="comparison-mobile">
            {beforeAfterPoints.map((item, index) => (
              <div key={index} className="comparison-mobile-card">
                <div className="mobile-col">
                  <div className="mobile-col-heading">
                    <FiAlertTriangle className="comparison-icon" />
                    <span>Founder Reality</span>
                  </div>
                  <p className="mobile-col-text">{item.before}</p>
                </div>
                <div className="mobile-divider">
                  <span>vs</span>
                </div>
                <div className="mobile-col">
                  <div className="mobile-col-heading after">
                    <FiCheckCircle className="comparison-icon" />
                    <span>With Finanshels</span>
                  </div>
                  <p className="mobile-col-text after-text">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">ONBOARDING</p>
            <h2 className="section-title">How It Works (Within 45 Days)</h2>
            <p className="section-subtitle">
              A clear roadmap from day one to steady-state finance operations, so you know exactly what happens when.
            </p>
          </div>

          <div className="how-table">
            <div className="how-header">
              <div className="how-heading">Stage</div>
              <div className="how-heading">Timeline</div>
              <div className="how-heading">What Happens</div>
            </div>

            {howItWorksSteps.map((step, index) => (
              <div key={index} className="how-row">
                <div className="how-cell">
                  <div className="how-stage">{step.stage}</div>
                </div>
                <div className="how-cell">
                  <span className="timeline-pill">{step.timeline}</span>
                </div>
                <div className="how-cell">
                  <p className="how-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="how-mobile-cards">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="how-card">
                <div className="how-card-top">
                  <div className="how-card-stage">{step.stage}</div>
                  <span className="timeline-pill">{step.timeline}</span>
                </div>
                <p className="how-card-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="content-container">
          <div className="section-header">
            <p className="section-eyebrow">SIMPLE PRICING</p>
            <h2 className="section-title">
              Transparent Plans for <span className="highlight-green">Every<br />Business</span>
            </h2>
            <p className="section-subtitle">
              Best prices in the market. No hidden fees. Cancel anytime.
            </p>
          </div>
          
          <div className="pricing-banner">
            <span className="banner-emoji">🎉</span>
            <strong> Pay Only if Satisfied — No Commitment!</strong>
            <p>Only pay if you're satisfied. No questions asked.</p>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                
                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-subtitle">{plan.subtitle}</p>
                </div>
                
                <div className="pricing-price">
                  <span className="currency">AED </span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                
                <p className="plan-transactions">{plan.transactions}</p>
                
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FiCheckCircle className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  className={`btn-plan ${plan.popular ? 'btn-plan-popular' : ''} data-wa-track`}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsAppClick('bookkeeping_pricing_plan')}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="content-container-small">
          <div className="section-header">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="section-title">Common <span className="highlight-orange">Questions</span></h2>
            <p className="section-subtitle">
              Everything you need to know about our finance accounting service and how we help your business grow.
            </p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <FiChevronDown className={`faq-icon ${openFaqIndex === index ? 'rotated' : ''}`} />
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

      {/* Final CTA Section */}
      <section className="final-cta-section" id="consultation">
        <div className="final-cta-container">
          <div className="final-cta-left">
            <p className="section-eyebrow">GET STARTED TODAY</p>
            <h2 className="cta-title">
              Ready to Stop Stressing<br />
              About Your Books?
            </h2>
            <p className="cta-description">
              Join 7,000+ UAE businesses who've transformed their financial
              operations with Finanshels. Get your free consultation and see the
              difference expert bookkeeping can make.
            </p>
            
            <div className="cta-steps">
              <div className="cta-step">
                <div className="step-number">1</div>
                <span>Book your free 30-minute consultation</span>
              </div>
              <div className="cta-step">
                <div className="step-number">2</div>
                <span>Get a customized financial health assessment</span>
              </div>
              <div className="cta-step">
                <div className="step-number">3</div>
                <span>Pay Only if Satisfied — no commitment</span>
              </div>
            </div>
          </div>
          
          <div className="final-cta-right">
            <div className="final-consultation-form">
              <ZohoConsultationForm formId="zoho-consultation-final" />
              
              <p className="form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your data is secure and will never be shared.
              </p>
              
              <div className="form-badges">
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>Pay Only if Satisfied</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>No Commitment</span>
                </div>
                <div className="badge-item">
                  <FiCheckCircle className="badge-icon" />
                  <span>24h Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookkeepingLanding;
