import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiCheckCircle, FiChevronDown, FiX } from 'react-icons/fi';
import Seo from '../components/Seo';
import './AccountingSoftwareLanding.css';

const ZohoConsultationForm = ({ formId }) => (
  <form
    action="https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit"
    name="form"
    id={formId || 'form'}
    method="POST"
    acceptCharset="UTF-8"
    encType="multipart/form-data"
    className="software-zoho-form"
    aria-label="Free consultation form"
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
    
    <div className="software-form-row">
      <div className="software-form-group">
        <label htmlFor={`first-name-${formId}`}>First Name</label>
        <input
          type="text"
          id={`first-name-${formId}`}
          maxLength="255"
          name="Name_First"
          placeholder="First name"
          className="software-form-control"
          aria-label="First name"
        />
      </div>
      
      <div className="software-form-group">
        <label htmlFor={`last-name-${formId}`}>Last Name</label>
        <input
          type="text"
          id={`last-name-${formId}`}
          maxLength="255"
          name="Name_Last"
          placeholder="Last name"
          className="software-form-control"
          aria-label="Last name"
        />
      </div>
    </div>
    
    <div className="software-form-group">
      <label htmlFor={`email-${formId}`}>Email <span aria-label="required">*</span></label>
      <input
        type="email"
        id={`email-${formId}`}
        maxLength="255"
        name="Email"
        fieldType="9"
        placeholder="i.e. name@yourdomain.com"
        className="software-form-control"
        required
        aria-required="true"
        aria-label="Email address"
      />
    </div>
    
    <div className="software-form-group">
      <label htmlFor={`phone-${formId}`}>Phone Number</label>
      <input
        type="text"
        id={`phone-${formId}`}
        compname="PhoneNumber"
        name="PhoneNumber_countrycode"
        phoneFormat="1"
        isCountryCodeEnabled="false"
        maxLength="20"
        fieldType="11"
        placeholder="+971 00 000 0000"
        className="software-form-control"
        aria-label="Phone number"
      />
    </div>
    
    <div className="software-form-group">
      <label htmlFor={`company-${formId}`}>Company Name <span aria-label="required">*</span></label>
      <input
        type="text"
        id={`company-${formId}`}
        name="SingleLine1"
        fieldType="1"
        maxLength="255"
        placeholder="i.e. dropxcell LLC"
        className="software-form-control"
        required
        aria-required="true"
        aria-label="Company name"
      />
    </div>
    
    <div className="software-form-group">
      <label htmlFor={`job-title-${formId}`}>Job Title</label>
      <input
        type="text"
        id={`job-title-${formId}`}
        name="SingleLine2"
        fieldType="1"
        maxLength="255"
        placeholder="i.e. Founder"
        className="software-form-control"
        aria-label="Job title"
      />
    </div>
    
    <button 
      type="submit" 
      className="software-btn-submit"
      aria-label="Submit consultation form"
    >
      Submit
    </button>
  </form>
);

const AccountingSoftwareLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const { pathname } = useLocation();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://finanshels.com';

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
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

  const getSoftwareStatus = (value) => {
    if (value === false) {
      return {
        className: 'status-unavailable',
        text: 'Not available',
        icon: <FiX className="software-icon-red" />
      };
    }
    if (value === 'limited') {
      return {
        className: 'status-limited',
        text: 'Limited / add-on',
        icon: <span className="software-limited-badge">—</span>
      };
    }
    return {
      className: 'status-included',
      text: 'Included',
      icon: <FiCheckCircle className="software-icon-check" />
    };
  };

  const comparisonFeatures = [
    {
      feature: 'Transactional Bookkeeping',
      software: false,
      finanshels: true
    },
    {
      feature: 'Real-Time Financial Dashboard',
      software: 'limited',
      finanshels: true
    },
    {
      feature: 'Client Portal with Reports & Records',
      software: false,
      finanshels: true
    },
    {
      feature: 'Expert Financial Advice',
      software: false,
      finanshels: true
    },
    {
      feature: 'Cash Flow Forecasting',
      software: 'limited',
      finanshels: true
    },
    {
      feature: 'Dedicated Account Manager',
      software: false,
      finanshels: true
    },
    {
      feature: 'UAE Corporate Tax Filing',
      software: false,
      finanshels: true
    },
    {
      feature: 'VAT Registration & Filing',
      software: false,
      finanshels: true
    },
    {
      feature: 'Proactive Tax Strategy',
      software: false,
      finanshels: true
    },
    {
      feature: 'Human Oversight & Error Correction',
      software: false,
      finanshels: true
    },
    {
      feature: 'Business Decision Support',
      software: false,
      finanshels: true
    },
    {
      feature: 'Audit-Ready Documentation',
      software: 'limited',
      finanshels: true
    }
  ];

  const testimonials = [
    {
      text: "We tried QuickBooks and Zoho Books before, but the time spent on data entry and reconciliation was killing us. Finanshels gave us expert accountants plus a dashboard that shows everything in real-time.",
      name: "Abdulla Al-Ogail",
      title: "Co-founder & CEO, Olymon"
    },
    {
      text: "Accounting software is just a tool. What we needed was financial advice and someone who understood our business. Finanshels delivers both — plus a client portal where I can access all our reports anytime.",
      name: "Szilvia Vitos",
      title: "Founder, Livvity"
    },
    {
      text: "My old xero setup got messy quickly. Too many errors I didn't catch. Finanshels does our books + shows cashflow forecasts weekly + remembers to file taxes. I can finally focus on revenue.",
      name: "Jeremy Khatar",
      title: "CEO, Ronin Global LLC"
    },
    {
      text: "With QuickBooks I had zero visibility between months. Now with Finanshels, I know exactly where we stand every day. Dashboard + dedicated expert = worth every dirham.",
      name: "Bader Al Kazimi",
      title: "Founder, Optimize App"
    }
  ];

  const beforeAfterComparison = [
    {
      before: 'Monthly subscription to QuickBooks/Xero + your time',
      after: 'All-inclusive expert service at predictable cost'
    },
    {
      before: 'DIY data entry and reconciliation',
      after: 'Automated bookkeeping with human oversight'
    },
    {
      before: 'Scattered reports across software tools',
      after: 'Unified client portal with all records & insights'
    },
    {
      before: 'No one to ask for financial advice',
      after: 'Dedicated account manager for strategic guidance'
    },
    {
      before: 'Tax compliance anxiety and deadlines',
      after: '100% on-time, audit-ready filings'
    }
  ];

  const faqs = [
    {
      question: "Why choose Finanshels over standalone accounting software like QuickBooks or Xero?",
      answer: "Accounting software only records transactions — they can't think, advise, or catch errors. Finanshels gives you expert accountants who understand your business + a powerful client portal + real-time financial insights. You get the best of both worlds: automation plus human expertise."
    },
    {
      question: "What's included in the client portal?",
      answer: "Your client portal includes real-time financial dashboards, profit & loss statements, cash flow forecasts, expense categorization, tax filing status, and all your financial records in one place. You can access everything 24/7 from any device."
    },
    {
      question: "How does Finanshels pricing compare to accounting software costs?",
      answer: "QuickBooks costs AED 80-300/month plus your time to manage it (and potential accountant fees for cleanup and tax filing). Finanshels includes everything — bookkeeping, expert advice, tax compliance, and your client portal — starting at AED 299/month with no hidden costs."
    },
    {
      question: "Do you replace my current bookkeeping software?",
      answer: "We can work with your existing software (QuickBooks, Xero, Zoho Books) or migrate you to a better solution. Our team handles all the data migration and setup so you don't have to worry about the technical details."
    },
    {
      question: "How does Finanshels handle UAE Corporate Tax compliance?",
      answer: "We manage your complete Corporate Tax lifecycle — from FTA registration to quarterly filings and annual returns. Our team stays updated with the latest UAE tax regulations to ensure 100% compliance and help you avoid penalties."
    },
    {
      question: "Is my financial data secure?",
      answer: "Absolutely. We use bank-level encryption and follow international security standards. Your data is stored securely in the cloud with multiple backups, and we never share your information with third parties."
    }
  ];

  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Finanshels Accounting Experts (UAE)',
    url: `${baseUrl}${pathname}`,
    image: `${baseUrl}/Dubai.png`,
    description:
      "Stop paying for accounting software that can't think. Get expert accountants + a client portal + real-time insights.",
    areaServed: 'AE',
    telephone: '+971521549572',
    serviceType: [
      'Accounting',
      'Bookkeeping',
      'Tax Compliance',
      'Financial Reporting',
      'CFO Advisory'
    ],
    priceRange: '$$'
  };

  return (
    <div className="software-landing">
      <Seo
        title="Stop Paying for Accounting Software That Can't Think | Finanshels"
        description="QuickBooks, Xero, Zoho Books — they're tools. Get expert accountants + a client portal + real-time financial insights."
        canonicalPath={pathname}
        image="/Dubai.png"
        jsonLd={seoJsonLd}
      />
      
      {/* Hero Section */}
      <section className="software-hero">
        <div className="software-hero-container">
          <div className="software-hero-left">
            <div className="software-trust-badge">
              <span className="software-trust-dot"></span>
              <span>Trusted by 5,000+ UAE businesses</span>
            </div>
            
            <h1 className="software-hero-title">
              Stop Paying for<br />
              <span className="software-text-orange">Accounting Software</span><br />
              That Can't Think
            </h1>
            
            <p className="software-hero-description">
              QuickBooks, Xero, Zoho Books — they're just tools for transactional accounting. Get expert accountants + a powerful client portal + financial insights that drive real business decisions.
            </p>
            
            <ul className="software-hero-benefits">
              <li>
                <FiCheckCircle className="software-icon-orange" />
                <span>Pay Only if Satisfied</span>
              </li>
              <li>
                <FiCheckCircle className="software-icon-orange" />
                <span>Dedicated Account Manager</span>
              </li>
              <li>
                <FiCheckCircle className="software-icon-orange" />
                <span>Comprehensive Financial Dashboard</span>
              </li>
              <li>
                <FiCheckCircle className="software-icon-orange" />
                <span>Expert Financial Advice Included</span>
              </li>
            </ul>
            
            <div className="software-hero-buttons">
              <a href="#consultation" className="software-btn-primary">Get Free Consultation</a>
              <a href="#pricing" className="software-btn-secondary">View Pricing</a>
            </div>
          </div>
          
          <div className="software-hero-right">
            <div className="software-consultation-card">
              <h2>Get Your Free Accounting Consultation</h2>
              <p className="software-card-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
              
              <ZohoConsultationForm formId="software-hero-form" />
              
              <p className="software-form-disclaimer">
                By submitting, you agree to receive communications from Finanshels. Your data is secure and will never be shared.
              </p>
              
              <div className="software-trust-indicators">
                <div className="software-trust-item">
                  <FiCheckCircle />
                  <span>Pay Only if Satisfied</span>
                </div>
                <div className="software-trust-item">
                  <FiCheckCircle />
                  <span>No Commitment</span>
                </div>
                <div className="software-trust-item">
                  <FiCheckCircle />
                  <span>24h Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="software-hero-trust-row">
          <p className="software-trust-label">Trusted by leading UAE businesses</p>
          <div className="software-logo-list-wide">
            {clientLogos.map((logo) => (
              <div key={logo.alt} className="software-trust-logo">
                <img
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  className="software-trust-logo-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="software-stats">
        <div className="software-container">
          <p className="software-stats-title">Trusted by leading UAE businesses</p>
          <div className="software-stats-grid">
            <div className="software-stat-item">
              <h3 className="software-stat-number">5,000+</h3>
              <p className="software-stat-label">Businesses Served</p>
            </div>
            <div className="software-stat-item">
              <h3 className="software-stat-number">4.9</h3>
              <p className="software-stat-label">Trustpilot Rating</p>
            </div>
            <div className="software-stat-item">
              <h3 className="software-stat-number">10×</h3>
              <p className="software-stat-label">Faster Than Manual</p>
            </div>
            <div className="software-stat-item">
              <h3 className="software-stat-number">24/7</h3>
              <p className="software-stat-label">Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="software-problem">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">THE PROBLEM</span>
            <h2 className="software-section-title">
              Accounting Software is Just a Tool<br />
              — <span className="software-text-orange">Not a Solution</span>
            </h2>
          </div>
          
          <div className="software-problem-grid">
            <div className="software-problem-card">
              <div className="software-problem-icon">📊</div>
              <h3>Software Without Strategy</h3>
              <p>QuickBooks, Zoho Books, Tally Prime — they process transactions but can't tell you if your business is healthy.</p>
            </div>
            
            <div className="software-problem-card">
              <div className="software-problem-icon">⏰</div>
              <h3>Hidden Costs Add Up</h3>
              <p>Accounting software pricing looks cheap until you add training, support, integrations, and your time to manage it all.</p>
            </div>
            
            <div className="software-problem-card">
              <div className="software-problem-icon">👁️</div>
              <h3>No Financial Guidance</h3>
              <p>Xero accounting software shows numbers, but who explains what they mean? Who advises on cash flow or tax strategy?</p>
            </div>
            
            <div className="software-problem-card">
              <div className="software-problem-icon">⚠️</div>
              <h3>Compliance Anxiety</h3>
              <p>UAE Corporate Tax and VAT deadlines loom. Your bookkeeping software won't remind you — or file for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="software-comparison">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">THE COMPARISON</span>
            <h2 className="software-section-title">
              Accounting Software vs<br />
              <span className="software-text-orange">Finanshels Experts</span>
            </h2>
            <p className="software-section-description">
              See why smart UAE businesses choose expert accountants with a client portal over standalone bookkeeping software
            </p>
          </div>
          
          <div className="software-comparison-table">
            <div className="software-comparison-header">
              <div className="software-comparison-col-header">
                <h3>Feature</h3>
              </div>
              <div className="software-comparison-col-header software-column">
                <h3>Accounting Software</h3>
                <p>QuickBooks, Xero, Zoho, Tally</p>
              </div>
              <div className="software-comparison-col-header finanshels-column">
                <h3>Finanshels</h3>
                <p>Experts + Portal + Insights</p>
              </div>
            </div>
            
            <div className="software-comparison-body">
              {comparisonFeatures.map((item, index) => {
                const softwareStatus = getSoftwareStatus(item.software);
                return (
                  <div key={index} className="software-comparison-row">
                  <div className="software-comparison-cell feature-cell">
                    <span className="software-feature-title">{item.feature}</span>
                  </div>
                  <div className="software-comparison-cell software-column">
                    <span className="software-comparison-cell-label">Accounting Software</span>
                    <span className={`software-comparison-status ${softwareStatus.className}`}>
                      {softwareStatus.icon}
                      <span>{softwareStatus.text}</span>
                    </span>
                  </div>
                  <div className="software-comparison-cell finanshels-column">
                    <span className="software-comparison-cell-label">Finanshels</span>
                    <span className="software-comparison-status status-included">
                      <FiCheckCircle className="software-icon-green" />
                      <span>Included</span>
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
          
          <div className="software-comparison-footer">
            <div className="software-legend">
              <div className="software-legend-item">
                <FiCheckCircle className="software-icon-check-small" />
                <span>Included</span>
              </div>
              <div className="software-legend-item">
                <span className="software-limited-badge-small">—</span>
                <span>Limited / Extra Cost</span>
              </div>
              <div className="software-legend-item">
                <FiX className="software-icon-red-small" />
                <span>Not Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="software-solution" id="services">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">THE SOLUTION</span>
            <h2 className="software-section-title">
              Expert Accountants + Client Portal.<br />
              <span className="software-text-orange">10× Better Than Software Alone.</span>
            </h2>
          </div>
          
          <div className="software-solution-grid">
            <div className="software-solution-card">
              <div className="software-solution-icon">👥</div>
              <h3>Dedicated Finance Team</h3>
              <p>Your own expert accountant who knows your business inside out. One team manages everything — not just software support.</p>
            </div>
            
            <div className="software-solution-card">
              <div className="software-solution-icon">⚡</div>
              <h3>Client Portal + Dashboard</h3>
              <p>Access all your reports, records, and financial data in one place. Real-time visibility that no standalone accounting software can match.</p>
            </div>
            
            <div className="software-solution-card">
              <div className="software-solution-icon">📈</div>
              <h3>Financial Insights & Advice</h3>
              <p>Strategic guidance to drive sound financial decisions. We don't just show numbers — we explain what they mean for your business.</p>
            </div>
            
            <div className="software-solution-card">
              <div className="software-solution-icon">🛡️</div>
              <h3>UAE Tax Compliance</h3>
              <p>Corporate tax, VAT registration, and quarterly filings handled. Stay compliant without the stress of managing software yourself.</p>
            </div>
          </div>
          
          <div className="software-cta-center">
            <a 
              href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
              target="_blank"
              rel="noreferrer"
               className="software-btn-primary data-wa-track"
            >
              Talk to an Expert
            </a>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="software-transformation">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">TRANSFORMATION</span>
            <h2 className="software-section-title">
              Before vs After <span className="software-text-orange">Finanshels</span>
            </h2>
            <p className="software-section-description">
              See the shift when expert accountants and a client portal replace standalone accounting software.
            </p>
          </div>
          
          <div className="software-before-after-table">
            <div className="software-before-after-header">
              <div className="software-before-after-col">
                <h3>Accounting Software Only</h3>
              </div>
              <div className="software-before-after-col after">
                <h3>With Finanshels</h3>
              </div>
            </div>
            
            <div className="software-before-after-body">
              {beforeAfterComparison.map((item, index) => (
                <div key={index} className="software-before-after-row">
                  <div className="software-before-after-cell">
                    <FiX className="software-icon-red" />
                    <span>{item.before}</span>
                  </div>
                  <div className="software-before-after-cell after">
                    <FiCheckCircle className="software-icon-green" />
                    <span>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="software-dashboard-preview">
        <div className="software-container">
          <div className="software-dashboard-content">
            <div className="software-dashboard-image">
              <div className="software-dashboard-mock">
                <div className="software-dashboard-header-bar">
                  <div className="software-status-live">
                    <span className="software-status-dot"></span>
                    <span>Live</span>
                  </div>
                  <div className="software-status-invoice">
                    <FiCheckCircle />
                    <span>Invoice Processed</span>
                  </div>
                </div>
                
                <h3 className="software-dashboard-title">Financial Dashboard</h3>
                
                <div className="software-dashboard-metrics">
                  <div className="software-metric">
                    <span className="software-metric-label">Monthly Revenue</span>
                    <div className="software-metric-value">AED 245K</div>
                    <div className="software-metric-change positive">↑ 12% vs last month</div>
                  </div>
                  
                  <div className="software-metric">
                    <span className="software-metric-label">Expenses</span>
                    <div className="software-metric-value">AED 89K</div>
                    <div className="software-metric-tag">On budget</div>
                  </div>
                </div>
                
                <div className="software-dashboard-compliance">
                  <span className="software-compliance-text">All filings up to date</span>
                  <div className="software-compliance-badges">
                    <span className="software-badge vat">VAT Filed</span>
                    <span className="software-badge ct">CT Registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="software-pricing" id="pricing">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">SIMPLE PRICING</span>
            <h2 className="software-section-title">
              Transparent Plans for Every<br />
              <span className="software-text-orange">Business</span>
            </h2>
            <p className="software-section-description">
              Best prices in the market. No hidden fees. Cancel anytime.
            </p>
            <div className="software-pricing-guarantee">
              <span className="software-emoji">🎯</span>
              <span>Pay Only if Satisfied — No Commitment!</span>
            </div>
          </div>
          
          <div className="software-pricing-grid">
            <div className="software-pricing-card">
              <h3 className="software-pricing-name">Starter</h3>
              <p className="software-pricing-subtitle">Perfect for freelancers and solopreneurs</p>
              <div className="software-pricing-amount">
                <span className="software-currency">AED</span>
                <span className="software-price">299</span>
                <span className="software-period">/mo</span>
              </div>
              <p className="software-pricing-limit">Up to 50 transactions/year</p>
              
              <ul className="software-pricing-features">
                <li><FiCheckCircle /> Corporate Tax Filing (Annual)</li>
                <li><FiCheckCircle /> CT Registration</li>
                <li><FiCheckCircle /> VAT Registration & Quarterly Filing</li>
                <li><FiCheckCircle /> Quarterly Financial Statements</li>
                <li><FiCheckCircle /> Dedicated Support Manager</li>
                <li><FiCheckCircle /> 30 Min Free Tax Consultation</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="software-btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="software-pricing-card">
              <h3 className="software-pricing-name">Essential</h3>
              <p className="software-pricing-subtitle">Ideal for growing small businesses</p>
              <div className="software-pricing-amount">
                <span className="software-currency">AED</span>
                <span className="software-price">599</span>
                <span className="software-period">/mo</span>
              </div>
              <p className="software-pricing-limit">Up to 200 transactions/year</p>
              
              <ul className="software-pricing-features">
                <li><FiCheckCircle /> Everything in Starter, plus:</li>
                <li><FiCheckCircle /> Monthly Account Reconciliation</li>
                <li><FiCheckCircle /> Quarterly Accounting Reports</li>
                <li><FiCheckCircle /> Priority Support</li>
                <li><FiCheckCircle /> Expense Categorization</li>
                <li><FiCheckCircle /> Financial Health Check-up</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="software-btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="software-pricing-card popular">
              <div className="software-popular-badge">Most Popular</div>
              <h3 className="software-pricing-name">Growth</h3>
              <p className="software-pricing-subtitle">For businesses with higher volume</p>
              <div className="software-pricing-amount">
                <span className="software-currency">AED</span>
                <span className="software-price">999</span>
                <span className="software-period">/mo</span>
              </div>
              <p className="software-pricing-limit">Up to 2,000 transactions/year</p>
              
              <ul className="software-pricing-features">
                <li><FiCheckCircle /> Everything in Essential, plus:</li>
                <li><FiCheckCircle /> Quarterly Bookkeeping</li>
                <li><FiCheckCircle /> Cash Flow Analysis</li>
                <li><FiCheckCircle /> Budget vs Actual Reports</li>
                <li><FiCheckCircle /> Multi-currency Support</li>
                <li><FiCheckCircle /> Dedicated Account Manager</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="software-btn-pricing primary data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="software-pricing-card">
              <h3 className="software-pricing-name">Scale</h3>
              <p className="software-pricing-subtitle">Enterprise-grade financial management</p>
              <div className="software-pricing-amount">
                <span className="software-currency">AED</span>
                <span className="software-price">1,999</span>
                <span className="software-period">/mo</span>
              </div>
              <p className="software-pricing-limit">Up to 3,600 transactions/year</p>
              
              <ul className="software-pricing-features">
                <li><FiCheckCircle /> Everything in Growth, plus:</li>
                <li><FiCheckCircle /> Monthly Bookkeeping</li>
                <li><FiCheckCircle /> Advanced Reporting Suite</li>
                <li><FiCheckCircle /> Custom Dashboard</li>
                <li><FiCheckCircle /> API Integrations</li>
                <li><FiCheckCircle /> CFO Advisory Services</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="software-btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
          </div>
          
          <p className="software-pricing-note">
            Compare this to QuickBooks pricing (AED 80-300/mo) + your time + no expert support.<br />
            <strong className="software-text-orange">Finanshels delivers 10x the value.</strong>
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="software-testimonials" id="testimonials">
        <div className="software-container">
          <div className="software-section-header">
            <span className="software-section-label">CLIENT SUCCESS STORIES</span>
            <h2 className="software-section-title">
              Trusted by <span className="software-text-orange">5,000+ Businesses</span>
            </h2>
            <p className="software-section-description">
              Hear what founders say about switching from accounting software to Finanshels.
            </p>
          </div>
          
          <div className="software-testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="software-testimonial-card">
                <div className="software-stars">★★★★★</div>
                <p className="software-testimonial-text">"{testimonial.text}"</p>
                <div className="software-testimonial-author">
                  <div className="software-author-info">
                    <h4 className="software-author-name">{testimonial.name}</h4>
                    <p className="software-author-title">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="software-trustpilot-rating">
            <div className="software-rating-stars">★★★★★</div>
            <div className="software-rating-info">
              <strong>4.9/5</strong> on Trustpilot • 239 reviews
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="software-faq" id="faq">
        <div className="software-container-small">
          <div className="software-section-header">
            <span className="software-section-label">FAQ</span>
            <h2 className="software-section-title">
              Common <span className="software-text-orange">Questions</span>
            </h2>
            <p className="software-section-description">
              Everything you need to know about choosing Finanshels over accounting software.
            </p>
          </div>
          
          <div className="software-faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`software-faq-item ${openFaq === index ? 'open' : ''}`}>
                <button className="software-faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <FiChevronDown className={`software-faq-icon ${openFaq === index ? 'rotated' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="software-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="software-final-cta" id="consultation">
        <div className="software-container">
          <div className="software-final-cta-content">
            <div className="software-final-cta-left">
              <span className="software-section-label">GET STARTED TODAY</span>
              <h2 className="software-section-title">
                Ready to Stop Paying for<br />
                <span className="software-text-orange">Software That Can't Think?</span>
              </h2>
              <p className="software-section-description">
                Join 5,000+ UAE businesses who've switched from standalone accounting software to Finanshels. Get expert accountants, a powerful client portal, and financial insights that drive real decisions.
              </p>
              
              <div className="software-cta-steps">
                <div className="software-cta-step">
                  <div className="software-step-number">1</div>
                  <span>Book your free 30-minute consultation</span>
                </div>
                <div className="software-cta-step">
                  <div className="software-step-number">2</div>
                  <span>Get a customized financial health assessment</span>
                </div>
                <div className="software-cta-step">
                  <div className="software-step-number">3</div>
                  <span>Pay Only if Satisfied — no commitment</span>
                </div>
              </div>
            </div>
            
            <div className="software-final-cta-right">
              <div className="software-consultation-card">
                <h3>Get Your Free Accounting Consultation</h3>
                <p className="software-card-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
                
                <ZohoConsultationForm formId="software-final-form" />
                
                <div className="software-trust-indicators">
                  <div className="software-trust-item">
                    <FiCheckCircle />
                    <span>Pay Only if Satisfied</span>
                  </div>
                  <div className="software-trust-item">
                    <FiCheckCircle />
                    <span>No Commitment</span>
                  </div>
                  <div className="software-trust-item">
                    <FiCheckCircle />
                    <span>24h Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountingSoftwareLanding;
