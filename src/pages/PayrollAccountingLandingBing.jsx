import { useState } from 'react';
import { FiCheckCircle, FiChevronDown, FiFileText, FiClock, FiAlertTriangle, FiTrendingDown, FiUsers, FiZap, FiBarChart2, FiShield, FiX, FiArrowRight } from 'react-icons/fi';
// Shares the Google-ads stylesheet: the Bing variant is visually identical and
// only differs in the prefilled WhatsApp copy below.
import './PayrollAccountingLanding.css';
import { ZOHO_BING_FORM_ACTION } from '../utils/zohoForms';
import ZohoHiddenFields from '../components/ZohoHiddenFields';

const ZohoPayrollForm = ({ formId }) => (
  <form
    action={ZOHO_BING_FORM_ACTION}
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
        placeholder="+971 50 000 0000"
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
    
    <p className="form-privacy">
      By submitting, you agree to receive communications. Your data is secure and will never be shared.
    </p>
    
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
  </form>
);

const PayrollAccountingLandingBing = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  const trackWhatsAppClick = (source) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({ event: 'whatsapp_click', source });
    }
  };

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

  const testimonials = [
    {
      text: "Finanshels transformed our payroll operations. What used to take us days now happens automatically. WPS compliance is handled flawlessly every month.",
      name: "Ahmed Al-Rashid",
      title: "CEO, TechVentures Dubai",
      initials: "AA"
    },
    {
      text: "The dedicated payroll manager assigned to us knows our business inside out. We've saved over 70% compared to our previous in-house team costs.",
      name: "Sarah Johnson",
      title: "HR Director, Gulf Retail Group",
      initials: "SJ"
    },
    {
      text: "As a growing startup, we needed flexible payroll solutions. Finanshels scaled with us from 5 to 50 employees without missing a beat.",
      name: "Mohammed Hassan",
      title: "Founder, StartUp Hub UAE",
      initials: "MH"
    }
  ];

  const faqs = [
    {
      question: "What is included in your payroll services?",
      answer: "Our payroll services include salary processing, WPS compliance and filing, gratuity calculations, leave management, end-of-service benefits, payslip generation, and real-time reporting dashboards. We handle everything from employee onboarding to final settlements."
    },
    {
      question: "How long does it take to set up?",
      answer: "Most businesses are fully onboarded within 30 days. This includes data migration, system setup, WPS configuration, and your first payroll run. We provide dedicated support throughout the process to ensure a smooth transition."
    },
    {
      question: "Is my employee data secure?",
      answer: "Absolutely. We use bank-level encryption and security protocols to protect all sensitive data. Our systems are compliant with UAE data protection regulations, and we never share your information with third parties."
    },
    {
      question: "Do you handle WPS compliance?",
      answer: "Yes, WPS (Wages Protection System) compliance is a core part of our service. We handle setup, monthly salary file generation, and ensure timely submissions to meet Ministry of Labour requirements."
    },
    {
      question: "Can you handle multi-entity payroll?",
      answer: "Yes, our Enterprise plan supports multi-entity payroll management. We can consolidate reporting across all your UAE entities while maintaining separate compliance for each."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "mWe offer a satisfaction guarantee. If you're not happy with our service within the first 30 days, we'll work with you to resolve any issues or provide a full refund. Your success is our priority."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      subtitle: "Perfect for freelancers and solopreneurs",
      price: "499",
      limit: "Up to 50 transactions/year",
      features: [
        "Annual Tax Filing",
        "Tax Compliance Support",
        "Basic Financial Statements",
        "Dedicated Support Manager",
        "30 Min Free Consultation"
      ],
      popular: false
    },
    {
      name: "Essential",
      subtitle: "Ideal for growing small businesses",
      price: "799",
      limit: "Up to 200 transactions/year",
      features: [
        "Everything in Starter, plus:",
        "Monthly Account Reconciliation",
        "Quarterly Accounting Reports",
        "Priority Support",
        "Expense Categorization",
        "Financial Health Check-up"
      ],
      popular: false
    },
    {
      name: "Growth",
      subtitle: "For businesses with higher volume",
      price: "999",
      limit: "Up to 2,000 transactions/year",
      features: [
        "Everything in Essential, plus:",
        "Quarterly Bookkeeping",
        "Cash Flow Analysis",
        "Profit & Loss Statements",
        "Multi-currency Support",
        "Dedicated Account Manager"
      ],
      popular: true
    },
    {
      name: "Scale",
      subtitle: "Enterprise-grade financial management",
      price: "1,999",
      limit: "Up to 3,600 transactions/year",
      features: [
        "Everything in Growth, plus:",
        "Monthly Bookkeeping",
        "Advanced Reporting Suite",
        "Custom Dashboard",
        "API Integrations",
        "CFO Advisory Services"
      ],
      popular: false
    }
  ];

  return (
    <div className="payroll-landing">
      {/* Hero Section */}
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
                Struggling with <span className="text-orange">Payroll Accounting?</span>
                <br />
                Let UAE's Top Accountants Handle It
              </h1>
              
              <p className="hero-subheadline">
                Expert payroll accounting services for growing businesses in Dubai, Abu Dhabi, Sharjah & across the UAE. From salary processing to WPS compliance and payroll bookkeeping — we streamline your payroll accounting so you can focus on growth.
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
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-value">7,000+</span>
                  <span className="stat-label">UAE Businesses Served</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">4.9</span>
                  <span className="stat-label">Trustpilot Rating</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">10x</span>
                  <span className="stat-label">Faster Than Manual</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-value">150+</span>
                  <span className="stat-label">Accountants</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="hero-form-wrapper">
              <div
                className="hero-form-card payroll-form-card"
                style={{ background: '#ffffff', color: '#0f172a' }}
              >
                <div className="form-intro">
                  <h2 className="form-title">Get Your Free Payroll Consultation</h2>
                  <p className="form-subtitle">Book a 30-minute call with our payroll experts. No obligation.</p>
                </div>
                
                <ZohoPayrollForm formId="payroll-hero-form" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="client-logos-section">
        <div className="container">
          <p className="logos-label">Trusted by leading UAE businesses</p>
          <div className="logos-marquee">
            <div className="logos-track">
              {clientLogos.map((logo) => (
                <div key={logo.alt} className="logo-tile">
                  <img
                    src={logo.src}
                    alt={`${logo.alt} logo`}
                    className="logo-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem">
        <div className="container">
          <div className="section-header">
            <span className="section-label">THE PROBLEM</span>
            <h2 className="section-title">
              Managing Payroll Accounting is Taxing
            </h2>
            <p className="section-description">
              You started your business to pursue your passion — not to wrestle with payroll spreadsheets and tax filings. Yet here you are, spending hours on tasks that drain your energy.
            </p>
          </div>
          
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">
                <FiFileText />
              </div>
              <h3>Spreadsheet Chaos</h3>
              <p>Excel files flying back and forth. Manual data entry. Human errors costing you money and time.</p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiClock />
              </div>
              <h3>Month-End Scrambles</h3>
              <p>Bookkeeping only happens at month-end. No real-time visibility into your payroll finances.</p>
            </div>
            
            <div className="problem-card highlighted">
              <div className="problem-icon">
                <FiTrendingDown />
              </div>
              <h3>Flying Blind</h3>
              <p>No cash flow visibility. No P&L clarity. Payroll accounting becomes a guessing game.</p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">
                <FiAlertTriangle />
              </div>
              <h3>Compliance Anxiety</h3>
              <p>WPS deadlines, tax filings, and Ministry of Labour requirements keeping you up at night.</p>
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
                One Platform. One Team. 10× Faster.
              </h2>
              <p className="section-description">
                In one platform, one dedicated team manages all your payroll accounting. From salary processing to tax compliance — we handle your books so you can focus on what you do best.
              </p>
              
              <div className="solution-features">
                <div className="solution-feature">
                  <div className="solution-feature-icon">
                    <FiUsers />
                  </div>
                  <div className="feature-content">
                    <h3>Dedicated Account Manager</h3>
                    <p>Your own expert accountant who knows your business inside out. One team handles all your payroll accounting.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="solution-feature-icon">
                    <FiZap />
                  </div>
                  <div className="feature-content">
                    <h3>Payroll Automation</h3>
                    <p>Built with APIs and automation. Human oversight ensures accuracy while saving you 10× the time on bookkeeping.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="solution-feature-icon">
                    <FiBarChart2 />
                  </div>
                  <div className="feature-content">
                    <h3>Real-Time Financial Insights</h3>
                    <p>No more month-end surprises. Get live dashboards on cash flow, P&L, and payroll expenses.</p>
                  </div>
                </div>
                
                <div className="solution-feature">
                  <div className="solution-feature-icon">
                    <FiShield />
                  </div>
                  <div className="feature-content">
                    <h3>Full Tax & WPS Compliance</h3>
                    <p>WPS filing and corporate tax compliance handled. Stay audit-ready without stress.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="solution-right">
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <h3 className="dashboard-title">Payroll Accounting Dashboard</h3>
                  <div className="live-badge">
                    <span className="live-dot"></span>
                    <span>Live</span>
                  </div>
                </div>
                
                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <span className="stat-label-small">Monthly Payroll</span>
                    <div className="stat-value-large">AED 245K</div>
                    <div className="stat-change-positive">↑ 12% vs last month</div>
                  </div>
                  
                  <div className="dashboard-stat">
                    <span className="stat-label-small">Employees</span>
                    <div className="stat-value-large">48</div>
                    <div className="stat-tag">Active</div>
                  </div>
                </div>
                
                <div className="dashboard-items">
                  <div className="dashboard-item">
                    <FiCheckCircle className="item-icon green" />
                    <span>WPS Filed</span>
                    <span className="item-status">Today</span>
                  </div>
                  <div className="dashboard-item">
                    <FiCheckCircle className="item-icon green" />
                    <span>Salaries Processed</span>
                    <span className="item-status">48/48</span>
                  </div>
                  <div className="dashboard-item">
                    <FiCheckCircle className="item-icon yellow" />
                    <span>Gratuity Updated</span>
                    <span className="item-status">Monthly</span>
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
              Before vs After Our Payroll Accounting
            </h2>
            <p className="section-description">
              See the shift when automation and a dedicated accounting team take over — less time firefighting, more time growing your business.
            </p>
          </div>
          
          <div className="comparison-grid">
            <div className="comparison-card before">
              <div className="comparison-header-card">
                <FiX className="comparison-icon" />
                <h3>Business Reality (Before)</h3>
              </div>
              <ul className="comparison-list">
                <li><FiX className="list-icon" /> 15–20 hrs/month chasing accountants</li>
                <li><FiX className="list-icon" /> No cash flow visibility</li>
                <li><FiX className="list-icon" /> Late tax filings & penalties</li>
                <li><FiX className="list-icon" /> Disconnected tools & spreadsheets</li>
                <li><FiX className="list-icon" /> Costly in-house finance team</li>
              </ul>
            </div>
            
            <div className="comparison-card after">
              <div className="comparison-header-card">
                <FiCheckCircle className="comparison-icon" />
                <h3>With Our Services (After)</h3>
              </div>
              <ul className="comparison-list">
                <li><FiCheckCircle className="list-icon" /> 2 hrs/month reviewing dashboards</li>
                <li><FiCheckCircle className="list-icon" /> Weekly automated forecasts</li>
                <li><FiCheckCircle className="list-icon" /> 100% on-time, audit-ready</li>
                <li><FiCheckCircle className="list-icon" /> One streamlined accounting platform</li>
                <li><FiCheckCircle className="list-icon" /> 70% cost reduction with predictable outcomes</li>
              </ul>
            </div>
          </div>
          
          <div className="section-cta">
            <a href="#consultation" className="btn-cta-section">
              Get Started Today <FiArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">SIMPLE PRICING</span>
            <h2 className="section-title">
              Transparent Plans for Every Business
            </h2>
            <p className="section-description">
              Best prices in the market. No hidden fees. Cancel anytime.
            </p>
            <div className="pricing-guarantee">
              <span className="emoji">🎉</span>
              <span>Pay Only if Satisfied — No Commitment!</span>
            </div>
          </div>
          
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="pricing-name">{plan.name}</h3>
                <p className="pricing-subtitle">{plan.subtitle}</p>
                <div className="pricing-amount">
                  <span className="currency">AED</span>
                  <span className="price">{plan.price}</span>
                  <span className="period">/mo</span>
                </div>
                <p className="pricing-limit">{plan.limit}</p>
                
                <ul className="pricing-features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}><FiCheckCircle /> {feature}</li>
                  ))}
                </ul>
                
                <a 
                  href="https://api.whatsapp.com/send/?phone=971521549572&text=Hi+I+saw+your+bing+ads+for+Payroll+Accounting+Services.+I%E2%80%99d+like+to+know+more.&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noreferrer"
                  className={`btn-pricing ${plan.popular ? 'primary' : ''} data-wa-track`}
                  onClick={() => trackWhatsAppClick('payroll_pricing_' + plan.name.toLowerCase())}
                >
                  Get Started
                </a>
              </div>
            ))}
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
              A clear roadmap from day one to steady-state payroll accounting operations, so you know exactly what happens when.
            </p>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3>Kickoff & Migration</h3>
                  <span className="timeline-badge">Day 0–7</span>
                </div>
                <p>Connect your tools (banks, software), clean historical data, import employee records.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3>Setup & Reporting</h3>
                  <span className="timeline-badge">Day 8–20</span>
                </div>
                <p>Build dashboards, setup cash flow tracking, configure tax calendars and payroll schedules.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3>Month-End & Review</h3>
                  <span className="timeline-badge">Day 30–45</span>
                </div>
                <p>Deliver first complete financial pack with payroll reports + review call with your account manager.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3>Steady State</h3>
                  <span className="timeline-badge">Day 45–90</span>
                </div>
                <p>Automated reporting, cash flow forecasting, payroll processing, and regular reviews.</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div className="timeline-header">
                  <h3>Expansion (Optional)</h3>
                  <span className="timeline-badge">Post 90 days</span>
                </div>
                <p>Add entities, CFO advisory services, or advanced payroll accounting dashboards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-label">TESTIMONIALS</span>
            <h2 className="section-title">
              Trusted by UAE Business Leaders
            </h2>
            <p className="section-description">
              See why thousands of businesses across Dubai, Abu Dhabi, and Sharjah trust us with their payroll.
            </p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-text">"{testimonial.text}"</p>
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
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <div className="container-small">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">
              Frequently Asked Questions
            </h2>
            <p className="section-description">
              Got questions about our payroll services? Find answers to the most common questions below.
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
              <h2 className="final-cta-title">
                Ready to Simplify Your <span className="text-orange">Payroll Accounting?</span>
              </h2>
              <p className="final-cta-description">
                Join 7,000+ UAE businesses who've transformed their payroll accounting operations. Get a free consultation with our finance experts today.
              </p>
              
              <ul className="cta-benefits">
                <li><FiCheckCircle className="benefit-icon" /> No obligation consultation</li>
                <li><FiCheckCircle className="benefit-icon" /> Custom payroll accounting assessment</li>
                <li><FiCheckCircle className="benefit-icon" /> Transparent pricing quote</li>
                <li><FiCheckCircle className="benefit-icon" /> 30-day satisfaction guarantee</li>
              </ul>
              
              <div className="cta-rating">
                <span className="rating-number">4.9</span>
                <div className="rating-stars">★★★★★</div>
                <span className="rating-text">Based on 500+ reviews</span>
              </div>
            </div>
            
            <div className="final-cta-right">
              <div className="consultation-card">
                <h3>Get Your Free Payroll Consultation</h3>
                <p className="card-subtitle">Book a 30-minute call with our payroll experts. No obligation.</p>
                
                <ZohoPayrollForm formId="payroll-final-form" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PayrollAccountingLandingBing;
