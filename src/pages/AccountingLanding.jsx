import { useState } from 'react';
import { FiCheckCircle, FiChevronDown, FiFileText, FiClock, FiTrendingDown, FiAlertTriangle, FiUsers, FiZap, FiBarChart2, FiShield, FiX } from 'react-icons/fi';
import './AccountingLanding.css';
import { ZOHO_GOOGLE_FORM_ACTION } from '../utils/zohoForms';
import ZohoHiddenFields from '../components/ZohoHiddenFields';
import clientLogos from '../data/clientLogos';

const ZohoConsultationForm = ({ formId }) => (
  <form
    action={ZOHO_GOOGLE_FORM_ACTION}
    name="form"
    id={formId || 'form'}
    method="POST"
    acceptCharset="UTF-8"
    encType="multipart/form-data"
    className="zoho-form"
  >
    <ZohoHiddenFields />
    
    <div className="form-row">
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          maxLength="255"
          name="Name_First"
          fieldType="7"
          placeholder="John"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          maxLength="255"
          name="Name_Last"
          fieldType="7"
          placeholder="Smith"
          className="form-control"
        />
      </div>
    </div>
    
    <div className="form-group">
      <label>Email *</label>
      <input
        type="text"
        maxLength="255"
        name="Email"
        fieldType="9"
        placeholder="john@company.com"
        className="form-control"
        required
      />
    </div>
    
    <div className="form-group">
      <label>Phone Number *</label>
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
        className="form-control"
        required
      />
    </div>
    
    <div className="form-group">
      <label>Company Name *</label>
      <input
        type="text"
        name="SingleLine"
        maxLength="255"
        fieldType="1"
        placeholder="Your Company LLC"
        className="form-control"
        required
      />
    </div>
    
    <button type="submit" className="btn-submit-form">
      Submit
    </button>
  </form>
);

const AccountingLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const trackWhatsAppClick = (source) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source });
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const testimonials = [
    {
      text: "Always very responsive, supportive, having a business mindset, providing visuals and on top of all that, open for feedback so they can keep improving. Very happy that I took the decision to work with them.",
      name: "Szilvia Vitos",
      title: "Founder, Livvity",
      initials: "SV"
    },
    {
      text: "They designed an accounting system tailor made to our needs & completely automated our finance operations just like they promised. They've been super helpful for us to scale.",
      name: "Jeremy Khatar",
      title: "CEO, Ronin Global LLC",
      initials: "JK"
    },
    {
      text: "If you ever do any financial modeling/forecasting, I seriously can't recommend Finanshels enough. They are a dependable team of professionals who work hard to deliver results.",
      name: "Bader Al Kazimi",
      title: "Founder, Optimize App",
      initials: "BA"
    },
    {
      text: "Bookkeeping, a piece of cake with Finanshels! Sahal has been extremely helpful in managing the books! He makes sure its up-to-date and super clean! Sometimes, for advice, I refer to him as well and again, he has been super supportive and helpful to my needs!",
      name: "Sapna Mulani",
      title: "Sr Accountant, Growdash",
      initials: "SM"
    },
    {
      text: "They thoroughly understood our business processes and streamlined our accounting processes perfectly where our both in-house and outsourced accountants failed multiple times to streamline and structure our complex financial ops.",
      name: "Meet Patel",
      title: "Former COO, StudentHub & BAWES",
      initials: "MP"
    }
  ];

  const faqs = [
    {
      question: "What accounting and bookkeeping services do you offer?",
      answer: "We provide comprehensive accounting solutions including bookkeeping, management accounts, profit and loss statement preparation, cash flow accounting, bank reconciliation, month-end close, and CFO advisory services. Our finance and accounting services are tailored to meet your business needs."
    },
    {
      question: "How does your accounting automation work?",
      answer: "Our streamline accounting platform uses APIs and machine learning to automate data entry, reconciliation, and reporting. With human oversight at every step, you get 10× faster processing while maintaining accuracy. This accounting automation eliminates manual errors and saves valuable time."
    },
    {
      question: "What accounting software do you support for integration?",
      answer: "We support integration with major accounting software platforms including QuickBooks, Xero, Zoho Books, and custom solutions tailored to your business needs."
    },
    {
      question: "How quickly can I get started with your accounting outsourcing?",
      answer: "You can get started within 45 days. We follow a structured onboarding process from tool connection and migration to delivering your first complete financial pack."
    },
    {
      question: "Is my financial data secure with your accounting company?",
      answer: "Yes, we follow industry-standard security protocols and encryption to ensure your financial data remains secure and confidential at all times."
    },
    {
      question: "Do you provide accounting for business decisions support?",
      answer: "Absolutely! Our CFO advisory services include financial modeling, cash flow forecasting, and strategic insights to help you make informed business decisions."
    }
  ];



  return (
    <div className="accounting-landing">
      {/* Hero Section - Complete Redesign */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-grid">
            {/* Left Column - Content */}
            <div className="hero-content-wrapper">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                <span className="badge-text">Trusted by 7,000+ Businesses in UAE</span>
              </div>
              
              <h1 className="hero-headline">
                UAE's Top Accountants Handle Your Books
              </h1>
              
              <p className="hero-subheadline">
                Expert outsourced accounting & bookkeeping services for growing businesses in Dubai, Abu Dhabi, Sharjah & across the UAE. From profit and loss statements to month-end close — we streamline your finance and accounting operations so you can focus on growth.
              </p>
              
              <div className="hero-features">
                <div className="hero-feature">
                  <FiCheckCircle className="feature-icon" />
                  <span>Pay Only if Satisfied</span>
                </div>
                <div className="hero-feature">
                  <FiCheckCircle className="feature-icon" />
                  <span>Dedicated Account Manager</span>
                </div>
                <div className="hero-feature">
                  <FiCheckCircle className="feature-icon" />
                  <span>Real-Time Financial Dashboard</span>
                </div>
              </div>
              
              <div className="hero-actions">
                <a href="#consultation" className="hero-btn hero-btn-primary">
                  Get Free Consultation
                </a>
                <a href="#pricing" className="hero-btn hero-btn-secondary">
                  View Pricing
                </a>
              </div>

              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">7,000+</span>
                  <span className="stat-label">UAE Businesses Served</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">Trustpilot Rating</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">10×</span>
                  <span className="stat-label">Faster Than Manual</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">150+</span>
                  <span className="stat-label">Accountants</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="hero-form-wrapper">
              <div className="hero-form-card">
                <div className="form-intro">
                  <h2 className="form-title">Get Your Free Consultation</h2>
                  <p className="form-subtitle">Book a 30-minute call with our experts. No obligation.</p>
                </div>
                
                <ZohoConsultationForm formId="hero-form" />
                
                <p className="form-privacy">
                  By submitting, you agree to receive communications. Your data is secure and will never be shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="accounting-client-logos-section" aria-label="Client logos">
        <div className="container">
          <p className="accounting-logos-label">Trusted by leading UAE businesses</p>
          <div className="accounting-logos-grid">
            {clientLogos.map((logo) => (
              <div key={logo.alt} className="accounting-logo-tile">
                <img
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  className="accounting-logo-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE PROBLEM</span>
            <h2 className="section-title">
              Managing Business Accounting is <span className="text-orange">Draining</span>
            </h2>
            <p className="section-description">
              You started your business to pursue your passion — not to wrestle with spreadsheets and month-end close. Yet here you are, spending hours on tasks that drain your energy.
            </p>
          </div>
          
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <FiFileText />
              </div>
              <h3>Spreadsheet Chaos</h3>
              <p>Excel files flying back and forth. Manual data entry. Human errors. Sound familiar?</p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiClock />
              </div>
              <h3>Month-End Scrambles</h3>
              <p>Bookkeeping only happens at month end. No real-time visibility into your finances.</p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiTrendingDown />
              </div>
              <h3>Flying Blind</h3>
              <p>Making business decisions without accurate financial data. Risking costly mistakes.</p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiAlertTriangle />
              </div>
              <h3>Year-End Panic</h3>
              <p>Year-end creeps up and the books are months behind. Numbers you cannot defend in a review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution">
        <div className="container">
          <div className="solution-content">
            <div className="solution-left">
              <span className="section-label">THE SOLUTION</span>
              <h2 className="section-title">
                One Platform. One Team. <span className="text-orange">10× Faster.</span>
              </h2>
              <p className="section-description">
                In one platform, one dedicated team manages all your finance and accounting functions. From bookkeeping to management reporting — we handle it so you can focus on what you do best.
              </p>
              
              <div className="solution-features">
                <div className="solution-feature">
                  <div className="feature-icon">
                    <FiUsers />
                  </div>
                  <div className="feature-content">
                    <h3>Dedicated Finance Team</h3>
                    <p>Your own expert accountant who knows your business inside out. One team manages everything.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="feature-icon">
                    <FiZap />
                  </div>
                  <div className="feature-content">
                    <h3>Accounting Automation</h3>
                    <p>Built with APIs and machine learning. Human oversight ensures accuracy while saving you 10× the time.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="feature-icon">
                    <FiBarChart2 />
                  </div>
                  <div className="feature-content">
                    <h3>Real-Time Insights</h3>
                    <p>No more month-end surprises. Get live dashboards and reports to make informed decisions daily.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="feature-icon">
                    <FiShield />
                  </div>
                  <div className="feature-content">
                    <h3>Always Close-Ready</h3>
                    <p>Reconciled ledgers and clean schedules every month. No year-end scramble.</p>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-primary data-wa-track"
                onClick={() => trackWhatsAppClick('accounting_solution_cta')}
              >
                Talk to an Expert
              </a>
            </div>
            
            <div className="solution-right">
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <div className="dashboard-status">
                    <FiCheckCircle className="status-icon-green" />
                    <span>Invoice Processed</span>
                    <span className="status-time">Just now</span>
                  </div>
                  <div className="live-badge">
                    <span className="live-dot"></span>
                    <span>Live</span>
                  </div>
                </div>
                
                <h3 className="dashboard-title">Financial Dashboard</h3>
                
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <span className="stat-label-small">Monthly Revenue</span>
                    <div className="stat-value-large">$245K</div>
                    <div className="stat-change-positive">↑ 12% vs last month</div>
                  </div>
                  
                  <div className="dashboard-stat">
                    <span className="stat-label-small">Expenses</span>
                    <div className="stat-value-large">$89K</div>
                    <div className="stat-tag">On budget</div>
                  </div>
                </div>
                
                <div className="dashboard-footer">
                  <span className="footer-text">All reconciliations up to date</span>
                  <div className="status-badges">
                    <span className="status-badge green">Books Reconciled</span>
                    <span className="status-badge orange">Report Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="transformation">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TRANSFORMATION</span>
            <h2 className="section-title">
              Before vs After <span className="text-orange">Our Accounting Solutions</span>
            </h2>
            <p className="section-description">
              See the shift when automation and a dedicated finance team take over — less time firefighting, more time growing your business.
            </p>
          </div>
          
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-col-header before">
                <h3>Business Reality (Before)</h3>
              </div>
              <div className="comparison-col-header after">
                <h3>With Our Services (After)</h3>
              </div>
            </div>
            
            <div className="comparison-body">
              <div className="comparison-row">
                <div className="comparison-cell before">
                  <FiX className="icon-red" />
                  <span>15–20 hrs/month spent chasing accountants</span>
                </div>
                <div className="comparison-cell after">
                  <FiCheckCircle className="icon-green" />
                  <span>2 hrs/month reviewing dashboards</span>
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="comparison-cell before">
                  <FiX className="icon-red" />
                  <span>No cash flow visibility</span>
                </div>
                <div className="comparison-cell after">
                  <FiCheckCircle className="icon-green" />
                  <span>Weekly automated forecasts</span>
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="comparison-cell before">
                  <FiX className="icon-red" />
                  <span>Month-end close drags on for weeks</span>
                </div>
                <div className="comparison-cell after">
                  <FiCheckCircle className="icon-green" />
                  <span>Closed in days, review-ready</span>
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="comparison-cell before">
                  <FiX className="icon-red" />
                  <span>Disconnected tools & spreadsheets</span>
                </div>
                <div className="comparison-cell after">
                  <FiCheckCircle className="icon-green" />
                  <span>One streamlined accounting platform</span>
                </div>
              </div>
              
              <div className="comparison-row">
                <div className="comparison-cell before">
                  <FiX className="icon-red" />
                  <span>Costly in-house finance team</span>
                </div>
                <div className="comparison-cell after">
                  <FiCheckCircle className="icon-green" />
                  <span>70% cost reduction with predictable outcomes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">SIMPLE PRICING</span>
            <h2 className="section-title">
              Transparent Plans for Every <span className="text-orange">Business</span>
            </h2>
            <p className="section-description">
              Best prices in the market. No hidden fees. Cancel anytime.
            </p>
            <div className="pricing-guarantee">
              <span className="emoji">🎉</span>
              <span>Pay Only if Satisfied — No Commitment!</span>
            </div>
            <div className="pricing-bonus-highlight">
              <span className="emoji">✅</span>
              <span>Every plan includes a <strong>FREE dedicated account manager &amp; live dashboard</strong></span>
            </div>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-name">Starter</h3>
              <p className="pricing-subtitle">Perfect for freelancers and solopreneurs</p>
              <div className="pricing-amount">
                <span className="currency">AED</span>
                <span className="price">499</span>
                <span className="period">/mo</span>
              </div>
              <p className="pricing-limit">Up to 50 transactions/year</p>
              
              <ul className="pricing-features">
                <li><FiCheckCircle /> <strong>Free Live Financial Dashboard</strong></li>
                <li><FiCheckCircle /> <strong>Free Monthly Bank Reconciliation</strong></li>
                <li><FiCheckCircle /> Quarterly Financial Statements</li>
                <li><FiCheckCircle /> Dedicated Support Manager</li>
                <li><FiCheckCircle /> 30 Min Free Finance Review</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Essential</h3>
              <p className="pricing-subtitle">Ideal for growing small businesses</p>
              <div className="pricing-amount">
                <span className="currency">AED</span>
                <span className="price">799</span>
                <span className="period">/mo</span>
              </div>
              <p className="pricing-limit">Up to 200 transactions/year</p>
              
              <ul className="pricing-features">
                <li><FiCheckCircle /> Everything in Starter, plus:</li>
                <li><FiCheckCircle /> Monthly Account Reconciliation</li>
                <li><FiCheckCircle /> Quarterly Accounting Reports</li>
                <li><FiCheckCircle /> Priority Support</li>
                <li><FiCheckCircle /> Expense Categorization</li>
                <li><FiCheckCircle /> Financial Health Check-up</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <h3 className="pricing-name">Growth</h3>
              <p className="pricing-subtitle">For businesses with higher volume</p>
              <div className="pricing-amount">
                <span className="currency">AED</span>
                <span className="price">999</span>
                <span className="period">/mo</span>
              </div>
              <p className="pricing-limit">Up to 2,000 transactions/year</p>
              
              <ul className="pricing-features">
                <li><FiCheckCircle /> Everything in Essential, plus:</li>
                <li><FiCheckCircle /> Quarterly Bookkeeping</li>
                <li><FiCheckCircle /> Cash Flow Analysis</li>
                <li><FiCheckCircle /> Profit & Loss Statements</li>
                <li><FiCheckCircle /> Multi-currency Support</li>
                <li><FiCheckCircle /> Dedicated Account Manager</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing primary data-wa-track"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Scale</h3>
              <p className="pricing-subtitle">Enterprise-grade financial management</p>
              <div className="pricing-amount">
                <span className="currency">AED</span>
                <span className="price">1,999</span>
                <span className="period">/mo</span>
              </div>
              <p className="pricing-limit">Up to 3,600 transactions/year</p>
              
              <ul className="pricing-features">
                <li><FiCheckCircle /> Everything in Growth, plus:</li>
                <li><FiCheckCircle /> Monthly Bookkeeping</li>
                <li><FiCheckCircle /> Advanced Reporting Suite</li>
                <li><FiCheckCircle /> Custom Dashboard</li>
                <li><FiCheckCircle /> API Integrations</li>
                <li><FiCheckCircle /> CFO Advisory Services</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+google+ad+for+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing data-wa-track"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ONBOARDING</span>
            <h2 className="section-title">
              How It Works <span className="text-orange">(Within 45 Days)</span>
            </h2>
            <p className="section-description">
              A clear roadmap from day one to steady-state finance operations, so you know exactly what happens when.
            </p>
          </div>
          
          <div className="timeline-table">
            <div className="timeline-header">
              <div className="timeline-col">Stage</div>
              <div className="timeline-col">Timeline</div>
              <div className="timeline-col">What Happens</div>
            </div>
            
            <div className="timeline-body">
              <div className="timeline-row">
                <div className="timeline-cell">Kickoff & Migration</div>
                <div className="timeline-cell">
                  <span className="timeline-badge">Day 0–7</span>
                </div>
                <div className="timeline-cell">Connect your tools (banks, software), clean historical data</div>
              </div>
              
              <div className="timeline-row">
                <div className="timeline-cell">Setup & Reporting</div>
                <div className="timeline-cell">
                  <span className="timeline-badge">Day 8–20</span>
                </div>
                <div className="timeline-cell">Build dashboards, setup cash flow tracking, reporting calendars</div>
              </div>
              
              <div className="timeline-row">
                <div className="timeline-cell">Month-End & Review</div>
                <div className="timeline-cell">
                  <span className="timeline-badge">Day 30–45</span>
                </div>
                <div className="timeline-cell">Deliver first complete financial pack + review call</div>
              </div>
              
              <div className="timeline-row">
                <div className="timeline-cell">Steady State</div>
                <div className="timeline-cell">
                  <span className="timeline-badge">Day 45–90</span>
                </div>
                <div className="timeline-cell">Automated reporting, cash flow forecasting, regular reviews</div>
              </div>
              
              <div className="timeline-row">
                <div className="timeline-cell">Expansion (Optional)</div>
                <div className="timeline-cell">
                  <span className="timeline-badge">Post 90 days</span>
                </div>
                <div className="timeline-cell">Add entities, CFO services, or advanced accounting dashboards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-label">CLIENT SUCCESS STORIES</span>
            <h2 className="section-title">
              Trusted by <span className="text-orange">7,000+ Businesses</span>
            </h2>
            <p className="section-description">
              Hear what founders say about working with our accounting company.
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-title">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="trustpilot-rating">
            <div className="stars">★★★★★</div>
            <div className="rating-info">
              <strong>4.9/5 on Trustpilot</strong>
              <span>Based on 239 reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container-small">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">
              Common <span className="text-orange">Questions</span>
            </h2>
            <p className="section-description">
              Everything you need to know about our finance accounting service and how we help your business grow.
            </p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <FiChevronDown className={`faq-icon ${openFaq === index ? 'rotated' : ''}`} />
                </button>
                {openFaq === index && (
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
      <section className="final-cta" id="consultation">
        <div className="container">
          <div className="final-cta-content">
            <div className="final-cta-left">
              <span className="section-label">GET STARTED TODAY</span>
              <h2 className="section-title">
                Ready to Stop Stressing <span className="text-orange">About Your Books?</span>
              </h2>
              <p className="section-description">
                Join 7,000+ businesses across Dubai, Abu Dhabi, Sharjah & UAE who've transformed their financial operations with our accounting services. Get your free consultation and see the difference expert bookkeeping can make.
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
              <div className="consultation-card">
                <h3>Get Your Free Accounting Consultation</h3>
                <p className="card-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
                
                <ZohoConsultationForm formId="final-form" />
                
                <div className="trust-indicators">
                  <div className="trust-item">
                    <FiCheckCircle />
                    <span>Pay Only if Satisfied</span>
                  </div>
                  <div className="trust-item">
                    <FiCheckCircle />
                    <span>No Commitment</span>
                  </div>
                  <div className="trust-item">
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

export default AccountingLanding;
