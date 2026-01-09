import { useState } from 'react';
import { FiCheckCircle, FiChevronDown, FiFileText, FiClock, FiTrendingDown, FiAlertTriangle, FiUsers, FiZap, FiBarChart2, FiShield, FiX } from 'react-icons/fi';
import Testimonials from '../components/Testimonials';
import './FinanshelsLanding.css';

const FinanshelsLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What accounting and bookkeeping services do you offer?",
      answer: "We provide comprehensive accounting solutions including bookkeeping, tax compliance, profit and loss statement preparation, cash flow accounting, bank reconciliation, audit support, and CFO advisory services. Our finance and accounting services are tailored to meet your business needs."
    },
    {
      question: "How does your accounting automation work?",
      answer: "Our accounting automation is built with APIs and machine learning. Human oversight ensures accuracy while saving you 10× the time."
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
    <div className="finanshels-landing">
      {/* Hero Section */}
      <section className="hero-section-new">
        <div className="hero-container-new">
          <div className="hero-grid-new">
            {/* Left Content */}
            <div className="hero-left-new">
              <div className="trust-badge-new">
                <span className="trust-dot-new"></span>
                <span className="trust-text-new">Trusted by 5,000+ Businesses in UAE</span>
              </div>
              
              <h1 className="hero-title-new">
                Struggling with{" "}
                <span className="hero-highlight-new">Cash Flow?</span>
                <br />
                Let UAE's Top Accountants Handle Your Books
              </h1>
              
              <p className="hero-description-new">
                Expert accounting & bookkeeping services for growing businesses in Dubai, Abu Dhabi, Sharjah & across the UAE. From profit and loss statements to tax compliance — we streamline your finance and accounting operations so you can focus on growth.
              </p>
              
              <ul className="hero-benefits-new">
                <li className="benefit-item-new">
                  <FiCheckCircle className="benefit-icon-new" />
                  <span>Pay Only if Satisfied</span>
                </li>
                <li className="benefit-item-new">
                  <FiCheckCircle className="benefit-icon-new" />
                  <span>Dedicated Account Manager</span>
                </li>
                <li className="benefit-item-new">
                  <FiCheckCircle className="benefit-icon-new" />
                  <span>Real-Time Financial Dashboard</span>
                </li>
              </ul>
              
              <div className="hero-buttons-new">
                <a 
                  href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-hero-primary-new"
                  data-wa-track="true"
                >
                  Get Free Consultation
                </a>
                <a href="#pricing" className="btn-hero-secondary-new">View Pricing</a>
              </div>
            </div>
            
            {/* Right Form */}
            <div className="hero-right-new">
              <div className="consultation-card-new">
                <h2 className="consultation-title-new">
                  Get Your Free Accounting Consultation
                </h2>
                <p className="consultation-subtitle-new">
                  Book a 30-minute call with our finance experts. No obligation.
                </p>
                
                <form 
                  action="https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit"
                  name="form"
                  method="POST"
                  acceptCharset="UTF-8"
                  encType="multipart/form-data"
                  className="consultation-form-new"
                >
                  <input type="hidden" name="zf_referrer_name" value="" />
                  <input type="hidden" name="zf_redirect_url" value="" />
                  <input type="hidden" name="zc_gad" value="" />
                  
                  <div className="form-row-new">
                    <div className="form-field-new">
                      <label htmlFor="Name_First" className="form-label-new">First Name</label>
                      <input
                        id="Name_First"
                        type="text"
                        maxLength="255"
                        name="Name_First"
                        fieldType="7"
                        placeholder="John"
                        className="form-input-new"
                      />
                    </div>
                    <div className="form-field-new">
                      <label htmlFor="Name_Last" className="form-label-new">Last Name</label>
                      <input
                        id="Name_Last"
                        type="text"
                        maxLength="255"
                        name="Name_Last"
                        fieldType="7"
                        placeholder="Smith"
                        className="form-input-new"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field-new">
                    <label htmlFor="Email" className="form-label-new">Email *</label>
                    <input
                      id="Email"
                      type="text"
                      maxLength="255"
                      name="Email"
                      fieldType="9"
                      placeholder="i.e. name@yourdomain.com"
                      className="form-input-new"
                      required
                    />
                  </div>
                  
                  <div className="form-field-new">
                    <label htmlFor="PhoneNumber_countrycode" className="form-label-new">Phone</label>
                    <input
                      id="PhoneNumber_countrycode"
                      type="text"
                      compname="PhoneNumber"
                      name="PhoneNumber_countrycode"
                      phoneFormat="1"
                      isCountryCodeEnabled="false"
                      maxLength="20"
                      fieldType="11"
                      placeholder="+971 00 000 0000"
                      className="form-input-new"
                    />
                  </div>
                  
                  <div className="form-field-new">
                    <label htmlFor="SingleLine1" className="form-label-new">Company Name *</label>
                    <input
                      id="SingleLine1"
                      type="text"
                      name="SingleLine1"
                      fieldType="1"
                      maxLength="255"
                      placeholder="i.e. dropxcell LLC"
                      className="form-input-new"
                      required
                    />
                  </div>
                  
                  <div className="form-field-new">
                    <label htmlFor="SingleLine2" className="form-label-new">Job Title</label>
                    <input
                      id="SingleLine2"
                      type="text"
                      name="SingleLine2"
                      fieldType="1"
                      maxLength="255"
                      placeholder="e.g. Finance Manager"
                      className="form-input-new"
                    />
                  </div>
                  
                  <button type="submit" className="btn-form-submit-new">
                    Submit
                  </button>
                  
                  <p className="form-disclaimer-new">
                    By submitting, you agree to receive communications. Your data is secure and will never be shared.
                  </p>
                  
                  <div className="form-footer-new">
                    <div className="footer-item-new">
                      <FiCheckCircle className="footer-icon-new" />
                      <span>Pay Only if Satisfied</span>
                    </div>
                    <div className="footer-item-new">
                      <FiCheckCircle className="footer-icon-new" />
                      <span>No Commitment</span>
                    </div>
                    <div className="footer-item-new">
                      <FiCheckCircle className="footer-icon-new" />
                      <span>24h Response</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h2 className="stat-number">5,000+</h2>
              <p className="stat-label">UAE Businesses Served</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number">4.9</h2>
              <p className="stat-label">Trustpilot Rating</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number">10x</h2>
              <p className="stat-label">Faster Than Manual</p>
            </div>
            <div className="stat-item">
              <h2 className="stat-number">24/7</h2>
              <p className="stat-label">Dubai-Based Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE PROBLEM</span>
            <h2 className="section-title">
              Managing Business Accounting is <span className="highlight">Taxing</span>
            </h2>
            <p className="section-description">
              You started your business to pursue your passion — not to wrestle with spreadsheets and tax filings. Yet here you are, spending hours on tasks that drain your energy.
            </p>
          </div>
          
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <FiFileText />
              </div>
              <h3 className="problem-title">Spreadsheet Chaos</h3>
              <p className="problem-description">
                Excel files flying back and forth. Manual data entry. Human errors. Sound familiar?
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiClock />
              </div>
              <h3 className="problem-title">Month-End Scrambles</h3>
              <p className="problem-description">
                Bookkeeping only happens at month-end. No real-time visibility into your finances.
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiTrendingDown />
              </div>
              <h3 className="problem-title">Flying Blind</h3>
              <p className="problem-description">
                Making business decisions without accurate financial data. Risking costly mistakes.
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiAlertTriangle />
              </div>
              <h3 className="problem-title">Tax Compliance Stress</h3>
              <p className="problem-description">
                Tax deadlines looming. Worried about penalties and mistakes with auditing services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="services" className="solution-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE SOLUTION</span>
            <h2 className="section-title">
              One Platform. One Team. <span className="highlight">10× Faster.</span>
            </h2>
            <p className="section-description">
              In one platform, one dedicated team manages all your finance and accounting functions. From bookkeeping to tax filing — we handle it so you can focus on what you do best.
            </p>
          </div>
          
          <div className="solution-content">
            <div className="solution-left">
              <div className="solution-feature">
                <div className="solution-icon">
                  <FiUsers />
                </div>
                <div className="solution-text">
                  <h3 className="solution-title">Dedicated Finance Team</h3>
                  <p className="solution-description">
                    Your own expert accountant who knows your business inside out. One team manages everything.
                  </p>
                </div>
              </div>
              
              <div className="solution-feature">
                <div className="solution-icon">
                  <FiZap />
                </div>
                <div className="solution-text">
                  <h3 className="solution-title">Accounting Automation</h3>
                  <p className="solution-description">
                    Built with APIs and machine learning. Human oversight ensures accuracy while saving you 10× the time.
                  </p>
                </div>
              </div>
              
              <div className="solution-feature">
                <div className="solution-icon">
                  <FiBarChart2 />
                </div>
                <div className="solution-text">
                  <h3 className="solution-title">Real-Time Insights</h3>
                  <p className="solution-description">
                    No more month-end surprises. Get live dashboards and reports to make informed decisions daily.
                  </p>
                </div>
              </div>
              
              <div className="solution-feature">
                <div className="solution-icon">
                  <FiShield />
                </div>
                <div className="solution-text">
                  <h3 className="solution-title">Full Tax Compliance</h3>
                  <p className="solution-description">
                    Corporate tax, VAT registration, and quarterly filings handled. Stay compliant without the stress.
                  </p>
                </div>
              </div>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-cta"
                data-wa-track="true"
              >
                Talk to an Expert
              </a>
            </div>
            
            <div className="solution-right">
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <div className="status-badge live">
                    <div className="live-dot"></div>
                    <span>Live</span>
                  </div>
                  <span className="dashboard-timestamp">Just now</span>
                </div>
                
                <h3 className="dashboard-title">Financial Dashboard</h3>
                
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <span className="stat-label">Monthly Revenue</span>
                    <div className="stat-value">$245K</div>
                    <div className="stat-change positive">↑ 12% vs last month</div>
                  </div>
                  
                  <div className="dashboard-stat">
                    <span className="stat-label">Expenses</span>
                    <div className="stat-value">$89K</div>
                    <div className="stat-tag">On budget</div>
                  </div>
                </div>
                
                <div className="dashboard-footer">
                  <span className="footer-text">All things up to date</span>
                  <div className="status-tags">
                    <span className="status-tag green">Tax Filed</span>
                    <span className="status-tag orange">Audit Ready</span>
                  </div>
                </div>
                
                <div className="invoice-notification">
                  <FiCheckCircle className="notification-icon" />
                  <span>Invoice Processed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="transformation-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TRANSFORMATION</span>
            <h2 className="section-title">
              Before vs After <span className="highlight">Our Accounting Solutions</span>
            </h2>
            <p className="section-description">
              See the shift when automation and a dedicated finance team take over — less time firefighting, more time growing your business.
            </p>
          </div>
          
          <div className="comparison-wrapper">
            {/* Desktop Table View */}
            <div className="comparison-table">
              <div className="comparison-table-header">
                <div className="comparison-header-cell before-header">
                  <h3 className="comparison-title">Business Reality (Before)</h3>
                </div>
                <div className="comparison-header-cell after-header">
                  <h3 className="comparison-title">With Our Services (After)</h3>
                </div>
              </div>
              
              <div className="comparison-table-body">
                <div className="comparison-row">
                  <div className="comparison-cell before-cell">
                    <FiX className="comparison-icon negative" />
                    <span>15–20 hrs/month spent chasing accountants</span>
                  </div>
                  <div className="comparison-cell after-cell">
                    <FiCheckCircle className="comparison-icon positive" />
                    <span>2 hrs/month reviewing dashboards</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <div className="comparison-cell before-cell">
                    <FiX className="comparison-icon negative" />
                    <span>No cash flow visibility</span>
                  </div>
                  <div className="comparison-cell after-cell">
                    <FiCheckCircle className="comparison-icon positive" />
                    <span>Weekly automated forecasts</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <div className="comparison-cell before-cell">
                    <FiX className="comparison-icon negative" />
                    <span>Late tax filings & penalties</span>
                  </div>
                  <div className="comparison-cell after-cell">
                    <FiCheckCircle className="comparison-icon positive" />
                    <span>100% on-time, audit-ready</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <div className="comparison-cell before-cell">
                    <FiX className="comparison-icon negative" />
                    <span>Disconnected tools & spreadsheets</span>
                  </div>
                  <div className="comparison-cell after-cell">
                    <FiCheckCircle className="comparison-icon positive" />
                    <span>One streamlined accounting platform</span>
                  </div>
                </div>
                
                <div className="comparison-row">
                  <div className="comparison-cell before-cell">
                    <FiX className="comparison-icon negative" />
                    <span>Costly in-house finance team</span>
                  </div>
                  <div className="comparison-cell after-cell">
                    <FiCheckCircle className="comparison-icon positive" />
                    <span>70% cost reduction with predictable outcomes</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Cards View */}
            <div className="comparison-mobile">
              <div className="comparison-mobile-card">
                <div className="comparison-mobile-before">
                  <FiX className="comparison-icon negative" />
                  <span>15–20 hrs/month spent chasing accountants</span>
                </div>
                <div className="comparison-mobile-after">
                  <FiCheckCircle className="comparison-icon positive" />
                  <span>2 hrs/month reviewing dashboards</span>
                </div>
              </div>
              
              <div className="comparison-mobile-card">
                <div className="comparison-mobile-before">
                  <FiX className="comparison-icon negative" />
                  <span>No cash flow visibility</span>
                </div>
                <div className="comparison-mobile-after">
                  <FiCheckCircle className="comparison-icon positive" />
                  <span>Weekly automated forecasts</span>
                </div>
              </div>
              
              <div className="comparison-mobile-card">
                <div className="comparison-mobile-before">
                  <FiX className="comparison-icon negative" />
                  <span>Late tax filings & penalties</span>
                </div>
                <div className="comparison-mobile-after">
                  <FiCheckCircle className="comparison-icon positive" />
                  <span>100% on-time, audit-ready</span>
                </div>
              </div>
              
              <div className="comparison-mobile-card">
                <div className="comparison-mobile-before">
                  <FiX className="comparison-icon negative" />
                  <span>Disconnected tools & spreadsheets</span>
                </div>
                <div className="comparison-mobile-after">
                  <FiCheckCircle className="comparison-icon positive" />
                  <span>One streamlined accounting platform</span>
                </div>
              </div>
              
              <div className="comparison-mobile-card">
                <div className="comparison-mobile-before">
                  <FiX className="comparison-icon negative" />
                  <span>Costly in-house finance team</span>
                </div>
                <div className="comparison-mobile-after">
                  <FiCheckCircle className="comparison-icon positive" />
                  <span>70% cost reduction with predictable outcomes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding Section */}
      <section className="onboarding-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">ONBOARDING</span>
            <h2 className="section-title">
              How It Works <span className="highlight">(Within 45 Days)</span>
            </h2>
            <p className="section-description">
              A clear roadmap from day one to steady-state finance operations, so you know exactly what happens when.
            </p>
          </div>
          
          <div className="onboarding-wrapper">
            <div className="onboarding-table">
              <div className="onboarding-table-header">
                <div className="onboarding-header-cell">Stage</div>
                <div className="onboarding-header-cell">Timeline</div>
                <div className="onboarding-header-cell">What Happens</div>
              </div>
              
              <div className="onboarding-table-body">
                <div className="onboarding-row">
                  <div className="onboarding-cell">Kickoff & Migration</div>
                  <div className="onboarding-cell timeline-cell">Day 0–7</div>
                  <div className="onboarding-cell">Connect your tools (banks, software), clean historical data</div>
                </div>
                
                <div className="onboarding-row">
                  <div className="onboarding-cell">Setup & Reporting</div>
                  <div className="onboarding-cell timeline-cell">Day 8–20</div>
                  <div className="onboarding-cell">Build dashboards, setup cash flow tracking, tax calendars</div>
                </div>
                
                <div className="onboarding-row">
                  <div className="onboarding-cell">Month-End & Review</div>
                  <div className="onboarding-cell timeline-cell">Day 30–45</div>
                  <div className="onboarding-cell">Deliver first complete financial pack + review call</div>
                </div>
                
                <div className="onboarding-row">
                  <div className="onboarding-cell">Steady State</div>
                  <div className="onboarding-cell timeline-cell">Day 45–90</div>
                  <div className="onboarding-cell">Automated reporting, cash flow forecasting, regular reviews</div>
                </div>
                
                <div className="onboarding-row">
                  <div className="onboarding-cell">Expansion (Optional)</div>
                  <div className="onboarding-cell timeline-cell">Post 90 days</div>
                  <div className="onboarding-cell">Add entities, CFO services, or advanced accounting dashboards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">SIMPLE PRICING</span>
            <h2 className="section-title">
              Transparent Plans for Every <span className="highlight">Business</span>
            </h2>
            <p className="section-description">
              Best prices in the market. No hidden fees. Cancel anytime.
            </p>
            <div className="pricing-guarantee">
              <span className="guarantee-emoji">🎉</span>
              <span>Pay Only if Satisfied — No Commitment!</span>
            </div>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3 className="pricing-name">Starter</h3>
              <p className="pricing-description">Perfect for freelancers and solopreneurs</p>
              <div className="pricing-price">
                <span className="price-currency">AED</span>
                <span className="price-amount">299</span>
                <span className="price-period">/mo</span>
              </div>
              <p className="pricing-limit">Up to 50 transactions/year</p>
              
              <ul className="pricing-features">
                <li><FiCheckCircle /> Annual Tax Filing</li>
                <li><FiCheckCircle /> Tax Registration</li>
                <li><FiCheckCircle /> Basic Financial Statements</li>
                <li><FiCheckCircle /> Dedicated Support Manager</li>
                <li><FiCheckCircle /> 30 Min Free Consultation</li>
              </ul>
              
              <a 
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing"
                data-wa-track="true"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Essential</h3>
              <p className="pricing-description">Ideal for growing small businesses</p>
              <div className="pricing-price">
                <span className="price-currency">AED</span>
                <span className="price-amount">599</span>
                <span className="price-period">/mo</span>
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
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing"
                data-wa-track="true"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <h3 className="pricing-name">Growth</h3>
              <p className="pricing-description">For businesses with higher volume</p>
              <div className="pricing-price">
                <span className="price-currency">AED</span>
                <span className="price-amount">999</span>
                <span className="price-period">/mo</span>
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
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing primary"
                data-wa-track="true"
              >
                Get Started
              </a>
            </div>
            
            <div className="pricing-card">
              <h3 className="pricing-name">Scale</h3>
              <p className="pricing-description">Enterprise-grade financial management</p>
              <div className="pricing-price">
                <span className="price-currency">AED</span>
                <span className="price-amount">1,999</span>
                <span className="price-period">/mo</span>
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
                href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+ad+for+Accounting+Services+starting+from+$499/mo.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="btn-pricing"
                data-wa-track="true"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">
              Common <span className="highlight">Questions</span>
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
      <section className="final-cta-section" id="consultation">
        <div className="final-cta-container">
          <div className="final-cta-left">
            <p className="section-eyebrow">GET STARTED TODAY</p>
            <h2 className="cta-title">
              Ready to Stop Stressing<br />
              About Your Books?
            </h2>
            <p className="cta-description">
              Join 5,000+ UAE businesses who've transformed their financial
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
              <form 
                action="https://forms.zohopublic.com/finanshelsllc/form/GetYourFreeAuditConsultation/formperma/EikNR5Pwn-Ak9PHJxB-cTO47ehdcxhrZeW_itd-c-I0/htmlRecords/submit"
                name="form"
                method="POST"
                acceptCharset="UTF-8"
                encType="multipart/form-data"
              >
                <input type="hidden" name="zf_referrer_name" value="" />
                <input type="hidden" name="zf_redirect_url" value="" />
                <input type="hidden" name="zc_gad" value="" />
                
                <h2 className="form-title">Get Your Free Consultation</h2>
                <p className="form-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
                
                <div className="form-row form-row-half">
                  <div className="form-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      maxLength="255"
                      name="Name_First"
                      fieldType="7"
                      placeholder="John"
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
                      placeholder="Smith"
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-field">
                  <label>Email *</label>
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
                  <label>Phone</label>
                  <input
                    type="text"
                    compname="PhoneNumber"
                    name="PhoneNumber_countrycode"
                    phoneFormat="1"
                    isCountryCodeEnabled="false"
                    maxLength="20"
                    fieldType="11"
                    placeholder="+971 00 000 0000"
                    className="form-input"
                  />
                </div>
                
                <div className="form-field">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="SingleLine1"
                    fieldType="1"
                    maxLength="255"
                    placeholder="i.e. dropxcell LLC"
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label>Job Title</label>
                  <input
                    type="text"
                    name="SingleLine2"
                    fieldType="1"
                    maxLength="255"
                    placeholder="e.g. Finance Manager"
                    className="form-input"
                  />
                </div>
                
                <button type="submit" className="form-submit">
                  <em>Submit</em>
                </button>
              </form>
              
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

export default FinanshelsLanding;
