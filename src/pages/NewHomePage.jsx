import { useState } from 'react';
import { FiCheckCircle, FiChevronDown, FiFileText, FiClock, FiTrendingDown, FiAlertTriangle, FiUsers, FiZap, FiBarChart2, FiShield } from 'react-icons/fi';
import Testimonials from '../components/Testimonials';
import './NewHomePage.css';

const NewHomePage = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const whatsappNumber = '971521549572';
  const whatsappMessage = encodeURIComponent('I saw your ad and want to know more about bookkeeping services.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
      title: 'Tax Compliance Stress',
      description: 'UAE Corporate Tax deadlines looming. Worried about penalties and mistakes.'
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
      title: 'UAE Tax Compliance',
      description: 'Corporate tax, VAT registration, and quarterly filings handled. Stay compliant without the stress.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      subtitle: 'Perfect for freelancers and solopreneurs',
      price: '299',
      period: '/mo',
      transactions: 'Up to 50 transactions/year',
      features: [
        'Corporate Tax Filing (Annual)',
        'CT Registration',
        'VAT Registration & Quarterly Filing',
        'Quarterly Financial Statements',
        'Dedicated Support Manager',
        '30 Min Free Tax Consultation'
      ]
    },
    {
      name: 'Essential',
      subtitle: 'Ideal for growing small businesses',
      price: '560',
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
      price: '800',
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
      price: '2,000',
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
      question: 'How does Finanshels handle UAE Corporate Tax compliance?',
      answer: 'We manage your complete Corporate Tax lifecycle - from registration with the FTA to quarterly filings and annual returns. Our team stays updated with the latest UAE tax regulations to ensure 100% compliance and help you avoid penalties.'
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
        <div className="hero-container">
          <div className="hero-left">
            <div className="trust-badge">
              <span className="trust-dot" aria-hidden="true" />
              <span className="trust-text">Trusted by 5,000+ UAE businesses</span>
            </div>
            
            <h1 className="hero-title">
              Buried in<br />
              <span className="highlight-green">Bookkeeping?</span><br />
              Let Experts Manage it<br />
              For You
            </h1>
            
            <p className="hero-description">
              Expert accounting & bookkeeping for UAE small businesses.
              Corporate tax compliance, VAT filing, and real-time financial
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
          </div>
          
          <div className="hero-right">
            <div className="consultation-form">
              <h3 className="form-title">Get Your Free Consultation</h3>
              <p className="form-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
              
              <form>
                <input type="text" placeholder="Your Name *" className="form-input" required />
                <input type="email" placeholder="Email Address *" className="form-input" required />
                <input type="tel" placeholder="Phone Number *" className="form-input" required />
                <input type="text" placeholder="Company Name (Optional)" className="form-input" />
                <button type="submit" className="form-submit">Claim Free Consultation</button>
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

        <div className="hero-trust-row">
          <p className="trust-label">Trusted by leading UAE businesses</p>
          <div className="logo-list-wide">
            {clientLogos.map((logo) => (
              <div key={logo.alt} className="trust-logo">
                <img src={logo.src} alt={`${logo.alt} logo`} className="trust-logo-image" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-value">5,000+</div>
            <div className="stat-label">Businesses Served</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.9</div>
            <div className="stat-label">Trustpilot Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">10×</div>
            <div className="stat-label">Faster Than Manual</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Dedicated Support</div>
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
              Accounting is <span className="highlight-green">Taxing</span>
            </h2>
            <p className="section-subtitle">
              You started your business to pursue your passion — not to wrestle with spreadsheets and
              tax filings. Yet here you are, spending hours on tasks that drain your energy.
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
                functions. From bookkeeping to tax filing — we handle it so you can
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
                className="btn-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
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
                
                <div className="compliance-status">
                  <div className="compliance-header">
                    <FiCheckCircle className="compliance-icon" />
                    <span className="compliance-title">All filings up to date</span>
                  </div>
                  <div className="compliance-badges">
                    <span className="compliance-badge">VAT Filed</span>
                    <span className="compliance-badge">CT Registered</span>
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
                  className={`btn-plan ${plan.popular ? 'btn-plan-popular' : ''}`}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
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
            <h2 className="section-title">Common Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about working with Finanshels.
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
              <h3 className="form-title">Get Your Free Consultation</h3>
              <p className="form-subtitle">Book a 30-minute call with our finance experts. No obligation.</p>
              
              <form>
                <input type="text" placeholder="Your Name *" className="form-input" required />
                <input type="email" placeholder="Email Address *" className="form-input" required />
                <input type="tel" placeholder="Phone Number *" className="form-input" required />
                <input type="text" placeholder="Company Name (Optional)" className="form-input" />
                <button type="submit" className="form-submit">Claim Free Consultation</button>
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

export default NewHomePage;
