import finanshelsLogo from '../assets/finanshelslogo.svg';

const Footer = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer-modern">
      <div className="footer-container-modern">
        <div className="footer-grid">
          <div className="footer-brand-modern">
            <div className="footer-logo-row">
              <img src={finanshelsLogo} alt="Finanshels" className="footer-logo" />
            </div>
            <p className="footer-tagline">Expert accounting & bookkeeping services for growing businesses in Dubai, Abu Dhabi, Sharjah & across the UAE. We streamline your finance and accounting operations so you can focus on growth.</p>
            <p className="footer-trust">Trusted by 5,000+ businesses across the UAE.</p>
          </div>

          <div className="footer-links-section">
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Cash Flow Accounting</a>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Bookkeeping Services</a>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Tax Compliance</a>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Profit & Loss Statements</a>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">Accounting Automation</a>
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="footer-link">CFO Advisory</a>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="#about" className="footer-link">About Us</a>
              <a href="#pricing" onClick={(e) => {e.preventDefault(); scrollToSection('pricing');}} className="footer-link">Pricing</a>
              <a href="#testimonials" onClick={(e) => {e.preventDefault(); scrollToSection('testimonials');}} className="footer-link">Testimonials</a>
              <a href="#faq" onClick={(e) => {e.preventDefault(); scrollToSection('faq');}} className="footer-link">FAQ</a>
              <a href="mailto:contact@finanshels.com" className="footer-link">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-modern">
          <div className="footer-bottom-content">
            <p className="footer-copyright">© {new Date().getFullYear()} Finanshels. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy" className="footer-bottom-link">Privacy Policy</a>
              <a href="#terms" className="footer-bottom-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
